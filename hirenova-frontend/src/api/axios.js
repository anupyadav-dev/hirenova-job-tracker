import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || "";

    const isUnauthorized = err.response?.status === 401;

    const ignoreRoutes = ["/auth/login", "/auth/logout", "/users/me"];

    const shouldIgnore = ignoreRoutes.some((route) => url.includes(route));

    if (isUnauthorized && !shouldIgnore) {
      if (!window.__isLoggingOut) {
        window.__isLoggingOut = true;
        window.dispatchEvent(new Event("logout"));
      }
    }

    return Promise.reject(err);
  },
);

export default instance;
