import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err.response &&
      err.response.status === 401 &&
      err.config &&
      !err.config.url.includes("/auth/login") &&
      !err.config.url.includes("/auth/logout")
    ) {
      if (!window.__isLoggingOut) {
        window.__isLoggingOut = true;
        window.dispatchEvent(new Event("logout"));
      }
    }

    return Promise.reject(err);
  },
);

export default instance;
