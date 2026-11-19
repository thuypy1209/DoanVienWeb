import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

import HomePage from './pages/public/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import HoatDongManager from './pages/admin/HoatDongManager';
import SinhVienManager from './pages/admin/SinhVienManager';

import StudentPortal from './pages/student/StudentPortal';
import StudentHistory from './pages/student/StudentHistory';
import StudentProfile from './pages/student/StudentProfile';
import ChatRoom from './pages/chat/ChatRoom';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Home & Landing Page - Xem hoạt động & Đăng ký tham gia */}
          <Route path="/" element={<HomePage />} />
          <Route path="/hoat-dong" element={<HomePage />} />

          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Area (Yêu cầu đăng nhập) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              {/* Cổng Quản Trị (Admin) */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/hoat-dong" element={<HoatDongManager />} />
              <Route path="/admin/sinh-vien" element={<SinhVienManager />} />

              {/* Cổng Sinh Viên / Đoàn Viên */}
              <Route path="/portal" element={<StudentPortal />} />
              <Route path="/portal/lich-su" element={<StudentHistory />} />
              <Route path="/portal/profile" element={<StudentProfile />} />

              {/* Kênh Chat Realtime SignalR */}
              <Route path="/chat" element={<ChatRoom />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
