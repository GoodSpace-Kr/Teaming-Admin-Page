import React, { useState } from 'react';
import type { GifticonFormData, Grade } from '../../types/gifticon';

interface GifticonFormProps {
  onSubmit: (data: GifticonFormData) => Promise<void>;
  loading?: boolean;
}

export const GifticonForm: React.FC<GifticonFormProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<GifticonFormData>({
    code: '',
    expirationDate: '',
    grade: 'BASIC'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      setFormData({
        code: '',
        expirationDate: '',
        grade: 'BASIC'
      });
    } catch (error) {
      // 에러는 상위 컴포넌트에서 처리
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">기프티콘 저장</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
  );
};
