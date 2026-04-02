import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || "http://localhost:3000/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let refreshSubscribers = [];

const onTokenRefreshed = (newToken) => {
  refreshSubscribers.forEach(({ resolve }) => resolve(newToken));
  refreshSubscribers = [];
};

const onRefreshFailed = (error) => {
  refreshSubscribers.forEach(({ reject }) => reject(error));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (subscriber) => {
  refreshSubscribers.push(subscriber);
};

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, config } = error;

    const message = response?.data?.message?.toLowerCase() || "";
    const status = response?.status;

    const currentPath = window.location.pathname;
    const isPublicPage = ["/login", "/register"].includes(currentPath);

    const isRefreshRequest = config?.url?.includes("/users/refreshTokens");

    const isAccessExpired =
      status === 401 && message.includes("expired");

    // refresh token request fails 
    if (isRefreshRequest) {
      localStorage.clear();
      return Promise.reject(error);
    }

    // normal error
    if (!isAccessExpired) {
      localStorage.clear();
      return Promise.reject(error);
    }

    // Prevent infinite retry loop
    if (config._retry) {
      return Promise.reject(error);
    }
    config._retry = true;

    const retryRequest = new Promise((resolve, reject) => {
      addRefreshSubscriber({
        resolve: (token) => {
          config.headers["Authorization"] = `Bearer ${token}`;
          resolve(axiosClient(config));
        },
        reject,
      });
    });

    // Trigger refresh ONLY once
    if (!isRefreshing) {
      isRefreshing = true;

      axiosClient
        .post("/users/refreshTokens")
        .then(({ data }) => {
          const newToken = data.data.accessToken;
          onTokenRefreshed(newToken);
        })
        .catch((err) => {
         
          onRefreshFailed(err);

          localStorage.clear();

          if (!isPublicPage) {
            window.location.href = "/login";
          }
        })
        .finally(() => {
          isRefreshing = false;
        });
    }

    return retryRequest;
  }
);

export default axiosClient;