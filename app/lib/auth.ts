// ระบบ Authentication แบบง่าย สำหรับการจัดการ login/logout
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
  private usersKey = 'astronomy_app_users'; // เก็บข้อมูลผู้ใช้ทั้งหมด

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

  // ดึงข้อมูลผู้ใช้ทั้งหมดจาก localStorage
  private getAllUsers(): Array<User & { password: string }> {
    if (typeof window === 'undefined') return [];
    const users = localStorage.getItem(this.usersKey);
    return users ? JSON.parse(users) : [];
  }

  // บันทึกข้อมูลผู้ใช้ทั้งหมดลง localStorage
  private saveAllUsers(users: Array<User & { password: string }>): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.usersKey, JSON.stringify(users));
    }
  }

  // สมัครสมาชิก
  signUp(signUpData: SignUpData): { success: boolean; message: string; user?: User } {
    const { name, email, password } = signUpData;
    
    // ตรวจสอบข้อมูล
    if (!name.trim() || !email.trim() || !password.trim()) {
      return { success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' };
    }

    if (password.length < 6) {
      return { success: false, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' };
    }

    const allUsers = this.getAllUsers();
    
    // ตรวจสอบว่าอีเมลซ้ำหรือไม่
    if (allUsers.some(user => user.email === email)) {
      return { success: false, message: 'อีเมลนี้ถูกใช้งานแล้ว' };
    }

    // สร้างผู้ใช้ใหม่
    const newUser: User = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      createdAt: new Date()
    };

    // เก็บข้อมูลผู้ใช้พร้อมรหัสผ่าน
    const userWithPassword = { ...newUser, password };
    allUsers.push(userWithPassword);
    this.saveAllUsers(allUsers);

    // ล็อกอินอัตโนมัติหลังสมัครสมาชิก
    this.currentUser = newUser;
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.authKey, JSON.stringify(newUser));
    }

    return { success: true, message: 'สมัครสมาชิกสำเร็จ', user: newUser };
  }

  // ล็อกอิน
  login(loginData: LoginData): { success: boolean; message: string; user?: User } {
    const { email, password } = loginData;
    
    if (!email.trim() || !password.trim()) {
      return { success: false, message: 'กรุณากรอกอีเมลและรหัสผ่าน' };
    }

    const allUsers = this.getAllUsers();
    const foundUser = allUsers.find(user => user.email === email && user.password === password);

    if (!foundUser) {
      return { success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
    }

    // สร้าง user object โดยไม่รวม password
    const user: User = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      createdAt: foundUser.createdAt
    };

    this.currentUser = user;
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.authKey, JSON.stringify(user));
    }

    return { success: true, message: 'เข้าสู่ระบบสำเร็จ', user };
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
