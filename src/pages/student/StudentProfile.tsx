import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sinhVienApi } from '../../api/sinhVienApi';
import { User, Award, Mail, GraduationCap, Building2, Upload, CheckCircle2 } from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setSuccessMsg(null);
      await sinhVienApi.uploadAvatar(file);
      await refreshProfile();
      setSuccessMsg('Cập nhật ảnh đại diện thành công!');
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Lỗi tải ảnh lên');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Hồ Sơ Đoàn Viên</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Thông tin cá nhân, chi đoàn và điểm rèn luyện tích lũy trong quá trình học tập
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          <div className="relative group">
            <div className="h-24 w-24 rounded-full border-2 border-blue-500/20 overflow-hidden bg-slate-100 flex items-center justify-center shadow-md">
              {user?.avatarUrl ? (
                <img
                  src={
                    user.avatarUrl.startsWith('http')
                      ? user.avatarUrl
                      : `http://localhost:5000${user.avatarUrl}`
                  }
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-slate-400" />
              )}
            </div>

            <label className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-blue-700 transition">
              <Upload className="h-4 w-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-bold text-slate-900">{user?.hoTen || 'Đoàn viên'}</h2>
            <p className="text-xs text-slate-500">Mã số sinh viên: <span className="font-semibold text-slate-700">{user?.mssv}</span></p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                <Award className="h-3.5 w-3.5" />
                <span>{user?.diemRenLuyenTichLuy ?? 0} Điểm Rèn Luyện Tích Lũy</span>
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6">
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase">
              <GraduationCap className="h-4 w-4 text-slate-500" />
              <span>Chi Đoàn / Lớp</span>
            </div>
            <div className="text-base font-bold text-slate-800 mt-1">
              {user?.lop || 'Chưa cập nhật'}
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase">
              <Building2 className="h-4 w-4 text-slate-500" />
              <span>Khoa / Viện</span>
            </div>
            <div className="text-base font-bold text-slate-800 mt-1">
              {user?.khoa || 'Chưa cập nhật'}
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase">
              <Mail className="h-4 w-4 text-slate-500" />
              <span>Địa chỉ Email</span>
            </div>
            <div className="text-base font-bold text-slate-800 mt-1">
              {user?.email || 'Chưa cập nhật'}
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase">
              <Award className="h-4 w-4 text-slate-500" />
              <span>Tình trạng Đoàn viên</span>
            </div>
            <div className="text-base font-bold text-emerald-600 mt-1">
              Đang sinh hoạt tích cực
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
