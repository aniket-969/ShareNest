import axiosClient from "../axiosClient";

const baseExpense = "expense";

export const createExpense = async (data, roomId) => { 
  console.log(data,roomId)
 
  return axiosClient.post(`/${baseExpense}/${roomId}`, data);
};

export const deleteExpense = async (expenseId) => {
  return axiosClient.delete(`/${baseExpense}/${expenseId}`);
}; 
 
export const updateExpense = async (expenseId, data) => {
  return axiosClient.patch(`/${baseExpense}/${expenseId}`, data);
};

export const getExpenseDetails = async (expenseId) => {
  return axiosClient.get(`/${baseExpense}/${expenseId}`);
};

export const getPendingPayments = async (expenseId) => {
  const response = await axiosClient.get(`/${baseExpense}/pending`);
  // console.log(response)
  return response?.data?.data
};

export const getUserExpense = async () => {
  console.log("in get user expense api query")
  const response = await axiosClient.get(`/${baseExpense}/`);
  // console.log(response)
  return response?.data?.data
};

export const updatePayment = async (expenseId, updatedData) => {
  console.log(updatedData,expenseId)
  
  return axiosClient.patch(`/${baseExpense}/${expenseId}/payment`, updatedData);
};
