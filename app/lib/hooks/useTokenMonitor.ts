import { useEffect, useRef, useCallback } from 'react';
import { authManager } from '../auth';

/**
 * Hook สำหรับตรวจสอบ JWT token expiration และ auto logout
 */
export function useTokenMonitor() {
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningShownRef = useRef(false);

  // ใช้ useCallback เพื่อป้องกัน function recreate ทุกครั้ง
  const getTimeUntilExpiry = useCallback((): number | null => {
    const expiry = authManager.getTokenExpiry();
    if (!expiry) return null;
    return Math.max(0, expiry.getTime() - Date.now());
  }, []);

  const isTokenValid = useCallback((): boolean => {
    return authManager.isTokenValid();
  }, []);

  const refreshToken = useCallback(() => {
    authManager.refreshTokenExpiry();
  }, []);

  useEffect(() => {
    // ตรวจสอบ token เมื่อ hook mount
    if (authManager.isLoggedIn() && !authManager.isTokenValid()) {
      console.log('🔒 Invalid token detected on mount, logging out...');
      authManager.logout();
      return;
    }

    // ฟังก์ชันสำหรับแสดง warning ก่อน token หมดอายุ
    const showExpiryWarning = () => {
      if (warningShownRef.current) return;
      
      const timeRemaining = getTimeUntilExpiry();
      if (timeRemaining && timeRemaining <= 5 * 60 * 1000) { // 5 นาทีก่อนหมดอายุ
        warningShownRef.current = true;
        
        // แสดง toast warning (ถ้ามี toast system)
        console.warn('⚠️ Session will expire in 5 minutes');
        
        // แจ้งเตือนผู้ใช้ (สามารถปรับแต่งได้)
        if (typeof window !== 'undefined' && 'Notification' in window) {
          if (Notification.permission === 'granted') {
            new Notification('Session Expiring', {
              body: 'Your session will expire in 5 minutes. Please save your work.',
              icon: '/favicon.ico'
            });
          }
        }
      }
    };

    // ฟังก์ชันตรวจสอบ token expiry แบบ periodic
    const checkTokenExpiry = () => {
      if (!authManager.isLoggedIn()) return;

      const timeRemaining = getTimeUntilExpiry();
      
      if (timeRemaining === null) {
        console.log('🔒 No token expiry found, logging out...');
        authManager.logout();
        return;
      }

      if (timeRemaining <= 0) {
        console.log('🔒 Token expired, logging out...');
        authManager.logout();
        return;
      }

      // แสดง warning ถ้าใกล้หมดอายุ
      showExpiryWarning();
    };

    // ตรวจสอบทุก ๆ 30 วินาที
    const tokenCheckInterval = setInterval(checkTokenExpiry, 30 * 1000);

    // ตรวจสอบ token เมื่อ page visible again
    const handleVisibilityChange = () => {
      if (!document.hidden && authManager.isLoggedIn()) {
        checkTokenExpiry();
        warningShownRef.current = false; // รีเซ็ต warning flag
      }
    };

    // ตรวจสอบ token เมื่อกลับมาที่หน้า
    const handleFocus = () => {
      if (authManager.isLoggedIn()) {
        checkTokenExpiry();
        warningShownRef.current = false; // รีเซ็ต warning flag
      }
    };

    // เพิ่ม event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // ติดตาม user activity เพื่อ refresh token (ถ้าต้องการ)
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleUserActivity = () => {
      if (!authManager.isLoggedIn()) return;

      // Clear previous timeout
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }

      // Set new timeout for inactivity logout (optional - หากต้องการ auto logout จาก inactivity)
      // activityTimeoutRef.current = setTimeout(() => {
      //   console.log('🔒 Auto logout due to inactivity');
      //   authManager.logout();
      // }, 30 * 60 * 1000); // 30 minutes of inactivity
    };

    // เพิ่ม activity listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    // Cleanup
    return () => {
      clearInterval(tokenCheckInterval);
      
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }

      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, []); // ลบ dependencies ทั้งหมดออกเพื่อป้องกัน infinite loop

  // ส่งคืนฟังก์ชันที่มีประโยชน์
  return {
    getTimeUntilExpiry,
    isTokenValid,
    refreshToken
  };
}