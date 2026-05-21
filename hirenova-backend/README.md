# HireNova — Backend API

A production-grade REST API for a full-stack job portal. Built with Node.js, Express, TypeScript, and MongoDB. Supports three user roles (job seeker, recruiter, admin), structured logging, runtime + compile-time validation, JWT authentication, and cloud file uploads.

> This codebase was migrated from JavaScript to strict TypeScript and progressively hardened with a Zod validation layer, a Pino logging layer, and a shared utilities architecture. Every architectural decision is documented in this README.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Features](#2-features)
3. [Tech Stack](#3-tech-stack)
4. [Architecture](#4-architecture)
5. [Folder Structure](#5-folder-structure)
6. [Request Flow](#6-request-flow)
7. [Environment Variables](#7-environment-variables)
8. [Getting Started](#8-getting-started)
9. [Available Scripts](#9-available-scripts)
10. [TypeScript Migration](#10-typescript-migration)
11. [Validation System](#11-validation-system)
12. [Logging System](#12-logging-system)
13. [API Reference](#13-api-reference)
14. [Security](#14-security)
15. [Deployment](#15-deployment)
16. [Future Roadmap](#16-future-roadmap)

---

## 1. Project Overview

HireNova is a job portal backend that serves three distinct user types with different capabilities:

| Role        | What they do                                                    |
|-------------|----------------------------------------------------------------|
| `user`      | Browse jobs, apply, track applications, manage profile/resume  |
| `recruiter` | Post jobs, view applicants, update application statuses        |
| `admin`     | Manage all users, all jobs, and platform-wide dashboard        |

The API follows REST conventions and returns uniform JSON envelopes (`{ success, message, data }`). All errors are centralized through a single error middleware that classifies and logs them appropriately.

---

## 2. Features

**Authentication & Authorization**
- JWT authentication stored in `HttpOnly` cookies (with Bearer header fallback)
- Role-based authorization via composable `protect` + `authorize(...roles)` middleware
- Account status enforcement — blocked accounts receive 403 before any route logic runs
- Per-route rate limiting for auth endpoints; global rate limiting for all other routes

**Job Management**
- Full CRUD for job listings (recruiter-owned)
- Advanced job search with filters: keyword, location, job type, category, salary range, experience
- Pagination on all list endpoints with parallel `Promise.all([find, count])` queries
- Recommended jobs engine based on applicant's past application history

**Application System**
- Atomic apply/withdraw using Mongoose transactions (dual document write + counter update)
- Duplicate application prevention via unique compound index on `(job, applicant)`
- Applicant listing for recruiters with pagination
- Application status workflow: `pending → reviewed → accepted / rejected`

**Profile & File Uploads**
- User profile with bio, skills, experience, phone
- Profile completion percentage calculator
- Resume and avatar upload to Cloudinary via `multer` + `streamifier` (buffer stream, no disk writes)
- File type and size validation in upload middleware

**Dashboards**
- Recruiter dashboard: total jobs, total applications, applications per job (MongoDB aggregation)
- Admin dashboard: platform-wide totals for users, recruiters, jobs, applications

**Developer Experience**
- `tsc --noEmit` on every change catches type errors before runtime
- Structured JSON logs in production; colorized human-readable logs in development
- Centralized environment validation — missing env vars crash the process at startup, not at the first API call that needs them

---

## 3. Tech Stack

| Category         | Technology                      | Version   | Why                                                               |
|------------------|---------------------------------|-----------|-------------------------------------------------------------------|
| Runtime          | Node.js                         | ≥ 20 LTS  | LTS stability, native ESM                                         |
| Language         | TypeScript                      | ^6.0      | Strict mode, `NodeNext` module resolution                         |
| Framework        | Express                         | ^4.22     | Minimal, well-understood, vast middleware ecosystem               |
| Database         | MongoDB + Mongoose              | ^9.3      | Flexible document model for job/profile data                      |
| Validation       | Zod                             | ^4.4      | Runtime schema + compile-time type in one expression              |
| Logger           | Pino                            | ^10.3     | Fastest Node.js logger; async JSON output; pino-pretty for dev    |
| Authentication   | jsonwebtoken                    | ^9.0      | JWT in HttpOnly cookies                                           |
| Password hashing | bcrypt                          | ^6.0      | Industry-standard adaptive hashing                                |
| File uploads     | Multer + Cloudinary + streamifier | —       | Memory-based upload → Cloudinary stream (no disk writes)          |
| Rate limiting    | express-rate-limit              | ^8.3      | Brute-force protection on auth + global throttle                  |
| Security headers | helmet                          | ^8.1      | Sets 15+ HTTP security headers in one call                        |
| Dev server       | tsx                             | ^4.21     | TypeScript-native dev runner, no separate compile step            |
| Build            | tsc + tsc-alias                 | —         | Compile to `dist/`, resolve path aliases                          |

---

## 4. Architecture

### Philosophy

The architecture follows three principles:

1. **Simplicity over ceremony** — no repository pattern, no dependency injection container, no microservices. A startup-scale SaaS needs code you can read and change in one session, not layers of abstraction that optimize for hypothetical scale.

2. **Feature-based modules** — code is organized by domain (job, application, profile) rather than by technical role (all controllers together, all services together). This means every feature is self-contained: adding a new module means creating one folder, not touching six.

3. **Unidirectional dependency** — the dependency rule is strict: `routes → controller → service → model`. A service never imports a controller. A model never imports a service. This makes layers independently testable and prevents circular dependency chains.

### Layered Responsibilities

```
┌─────────────────────────────────────────────────────────────────┐
│  HTTP Layer (Express app)                                        │
│  helmet · cors · body-parser · morgan · rate-limiter             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│  Routes  (src/modules/*/X.routes.ts)                             │
│  Declares URL paths + middleware chain (protect, authorize, zod) │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│  Controller  (src/modules/*/X.controller.ts)                     │
│  Reads req, calls service, writes res. No business logic.        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│  Service  (src/modules/*/X.service.ts)                           │
│  All business logic. DB queries. Throws ApiError on failure.     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│  Model  (src/modules/*/X.model.ts)                               │
│  Mongoose schema + TypeScript interface + exported types.         │
└─────────────────────────────────────────────────────────────────┘
```

**Why split controller and service?**

The controller's only job is to translate HTTP concepts (request body, params, user identity) into function arguments, and translate the result back into an HTTP response. The service does not know what Express is — it takes plain arguments and returns plain values or throws `ApiError`. This separation means:
- Services can be tested with plain function calls, no Express mocking required
- The same service function can be called from multiple routes or from a CLI script
- Swapping Express for Fastify would only touch controllers, not business logic

---

## 5. Folder Structure

```
src/
│
├── app.ts                    # Express app factory — middleware stack, routes, error handler
├── server.ts                 # Entry point — DB connect, port bind, startup log
│
├── config/
│   ├── env.ts                # Validates process.env at startup; exports typed `env` object
│   ├── db.ts                 # Mongoose connection with structured logging
│   └── cookieOptions.ts      # HttpOnly cookie config (reads env.NODE_ENV)
│
├── middlewares/
│   ├── auth.middleware.ts    # `protect` (JWT verify) + `authorize(...roles)` (RBAC)
│   ├── error.middleware.ts   # Centralized error classifier: normalize → log → respond
│   ├── avatarUpload.middleware.ts  # Multer config for avatar uploads
│   ├── resumeUpload.middleware.ts  # Multer config for resume uploads
│   └── rateLimiter/
│       ├── authLimiter.ts    # Strict limit for /auth/* routes
│       └── globalLimiter.ts  # Loose limit for all other routes
│
├── modules/                  # Feature-based modules — one folder per domain
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.schemas.ts   # Zod schemas + derived TS types
│   ├── user/
│   ├── profile/
│   ├── job/
│   ├── application/
│   ├── dashboard/
│   └── admin/
│
├── routes/
│   └── index.ts              # Single API manifest — mounts all module routers at /api/v1
│
├── shared/                   # Code used by 2+ modules — only real abstractions live here
│   ├── helpers/
│   │   └── pagination.helper.ts  # parsePagination() / calcPages() — replaces 3× duplicated code
│   ├── logger/
│   │   └── logger.ts         # Pino instance — dev: pino-pretty; prod: raw JSON
│   ├── types/
│   │   └── pagination.types.ts   # PaginatedResult<T> generic used by all list endpoints
│   └── validators/
│       ├── common.schemas.ts     # Reusable Zod primitives: emailSchema, passwordSchema, etc.
│       └── validate.middleware.ts # zodValidate(schema, target) middleware factory
│
├── types/
│   ├── express.d.ts          # Augments Express Request: adds req.user: AuthedUser
│   └── modules.d.ts          # Ambient declaration for streamifier (no @types package)
│
└── utils/
    ├── apiError.ts           # ApiError(statusCode, message) — throw from anywhere in the app
    ├── apiResponse.ts        # ApiResponse<T>(statusCode, message, data) — uniform response shape
    ├── asyncHandler.util.ts  # Wraps async controllers so rejected promises reach error middleware
    ├── cloudinary.ts         # Cloudinary SDK client (configured once, imported everywhere)
    └── token.util.ts         # generateToken(user) — JWT mint with typed payload
```

**The rule for `shared/`:** A file only moves to `shared/` when it is imported by **two or more modules**. No pre-emptive abstraction. No "might need it later" folders. This prevents `shared/` from becoming a dumping ground.

---

## 6. Request Flow

### Happy path: `POST /api/v1/jobs` (recruiter creates a job)

```
Client
  │
  │  POST /api/v1/jobs
  │  Headers: Cookie: token=<jwt>
  │  Body: { title, description, company, location, category }
  │
  ▼
app.ts middleware stack
  helmet()          → sets security headers
  cors()            → checks origin against CLIENT_URL
  express.json()    → parses body
  cookieParser()    → parses Cookie header
  morgan("dev")     → logs HTTP line in development
  globalLimiter     → checks rate limit (IP-based)
  │
  ▼
routes/index.ts     → /api/v1 → jobRoutes
  │
  ▼
job.routes.ts
  protect           → extracts JWT from cookie/header
                    → verifies signature, loads user from DB
                    → checks account not blocked
                    → sets req.user = { _id, role, ... }
  authorize("recruiter")
                    → checks req.user.role === "recruiter"
  zodValidate(createJobSchema)
                    → schema.safeParse(req.body)
                    → on failure: 400 + field-level errors
                    → on success: writes parsed data back to req.body
                    → (strings trimmed, defaults applied, types coerced)
  createJob handler
  │
  ▼
job.controller.ts
  createJob()
    → if (!req.user) throw ApiError(401)   ← defense-in-depth guard
    → await createJobService(req.body as CreateJobInput, req.user._id)
    → res.status(201).json(new ApiResponse(201, "Job created", job))
  │
  ▼
job.service.ts
  createJobService(data, userId)
    → Job.create({ ...data, createdBy: userId })
    → returns JobDocument
  │
  ▼
  ← JobDocument
  ← ApiResponse { statusCode: 201, success: true, message: "Job created", data: job }
  ← HTTP 201
```

### Error path: validation fails

```
zodValidate(createJobSchema) runs schema.safeParse(req.body)
  → fails (e.g., title is missing)
  → res.status(400).json({
       success: false,
       message: "Validation failed",
       errors: [{ path: "title", message: "Title is required" }]
     })
  → next() is NOT called — controller never runs
```

### Error path: unhandled exception

```
Any controller/service throws → asyncHandler catches it → calls next(err)
  → error.middleware.ts runs
  → normalizes: determines statusCode + message from error type
  → logs: 5xx → logger.error({ err, method, path }); 4xx (dev only) → logger.warn
  → responds: res.status(statusCode).json({ success: false, message })
  → stack traces and internals never reach the client
```

---

## 7. Environment Variables

Copy `.env.example` to `.env` and fill in all values. The app validates every variable at startup — a missing or malformed variable throws immediately before the HTTP server starts.

```bash
# ── Server ─────────────────────────────────────────────────────────
NODE_ENV=development          # "development" | "production" | "test"
PORT=5000                     # Optional, defaults to 5000

# ── Database ───────────────────────────────────────────────────────
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<db>

# ── Authentication ─────────────────────────────────────────────────
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES=1d                # Optional, defaults to "1d" (jsonwebtoken format)

# ── CORS ───────────────────────────────────────────────────────────
CLIENT_URL=http://localhost:5173   # Frontend origin (exact match)

# ── Cloudinary (file uploads) ──────────────────────────────────────
CLOUD_NAME=your_cloud_name
CLOUD_KEY=your_api_key
CLOUD_SECRET=your_api_secret
```

| Variable     | Required | Description                                        |
|--------------|----------|----------------------------------------------------|
| `NODE_ENV`   | No       | Controls log format, cookie `secure` flag          |
| `PORT`       | No       | HTTP port, defaults to `5000`                      |
| `MONGO_URI`  | **Yes**  | Full MongoDB connection string with credentials    |
| `JWT_SECRET` | **Yes**  | Token signing secret — use 32+ random characters   |
| `JWT_EXPIRES`| No       | Token lifetime in jsonwebtoken format, default `1d`|
| `CLIENT_URL` | **Yes**  | Exact frontend origin for CORS `Access-Control-Allow-Origin` |
| `CLOUD_NAME` | **Yes**  | Cloudinary cloud name                              |
| `CLOUD_KEY`  | **Yes**  | Cloudinary API key                                 |
| `CLOUD_SECRET` | **Yes** | Cloudinary API secret                             |

> **Security note:** `JWT_SECRET` is used to sign tokens. If rotated, all existing tokens are immediately invalidated — all users are logged out. Use a cryptographically random value (e.g., `openssl rand -hex 32`).

---

## 8. Getting Started

### Prerequisites

- Node.js ≥ 20 LTS
- npm ≥ 10
- A MongoDB Atlas cluster (or local `mongod`)
- A Cloudinary account (free tier is sufficient)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/hirenova.git
cd hirenova/hirenova-backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and fill in all required values

# 4. Start the development server
npm run dev
```

The server starts on `http://localhost:5000` (or `PORT` from your `.env`).

You should see structured startup logs:
```
[HH:MM:ss] INFO: MongoDB connected {"uri":"mongodb+srv://<redacted>@..."}
[HH:MM:ss] INFO: Server started {"port":5000,"env":"development"}
```

If any required environment variable is missing, the process exits before binding a port:
```
Error: Missing required environment variable: JWT_SECRET
```

---

## 9. Available Scripts

```bash
npm run dev        # Start development server with tsx watch (hot-reload, no compile step)
npm run build      # Compile to dist/ using tsc + resolve path aliases with tsc-alias
npm start          # Run compiled dist/server.js (production)
npm run typecheck  # Run tsc --noEmit — type errors only, no output files
```

### Development vs Production

| Mode        | Command         | Runtime     | Source  |
|-------------|-----------------|-------------|---------|
| Development | `npm run dev`   | `tsx watch` | `src/`  |
| Production  | `npm start`     | `node`      | `dist/` |

In development, `tsx` runs TypeScript directly without an intermediate compile step. Hot-reload means file changes reflect instantly. In production, you always run the compiled JavaScript output from `dist/` — TypeScript is a build-time concern, never a production dependency.

---

## 10. TypeScript Migration

### Background

The codebase was originally written in plain JavaScript. The migration to TypeScript was performed incrementally in a dedicated branch (`refactor/auth-typescript`) without disrupting main.

### Why TypeScript?

JavaScript is forgiving at authoring time but expensive at debugging time. In a job portal backend, silent failures are costly:

- A missing `req.user` check doesn't crash — it accesses `undefined._id` at runtime
- A wrong field name in a Mongoose query returns `null`, not a type error
- Refactoring a service method's parameters breaks every caller silently

TypeScript moves these failures to the editor and the CI pipeline, before deployment.

### Migration Strategy

The migration followed a strict module-by-module approach:

```
Step 1  admin.js     → admin.ts        (lowest external deps)
Step 2  application.js → application.ts
Step 3  job.js       → job.ts
Step 4  profile.js   → profile.ts
Step 5  auth.js      → auth.ts         (depends on user model)
Step 6  entry points (app.ts, server.ts, routes/index.ts)
Step 7  tsconfig: allowJs: false       (no JS files remain in src/)
```

Each step compiled clean before the next began. TypeScript errors found during migration were fixed, not suppressed with `// @ts-ignore`.

### Key Patterns

**`as const` for enum-like values — one declaration, two uses**

```typescript
// user.model.ts
export const USER_ROLES = ["user", "recruiter", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];
// → "user" | "recruiter" | "admin"
```

Without `as const`, the array would be inferred as `string[]`, losing the literal types. With it, the array serves as both a runtime validation set (Mongoose enum) and a compile-time union type — defined exactly once.

**`HydratedDocument<T>` for typed Mongoose results**

```typescript
export type UserDocument = HydratedDocument<IUser>;
```

`IUser` is the plain data shape. `HydratedDocument<IUser>` adds `_id`, `.save()`, `.toObject()`, and all Mongoose document methods. Controllers and services use `UserDocument` when they need to call `.save()`; they use `IUser` when they only need the data shape.

**`.js` extensions in TypeScript imports**

```typescript
import { generateToken } from "../utils/token.util.js";
```

With `moduleResolution: NodeNext`, TypeScript resolves `.js` imports to `.ts` files at compile time but emits `.js` imports in the output (which Node loads at runtime). This is not a mistake — it is the correct ESM import convention under NodeNext.

**`tsconfig.json` — strict mode**

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "allowJs": false,
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  }
}
```

`strict: true` enables all strict checks including `strictNullChecks` (no implicit `null | undefined`), `strictFunctionTypes`, and `noImplicitAny`. `noUncheckedIndexedAccess` adds `| undefined` to array and object index accesses, preventing "index exists" assumptions. `allowJs: false` enforces that no JavaScript source files exist — the migration is complete.

---

## 11. Validation System

### The Problem with Type-Only Validation

TypeScript types exist only at compile time. When a request arrives at your server, the types are gone — what arrives is an untyped JSON object. Consider:

```typescript
// Controller — TypeScript trusts you
const body = req.body as CreateJobInput;
await createJobService(body.title, body.category);
```

If the client sends `{ title: "" }` (missing `category`), TypeScript is silent. The service receives `undefined` for `category` and creates a document with a missing required field — or Mongoose throws an ugly runtime error.

TypeScript tells you the *shape*. Zod proves the *value*.

### Why Zod Instead of express-validator?

The codebase started with `express-validator` chains. After the TypeScript migration, a problem emerged: validation and types were two separate things that could drift apart.

```typescript
// express-validator (old)
const createJobValidation = [
  body("title").notEmpty(),
  body("category").notEmpty(),
];

interface CreateJobData {     // ← manually maintained, can drift
  title: string;
  category: string;
}
```

If you add a field to `CreateJobData` but forget to add a validator for it, TypeScript won't tell you.

With Zod, the schema *is* the type:

```typescript
// Zod (current)
export const createJobSchema = z.object({
  title: z.string({ error: "Title is required" }).min(1).trim(),
  category: z.enum(JOB_CATEGORIES, { error: "Category is required" }),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
// ↑ derived — cannot drift from the schema
```

Change the schema once; the type updates automatically.

### The `zodValidate` Middleware Factory

```typescript
// shared/validators/validate.middleware.ts
export const zodValidate = (
  schema: ZodSchema,
  target: "body" | "query" | "params" = "body",
): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      // Field-level errors: [{ path: "category", message: "Category is required" }]
      res.status(400).json({ success: false, message: "Validation failed",
        errors: result.error.issues.map(i => ({ path: i.path.join("."), message: i.message }))
      });
      return;
    }

    req[target] = result.data; // ← writes parsed/coerced data back
    next();
  };
```

`result.data` is not just validated — it is **parsed**. Strings are trimmed. Emails are lowercased. Numbers coerced from query strings (`"10"` → `10`). Defaults applied. By the time the controller runs, `req.body` holds clean, coerced, guaranteed-to-match-the-schema data. The `as CreateJobInput` cast in the controller is not blind — it is backed by runtime proof.

**Validation targets:**

```typescript
// Validate request body (default)
router.post("/", zodValidate(createJobSchema), createJob);

// Validate query string — coerces "?page=2&limit=10" to { page: 2, limit: 10 }
router.get("/", zodValidate(getAllJobsQuerySchema, "query"), getJobs);
```

### Shared Zod Primitives

```typescript
// shared/validators/common.schemas.ts
export const emailSchema = z.string({ error: "Email is required" })
  .email("Must be a valid email address").toLowerCase().trim();

export const passwordSchema = z.string({ error: "Password is required" })
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Must include at least one uppercase letter")
  .regex(/[0-9]/, "Must include at least one number");
```

Primitives that are used in two or more modules live in `shared/validators/common.schemas.ts`. Module-specific schemas (job title, application status) stay in their own module's schema file.

---

## 12. Logging System

### Why Pino Instead of `console.log`?

`console.log` is synchronous — it blocks the Node.js event loop while formatting and writing the string to stdout. In a request handler doing 5 console.log calls per request at 100 req/s, that's 500 synchronous writes blocking all other I/O.

Pino writes asynchronously and serializes to JSON using a Worker thread, keeping the main event loop free. Benchmarks consistently put Pino at ~5× faster than Winston and ~20× faster than `console.log` under load.

The bigger advantage is structured output:

```json
{"level":30,"time":1748812543120,"msg":"Server started","port":5000,"env":"development"}
{"level":50,"time":1748812601243,"msg":"Server error","err":{"type":"Error","message":"...","stack":"..."},"method":"POST","path":"/api/v1/jobs"}
```

A log aggregator (Datadog, Loki, CloudWatch Logs Insights) can query `fields.method = "POST" AND fields.path = "/api/v1/jobs"` against JSON fields natively. Plain-string logs require regex parsing.

### Configuration

```typescript
// shared/logger/logger.ts
export const logger = pino({
  level: isDev ? "debug" : "info",
  serializers: { err: pino.stdSerializers.err }, // Error → { type, message, stack }
  ...(isDev && {
    transport: {
      target: "pino-pretty",
      options: { colorize: true, translateTime: "SYS:HH:MM:ss", ignore: "pid,hostname" }
    }
  })
});
```

In **development**: pino-pretty renders colorized, human-readable lines. The transport runs in a Worker thread — pino-pretty's synchronous rendering happens off the main event loop.

In **production**: raw JSON to stdout. Never run pino-pretty in production — it removes pino's async advantage.

### Log Levels

| Level   | When used                                             |
|---------|-------------------------------------------------------|
| `debug` | Detailed trace information (dev only)                 |
| `info`  | Normal operational events (server start, DB connect)  |
| `warn`  | Client errors in development (4xx responses)          |
| `error` | Server-side failures — always logged including prod   |
| `fatal` | Process-ending failures (DB connection lost)          |

### Error Middleware Logging Strategy

```typescript
// 5xx = server bugs → always log, even in production
if (statusCode >= 500) {
  logger.error({ err, method: req.method, path: req.path }, "Server error");
}
// 4xx = client mistakes → log only in development (suppress production noise)
else if (env.NODE_ENV !== "production") {
  logger.warn({ statusCode, message, method: req.method, path: req.path }, "Client error");
}
```

In production, 400-level errors are not logged — clients sending bad requests are expected and logging them would flood your observability platform with noise. 500-level errors always log because they represent bugs in your code.

---

## 13. API Reference

Base URL: `http://localhost:5000/api/v1`

All responses follow the envelope pattern:
```json
// Success
{ "success": true, "statusCode": 200, "message": "...", "data": { ... } }

// Error
{ "success": false, "message": "...", "errors": [{ "path": "field", "message": "..." }] }
```

### Auth

| Method | Endpoint           | Auth  | Body                              | Description           |
|--------|--------------------|-------|-----------------------------------|-----------------------|
| POST   | `/auth/register`   | None  | `name, email, password, role?`    | Create a new account  |
| POST   | `/auth/login`      | None  | `email, password`                 | Login, receive cookie |
| POST   | `/auth/logout`     | None  | —                                 | Clear auth cookie     |

`role` defaults to `"user"`. Registering as `"admin"` is blocked at the Zod schema level — `z.enum(USER_ROLES).exclude(["admin"])`.

### Users

| Method | Endpoint              | Auth          | Description                                |
|--------|-----------------------|---------------|--------------------------------------------|
| GET    | `/users/me`           | User          | Get current user's profile                 |
| GET    | `/users/`             | Admin         | Get all users                              |
| PATCH  | `/users/:id/status`   | Admin         | Block or activate a user account           |

### Profile

| Method | Endpoint              | Auth  | Description                                       |
|--------|-----------------------|-------|---------------------------------------------------|
| GET    | `/profile/me`         | User  | Get own profile + completion percentage           |
| POST   | `/profile/`           | User  | Create profile (one-time; 400 if already exists)  |
| PUT    | `/profile/me`         | User  | Update profile fields                             |
| PATCH  | `/profile/me/avatar`  | User  | Upload/replace avatar (image, max 2 MB)           |
| DELETE | `/profile/me/avatar`  | User  | Delete avatar from Cloudinary + clear field       |
| PATCH  | `/profile/me/resume`  | User  | Upload/replace resume (PDF, max 5 MB)             |
| GET    | `/profile/me/resume`  | User  | Get resume URL                                    |
| DELETE | `/profile/me/resume`  | User  | Delete resume from Cloudinary + clear field       |

`skills` in the profile body accepts either `["React", "Node"]` or a comma-separated string `"React, Node"` — the Zod schema normalizes both to `string[]`.

### Jobs

| Method | Endpoint             | Auth        | Query Params                                           | Description                        |
|--------|----------------------|-------------|--------------------------------------------------------|------------------------------------|
| GET    | `/jobs/`             | None        | `keyword, location, jobType, category, minSalary, maxSalary, experience, sort, page, limit` | Search & filter all active jobs |
| GET    | `/jobs/latest`       | None        | —                                                      | 6 most recently posted jobs        |
| GET    | `/jobs/recommended`  | User        | —                                                      | Personalised based on past applies |
| GET    | `/jobs/my/jobs`      | Recruiter   | `page, limit`                                          | Jobs created by the recruiter      |
| GET    | `/jobs/:id`          | None        | —                                                      | Single job detail                  |
| POST   | `/jobs/`             | Recruiter   | —                                                      | Create a job listing               |
| PUT    | `/jobs/:id`          | Recruiter   | —                                                      | Update own job (all fields optional)|
| DELETE | `/jobs/:id`          | Recruiter   | —                                                      | Soft-delete (sets `status: deleted`)|

`sort` accepts `"latest"` (default), `"oldest"`, `"salary"`. All numeric query params (`page`, `limit`, `minSalary`, `maxSalary`, `experience`) are coerced from strings by Zod's `z.coerce.number()`.

### Applications

| Method | Endpoint                    | Auth       | Description                                           |
|--------|-----------------------------|------------|-------------------------------------------------------|
| POST   | `/applications/:jobId/apply`| User       | Apply to a job (atomic transaction)                   |
| GET    | `/applications/my`          | User       | All of the current user's applications                |
| DELETE | `/applications/:id`         | User       | Withdraw an application (atomic, decrements counter)  |
| GET    | `/applications/job/:jobId`  | Recruiter  | Paginated applicant list for a job                    |
| PATCH  | `/applications/:id/status`  | Recruiter  | Update application status                             |

Status transitions: `pending → reviewed`, `pending / reviewed → accepted`, `pending / reviewed → rejected`.

Apply and Withdraw both use Mongoose sessions + transactions to atomically update the application document and the job's `applicationsCount` counter.

### Dashboard

| Method | Endpoint               | Auth       | Description                                          |
|--------|------------------------|------------|------------------------------------------------------|
| GET    | `/dashboard/recruiter` | Recruiter  | Total jobs, total applications, breakdown per job    |
| GET    | `/dashboard/admin`     | Admin      | Platform totals: users, recruiters, jobs, applications |

### Admin

| Method | Endpoint                     | Auth  | Description                        |
|--------|------------------------------|-------|------------------------------------|
| GET    | `/admin/users`               | Admin | All users                          |
| GET    | `/admin/recruiters`          | Admin | All recruiters                     |
| GET    | `/admin/jobs`                | Admin | All jobs across all recruiters     |
| DELETE | `/admin/jobs/:id`            | Admin | Hard-delete any job                |
| PATCH  | `/admin/users/:userId/status`| Admin | Block or activate any user account |

---

## 14. Security

| Concern                | Mechanism                                                                        |
|------------------------|----------------------------------------------------------------------------------|
| Auth tokens            | Stored in `HttpOnly` cookies — inaccessible to JavaScript, resistant to XSS     |
| Password storage       | `bcrypt` with `saltRounds: 10` — adaptive hashing, immune to rainbow tables      |
| Security headers       | `helmet()` sets CSP, HSTS, X-Frame-Options, X-Content-Type-Options, and more     |
| CORS                   | Strict origin allowlist from `CLIENT_URL` env var; credentials allowed           |
| Rate limiting          | Auth routes: 10 requests / 15 minutes per IP. Global: 100 / 15 minutes           |
| Input validation       | All request bodies, query params validated and coerced by Zod before controllers |
| Environment secrets    | `process.env` only read through `config/env.ts`; validated at startup            |
| Log safety             | MongoDB URI credentials redacted before logging; stack traces never sent to clients |
| Account blocking       | `protect` middleware checks `user.status !== "blocked"` on every authenticated request |
| Role enforcement       | `authorize(...roles)` middleware — cannot bypass by modifying JWT payload (signature verified) |

---

## 15. Deployment

### Build

```bash
npm run build
# Compiles src/ → dist/
# Resolves tsconfig path aliases (tsc-alias)
# Output: dist/server.js (entry point)
```

### Environment

Set `NODE_ENV=production`. This changes:
- Pino output: raw JSON (no pino-pretty)
- Cookie `secure` flag: `true` (HTTPS only)
- Log level: `info` and above (no debug noise)
- Error log: 4xx errors suppressed in production logs

### Process Management

Use a process manager to keep the Node process alive and restart it on crash:

```bash
# PM2
npm install -g pm2
pm2 start dist/server.js --name hirenova-api
pm2 startup   # auto-start on reboot
pm2 save
```

### Docker

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

This two-stage build keeps TypeScript and dev tools out of the production image. The runtime stage only contains compiled JavaScript and production dependencies.

### Health Check

The app does not currently expose a `/health` endpoint. For deployment behind a load balancer or in Kubernetes, add one:

```typescript
// app.ts
app.get("/health", (_req, res) => res.json({ status: "ok", uptime: process.uptime() }));
```

### Deployment Checklist

- [ ] All required environment variables are set
- [ ] `NODE_ENV=production`
- [ ] MongoDB Atlas IP allowlist includes your server's IP
- [ ] Cloudinary credentials are from a production environment
- [ ] `CLIENT_URL` points to the production frontend domain (exact match)
- [ ] HTTPS is terminated at the load balancer or reverse proxy (nginx, Caddy)
- [ ] `JWT_SECRET` is a cryptographically random string (≥ 32 characters)
- [ ] Process manager configured for auto-restart
- [ ] Log aggregation configured (stdout → Datadog / Loki / CloudWatch)

---

## 16. Future Roadmap

The current architecture is deliberately lean. The following improvements are defined and architecturally compatible — they extend the existing structure rather than requiring rewrites.

### Near-term

- **Zod schemas for remaining modules** — `user` and `admin` modules still use manual type guards for input validation. Migrate them to `zodValidate` following the pattern in `auth`, `job`, and `profile`.

- **Remove `express-validator` dependency** — the package is still listed in `package.json` but no source file imports it (all validation was migrated to Zod). Running `npm uninstall express-validator` cleans up the dependency tree.

- **`/health` endpoint** — required for load balancers, Kubernetes liveness probes, and uptime monitors.

- **Resume/avatar type validation** — file type restrictions currently live in upload middleware. Consider extending Zod schemas to validate metadata (MIME type, file size) from `req.file` for a uniform validation pattern.

### Medium-term

- **Refresh token + access token split** — current JWTs have a 1-day expiry. Production systems pair short-lived access tokens (15 min) with long-lived refresh tokens (30 days) stored server-side (Redis) for revocation.

- **Email notifications** — application status changes trigger transactional emails (Resend or Nodemailer). The service layer is the right place to add this: `updateApplicationStatusService` already owns the status transition logic.

- **Redis caching** — `getLatestJobsService` and `getRecommendedJobsService` are good candidates for short-TTL caching (30–60 seconds). Both are read-heavy, do not depend on the requesting user's mutations, and use `Promise.all` queries that could be cached as a unit.

- **Integration tests** — the service layer is decoupled from Express, so services can be tested with plain function calls against a test database (MongoDB Memory Server). No Express mocking required.

### Architectural Scale Points

The current architecture handles everything in one Node.js process. When a single dimension becomes a bottleneck, the layer that owns it can be extracted independently:

| If this grows         | Extract this                           |
|-----------------------|----------------------------------------|
| File upload load      | Dedicated upload service + presigned Cloudinary URLs |
| Search query load     | Elasticsearch index alongside MongoDB |
| Notification volume   | Message queue (BullMQ + Redis) for async email/push |
| Auth complexity       | OAuth2 providers (Google, LinkedIn)   |
| Multiple frontends    | GraphQL layer over the existing services |

None of these require restructuring the existing modules. The service layer provides the abstraction boundary at which each extraction happens.

---

## Project Structure at a Glance

```
hirenova-backend/
├── src/
│   ├── app.ts                    Express app
│   ├── server.ts                 Entry point
│   ├── config/                   Startup config (env, db, cookies)
│   ├── middlewares/              Auth, error, rate-limit, uploads
│   ├── modules/                  Feature modules (auth, job, profile, ...)
│   │   └── <module>/
│   │       ├── *.routes.ts       URL + middleware chain
│   │       ├── *.controller.ts   HTTP in/out
│   │       ├── *.service.ts      Business logic
│   │       ├── *.model.ts        Mongoose schema + TS types
│   │       └── *.schemas.ts      Zod schemas + derived types
│   ├── routes/index.ts           API manifest
│   ├── shared/                   Cross-module utilities (pagination, logger, validators)
│   ├── types/                    TypeScript ambient declarations
│   └── utils/                    Pure utilities (ApiError, ApiResponse, asyncHandler)
├── dist/                         Compiled output (gitignored)
├── package.json
└── tsconfig.json
```

---

*Built with TypeScript, designed for simplicity, hardened for production.*
