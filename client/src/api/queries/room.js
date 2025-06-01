import axiosClient from "../axiosClient";

const baseRoom = "room";

export const createRoom = async (data) => {
  const response = await axiosClient.post(`/${baseRoom}`, data);

  return response.data?.data?._id;
};

export const addUserRequest = async (data, roomId) => {
  return axiosClient.post(`/${baseRoom}/request`, data);
};

export const adminResponse = async (data, roomId) => {
  console.log(data, roomId);
  return axiosClient.post(`/${baseRoom}/${roomId}/responses`, data);
};

export const updateRoom = async (roomId, data) => {
  const response = axiosClient.patch(`/${baseRoom}/${roomId}`, data);
  return response.data?.data?._id;
};

export const deleteRoom = async (data, roomId) => {
  return axiosClient.delete(`/${baseRoom}/${roomId}`, data);
};

export const getRoomData = async (roomId) => {
  console.log("here");
  const response = await axiosClient.get(`/${baseRoom}/${roomId}`);
  console.log(response);
  return response.data?.data;
};

export const leaveRoom = async (data, roomId) => {
  console.log("leave room", data);
  const response = await axiosClient.patch(
    `/${baseRoom}/${roomId}/leave`,
    data
  );
  console.log(response);
  return response.data?.data;
};

export const adminTransfer = async (data) => {
  return axiosClient.post(`/${baseRoom}/${roomId}/admin/transfer`);
};
