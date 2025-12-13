// 탄소 계산 관련 상수

// 토지이용 유형별 탄소 계수 (단위: tC/ha)
export const CARBON_COEFFICIENTS = {
  FOREST: {
    name: '산림지',
    code: 'F',
    storage: 150,      // 저장량 (tC/ha)
    absorption: 8,     // 연간 흡수량 (tC/ha/year)
    emission: 0,       // 연간 배출량 (tC/ha/year)
    color: '#166534',  // green-800
  },
  GRASSLAND: {
    name: '초지/공원녹지',
    code: 'G',
    storage: 50,
    absorption: 3,
    emission: 0,
    color: '#22c55e',  // green-500
  },
  AGRICULTURAL: {
    name: '농경지',
    code: 'A',
    storage: 30,
    absorption: 2,
    emission: 1,
    color: '#84cc16',  // lime-500
  },
  WETLAND: {
    name: '습지',
    code: 'W',
    storage: 200,
    absorption: 5,
    emission: 0,
    color: '#0ea5e9',  // sky-500
  },
  RESIDENTIAL: {
    name: '주거지',
    code: 'R',
    storage: 10,
    absorption: 0.5,
    emission: 5,
    color: '#f97316',  // orange-500
  },
  COMMERCIAL: {
    name: '상업지',
    code: 'C',
    storage: 5,
    absorption: 0.2,
    emission: 10,
    color: '#ef4444',  // red-500
  },
  INDUSTRIAL: {
    name: '공업지',
    code: 'I',
    storage: 2,
    absorption: 0.1,
    emission: 20,
    color: '#7c3aed',  // violet-600
  },
} as const;

export type LandUseType = keyof typeof CARBON_COEFFICIENTS;

// 시뮬레이션 시나리오
export const SIMULATION_SCENARIOS = [
  { id: 'DEV_RES', name: '주거지 개발', targetType: 'RESIDENTIAL' as LandUseType },
  { id: 'DEV_COM', name: '상업지 개발', targetType: 'COMMERCIAL' as LandUseType },
  { id: 'DEV_IND', name: '공업지 개발', targetType: 'INDUSTRIAL' as LandUseType },
  { id: 'CON_GRN', name: '녹지 보전', targetType: 'GRASSLAND' as LandUseType },
  { id: 'RES_FOR', name: '산림 복원', targetType: 'FOREST' as LandUseType },
] as const;

// 환산 계수
export const CONVERSION_FACTORS = {
  C_TO_CO2: 44 / 12,                    // 탄소 → 이산화탄소 (≈ 3.67)
  TREE_CARBON_30Y: 0.5,                  // 소나무 1그루 30년간 흡수량 (tC)
  CAR_ANNUAL_CO2: 4.6,                   // 승용차 연간 CO2 배출량 (tCO2)
  HOUSEHOLD_ANNUAL_CO2: 2.5,             // 가구 연간 CO2 배출량 (tCO2)
} as const;

// 경기기후플랫폼 API 관련
export const CLIMATE_API = {
  BASE_URL: 'https://climate.gg.go.kr/ols/api/geoserver',
  // WMS 레이어 (지도 표시용)
  LAYERS: {
    NPP: 'spggcee:rst_npp',                           // 탄소흡수지도 (NPP)
    TREE_CARBON: 'spggcee:plnt_cbn_strgat_biotop',    // 수목 탄소저장지도
    SOIL_CARBON: 'spggcee:rst_soil_cbn_strgat_32652', // 토양 탄소저장지도
    BIOTOP: 'spggcee:biotop_lclsf',                   // 비오톱 유형도
  },
  // WFS 레이어 (데이터 조회용)
  WFS_LAYERS: {
    BIOTOP_CARBON: 'spggcee:biotop_cbn_abpvl',        // 비오톱 탄소흡수량
    TREE_CARBON: 'spggcee:plnt_cbn_strgat_biotop',    // 수목 탄소저장량
    SOIL_CARBON: 'spggcee:soil_cbn_strgat',           // 토양 탄소저장량
    BIOTOP_MID: 'spggcee:biotop_mclsf',               // 비오톱 중분류
    BIOTOP_LARGE: 'spggcee:biotop_lclsf',             // 비오톱 대분류
  },
} as const;

// 지도 초기 설정 (경기도 중심)
export const MAP_CONFIG = {
  CENTER: [127.0, 37.28] as [number, number],  // 경기도 중심 좌표 (lon, lat)
  ZOOM: 10,
  MIN_ZOOM: 8,
  MAX_ZOOM: 18,
} as const;

// 색상 팔레트
export const COLORS = {
  positive: '#22c55e',   // green-500 (탄소 흡수/보전)
  negative: '#ef4444',   // red-500 (탄소 배출/개발)
  warning: '#f97316',    // orange-500
  neutral: '#3b82f6',    // blue-500
  background: '#f1f5f9', // slate-100
  text: '#1e293b',       // slate-800
} as const;
