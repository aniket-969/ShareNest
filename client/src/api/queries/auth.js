import axiosClient from "../axiosClient";

const base = "users";

export const fetchSession = async () => {
  const response = await axiosClient.get(`/${base}/session`);
  localStorage.setItem("session", JSON.stringify(response.data?.data));
  return response.data?.data;
};

export const registerUser = (data) => {
  return axiosClient.post(`/${base}/register`, data);
};

export const loginUser = (data) => {
  return axiosClient.post(`/${base}/login`, data);
};

export const loginWithGoogle = (idToken) => {
  return axiosClient.post(
    `/${base}/google`,
    {}, 
    {
      headers: { Authorization: `Bearer ${idToken}` },
    }
  );
};


export const logOut = () => {
  return axiosClient.post(`/${base}/me/logout`);
};

export const refreshTokens = (data) => {
  return axiosClient.post(`/${base}/refreshTokens`, data);
};

export const updateUser = async(data) => {
  console.log(data)
const response = await axiosClient.patch(`/${base}/me`, data);
console.log(response)
  return response.data?.data
};

export const updateNotificationToken = async(data) => { 
  console.log("In update notification token")
  const response = await axiosClient.patch(`/${base}/me/token`, data);
  console.log(response)
  return 
};

export const changePassword = async(data) => {
  console.log("changin pass",data)
  const response = await axiosClient.patch(`/${base}/me/password`, data);
  console.log(response)
  return response?.data
};

export const addPayment = (data) => {
  return axiosClient.patch(`/${base}/me/payments`, data);
};
