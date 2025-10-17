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
  private tokenExpiryKey = 'astronomy_app_token_expiry';
  private checkTokenInterval: NodeJS.Timeout | null = null;
  private lastActivityKey = 'astronomy_app_last_activity';
  private authStateListeners: ((user: User | null) => void)[] = [];

  constructor() {
    // โหลดข้อมูล user จาก localStorage เมื่อเริ่มต้น
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem(this.authKey);
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      }

      // ตรวจสอบ token expiry เมื่อเริ่มต้น
      this.checkTokenExpiry();
      
      // เริ่มต้น token monitoring
      this.startTokenMonitoring();
      
      // ติดตาม user activity
      this.initializeActivityTracking();
      
      // ตรวจสอบ token expiry เมื่อ page visible again (กลับมาจากการปิดหน้าต่าง)
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && this.isLoggedIn()) {
          this.checkTokenExpiry();
        }
      });
    }
  }

  // ตรวจสอบสถานะการล็อกอิน
  isLoggedIn(): boolean {
    return this.currentUser !== null && !this.isTokenExpired();
  }

  // ตรวจสอบว่า token หมดอายุหรือไม่
  private isTokenExpired(): boolean {
    if (typeof window === 'undefined') return false;
    
    const expiry = localStorage.getItem(this.tokenExpiryKey);
    if (!expiry) return false;
    
    const expiryTime = new Date(expiry).getTime();
    const currentTime = Date.now();
    
    return currentTime >= expiryTime;
  }

  // ตรวจสอบและจัดการ token expiry
  private checkTokenExpiry(): void {
    if (this.isTokenExpired() && this.currentUser) {
      console.log('🔒 Token expired, logging out...');
      this.forceLogout();
    }
  }

  // เริ่มต้น token monitoring
  private startTokenMonitoring(): void {
    // ตรวจสอบทุก ๆ 5 นาที
    this.checkTokenInterval = setInterval(() => {
      this.checkTokenExpiry();
    }, 5 * 60 * 1000); // 5 minutes
  }

  // หยุด token monitoring
  private stopTokenMonitoring(): void {
    if (this.checkTokenInterval) {
      clearInterval(this.checkTokenInterval);
      this.checkTokenInterval = null;
    }
  }

  // ติดตาม user activity
  private initializeActivityTracking(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const updateActivity = () => {
      if (this.isLoggedIn()) {
        localStorage.setItem(this.lastActivityKey, Date.now().toString());
      }
    };

    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // บันทึก activity เริ่มต้น
    updateActivity();
  }

  // บังคับ logout โดยไม่เรียก API
  private forceLogout(): void {
    this.currentUser = null;
    this.stopTokenMonitoring();
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.authKey);
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.tokenExpiryKey);
      localStorage.removeItem(this.lastActivityKey);
    }

    // จัดการ progress cleanup
    this.handleLogoutActions();
    
    // แจ้งเตือน listeners
    this.notifyAuthStateChange();
    
    // รีเฟรชหน้าเพื่อกลับไปหน้า login
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  // แจ้งเตือน auth state listeners
  private notifyAuthStateChange(): void {
    this.authStateListeners.forEach(listener => {
      try {
        listener(this.currentUser);
      } catch (error) {
        console.error('Error in auth state listener:', error);
      }
    });
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

      console.log('Sending create user request:', createUserData);
      const response = await userService.createUser(createUserData);
      
      // Handle actual API response format
      console.log('API Response:', response);
      
      let userData;
      let token;

      // ตรวจสอบ response format ต่างๆ ที่อาจเกิดขึ้น
      if (response && (response as any).user) {
        // Format: { user: User, token?: string, message?: string }
        userData = (response as any).user;
        token = (response as any).token;
      } else if (response && response.data && (response.data as any).user) {
        // Format: { data: { user: User, token?: string } }
        userData = (response.data as any).user;
        token = (response.data as any).token;
      } else if (response && response.data) {
        // Format: { data: User }
        userData = response.data;
      } else if (response && (response as any).id) {
        // Format: User object directly
        userData = response;
      } else {
        console.error('Unexpected API response format:', response);
        return { 
          success: false, 
          message: 'รูปแบบการตอบกลับจากเซิร์ฟเวอร์ไม่ถูกต้อง' 
        };
      }

      if (!userData || !userData.id) {
        return { 
          success: false, 
          message: 'ไม่สามารถสร้างผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง' 
        };
      }

      // แปลงข้อมูลจาก API เป็น User interface ของเรา
      const user: User = {
        id: userData.id || userData._id,
        name: userData.name || userData.fullName || userData.displayName,
        email: userData.email,
        createdAt: new Date(userData.createAt || userData.createdAt || userData.created_at || Date.now())
      };

          // บันทึกข้อมูลผู้ใช้ลง localStorage
          this.currentUser = user;
          if (typeof window !== 'undefined') {
            localStorage.setItem(this.authKey, JSON.stringify(user));
            
            // บันทึก token ถ้ามี และตั้งเวลาหมดอายุ
            if (token) {
              localStorage.setItem(this.tokenKey, token);
              
              // ตั้งเวลาหมดอายุ token เป็น 60 นาที (1 ชั่วโมง)
              const expiryTime = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes
              localStorage.setItem(this.tokenExpiryKey, expiryTime.toISOString());
            }

            // เริ่มต้น token monitoring
            this.startTokenMonitoring();        // บันทึกผู้ใช้ไว้ในรายการสำหรับการ login ในอนาคต
        const savedUsers = localStorage.getItem('astronomy_app_all_users');
        let allUsers = [];
        if (savedUsers) {
          try {
            allUsers = JSON.parse(savedUsers);
          } catch (e) {
            allUsers = [];
          }
        }
        
        // เพิ่มผู้ใช้ใหม่ (พร้อม password สำหรับการ login)
        const userWithPassword = {
          ...user,
          password: password, // เก็บ password ไว้สำหรับการตรวจสอบ login
          createdAt: user.createdAt.toISOString()
        };
        
        // ตรวจสอบไม่ให้มีผู้ใช้ซ้ำ
        const existingUserIndex = allUsers.findIndex((u: any) => u.email === user.email);
        if (existingUserIndex >= 0) {
          allUsers[existingUserIndex] = userWithPassword;
        } else {
          allUsers.push(userWithPassword);
        }
        
        localStorage.setItem('astronomy_app_all_users', JSON.stringify(allUsers));
        console.log('User saved to localStorage backup:', userWithPassword);
      }

      console.log('Sign up successful, user:', user);
      return { 
        success: true, 
        message: 'สมัครสมาชิกสำเร็จ', 
        user 
      };

    } catch (error: any) {
      console.error('SignUp error:', error);
      
      // จัดการ error messages ที่เฉพาะเจาะจง
      if (error.status === 409 || error.message?.includes('already exists') || error.message?.includes('duplicate')) {
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
        message: error.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง' 
      };
    }
  }

  // ล็อกอิน - ใช้หลายวิธีตามสถานการณ์
  async login(loginData: LoginData): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const { email, password } = loginData;
      
      if (!email.trim() || !password.trim()) {
        return { success: false, message: 'กรุณากรอกอีเมลและรหัสผ่าน' };
      }

      console.log('Attempting login with email:', email.trim());
      
      // วิธีที่ 1: ลอง login endpoint ถ้ามี (ใช้ endpoint ที่ถูกต้อง)
      try {
        console.log('Trying login endpoint with correct route...');
        const response = await userService.loginUser(email.trim(), password);
        console.log('Login API response:', response);
        
        let userData;
        let token;

        // รองรับหลายรูปแบบของ response
        if (response && (response as any).user) {
          // Format: { user: User, token?: string }
          userData = (response as any).user;
          token = (response as any).token;
          console.log('Found user data in response.user');
        } else if (response && response.data && (response.data as any).user) {
          // Format: { data: { user: User, token?: string } }
          userData = (response.data as any).user;
          token = (response.data as any).token;
          console.log('Found user data in response.data.user');
        } else if (response && response.data) {
          // Format: { data: User } (user data directly in data)
          userData = response.data;
          token = (response as any).token; // token might be at root level
          console.log('Found user data in response.data');
        } else if (response && (response as any).id) {
          // Format: User object directly (no wrapper)
          userData = response;
          console.log('Found user data directly in response');
        }

        if (userData && (userData.id || userData._id)) {
          console.log('Processing user data:', userData);
          
          const user: User = {
            id: userData.id || userData._id,
            name: userData.name || userData.fullName || userData.displayName,
            email: userData.email,
            createdAt: new Date(userData.createAt || userData.createdAt || userData.created_at || Date.now())
          };

            this.currentUser = user;
            if (typeof window !== 'undefined') {
              localStorage.setItem(this.authKey, JSON.stringify(user));
              if (token) {
                localStorage.setItem(this.tokenKey, token);
                
                // ตั้งเวลาหมดอายุ token เป็น 60 นาที
                const expiryTime = new Date(Date.now() + 60 * 60 * 1000);
                localStorage.setItem(this.tokenExpiryKey, expiryTime.toISOString());
              }
              
              // เริ่มต้น token monitoring
              this.startTokenMonitoring();
            }
            
            // เรียกใช้ progress migration หลังจาก login สำเร็จ
            this.handlePostLoginActions();
            
            console.log('Login successful via login endpoint, user:', user);
          return { success: true, message: 'เข้าสู่ระบบสำเร็จ', user };
        } else {
          console.log('No valid user data found in response');
        }
      } catch (loginError: any) {
        console.log('Login endpoint failed:', loginError.message);
        console.log('Login error details:', loginError);
      }

      // วิธีที่ 2: ลองใช้ public user list
      try {
        console.log('Trying public user list...');
        const response = await userService.getAllUsersPublic();
        console.log('Public users response:', response);
        
        let users = [];
        if (response && (response as any).user) {
          users = (response as any).user;
        } else if (response && response.data) {
          users = response.data;
        }

        if (Array.isArray(users) && users.length > 0) {
          const foundUser = users.find((user: any) => {
            console.log('Checking user:', user.email, 'vs', email.trim());
            return user.email === email.trim() && user.password === password;
          });

          if (foundUser) {
            const user: User = {
              id: foundUser.id || foundUser._id,
              name: foundUser.name || foundUser.fullName || foundUser.displayName,
              email: foundUser.email,
              createdAt: new Date(foundUser.createAt || foundUser.createdAt || foundUser.created_at || Date.now())
            };

            this.currentUser = user;
            if (typeof window !== 'undefined') {
              localStorage.setItem(this.authKey, JSON.stringify(user));
              
              // ตั้งเวลาหมดอายุ token เป็น 60 นาที (สำหรับ public user list login)
              const expiryTime = new Date(Date.now() + 60 * 60 * 1000);
              localStorage.setItem(this.tokenExpiryKey, expiryTime.toISOString());
              
              // เริ่มต้น token monitoring
              this.startTokenMonitoring();
            }

            // เรียกใช้ progress migration หลังจาก login สำเร็จ
            this.handlePostLoginActions();

            console.log('Login successful via public user list, user:', user);
            return { success: true, message: 'เข้าสู่ระบบสำเร็จ', user };
          }
        }
      } catch (publicError: any) {
        console.log('Public user list failed:', publicError.message);
      }

      // วิธีที่ 3: ลองใช้ user list แบบปกติ (อาจต้องการ auth)
      try {
        console.log('Trying regular user list...');
        const response = await userService.getAllUsers();
        console.log('Regular users response:', response);
        
        let users = [];
        if (response && (response as any).user) {
          users = (response as any).user;
        } else if (response && response.data) {
          users = response.data;
        }

        if (Array.isArray(users) && users.length > 0) {
          const foundUser = users.find((user: any) => {
            return user.email === email.trim() && user.password === password;
          });

          if (foundUser) {
            const user: User = {
              id: foundUser.id || foundUser._id,
              name: foundUser.name || foundUser.fullName || foundUser.displayName,
              email: foundUser.email,
              createdAt: new Date(foundUser.createAt || foundUser.createdAt || foundUser.created_at || Date.now())
            };

            this.currentUser = user;
            if (typeof window !== 'undefined') {
              localStorage.setItem(this.authKey, JSON.stringify(user));
              
              // ตั้งเวลาหมดอายุ token เป็น 60 นาที (สำหรับ regular user list login)
              const expiryTime = new Date(Date.now() + 60 * 60 * 1000);
              localStorage.setItem(this.tokenExpiryKey, expiryTime.toISOString());
              
              // เริ่มต้น token monitoring
              this.startTokenMonitoring();
            }

            // เรียกใช้ progress migration หลังจาก login สำเร็จ
            this.handlePostLoginActions();

            console.log('Login successful via regular user list, user:', user);
            return { success: true, message: 'เข้าสู่ระบบสำเร็จ', user };
          }
        }
      } catch (regularError: any) {
        console.log('Regular user list failed:', regularError.message);
      }

      // วิธีที่ 4: ตรวจสอบจาก localStorage (สำหรับกรณีที่ API ไม่พร้อมใช้งาน)
      console.log('Trying localStorage fallback...');
      if (typeof window !== 'undefined') {
        // ดูว่ามีข้อมูลผู้ใช้ที่เคยบันทึกไว้หรือไม่
        const savedUsers = localStorage.getItem('astronomy_app_all_users');
        if (savedUsers) {
          try {
            const users = JSON.parse(savedUsers);
            const foundUser = users.find((user: any) => 
              user.email === email.trim() && user.password === password
            );

            if (foundUser) {
              const user: User = {
                id: foundUser.id,
                name: foundUser.name,
                email: foundUser.email,
                createdAt: new Date(foundUser.createdAt || Date.now())
              };

              this.currentUser = user;
              localStorage.setItem(this.authKey, JSON.stringify(user));
              
              // ตั้งเวลาหมดอายุ token เป็น 60 นาที (สำหรับ localStorage fallback)
              const expiryTime = new Date(Date.now() + 60 * 60 * 1000);
              localStorage.setItem(this.tokenExpiryKey, expiryTime.toISOString());
              
              // เริ่มต้น token monitoring
              this.startTokenMonitoring();

              // เรียกใช้ progress migration หลังจาก login สำเร็จ
              this.handlePostLoginActions();

              console.log('Login successful via localStorage fallback, user:', user);
              return { success: true, message: 'เข้าสู่ระบบสำเร็จ (โหมดออฟไลน์)', user };
            }
          } catch (parseError) {
            console.error('Error parsing saved users:', parseError);
          }
        }
      }

      // ถ้าไม่พบด้วยวิธีไหนเลย
      console.log('User not found with any method');
      return { success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };

    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.status === 401 || error.message?.includes('Unauthorized')) {
        return { success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
      } else if (error.status === 404) {
        return { success: false, message: 'ไม่พบผู้ใช้นี้ในระบบ' };
      } else if (error.status === 400) {
        return { success: false, message: 'ข้อมูลที่ส่งไม่ถูกต้อง' };
      } else if (error.message?.includes('fetch') || error.message?.includes('Network')) {
        return { success: false, message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต' };
      }
      
      return { 
        success: false, 
        message: error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง' 
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
      this.stopTokenMonitoring();
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.authKey);
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.tokenExpiryKey);
        localStorage.removeItem(this.lastActivityKey);
      }
      
      // จัดการ progress cleanup
      this.handleLogoutActions();
      
      // แจ้งเตือน listeners
      this.notifyAuthStateChange();
    }
  }

  // ดึง authentication token
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    // ตรวจสอบว่า token หมดอายุหรือไม่
    if (this.isTokenExpired()) {
      return null;
    }
    
    return localStorage.getItem(this.tokenKey);
  }

  // ตรวจสอบว่า token ยังใช้ได้หรือไม่
  isTokenValid(): boolean {
    return this.getToken() !== null && !this.isTokenExpired();
  }

  // รีเฟรช token expiry (เมื่อมี activity ใหม่)
  refreshTokenExpiry(): void {
    if (this.isLoggedIn() && typeof window !== 'undefined') {
      const expiryTime = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes
      localStorage.setItem(this.tokenExpiryKey, expiryTime.toISOString());
      console.log('🔄 Token expiry refreshed to:', expiryTime.toISOString());
    }
  }

  // ดึงเวลาหมดอายุของ token
  getTokenExpiry(): Date | null {
    if (typeof window === 'undefined') return null;
    
    const expiry = localStorage.getItem(this.tokenExpiryKey);
    return expiry ? new Date(expiry) : null;
  }

  // สำหรับ listener เมื่อสถานะ auth เปลี่ยน
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    // เพิ่ม listener เข้าไปใน array
    this.authStateListeners.push(callback);
    
    // ส่งค่าปัจจุบันทันที
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  // จัดการ actions หลังจาก login สำเร็จ
  private async handlePostLoginActions(): Promise<void> {
    try {
      // Import ProgressManager dynamically เพื่อป้องกัน circular dependency
      const { progressManager } = await import('./progress');
      
      // เรียกใช้ comprehensive login sync
      await progressManager.handleLoginSync();
      
      console.log('✅ Post-login actions completed successfully');
    } catch (error) {
      console.error('❌ Error in post-login actions:', error);
      // ไม่ throw error เพื่อไม่ให้ login fail
    }
  }

  // จัดการ actions หลังจาก logout
  handleLogoutActions(): void {
    try {
      // Import ProgressManager dynamically
      import('./progress').then(({ progressManager }) => {
        progressManager.handleLogoutCleanup();
      });
      
      console.log('✅ Post-logout actions completed successfully');
    } catch (error) {
      console.error('❌ Error in post-logout actions:', error);
    }
  }
}

export const authManager = new AuthManager();
