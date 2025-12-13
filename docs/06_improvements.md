# CarbonLand 개선사항 제안

> 작성일: 2025-12-13
> 버전: 1.1 (업데이트: 2025-12-13)

---

## 1. 즉시 수정 필요 (해커톤 전)

### 1.1 푸터 문구 수정 ✅ 완료

**현재:** ~~"데이터 출처: 경기기후플랫폼 | Mock 데이터 사용 중"~~

**수정 완료:** "데이터 출처: 경기기후플랫폼 | 경기 기후 바이브코딩 해커톤 2025"

**파일:** `src/app/page.tsx:222`

### 1.2 결과 패널 푸터 수정 ✅ 완료

**파일:** `src/components/result/ResultPanel.tsx:403`

**수정 완료:** "데이터 출처: 경기기후플랫폼"

---

## 2. 단기 개선사항 (Post-MVP)

### 2.1 모바일 레이어 패널 접근성 ✅ 완료

**문제:** ~~모바일에서 레이어 패널에 접근할 수 없음~~

**해결 완료:**
- 모바일 하단 탭에 "레이어" 탭 추가
- LayerPanel 컴포넌트에 `isMobile` prop 추가

**변경 파일:** `src/app/page.tsx`, `src/components/map/LayerPanel.tsx`

### 2.2 WMS 레이어 로딩 인디케이터 ✅ 완료

**문제:** ~~WMS 타일 로딩 중 사용자 피드백 없음~~

**해결 완료:**
- `isLayerLoading` 상태 추가
- TileWMS 소스에 `tileloadstart`, `tileloadend`, `tileloaderror` 이벤트 리스너 추가
- 지도 상단 중앙에 로딩 스피너 표시

**변경 파일:** `src/components/map/MapContainer.tsx`

### 2.3 주소 검색 기능

**설명:** 사용자가 주소를 입력하면 해당 위치로 지도 이동

**구현 방안:**
- Kakao/Naver 주소 검색 API 연동
- 또는 OpenStreetMap Nominatim API 사용

### 2.4 WFS 연동 - 실제 탄소 데이터 조회

**설명:** 선택 영역의 실제 NPP, 탄소저장량 데이터 조회

**구현 방안:**
```typescript
// climateApi.ts에 추가
export async function getCarbonDataForArea(
  bbox: number[]
): Promise<CarbonData | null> {
  const features = await getFeatures(CLIMATE_API.LAYERS.NPP, bbox);
  // 피처에서 탄소 데이터 추출 및 통계 계산
  return calculateCarbonStatistics(features);
}
```

---

## 3. 중기 개선사항

### 3.1 결과 저장/공유 기능

**기능:**
- 시뮬레이션 결과를 이미지로 저장
- PDF 리포트 생성
- URL 공유 (쿼리 파라미터에 설정 저장)

**라이브러리:**
- html2canvas: 결과 패널 이미지 캡처
- jsPDF: PDF 생성

### 3.2 비오톱 자동 감지

**설명:** 선택 영역의 현재 토지이용 유형을 WFS로 자동 분석

**구현 방안:**
```typescript
// 비오톱 레이어에서 피처 조회
const biotopFeatures = await getFeatures(CLIMATE_API.LAYERS.BIOTOP, bbox);
// 면적 비율로 주요 토지이용 유형 결정
const dominantType = analyzeBiotopDistribution(biotopFeatures);
```

### 3.3 다중 시나리오 비교

**설명:** 여러 시나리오를 동시에 비교하는 화면

**UI 제안:**
- 시나리오 카드 추가/제거 기능
- 나란히 비교 테이블
- 종합 비교 차트

---

## 4. 장기 개선사항

### 4.1 시나리오 저장/불러오기

**기능:**
- 로컬스토리지 또는 서버에 시나리오 저장
- 저장된 시나리오 목록 관리
- 시나리오 공유 기능

### 4.2 시계열 분석 고도화

**기능:**
- 연도별 세부 분석
- 탄소중립 달성 시점 예측
- 최적 복원 시나리오 추천

### 4.3 AI 기반 추천

**기능:**
- 선택 영역에 최적인 토지이용 시나리오 추천
- 탄소중립 달성을 위한 조합 제안

### 4.4 건물 배출량 연계

**설명:** 개발 후 건물에서 발생하는 탄소 배출량까지 포함

**데이터:** 경기기후플랫폼 `spggcee:bldg_info` 레이어 활용

---

## 5. 코드 품질 개선

### 5.1 타입 정의 강화

```typescript
// types/index.ts에 WMS 관련 타입 추가
export interface WMSLayerConfig {
  id: string;
  name: string;
  layerName: string;
  description: string;
  visible: boolean;
  opacity: number;
}
```

### 5.2 에러 핸들링

```typescript
// API 호출 시 에러 처리 강화
try {
  const features = await getFeatures(layerName, bbox);
  if (!features) {
    toast.error('데이터를 불러올 수 없습니다');
    return;
  }
} catch (error) {
  console.error('WFS 오류:', error);
  toast.error('서버 연결에 실패했습니다');
}
```

### 5.3 테스트 코드 추가

- 탄소 계산 로직 단위 테스트
- 컴포넌트 스냅샷 테스트
- E2E 테스트 (Playwright)

---

## 6. 우선순위 요약

| 우선순위 | 항목 | 상태 | 예상 소요 |
|----------|------|------|-----------|
| **즉시** | 푸터 문구 수정 | ✅ 완료 | 5분 |
| **P1** | 모바일 레이어 접근성 | ✅ 완료 | 1시간 |
| **P1** | 주소 검색 기능 | ⬜ 미완료 | 2시간 |
| **P2** | WMS 로딩 인디케이터 | ✅ 완료 | 30분 |
| **P2** | WFS 실제 데이터 연동 | ⬜ 미완료 | 3시간 |
| **P2** | 결과 저장/공유 | ⬜ 미완료 | 2시간 |
| **P3** | 비오톱 자동 감지 | ⬜ 미완료 | 2시간 |
| **P3** | 다중 시나리오 비교 | ⬜ 미완료 | 4시간 |

---

## 7. 참고사항

### 경기기후플랫폼 API 추가 활용 가능 레이어

| 레이어 | WMS명 | 활용 방안 |
|--------|-------|-----------|
| 탄소흡수지도(비오톱) | spggcee:biotop_cbn_abpvl | 비오톱별 세부 흡수량 |
| 토양탄소저장(비오톱) | spggcee:soil_cbn_strgat | 비오톱별 토양 탄소 |
| 건물정보 | spggcee:bldg_info | 개발 후 건물 배출량 |
| 비오톱 중분류 | spggcee:biotop_mclsf | 상세 토지이용 분류 |
| 생태계서비스-탄소저장 | spggcee:rst_cbn_strgat | 종합 탄소저장 평가 |
