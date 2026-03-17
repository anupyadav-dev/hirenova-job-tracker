const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const errorHandler = require("./middleware/error.middleware");

const authRoutes = require("./routes/auth.routes");
const jobRoutes = require("./routes/job.routes");
const applicationRoutes = require("./routes/application.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);
module.exports = app;
