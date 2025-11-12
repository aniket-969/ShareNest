import {
  createExpense,
  deleteExpense,
  getExpenseDetails,
  getPendingPayments,
  getUserExpense,
  updateExpense,
  updatePayment,
} from "@/api/queries/expense";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useExpense = (roomId) => {
  const queryClient = useQueryClient();
 
  // Create an expense
  const createExpenseMutation = useMutation({
    mutationFn: (data) => createExpense(data, roomId),
    onSuccess: () => {
      queryClient.invalidateQueries(["expense", "user"]);
    },
  });

  // Update an expense
  const updateExpenseMutation = useMutation({
    mutationFn: ({ expenseId, updatedData }) =>
      updateExpense(expenseId, updatedData),
    onSuccess: (data, { expenseId }) => {
      queryClient.invalidateQueries(["expense", expenseId]);
    },
  });

  const updatePaymentMutation = useMutation({
    mutationFn: ({ expenseId, updatedData }) =>
      updatePayment(expenseId, updatedData)
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (expenseId) => deleteExpense(expenseId),
    onSuccess: (data, expenseId) => {
      queryClient.invalidateQueries(["expense", "user"]);
      queryClient.invalidateQueries(["expense", expenseId]);
    },
  });

  return {
    createExpenseMutation,
    updateExpenseMutation,
    deleteExpenseMutation,
    updatePaymentMutation,
  };
};
