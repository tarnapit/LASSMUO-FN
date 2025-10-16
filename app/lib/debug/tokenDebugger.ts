/**
 * Debug utilities สำหรับตรวจสอบ JWT Auto Logout system
 */

export class TokenDebugger {
  private static logPrefix = '🔍 [TokenDebug]';

  static logTokenStatus() {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('astronomy_app_token');
    const expiry = localStorage.getItem('astronomy_app_token_expiry');
    const user = localStorage.getItem('astronomy_app_user');
    
    console.group(`${this.logPrefix} Token Status`);
    console.log('Token exists:', !!token);
    console.log('Token (first 20 chars):', token ? token.substring(0, 20) + '...' : 'N/A');
    console.log('Expiry:', expiry ? new Date(expiry).toLocaleString() : 'N/A');
    console.log('User:', user ? JSON.parse(user).email : 'N/A');
    
    if (expiry) {
      const expiryTime = new Date(expiry).getTime();
      const currentTime = Date.now();
      const timeRemaining = expiryTime - currentTime;
      
      console.log('Time remaining (ms):', timeRemaining);
      console.log('Time remaining (formatted):', this.formatTime(timeRemaining));
      console.log('Is expired:', timeRemaining <= 0);
    }
    console.groupEnd();
  }

  static formatTime(ms: number): string {
    if (ms <= 0) return 'Expired';
    
    const minutes = Math.floor(ms / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  static logComponentRender(componentName: string, reason: string = '') {
    console.log(`${this.logPrefix} ${componentName} rendered${reason ? ` - ${reason}` : ''}`);
  }

  static logEffectRun(componentName: string, deps: any[] = []) {
    console.log(`${this.logPrefix} ${componentName} useEffect ran`, deps.length ? deps : 'no deps');
  }

  static checkForInfiniteLoop() {
    const key = 'debug_render_count';
    const currentCount = parseInt(sessionStorage.getItem(key) || '0') + 1;
    sessionStorage.setItem(key, currentCount.toString());
    
    if (currentCount > 100) {
      console.error(`${this.logPrefix} Possible infinite loop detected! Render count: ${currentCount}`);
      // รีเซ็ต counter
      sessionStorage.setItem(key, '0');
      return true;
    }
    
    return false;
  }

  static clearDebugData() {
    sessionStorage.removeItem('debug_render_count');
    console.log(`${this.logPrefix} Debug data cleared`);
  }

  static testTokenExpiry() {
    if (typeof window === 'undefined') return;
    
    // ตั้งให้หมดอายุใน 2 นาที
    const shortExpiry = new Date(Date.now() + 2 * 60 * 1000);
    localStorage.setItem('astronomy_app_token_expiry', shortExpiry.toISOString());
    
    console.log(`${this.logPrefix} Token expiry set to 2 minutes from now`);
    this.logTokenStatus();
  }

  static testTokenExpired() {
    if (typeof window === 'undefined') return;
    
    // ตั้งให้หมดอายุแล้ว
    const expiredTime = new Date(Date.now() - 1000);
    localStorage.setItem('astronomy_app_token_expiry', expiredTime.toISOString());
    
    console.log(`${this.logPrefix} Token set to expired`);
    this.logTokenStatus();
  }

  static resetTokenExpiry() {
    if (typeof window === 'undefined') return;
    
    // ตั้งกลับเป็น 60 นาที
    const normalExpiry = new Date(Date.now() + 60 * 60 * 1000);
    localStorage.setItem('astronomy_app_token_expiry', normalExpiry.toISOString());
    
    console.log(`${this.logPrefix} Token expiry reset to 60 minutes`);
    this.logTokenStatus();
  }
}

// Export global debug functions
if (typeof window !== 'undefined') {
  (window as any).tokenDebug = TokenDebugger;
  console.log('🔍 Token debugger available at window.tokenDebug');
}