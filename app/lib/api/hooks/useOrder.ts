import { useCallback } from 'react';
import { orderService } from '../services';
import { Order, CreateOrderRequest, UpdateOrderRequest } from '../types';
import { ApiResponse } from '../config';
import { useApi, useMutation, useFetch } from './useApi';

// Hook for getting all orders
export function useOrders() {
  return useFetch(
    () => orderService.getAllOrders(),
    []
  );
}

// Hook for getting order by ID
export function useOrderById(orderId: string | null) {
  return useFetch(
    () => orderId ? orderService.getOrderById(orderId) : Promise.resolve(null),
    [orderId]
  );
}

// Hook for getting orders by user ID (for user's purchase history)
export function useOrdersByUserId(userId: string | null) {
  return useFetch(
    () => userId ? orderService.getOrdersByUserId(userId) : Promise.resolve(null),
    [userId]
  );
}

// Hook for creating order
export function useCreateOrder() {
  return useMutation<ApiResponse<Order>, [CreateOrderRequest]>();
}

// Hook for updating order
export function useUpdateOrder() {
  return useMutation<ApiResponse<Order>, [string, UpdateOrderRequest]>();
}

// Hook for patching order
export function usePatchOrder() {
  return useMutation<ApiResponse<Order>, [string, Partial<UpdateOrderRequest>]>();
}

// Hook for deleting order
export function useDeleteOrder() {
  return useMutation<ApiResponse<void>, [string]>();
}

// Comprehensive hook for order operations
export function useOrderOperations() {
  const createMutation = useCreateOrder();
  const updateMutation = useUpdateOrder();
  const patchMutation = usePatchOrder();
  const deleteMutation = useDeleteOrder();

  const createOrder = useCallback(async (data: CreateOrderRequest) => {
    return createMutation.mutate(orderService.createOrder, data);
  }, [createMutation]);

  const updateOrder = useCallback(async (id: string, data: UpdateOrderRequest) => {
    return updateMutation.mutate(orderService.updateOrder, id, data);
  }, [updateMutation]);

  const patchOrder = useCallback(async (id: string, data: Partial<UpdateOrderRequest>) => {
    return patchMutation.mutate(orderService.patchOrder, id, data);
  }, [patchMutation]);

  const deleteOrder = useCallback(async (id: string) => {
    return deleteMutation.mutate(orderService.deleteOrder, id);
  }, [deleteMutation]);

  return {
    createOrder,
    updateOrder,
    patchOrder,
    deleteOrder,
    creating: createMutation.loading,
    updating: updateMutation.loading,
    patching: patchMutation.loading,
    deleting: deleteMutation.loading,
    createError: createMutation.error,
    updateError: updateMutation.error,
    patchError: patchMutation.error,
    deleteError: deleteMutation.error,
    createSuccess: createMutation.success,
    updateSuccess: updateMutation.success,
    patchSuccess: patchMutation.success,
    deleteSuccess: deleteMutation.success,
  };
}

// Hook for course purchase
export function useCoursePurchase() {
  const createOrderMutation = useCreateOrder();

  const purchaseCourse = useCallback(async (userId: string, courseId: string, amount: number) => {
    const orderData: CreateOrderRequest = {
      userId,
      courseId,
      amount,
      status: 'pending'
    };

    return createOrderMutation.mutate(orderService.createOrder, orderData);
  }, [createOrderMutation]);

  return {
    purchaseCourse,
    loading: createOrderMutation.loading,
    error: createOrderMutation.error,
    success: createOrderMutation.success,
    data: createOrderMutation.data,
  };
}

// Hook for order status management
export function useOrderStatus() {
  const patchOrderMutation = usePatchOrder();

  const updateOrderStatus = useCallback(async (orderId: string, status: 'pending' | 'completed' | 'cancelled') => {
    return patchOrderMutation.mutate(orderService.patchOrder, orderId, { status });
  }, [patchOrderMutation]);

  const completeOrder = useCallback(async (orderId: string) => {
    return updateOrderStatus(orderId, 'completed');
  }, [updateOrderStatus]);

  const cancelOrder = useCallback(async (orderId: string) => {
    return updateOrderStatus(orderId, 'cancelled');
  }, [updateOrderStatus]);

  return {
    updateOrderStatus,
    completeOrder,
    cancelOrder,
    loading: patchOrderMutation.loading,
    error: patchOrderMutation.error,
    success: patchOrderMutation.success,
  };
}