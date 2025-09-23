import { API_CONFIG, ApiError, NetworkError, ApiResponse } from './config';

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.defaultHeaders = API_CONFIG.HEADERS;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const responseText = await response.text();
    console.log(`Response text from ${response.url}:`, responseText);

    if (!response.ok) {
      let errorMessage = `HTTP Error: ${response.status}`;
      
      try {
        const errorData = responseText ? JSON.parse(responseText) : {};
        errorMessage = errorData.message || errorData.error || errorData.detail || errorMessage;
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      
      // เพิ่มข้อมูลเพิ่มเติมสำหรับ debugging
      if (response.status === 404) {
        errorMessage = `Not Found: ${errorMessage}`;
      } else if (response.status === 401) {
        errorMessage = `Unauthorized: ${errorMessage}`;
      } else if (response.status === 400) {
        errorMessage = `Bad Request: ${errorMessage}`;
      }
      
      throw new ApiError(errorMessage, response.status);
    }

    try {
      if (!responseText) {
        // ถ้าไม่มี response body ส่งคืน empty object
        return {} as T;
      }
      
      const parsedResponse = JSON.parse(responseText);
      console.log('Parsed response:', parsedResponse);
      return parsedResponse;
    } catch (error) {
      console.error('JSON parse error:', error);
      throw new ApiError('Invalid JSON response from server');
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // เพิ่ม Authorization header ถ้ามี token - รองรับหลายชื่อ token
    const token = typeof window !== 'undefined' ? 
      localStorage.getItem('astronomy_app_token') || 
      localStorage.getItem('authToken') || 
      localStorage.getItem('token') : null;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      console.log(`Making ${config.method || 'GET'} request to:`, url);
      console.log('Request config:', { 
        headers: config.headers, 
        body: config.body ? JSON.stringify(JSON.parse(config.body as string)) : undefined 
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      console.log(`Response from ${url}:`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error('API Request failed:', { url, error });
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new NetworkError('Request timeout');
        }
        if (error.message.includes('Failed to fetch')) {
          throw new NetworkError('Network connection failed - API server may be down');
        }
        throw new NetworkError(error.message);
      }
      
      throw new NetworkError('Unknown error occurred');
    }
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }

    return this.makeRequest<T>(url, {
      method: 'GET',
    });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // Upload file
  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
    });
  }

  // Set authentication token
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Remove authentication token
  removeAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  // Update base URL
  setBaseURL(url: string) {
    this.baseURL = url;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export { ApiClient };
