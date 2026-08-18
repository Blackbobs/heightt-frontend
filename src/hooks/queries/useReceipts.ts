import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeApi, Receipt } from '@/lib/api/finance';
import { queryKeys } from '@/lib/api/keys';
import { useAuthStore } from '@/store/auth-store';

export function useReceipts(params?: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  organizationId?: string;
}) {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: queryKeys.finance.receipts(params),
    queryFn: async () => {
      try {
        const result = await financeApi.getReceipts(params);
        return result?.data || [];
      } catch (error) {
        console.error('Error fetching receipts:', error);
        return [];
      }
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useDownloadReceipt() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const blob = await financeApi.downloadReceipt(id);
      if (!blob) {
        throw new Error('Failed to download receipt');
      }
      return blob;
    },
    onSuccess: (_, id) => {
      // Invalidate the receipt query to update download count
      queryClient.invalidateQueries({ queryKey: queryKeys.finance.receipt(id) });
    },
  });
}