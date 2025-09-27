// 기프티콘 관련 타입 정의

export interface GifticonRequest {
  code: string;
  expirationDateStr: string;
  grade: 'BASIC' | 'STANDARD' | 'ELITE';
}

export interface GifticonResponse {
  code: string;
  expirationDateStr: string;
  grade: 'BASIC' | 'STANDARD' | 'ELITE';
}

export interface GifticonFormData {
  email: string;
  code: string;
  expirationDate: string;
  grade: 'BASIC' | 'STANDARD' | 'ELITE';
}
