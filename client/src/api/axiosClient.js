import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || "http://localhost:3000/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let refreshSubscribers = [];

const onTokenRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (cb) => {
  refreshSubscribers.push(cb);
};

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, config } = error;
    const expired =
      response?.status === 401 &&
      response.data?.message?.toLowerCase().includes("expired");
    const currentPath = window.location.pathname;

    const isPublicPage = ["/login", "/register"].includes(currentPath);
    if (!expired) {
      localStorage.clear()
      return Promise.reject(error);
    }

    //  return a promise that will retry this request
    const retryRequest = new Promise((resolve) => {
      addRefreshSubscriber((token) => {
        config.headers["Authorization"] = `Bearer ${token}`;
        resolve(axiosClient(config));
      });
    });

    
    if (!isRefreshing) {
      isRefreshing = true;
      axiosClient
        .post("/users/refreshTokens")
        .then(({ data }) => {
          const newToken = data.data.accessToken;
          onTokenRefreshed(newToken);
        })
        .catch(() => {
          localStorage.clear();
          if (!isPublicPage) window.location.href = "/login";
        })
        .finally(() => {
          isRefreshing = false;
        });
    }

    return retryRequest;
  }
);

export default axiosClient;
