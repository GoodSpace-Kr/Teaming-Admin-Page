// API 유틸리티 함수들

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
  // 사용자 관련
  USERS: '/api/users',
  USER_DETAIL: (id: string) => `/api/users/${id}`,
  USER_CREATE: '/api/users',
  USER_UPDATE: (id: string) => `/api/users/${id}`,
  USER_DELETE: (id: string) => `/api/users/${id}`,
  
  // 팀 관련
  TEAMS: '/api/teams',
  TEAM_DETAIL: (id: string) => `/api/teams/${id}`,
  TEAM_CREATE: '/api/teams',
  TEAM_UPDATE: (id: string) => `/api/teams/${id}`,
  TEAM_DELETE: (id: string) => `/api/teams/${id}`,
  
  // 인증 관련
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_REFRESH: '/api/auth/refresh',
  AUTH_ME: '/api/auth/me',
  
  // 통계 관련
  STATS_DASHBOARD: '/api/stats/dashboard',
  STATS_USERS: '/api/stats/users',
  STATS_TEAMS: '/api/stats/teams',
  
  // 웹소켓 관련
  WS_CONNECT: '/ws/connect',
  WS_NOTIFICATIONS: '/ws/notifications',
};

// HTTP 요청 헬퍼 함수
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${apiConfig.baseURL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
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

// DELETE 요청
export const apiDelete = (endpoint: string, options?: RequestInit) => 
  apiRequest(endpoint, { ...options, method: 'DELETE' });

// 웹소켓 연결
export const createWebSocketConnection = (endpoint: string) => {
  const wsUrl = `${apiConfig.wsURL}${endpoint}`;
  return new WebSocket(wsUrl);
};
