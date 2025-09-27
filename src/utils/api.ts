// API 유틸리티 함수들 (JWT 자동 관리 포함)

import { storage } from './storage';
import { refreshTokenIfNeeded } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://teamingkr.duckdns.org';
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'wss://teamingkr.duckdns.org';

// API 요청을 위한 기본 설정
export const apiConfig = {
  baseURL: API_BASE_URL,
  wsURL: WS_BASE_URL,
  timeout: 10000,
};

// API 엔드포인트들
export const API_ENDPOINTS = {
  // 인증 관련 (Nginx에서 /api 접두사 제거하므로 /api/api로 시작)
  AUTH_LOGIN: '/api/api/auth/teaming/sign-in',
  AUTH_LOGOUT: '/users/me/log-out',
  AUTH_REFRESH: '/users/me/access-token',
  AUTH_ME: '/users/me',
  
  // 사용자 관련
  USERS: '/users/me',
  USER_UPDATE: '/users/me',
  USER_DELETE: '/users/me/withdraw',
  
  // 팀 관련 (실제 API에 맞게 수정)
  ROOMS: '/rooms',
  ROOM_DETAIL: (id: number) => `/rooms/${id}`,
  ROOM_CREATE: '/rooms',
  ROOM_LEAVE: (id: number) => `/rooms/${id}`,
  
  // 통계 관련 (실제 API에 맞게 수정)
  STATS_LANDING: '/landing',
  STATS_GIFTICON: '/admin/gifticon',
  
  // 웹소켓 관련
  WS_CONNECT: '/ws/connect',
  WS_NOTIFICATIONS: '/ws/notifications',
};

// HTTP 요청 헬퍼 함수 (JWT 자동 관리)
export const apiRequest = async <T = any>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  const url = `${apiConfig.baseURL}${endpoint}`;
  
  // 토큰 갱신 시도
  const accessToken = await refreshTokenIfNeeded();
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log('API 요청:', { url, options: defaultOptions });
    const response = await fetch(url as string, defaultOptions as RequestInit);
    
    // 403 응답 처리 (토큰 만료)
    if (response.status === 403) {
      // 토큰 갱신 시도
      const newAccessToken = await refreshTokenIfNeeded();
      
      if (newAccessToken) {
        // 새로운 토큰으로 재시도
        const retryOptions: RequestInit = {
          ...defaultOptions,
          headers: {
            ...defaultOptions.headers,
            'Authorization': `Bearer ${newAccessToken}`,
          },
        };
        
        const retryResponse = await fetch(url as string, retryOptions as RequestInit);
        
        if (!retryResponse.ok) {
          throw new Error(`HTTP error! status: ${retryResponse.status}`);
        }
        
        return await retryResponse.json();
      } else {
        // 토큰 갱신 실패 - 로그인 페이지로 리다이렉트
        storage.clearAuth();
        window.location.href = '/login';
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// GET 요청
export const apiGet = (endpoint: string, options?: RequestInit) => 
  apiRequest(endpoint, { ...options, method: 'GET' });

// POST 요청
export const apiPost = (endpoint: string, data?: any, options?: RequestInit) => 
  apiRequest(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });

// PUT 요청
export const apiPut = (endpoint: string, data?: any, options?: RequestInit) => 
  apiRequest(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });

// PATCH 요청
export const apiPatch = (endpoint: string, data?: any, options?: RequestInit) => 
  apiRequest(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });

// DELETE 요청
export const apiDelete = (endpoint: string, options?: RequestInit) => 
  apiRequest(endpoint, { ...options, method: 'DELETE' });

// 웹소켓 연결
export const createWebSocketConnection = (endpoint: string) => {
  const wsUrl = `${apiConfig.wsURL}${endpoint}`;
  return new WebSocket(wsUrl);
};