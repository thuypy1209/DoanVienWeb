export interface User {
  id?: number;
  mssv: string;
  hoTen: string;
  email?: string;
  lop?: string;
  khoa?: string;
  diemRenLuyenTichLuy?: number;
  avatarUrl?: string;
  role: 'Admin' | 'SinhVien';
}

export interface LoginResponse {
  message: string;
  token: string;
  role?: 'Admin' | 'SinhVien';
  hoTen?: string;
  mssv?: string;
  lop?: string;
}

export interface HoatDong {
  id: number;
  tenHoatDong: string;
  moTa?: string;
  diaDiem?: string;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
  diemCong: number;
  trangThai?: string;
  imageUrl?: string;
}

export interface DangKyHoatDong {
  id: number;
  hoatDongId: number;
  sinhVienId?: number;
  ngayDangKy: string;
  trangThai: string;
  thoiGianCheckIn?: string;
  tenHoatDong?: string;
  diaDiem?: string;
  thoiGian?: string;
  diemCong?: number;
  imageUrl?: string;
  hoTen?: string;
  mssv?: string;
  lop?: string;
}

export interface ChatMessage {
  id?: number;
  user: string;
  message: string;
  timestamp: string;
  isRead?: boolean;
}
