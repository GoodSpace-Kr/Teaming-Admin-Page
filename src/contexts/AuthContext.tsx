// 인증 컨텍스트 및 훅

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { login, logout, getCurrentUser, refreshTokenIfNeeded } from '../utils/auth';
import type { AuthState, User, LoginRequest } from '../types/auth';

// 액션 타입 정의
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; tokens: { accessToken: string; refreshToken: string } } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'UPDATE_TOKENS'; payload: { accessToken: string; refreshToken: string } };

// 초기 상태
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  tokens: null,
  isLoading: true,
};

// 리듀서
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isLoading: false,
      };
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        tokens: null,
        isLoading: false,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        tokens: null,
        isLoading: false,
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    
    case 'UPDATE_TOKENS':
      return { ...state, tokens: action.payload };
    
    default:
      return state;
  }
};

// 컨텍스트 타입
interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  updateTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
}

// 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 프로바이더 컴포넌트
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  // 초기 인증 상태 확인
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = storage.getAccessToken();
        const refreshToken = storage.getRefreshToken();
        
        if (accessToken && refreshToken) {
          // 토큰이 있으면 사용자 정보 가져오기
          try {
            const user = await getCurrentUser();
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                user,
                tokens: { accessToken, refreshToken }
              }
            });
          } catch (error) {
            // 토큰 갱신 시도
            const newAccessToken = await refreshTokenIfNeeded();
            if (newAccessToken) {
              try {
                const user = await getCurrentUser();
                dispatch({
                  type: 'LOGIN_SUCCESS',
                  payload: {
                    user,
                    tokens: { accessToken: newAccessToken, refreshToken }
                  }
                });
              } catch (error) {
                // 갱신 실패 시 로그아웃
                storage.clearAuth();
                dispatch({ type: 'LOGOUT' });
              }
            } else {
              dispatch({ type: 'LOGOUT' });
            }
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('인증 초기화 실패:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  // 로그인 함수
  const handleLogin = async (credentials: LoginRequest) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await login(credentials);
      const user = await getCurrentUser();
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user,
          tokens: {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken
          }
        }
      });
      
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  // 로그아웃 함수
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
      navigate('/login');
    }
  };

  // 사용자 정보 업데이트
  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  // 토큰 업데이트
  const updateTokens = (tokens: { accessToken: string; refreshToken: string }) => {
    dispatch({ type: 'UPDATE_TOKENS', payload: tokens });
  };

  const value: AuthContextType = {
    state,
    login: handleLogin,
    logout: handleLogout,
    updateUser,
    updateTokens,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 커스텀 훅
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};