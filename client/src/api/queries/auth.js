import axiosClient from "../axiosClient";

const base = "users";

export const fetchSession = async () => {
  const response = await axiosClient.get(`/${base}/session`);
  localStorage.setItem("session", JSON.stringify(response.data.data));
  return response.data?.data;
};

export const registerUser = (data) => {
  return axiosClient.post(`/${base}/register`, data);
};

export const loginUser = (data) => {
  return axiosClient.post(`/${base}/login`, data);
};

export const logOut = () => {
  return axiosClient.post(`/${base}/me/logout`);
};

export const refreshTokens = (data) => {
  return axiosClient.post(`/${base}/refreshTokens`, data);
};

export const updateUser = (data) => {
  return axiosClient.patch(`/${base}/me`, data);
};

export const updateNotificationToken = (data) => {
  return axiosClient.patch(`/${base}/me/token`, data);
};

export const changePassword = (data) => {
  return axiosClient.patch(`/${base}/me/password`, data);
};

export const addPayment = (data) => {
  return axiosClient.patch(`/${base}/me/payments`, data);
};
