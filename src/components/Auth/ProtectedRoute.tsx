// 보호된 라우트 컴포넌트

import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { state } = useAuth();

  // 로딩 중이면 로딩 표시
  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 인증되지 않았으면 로그인 페이지로 리다이렉트
  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 인증된 사용자면 자식 컴포넌트 렌더링
  return <>{children}</>;
};