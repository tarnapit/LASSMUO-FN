import { apiClient } from '../client';
import { API_CONFIG, ApiResponse } from '../config';
import { 
  Order, 
  CreateOrderRequest, 
  UpdateOrderRequest 
} from '../types';

export class OrderService {
  private endpoint = API_CONFIG.ENDPOINTS.ORDER;

  /**
   * Create a new order (quiz question)
   */
  async createOrder(orderData: CreateOrderRequest): Promise<ApiResponse<Order>> {
    return apiClient.post<ApiResponse<Order>>(`${this.endpoint}/createOrder`, orderData);
  }

  /**
   * Get all orders
   */
  async getAllOrders(): Promise<ApiResponse<Order[]>> {
    return apiClient.get<ApiResponse<Order[]>>(`${this.endpoint}/getOrder`);
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string): Promise<ApiResponse<Order>> {
    return apiClient.get<ApiResponse<Order>>(`${this.endpoint}/${orderId}`);
  }

  /**
   * Get orders by lesson ID
   */
  async getOrdersByLessonId(lessonId: string): Promise<ApiResponse<Order[]>> {
    return apiClient.get<ApiResponse<Order[]>>(`${this.endpoint}/getOrder`, { lessonId });
  }

  /**
   * Get orders by user ID
   */
  async getOrdersByUserId(userId: string): Promise<ApiResponse<Order[]>> {
    return apiClient.get<ApiResponse<Order[]>>(`${this.endpoint}/getOrder`, { userId });
  }

  /**
   * Update order (full update)
   */
  async updateOrder(orderId: string, orderData: UpdateOrderRequest): Promise<ApiResponse<Order>> {
    return apiClient.put<ApiResponse<Order>>(`${this.endpoint}/updateOrder/${orderId}`, orderData);
  }

  /**
   * Patch order (partial update)
   */
  async patchOrder(orderId: string, orderData: Partial<UpdateOrderRequest>): Promise<ApiResponse<Order>> {
    return apiClient.patch<ApiResponse<Order>>(`${this.endpoint}/patchOrder/${orderId}`, orderData);
  }

  /**
   * Delete order
   */
  async deleteOrder(orderId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.endpoint}/deleteOrder/${orderId}`);
  }

  /**
   * Get random orders for a lesson (for quiz generation)
   */
  async getRandomOrders(lessonId: string, count: number = 10): Promise<ApiResponse<Order[]>> {
    return apiClient.get<ApiResponse<Order[]>>(`${this.endpoint}/getOrder`, { 
      lessonId, 
      random: true,
      limit: count 
    });
  }

  /**
   * Validate answer for an order
   */
  async validateAnswer(orderId: string, answer: string): Promise<ApiResponse<{
    isCorrect: boolean;
    correctAnswer?: string;
    explanation?: string;
  }>> {
    return apiClient.post(`${this.endpoint}/${orderId}/validate`, { answer });
  }

  /**
   * Get order statistics
   */
  async getOrderStats(orderId: string): Promise<ApiResponse<{
    totalAttempts: number;
    correctAttempts: number;
    successRate: number;
    averageTime: number;
  }>> {
    return apiClient.get(`${this.endpoint}/${orderId}/stats`);
  }

  /**
   * Bulk create orders
   */
  async bulkCreateOrders(orders: CreateOrderRequest[]): Promise<ApiResponse<Order[]>> {
    return apiClient.post<ApiResponse<Order[]>>(`${this.endpoint}/bulk-create`, { orders });
  }

  /**
   * Search orders by question text
   */
  async searchOrders(searchTerm: string): Promise<ApiResponse<Order[]>> {
    return apiClient.get<ApiResponse<Order[]>>(`${this.endpoint}/getOrder`, { 
      search: searchTerm 
    });
  }
}

// Export singleton instance
export const orderService = new OrderService();
