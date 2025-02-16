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

  // Fetch expense details
  const expenseQuery = (expenseId) =>
    useQuery({
      queryKey: ["expense", expenseId],
      queryFn: () => getExpenseDetails(expenseId),
      refetchOnWindowFocus: false,
      staleTime: 30 * 60 * 1000,
      cacheTime: 60 * 60 * 1000,
      enabled: !!expenseId, // Avoid fetching when expenseId is undefined
    });

  // Fetch user-specific expenses
  const userExpenseQuery = useQuery({
    queryKey: ["expense", "user"],
    queryFn: getUserExpense,
    refetchOnWindowFocus: false,
    staleTime: 30 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
    enabled: false,
  });

  // Fetch pending payments
  const userPendingExpenseQuery = useQuery({
    queryKey: ["expense", "pending"],
    queryFn: getPendingPayments,
    refetchOnWindowFocus: false,
    staleTime: 30 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });
 
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
      updatePayment(expenseId, updatedData),
    onSuccess: (data, { expenseId }) => {
      queryClient.invalidateQueries(["expense", expenseId]);
      queryClient.invalidateQueries(["expense", "pending"]);
    },
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
    expenseQuery,
    userExpenseQuery,
    userPendingExpenseQuery,
    updatePaymentMutation,
  };
};
