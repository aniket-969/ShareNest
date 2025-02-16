import axiosClient from "../axiosClient";

const baseAuth = "users";

export const fetchSession = async () => {
  // console.log("calling session");

  console.log("calling getAuth");
  const response = await axiosClient.get(`/${baseAuth}/session`);
  console.log(response)
  // console.log("Fetched session data",response.data.data)
  localStorage.setItem("session", JSON.stringify(response.data.data));
  return response.data?.data;
};

export const registerUser = async (data) => {
  return axiosClient.post(`/${baseAuth}/register`, data);
};

export const loginUser = async (data) => {
  return axiosClient.post(`/${baseAuth}/login`, data);
};

export const logOut = async (data) => {
  return axiosClient.post(`/${baseAuth}/logout`, data);
};

export const refreshTokens = async (data) => {
  return axiosClient.post(`/${baseAuth}/refreshTokens`, data);
};

export const updateUser = async (data) => {
  return axiosClient.patch(`/${baseAuth}/update-user`, data);
};
 
export const addPayment = async (data) => {
  return axiosClient.patch(`/${baseAuth}/payment`, data);
};

export const changePassword = async (data) => {
  return axiosClient.post(`/${baseAuth}/change-password`, data);
};
