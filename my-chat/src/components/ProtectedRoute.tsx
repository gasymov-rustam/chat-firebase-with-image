import { Fragment, ReactNode, createElement, memo } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = memo(({ children }: ProtectedRouteProps) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return createElement(Fragment, null, children);
});
