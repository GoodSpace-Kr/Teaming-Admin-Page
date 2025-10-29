import React, { useState, useEffect } from 'react';
import { GifticonFiltersComponent } from '../components/Gifticon/GifticonFilters';
import { GifticonList } from '../components/Gifticon/GifticonList';
import { GifticonForm } from '../components/Gifticon/GifticonForm';
import { ConfirmDialog } from '../components/Common/ConfirmDialog';
import { 
  fetchAllGifticons, 
  saveGifticon, 
  deleteGifticons,
  processGifticons,
  getDeletableExpiredGifticonIds
} from '../services/gifticonService';
import type { 
  GifticonDetailResponse, 
  GifticonFormData, 
  GifticonFilters, 
  SortOptions 
} from '../types/gifticon';

export default function Gifticon() {
  const [gifticons, setGifticons] = useState<GifticonDetailResponse[]>([]);
  const [filteredGifticons, setFilteredGifticons] = useState<GifticonDetailResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // 필터 및 정렬 상태
  const [filters, setFilters] = useState<GifticonFilters>({});
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: 'id',
    order: 'asc'
  });

  // 삭제 관련 상태
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteTargetType, setDeleteTargetType] = useState<'single' | 'expired' | null>(null);

  // 컴포넌트 마운트 시 기프티콘 목록 로드
  useEffect(() => {
    loadGifticons();
  }, []);

  // 필터나 정렬 옵션이 변경될 때마다 목록 재처리
  useEffect(() => {
    const processed = processGifticons(gifticons, filters, sortOptions);
    setFilteredGifticons(processed);
  }, [gifticons, filters, sortOptions]);

  // 기프티콘 목록 로드
  const loadGifticons = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllGifticons();
      setGifticons(data);
    } catch (err: any) {
      setError(err.message || '기프티콘 목록 조회에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 기프티콘 저장
  const handleSaveGifticon = async (formData: GifticonFormData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 폼 데이터를 API 요청 형식으로 변환
      const gifticonData = {
        code: formData.code,
        expirationDateStr: formData.expirationDate.replace(/-/g, ''), // YYYY-MM-DD -> YYYYMMDD
        grade: formData.grade
      };
      
      await saveGifticon(gifticonData);
      setSuccess('기프티콘이 성공적으로 저장되었습니다.');
      
      // 목록 새로고침
      await loadGifticons();
    } catch (err: any) {
      setError(err.message || '기프티콘 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 필터 변경 핸들러
  const handleFiltersChange = (newFilters: GifticonFilters) => {
    setFilters(newFilters);
  };

  // 정렬 변경 핸들러
  const handleSortChange = (newSortOptions: SortOptions) => {
    setSortOptions(newSortOptions);
  };

  // 개별 기프티콘 삭제 핸들러
  const handleDeleteGifticon = (id: number) => {
    setDeleteTargetId(id);
    setDeleteTargetType('single');
    setShowDeleteDialog(true);
  };

  // 만료된 기프티콘 일괄 삭제 핸들러
  const handleDeleteExpiredGifticons = () => {
    setDeleteTargetType('expired');
    setShowDeleteDialog(true);
  };

  // 삭제 확인 핸들러
  const handleConfirmDelete = async () => {
    if (!deleteTargetType) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (deleteTargetType === 'single' && deleteTargetId) {
        await deleteGifticons([deleteTargetId]);
        setSuccess('기프티콘이 성공적으로 삭제되었습니다.');
      } else if (deleteTargetType === 'expired') {
        const expiredIds = getDeletableExpiredGifticonIds(gifticons);
        if (expiredIds.length > 0) {
          await deleteGifticons(expiredIds);
          setSuccess(`만료된 기프티콘 ${expiredIds.length}개가 성공적으로 삭제되었습니다.`);
        }
      }
      
      // 목록 새로고침
      await loadGifticons();
    } catch (err: any) {
      setError(err.message || '기프티콘 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
      setDeleteTargetId(null);
      setDeleteTargetType(null);
    }
  };

  // 삭제 취소 핸들러
  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setDeleteTargetId(null);
    setDeleteTargetType(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">기프티콘 관리</h1>
        <p className="mt-1 text-sm text-gray-600">
          전체 기프티콘을 조회하고 새로운 기프티콘을 저장할 수 있습니다.
        </p>
      </div>

      {/* 기프티콘 저장 폼 */}
      <GifticonForm 
        onSubmit={handleSaveGifticon} 
        loading={loading} 
      />

      {/* 필터 및 정렬 */}
      <GifticonFiltersComponent
        filters={filters}
        sortOptions={sortOptions}
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
        onDeleteExpired={handleDeleteExpiredGifticons}
        deletableExpiredCount={getDeletableExpiredGifticonIds(gifticons).length}
      />

      {/* 기프티콘 목록 */}
      <GifticonList 
        gifticons={filteredGifticons} 
        loading={loading}
        onDeleteGifticon={handleDeleteGifticon}
      />

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

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title={deleteTargetType === 'single' ? '기프티콘 삭제' : '만료된 기프티콘 일괄 삭제'}
        message={
          deleteTargetType === 'single' 
            ? '이 기프티콘을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
            : `전송되지 않은 만료된 기프티콘 ${getDeletableExpiredGifticonIds(gifticons).length}개를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
        }
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={loading}
      />
    </div>
  );
}
