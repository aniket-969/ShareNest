import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || "http://localhost:3000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshSubscribers = []; // Store pending requests while refreshing

const onTokenRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message || "";

      if (errorMessage.includes("expired")) {
        console.log("Access token expired, attempting to refresh...");

        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const refreshResponse = await axios.post(
              "http://localhost:3000/api/v1/users/refreshTokens",
              {},
              { withCredentials: true }
            );

            const newAccessToken = refreshResponse.data?.accessToken;

            if (newAccessToken) {
              onTokenRefreshed(newAccessToken);
              isRefreshing = false;

              return new Promise((resolve) => {
                addRefreshSubscriber((token) => {
                  error.config.headers["Authorization"] = `Bearer ${token}`;
                  resolve(axiosClient(error.config));
                });
              });
            }
          } catch (refreshError) {
            console.error("Refresh token failed, logging out user.");
            if (!localStorage.getItem("sessionExpired")) {
              localStorage.setItem("sessionExpired", "true");
              localStorage.removeItem("session");
              window.location.href = "/login";
            }
          }

          isRefreshing = false;
        }

        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            error.config.headers["Authorization"] = `Bearer ${token}`;
            resolve(axiosClient(error.config));
          });
        });
      } else {
        console.warn("No valid access token found. Redirecting to login.");
        if (!localStorage.getItem("sessionExpired")) {
          localStorage.setItem("sessionExpired", "true");
          localStorage.removeItem("session");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
