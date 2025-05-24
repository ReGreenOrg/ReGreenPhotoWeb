1. 디렉토리 구조 예시

- app/
  - page.tsx → 촬영 화면
  - check/page.tsx → 사진 선택 + 프레임 선택
  - result/page.tsx → 결과 + QR코드
- pages/api/
  - upload.ts → GCS 업로드 처리 API (App Router에서도 pages 디렉토리 사용)
- public/
- .env.local → GCS 설정
- gcp-service-key.json → GCP 서비스 계정 키 (절대 업로드 금지)
