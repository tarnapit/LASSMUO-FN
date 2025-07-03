// ระบบ Authentication แบบง่าย สำหรับการจัดการ login/logout
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

class AuthManager {
  private currentUser: User | null = null;
  private authKey = 'astronomy_app_user';

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

  // ล็อกอิน (simulation)
  login(username: string, email: string): User {
    const user: User = {
      id: Date.now().toString(),
      username,
      email,
      createdAt: new Date()
    };

    this.currentUser = user;
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.authKey, JSON.stringify(user));
    }

    return user;
  }

  // ล็อกเอาต์
  logout(): void {
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.authKey);
    }
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
