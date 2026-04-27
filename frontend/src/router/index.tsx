import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

// Lazy-loaded pages
const HomePage = React.lazy(() => import('../pages/HomePage'));
const LoginPage = React.lazy(() => import('../pages/LoginPage'));
const RegisterPage = React.lazy(() => import('../pages/RegisterPage'));
const ProfilePage = React.lazy(() => import('../pages/ProfilePage'));
const ItemsPage = React.lazy(() => import('../pages/ItemsPage'));

const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <React.Suspense
    fallback={
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    }
  >
    {children}
  </React.Suspense>
);

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <SuspenseWrapper>
              <HomePage />
            </SuspenseWrapper>
          }
        />
        <Route
          path="/login"
          element={
            <SuspenseWrapper>
              <LoginPage />
            </SuspenseWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <SuspenseWrapper>
              <RegisterPage />
            </SuspenseWrapper>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <SuspenseWrapper>
                <ProfilePage />
              </SuspenseWrapper>
            </ProtectedRoute>
          }
        />
        {/* EXAMPLE ROUTE — DELETE when removing example entities */}
        <Route
          path="/items"
          element={
            <ProtectedRoute>
              <SuspenseWrapper>
                <ItemsPage />
              </SuspenseWrapper>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};