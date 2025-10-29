import React from 'react';
import type { GifticonFilters, SortOptions, Grade } from '../types/gifticon';

interface GifticonFiltersProps {
  filters: GifticonFilters;
  sortOptions: SortOptions;
  onFiltersChange: (filters: GifticonFilters) => void;
  onSortChange: (sortOptions: SortOptions) => void;
  onDeleteExpired?: () => void;
  deletableExpiredCount?: number;
}

export const GifticonFiltersComponent: React.FC<GifticonFiltersProps> = ({
  filters,
  sortOptions,
  onFiltersChange,
  onSortChange,
  onDeleteExpired,
  deletableExpiredCount = 0
}) => {
  const handleFilterChange = (key: keyof GifticonFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleSortChange = (field: 'id' | 'expirationDate') => {
    const newOrder = sortOptions.field === field && sortOptions.order === 'asc' ? 'desc' : 'asc';
    onSortChange({
      field,
      order: newOrder
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== 'ALL'
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">필터 및 정렬</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            필터 초기화
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 만료 여부 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            만료 여부
          </label>
          <select
            value={filters.isExpired === undefined ? 'ALL' : filters.isExpired.toString()}
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange('isExpired', value === 'ALL' ? undefined : value === 'true');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="ALL">전체</option>
            <option value="true">만료됨</option>
            <option value="false">유효함</option>
          </select>
        </div>

        {/* 등급 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            등급
          </label>
          <select
            value={filters.grade || 'ALL'}
            onChange={(e) => {
              const value = e.target.value as Grade | 'ALL';
              handleFilterChange('grade', value === 'ALL' ? undefined : value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="ALL">전체</option>
            <option value="BASIC">BASIC</option>
            <option value="STANDARD">STANDARD</option>
            <option value="ELITE">ELITE</option>
          </select>
        </div>

        {/* 전송 여부 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            전송 여부
          </label>
          <select
            value={filters.isSent === undefined ? 'ALL' : filters.isSent.toString()}
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange('isSent', value === 'ALL' ? undefined : value === 'true');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="ALL">전체</option>
            <option value="true">전송됨</option>
            <option value="false">미전송</option>
          </select>
        </div>

        {/* 사용 여부 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            사용 여부
          </label>
          <select
            value={filters.isUsed === undefined ? 'ALL' : filters.isUsed.toString()}
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange('isUsed', value === 'ALL' ? undefined : value === 'true');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="ALL">전체</option>
            <option value="true">사용됨</option>
            <option value="false">미사용</option>
          </select>
        </div>
      </div>

      {/* 정렬 옵션 */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          정렬 기준
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => handleSortChange('id')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              sortOptions.field === 'id'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ID {sortOptions.field === 'id' && (sortOptions.order === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSortChange('expirationDate')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              sortOptions.field === 'expirationDate'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            만료일 {sortOptions.field === 'expirationDate' && (sortOptions.order === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {/* 만료된 기프티콘 일괄 삭제 */}
      {deletableExpiredCount > 0 && onDeleteExpired && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">만료된 기프티콘 정리</h3>
              <p className="text-xs text-gray-600 mt-1">
                전송되지 않은 만료된 기프티콘 {deletableExpiredCount}개를 삭제할 수 있습니다.
              </p>
            </div>
            <button
              onClick={onDeleteExpired}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              만료된 기프티콘 삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
