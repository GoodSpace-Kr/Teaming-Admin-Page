// 인증 관련 유틸리티 함수들

import { storage } from './storage';
import { apiRequest } from './api';
import type { LoginRequest, LoginResponse, RefreshTokenResponse, User } from '../types/auth';

// JWT 토큰 디코딩 (페이로드만)
export const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT 디코딩 실패:', error);
    return null;
  }
};

// 토큰 만료 시간 확인
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

// 로그인 함수
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await apiRequest<LoginResponse>('/api/api/auth/teaming/sign-in', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  
  // 토큰 저장
  storage.setAccessToken(response.accessToken);
  storage.setRefreshToken(response.refreshToken);
  
  return response;
};

// 로그아웃 함수
export const logout = async (): Promise<void> => {
  try {
    // 서버에 로그아웃 요청 (선택사항)
    await apiRequest('/users/me/log-out', {
      method: 'POST',
      body: JSON.stringify({
        refreshToken: storage.getRefreshToken()
      })
    });
  } catch (error) {
    console.error('서버 로그아웃 실패:', error);
  } finally {
    // 로컬 스토리지에서 토큰 제거
    storage.clearAuth();
  }
};

// 현재 사용자 정보 가져오기
export const getCurrentUser = async (): Promise<User> => {
  return await apiRequest<User>('/users/me', {
    method: 'GET'
  });
};

// 토큰 갱신 함수
export const refreshTokenIfNeeded = async (): Promise<string | null> => {
  const refreshToken = storage.getRefreshToken();
  if (!refreshToken) {
    console.error('리프레시 토큰이 없습니다.');
    return null;
  }

  try {
    const response = await apiRequest<RefreshTokenResponse>('/users/me/access-token', {
      method: 'POST',
      body: JSON.stringify({
        refreshToken
      })
    });
    
    // 새로운 액세스 토큰 저장
    storage.setAccessToken(response.accessToken);
    return response.accessToken;
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
    // 갱신 실패 시 로그아웃 처리
    storage.clearAuth();
    return null;
  }
};

// 인증 상태 확인
export const isAuthenticated = (): boolean => {
  const accessToken = storage.getAccessToken();
  if (!accessToken) return false;
  
  return !isTokenExpired(accessToken);
};