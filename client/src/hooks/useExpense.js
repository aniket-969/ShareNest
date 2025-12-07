import {
  getUserExpense,
  createExpense,
  deleteExpense,
  updateExpense,
  updatePayment,
  getSettleUpExpense,
} from "@/api/queries/expense";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useExpense = (roomId) => {
  const queryClient = useQueryClient();

  const createExpenseMutation = useMutation({
    mutationFn: (data) => createExpense(data, roomId),
    onSuccess: () => {
     
    },
  });

  const updateExpenseMutation = useMutation({
    mutationFn: ({ expenseId, updatedData }) =>
      updateExpense(expenseId, updatedData),
    onSuccess: (data, { expenseId }) => {
     
    },
  });

  const updatePaymentMutation = useMutation({
    mutationFn: ({ expenseId, updatedData }) =>
      updatePayment(expenseId, updatedData),
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (expenseId) => deleteExpense(expenseId),
    onSuccess: (data, expenseId) => {
     
    },
  });

  return {
    createExpenseMutation,
    updateExpenseMutation,
    deleteExpenseMutation,
    updatePaymentMutation,
  };
};

export const useExpenseQuery = (roomId) => {
  return useInfiniteQuery({
    queryKey: ["expense", roomId],
    queryFn: async ({ pageParam = null }) => {
      return getUserExpense(roomId, pageParam, 10);
    },
    getNextPageParam: (lastPage) => {
      const meta = lastPage?.meta;
      if (!meta) return undefined;
      if (!meta.hasMore) return undefined;
      return meta.nextBeforeId;
    },
    enabled: !!roomId,
    refetchOnWindowFocus: false,
    staleTime: 30 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });
};

export const useSettleUpQuery = (roomId) => {
  return useQuery({
    queryKey: ["settleUp", roomId],
    queryFn: () => getSettleUpExpense(roomId),
    enabled: !!roomId,
    refetchOnWindowFocus: false,
    refetchOnMount: false, 
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 3,
  });
};
