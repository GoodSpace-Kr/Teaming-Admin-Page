// 기프티콘 관련 API 서비스 함수들

import { apiGet, apiPost, apiDelete } from '../utils/api';
import type { 
  GifticonDetailResponse, 
  GifticonRequest, 
  GifticonDeleteRequest,
  GifticonFilters, 
  SortOptions 
} from '../types/gifticon';

/**
 * 전체 기프티콘 목록을 조회합니다.
 * @returns Promise<GifticonDetailResponse[]>
 */
export const fetchAllGifticons = async (): Promise<GifticonDetailResponse[]> => {
  try {
    const response = await apiGet('/admin/gifticon');
    return response;
  } catch (error) {
    console.error('기프티콘 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 기프티콘을 저장합니다.
 * @param gifticonData 저장할 기프티콘 데이터
 * @returns Promise<string> 성공 메시지
 */
export const saveGifticon = async (gifticonData: GifticonRequest): Promise<string> => {
  try {
    const response = await apiPost('/admin/gifticon', gifticonData);
    return response;
  } catch (error) {
    console.error('기프티콘 저장 실패:', error);
    throw error;
  }
};

/**
 * 기프티콘을 삭제합니다.
 * @param ids 삭제할 기프티콘 ID 목록
 * @returns Promise<void>
 */
export const deleteGifticons = async (ids: number[]): Promise<void> => {
  try {
    const deleteRequest: GifticonDeleteRequest = { ids };
    await apiDelete('/admin/gifticon', deleteRequest);
  } catch (error) {
    console.error('기프티콘 삭제 실패:', error);
    throw error;
  }
};

/**
 * 기프티콘 목록을 필터링합니다.
 * @param gifticons 필터링할 기프티콘 목록
 * @param filters 필터 옵션
 * @returns 필터링된 기프티콘 목록
 */
export const filterGifticons = (
  gifticons: GifticonDetailResponse[], 
  filters: GifticonFilters
): GifticonDetailResponse[] => {
  return gifticons.filter(gifticon => {
    // 만료 여부 필터링
    if (filters.isExpired !== undefined) {
      const isExpired = new Date(gifticon.expirationDate) < new Date();
      if (isExpired !== filters.isExpired) {
        return false;
      }
    }

    // 등급 필터링
    if (filters.grade && filters.grade !== 'ALL') {
      if (gifticon.grade !== filters.grade) {
        return false;
      }
    }

    // 전송 여부 필터링
    if (filters.isSent !== undefined && filters.isSent !== 'ALL') {
      if (gifticon.isSent !== filters.isSent) {
        return false;
      }
    }

    // 사용 여부 필터링
    if (filters.isUsed !== undefined && filters.isUsed !== 'ALL') {
      if (gifticon.isUsed !== filters.isUsed) {
        return false;
      }
    }

    return true;
  });
};

/**
 * 기프티콘 목록을 정렬합니다.
 * @param gifticons 정렬할 기프티콘 목록
 * @param sortOptions 정렬 옵션
 * @returns 정렬된 기프티콘 목록
 */
export const sortGifticons = (
  gifticons: GifticonDetailResponse[], 
  sortOptions: SortOptions
): GifticonDetailResponse[] => {
  return [...gifticons].sort((a, b) => {
    let comparison = 0;

    switch (sortOptions.field) {
      case 'id':
        comparison = a.id - b.id;
        break;
      case 'expirationDate':
        comparison = new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
        break;
      default:
        return 0;
    }

    return sortOptions.order === 'desc' ? -comparison : comparison;
  });
};

/**
 * 기프티콘 목록을 필터링하고 정렬합니다.
 * @param gifticons 처리할 기프티콘 목록
 * @param filters 필터 옵션
 * @param sortOptions 정렬 옵션
 * @returns 필터링되고 정렬된 기프티콘 목록
 */
export const processGifticons = (
  gifticons: GifticonDetailResponse[],
  filters: GifticonFilters,
  sortOptions: SortOptions
): GifticonDetailResponse[] => {
  const filtered = filterGifticons(gifticons, filters);
  return sortGifticons(filtered, sortOptions);
};

/**
 * 기프티콘의 만료 여부를 확인합니다.
 * @param expirationDate 만료일 (ISO 8601 형식)
 * @returns 만료 여부
 */
export const isGifticonExpired = (expirationDate: string): boolean => {
  return new Date(expirationDate) < new Date();
};

/**
 * 날짜를 포맷팅합니다.
 * @param dateString ISO 8601 형식의 날짜 문자열
 * @returns 포맷팅된 날짜 문자열 (YYYY-MM-DD)
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * 등급에 따른 색상을 반환합니다.
 * @param grade 기프티콘 등급
 * @returns Tailwind CSS 클래스 문자열
 */
export const getGradeColor = (grade: string): string => {
  switch (grade) {
    case 'ELITE': 
      return 'text-purple-600 bg-purple-100';
    case 'STANDARD': 
      return 'text-blue-600 bg-blue-100';
    case 'BASIC': 
      return 'text-green-600 bg-green-100';
    default: 
      return 'text-gray-600 bg-gray-100';
  }
};

/**
 * 삭제 가능한 만료된 기프티콘 ID 목록을 반환합니다.
 * (전송되지 않은 만료된 기프티콘만 삭제 가능)
 * @param gifticons 기프티콘 목록
 * @returns 삭제 가능한 만료된 기프티콘 ID 목록
 */
export const getDeletableExpiredGifticonIds = (gifticons: GifticonDetailResponse[]): number[] => {
  return gifticons
    .filter(gifticon => 
      isGifticonExpired(gifticon.expirationDate) && !gifticon.isSent
    )
    .map(gifticon => gifticon.id);
};
