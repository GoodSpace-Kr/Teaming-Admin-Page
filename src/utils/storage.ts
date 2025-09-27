// 로컬 스토리지 관리 유틸리티

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'teaming_admin_access_token',
  REFRESH_TOKEN: 'teaming_admin_refresh_token',
  USER_INFO: 'teaming_admin_user_info',
} as const;

export const storage = {
  // 토큰 관리
  getAccessToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  setAccessToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  // 사용자 정보 관리
  getUserInfo: (): any | null => {
    const userInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO);
    return userInfo ? JSON.parse(userInfo) : null;
  },

  setUserInfo: (userInfo: any): void => {
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
  },

  // 모든 인증 정보 제거
  clearAuth: (): void => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
  },

  // 토큰 존재 여부 확인
  hasTokens: (): boolean => {
    return !!(storage.getAccessToken() && storage.getRefreshToken());
  },
};