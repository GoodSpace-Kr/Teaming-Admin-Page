import React, { useState, useEffect } from 'react';
import { apiGet, apiPost, API_ENDPOINTS } from '../utils/api';
import type { GifticonResponse, GifticonFormData } from '../types/gifticon';

export default function Gifticon() {
  const [gifticons, setGifticons] = useState<GifticonResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [formData, setFormData] = useState<GifticonFormData>({
    email: '',
    code: '',
    expirationDate: '',
    grade: 'BASIC'
  });

  // 기프티콘 조회
  const fetchGifticons = async (email: string) => {
    if (!email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await apiGet(`${API_ENDPOINTS.GIFTCON_GET}?email=${encodeURIComponent(email)}`);
      setGifticons(response);
    } catch (err: any) {
      setError(err.message || '기프티콘 조회에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 기프티콘 저장
  const saveGifticon = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // API 요청 형식에 맞게 데이터 변환
      const gifticonData = {
        code: formData.code,
        expirationDateStr: formData.expirationDate.replace(/-/g, ''), // YYYY-MM-DD -> YYYYMMDD
        grade: formData.grade
      };
      
      const response = await apiPost(API_ENDPOINTS.GIFTCON_SAVE, gifticonData);
      // 응답은 문자열이므로 JSON 파싱하지 않음
      setSuccess('기프티콘이 성공적으로 저장되었습니다.');
      setFormData({
        email: '',
        code: '',
        expirationDate: '',
        grade: 'BASIC'
      });
    } catch (err: any) {
      setError(err.message || '기프티콘 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'ELITE': return 'text-purple-600 bg-purple-100';
      case 'STANDARD': return 'text-blue-600 bg-blue-100';
      case 'BASIC': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">기프티콘 관리</h1>
        <p className="mt-1 text-sm text-gray-600">
          사용자의 기프티콘을 조회하고 새로운 기프티콘을 저장할 수 있습니다.
        </p>
      </div>

      {/* 기프티콘 조회 */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">기프티콘 조회</h2>
        <div className="flex gap-4">
          <input
            type="email"
            placeholder="사용자 이메일을 입력하세요"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            onClick={() => fetchGifticons(searchEmail)}
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {loading ? '조회 중...' : '조회'}
          </button>
        </div>

        {/* 조회 결과 */}
        {gifticons.length > 0 && (
          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-900 mb-3">
              {searchEmail}의 기프티콘 ({gifticons.length}개)
            </h3>
            <div className="grid gap-4">
              {gifticons.map((gifticon, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{gifticon.code}</p>
                      <p className="text-sm text-gray-600">만료일: {gifticon.expirationDateStr}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(gifticon.grade)}`}>
                      {gifticon.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {gifticons.length === 0 && searchEmail && !loading && (
          <div className="mt-4 text-center text-gray-500">
            해당 사용자의 기프티콘이 없습니다.
          </div>
        )}
      </div>

      {/* 기프티콘 저장 */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">기프티콘 저장</h2>
        <form onSubmit={saveGifticon} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                기프티콘 코드
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="기프티콘 코드를 입력하세요"
              />
            </div>

            <div>
              <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">
                만료일
              </label>
              <input
                type="date"
                id="expirationDate"
                name="expirationDate"
                value={formData.expirationDate}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
              등급
            </label>
            <select
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="BASIC">BASIC</option>
              <option value="STANDARD">STANDARD</option>
              <option value="ELITE">ELITE</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? '저장 중...' : '기프티콘 저장'}
            </button>
          </div>
        </form>
      </div>

      {/* 알림 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="text-sm text-green-700">{success}</div>
        </div>
      )}
    </div>
  );
}
