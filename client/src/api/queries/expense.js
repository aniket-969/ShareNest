import axiosClient from "../axiosClient";

const baseExpense = "expense";

export const getUserExpense = async (
  roomId,
  beforeId = null,
  limit = 10,
  q = ""
) => {
  console.log("in get user expense api query");
  const response = await axiosClient.get(`/${baseExpense}/${roomId}`, {
    params: { beforeId, limit, q },
  });
  console.log(response);
  return response?.data?.data;
};

export const settleAllExpense = async (roomId, owedToUserId, data) => {
  console.log("Settling expense", roomId, owedToUserId);
  // return;
  const response = await axiosClient.post(
    `/${baseExpense}/${roomId}/settle-up/${owedToUserId}`,
    data
  );

  console.log(response);
  return response?.data?.data;
};

export const getSettleUpExpense = async (roomId) => {
  console.log("Settling expense");
  const response = await axiosClient.get(`/${baseExpense}/${roomId}/settle-up`);

  console.log(response);
  return response?.data?.data;
};

export const createExpense = async (data, roomId) => {
  console.log(data, roomId);

  return axiosClient.post(`/${baseExpense}/${roomId}`, data);
};

export const deleteExpense = async (expenseId) => {
  console.log(expenseId)
  // return
  return axiosClient.delete(`/${baseExpense}/${expenseId}`);
};

export const updateExpense = async (expenseId, data) => {
  console.log(expenseId,data)
  return
  return axiosClient.patch(`/${baseExpense}/${expenseId}`, data);
};

export const updatePayment = async (expenseId, updatedData) => {
  console.log(updatedData, expenseId);

  return axiosClient.patch(`/${baseExpense}/${expenseId}/payment`, updatedData);
};
