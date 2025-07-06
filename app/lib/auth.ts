// ระบบ Authentication ที่เชื่อมต่อกับ API
import { userService } from './api/services/userService';
import type { CreateUserRequest } from './api/types';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class AuthManager {
  private currentUser: User | null = null;
  private authKey = 'astronomy_app_user';
  private tokenKey = 'astronomy_app_token';

  constructor() {
    // โหลดข้อมูล user จาก localStorage เมื่อเริ่มต้น
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem(this.authKey);
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      }
    }
  }

  // ตรวจสอบสถานะการล็อกอิน
  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  // ดึงข้อมูลผู้ใช้ปัจจุบัน
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // สมัครสมาชิก - ใช้ API จริง
  async signUp(signUpData: SignUpData): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const { name, email, password } = signUpData;
      
      // ตรวจสอบข้อมูลพื้นฐาน
      if (!name.trim() || !email.trim() || !password.trim()) {
        return { success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' };
      }

      if (password.length < 6) {
        return { success: false, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' };
      }

      // เรียก API สร้างผู้ใช้
      const createUserData: CreateUserRequest = {
        name: name.trim(),
        email: email.trim(),
        password
      };

      const response = await userService.createUser(createUserData);
      
      // Handle actual API response format
      console.log('API Response:', response);
      
      // API ส่งกลับ { message: string, user: User } แทน { success: boolean, data: User }
      if (response && (response as any).user) {
        const apiUser = (response as any).user;
        
        // แปลงข้อมูลจาก API เป็น User interface ของเรา
        const user: User = {
          id: apiUser.id,
          name: apiUser.name,
          email: apiUser.email,
          createdAt: new Date(apiUser.createAt || apiUser.createdAt || Date.now())
        };

        // บันทึกข้อมูลผู้ใช้ลง localStorage
        this.currentUser = user;
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.authKey, JSON.stringify(user));
        }

        return { 
          success: true, 
          message: 'สมัครสมาชิกสำเร็จ', 
          user 
        };
      } else if (response && response.data) {
        // กรณีที่ API ส่งกลับตาม ApiResponse format
        const user: User = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          createdAt: new Date(response.data.createdAt || Date.now())
        };

        this.currentUser = user;
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.authKey, JSON.stringify(user));
        }

        return { 
          success: true, 
          message: 'สมัครสมาชิกสำเร็จ', 
          user 
        };
      } else {
        return { 
          success: false, 
          message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' 
        };
      }

    } catch (error: any) {
      console.error('SignUp error:', error);
      
      // จัดการ error messages ที่เฉพาะเจาะจง
      if (error.status === 409 || error.message?.includes('already exists')) {
        return { success: false, message: 'อีเมลนี้ถูกใช้งานแล้ว' };
      } else if (error.status === 400) {
        return { success: false, message: 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง' };
      } else if (error.message?.includes('fetch') || error.message?.includes('Network')) {
        return { success: false, message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต' };
      } else if (error.message?.includes('JSON')) {
        return { success: false, message: 'เกิดข้อผิดพลาดในการประมวลผลข้อมูล' };
      }
      
      return { 
        success: false, 
        message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง' 
      };
    }
  }

  // ล็อกอิน - ตรวจสอบจาก user list เนื่องจาก login endpoint ไม่มี
  async login(loginData: LoginData): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const { email, password } = loginData;
      
      if (!email.trim() || !password.trim()) {
        return { success: false, message: 'กรุณากรอกอีเมลและรหัสผ่าน' };
      }

      // ดึงรายการ users ทั้งหมดแล้วหาที่ตรงกัน
      const response = await userService.getAllUsers();
      console.log('Get all users response:', response);
      
      let users = [];
      if (response && (response as any).user) {
        users = (response as any).user;
      } else if (response && response.data) {
        users = response.data;
      }

      if (!Array.isArray(users)) {
        return { success: false, message: 'ไม่สามารถเข้าถึงข้อมูลผู้ใช้ได้' };
      }

      // หา user ที่ email และ password ตรงกัน
      const foundUser = users.find((user: any) => 
        user.email === email.trim() && user.password === password
      );

      if (!foundUser) {
        return { success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
      }

      // แปลงข้อมูลจาก API เป็น User interface ของเรา
      const user: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        createdAt: new Date(foundUser.createAt || foundUser.createdAt || Date.now())
      };

      // บันทึกข้อมูลผู้ใช้
      this.currentUser = user;
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.authKey, JSON.stringify(user));
      }

      return { 
        success: true, 
        message: 'เข้าสู่ระบบสำเร็จ', 
        user 
      };

    } catch (error: any) {
      console.error('Login error:', error);
      
      // จัดการ error messages ที่เฉพาะเจาะจง
      if (error.message?.includes('fetch')) {
        return { success: false, message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' };
      }
      
      return { 
        success: false, 
        message: error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' 
      };
    }
  }

  // ล็อกเอาต์
  async logout(): Promise<void> {
    try {
      // เรียก API logout (ถ้ามี token)
      const token = typeof window !== 'undefined' ? localStorage.getItem(this.tokenKey) : null;
      if (token) {
        await userService.logoutUser();
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // ไม่ throw error เพราะยังคงต้องล็อกเอาต์ในฝั่ง client
    } finally {
      // ล็อกเอาต์ในฝั่ง client
      this.currentUser = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.authKey);
        localStorage.removeItem(this.tokenKey);
      }
    }
  }

  // ดึง authentication token
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  // สำหรับ listener เมื่อสถานะ auth เปลี่ยน
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    const handler = () => callback(this.currentUser);
    
    // ส่งค่าปัจจุบันทันที
    handler();
    
    // Return unsubscribe function
    return () => {};
  }
}

export const authManager = new AuthManager();
