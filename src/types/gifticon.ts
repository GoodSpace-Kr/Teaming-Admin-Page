// 기프티콘 관련 타입 정의

export type Grade = 'BASIC' | 'STANDARD' | 'ELITE';

// 서버 API 응답 타입 (GifticonDetailResponseDto)
export interface GifticonDetailResponse {
  id: number;
  code: string;
  expirationDate: string; // ISO 8601 형식의 날짜 문자열
  grade: Grade;
  isSent: boolean;
  isUsed: boolean;
}

// 기프티콘 저장 요청 타입 (GifticonRequestDto)
export interface GifticonRequest {
  code: string;
  expirationDateStr: string; // YYYYMMDD 형식
  grade: Grade;
}

// 기프티콘 폼 데이터 타입
export interface GifticonFormData {
  code: string;
  expirationDate: string; // YYYY-MM-DD 형식
  grade: Grade;
}

// 필터링 옵션 타입
export interface GifticonFilters {
  isExpired?: boolean;
  grade?: Grade | 'ALL';
  isSent?: boolean | 'ALL';
  isUsed?: boolean | 'ALL';
}

// 기프티콘 삭제 요청 타입 (GifticonDeleteRequestDto)
export interface GifticonDeleteRequest {
  ids: number[];
}

// 정렬 옵션 타입
export type SortField = 'id' | 'expirationDate';
export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  field: SortField;
  order: SortOrder;
}
