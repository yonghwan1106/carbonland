// Mock 데이터 - API 발급 전까지 사용

import type { LandUseType } from './constants';

// 데모용 프리셋 영역 (경기도 주요 지역)
export interface PresetArea {
  id: string;
  name: string;
  description: string;
  center: [number, number];  // [lng, lat]
  areaHa: number;
  currentLandUse: LandUseType;
  polygon: number[][][];     // GeoJSON Polygon coordinates
}

export const PRESET_AREAS: PresetArea[] = [
  {
    id: 'suwon-yeongtong',
    name: '수원 영통 녹지',
    description: '영통구 원천동 일대 산림지역',
    center: [127.0456, 37.2636],
    areaHa: 15.5,
    currentLandUse: 'FOREST',
    polygon: [[
      [127.0406, 37.2606],
      [127.0506, 37.2606],
      [127.0506, 37.2666],
      [127.0406, 37.2666],
      [127.0406, 37.2606],
    ]],
  },
  {
    id: 'seongnam-pangyo',
    name: '성남 판교 녹지',
    description: '판교테크노밸리 인근 초지',
    center: [127.1125, 37.3947],
    areaHa: 8.2,
    currentLandUse: 'GRASSLAND',
    polygon: [[
      [127.1075, 37.3917],
      [127.1175, 37.3917],
      [127.1175, 37.3977],
      [127.1075, 37.3977],
      [127.1075, 37.3917],
    ]],
  },
  {
    id: 'hwaseong-dongtan',
    name: '화성 동탄 농경지',
    description: '동탄신도시 인근 농경지',
    center: [127.0736, 37.2006],
    areaHa: 22.0,
    currentLandUse: 'AGRICULTURAL',
    polygon: [[
      [127.0636, 37.1936],
      [127.0836, 37.1936],
      [127.0836, 37.2076],
      [127.0636, 37.2076],
      [127.0636, 37.1936],
    ]],
  },
  {
    id: 'yongin-suji',
    name: '용인 수지 산림',
    description: '수지구 광교산 일대',
    center: [127.0856, 37.3256],
    areaHa: 45.0,
    currentLandUse: 'FOREST',
    polygon: [[
      [127.0706, 37.3156],
      [127.1006, 37.3156],
      [127.1006, 37.3356],
      [127.0706, 37.3356],
      [127.0706, 37.3156],
    ]],
  },
  {
    id: 'goyang-ilsan',
    name: '고양 일산 습지',
    description: '일산호수공원 인근 습지',
    center: [126.7656, 37.6706],
    areaHa: 12.8,
    currentLandUse: 'WETLAND',
    polygon: [[
      [126.7556, 37.6636],
      [126.7756, 37.6636],
      [126.7756, 37.6776],
      [126.7556, 37.6776],
      [126.7556, 37.6636],
    ]],
  },
];

// 비오톱 유형 분포 Mock 데이터 생성
export interface BiotopDistribution {
  typeCode: string;
  typeName: string;
  areaHa: number;
  percentage: number;
  color: string;
}

export function generateBiotopDistribution(
  totalAreaHa: number,
  primaryType: LandUseType
): BiotopDistribution[] {
  const distributions: Record<LandUseType, BiotopDistribution[]> = {
    FOREST: [
      { typeCode: 'F1', typeName: '상록침엽수림', areaHa: 0, percentage: 45, color: '#166534' },
      { typeCode: 'F2', typeName: '낙엽활엽수림', areaHa: 0, percentage: 35, color: '#22c55e' },
      { typeCode: 'F3', typeName: '혼효림', areaHa: 0, percentage: 15, color: '#4ade80' },
      { typeCode: 'G1', typeName: '초지', areaHa: 0, percentage: 5, color: '#86efac' },
    ],
    GRASSLAND: [
      { typeCode: 'G1', typeName: '자연초지', areaHa: 0, percentage: 60, color: '#22c55e' },
      { typeCode: 'G2', typeName: '조경녹지', areaHa: 0, percentage: 25, color: '#4ade80' },
      { typeCode: 'F3', typeName: '관목림', areaHa: 0, percentage: 15, color: '#166534' },
    ],
    AGRICULTURAL: [
      { typeCode: 'A1', typeName: '논', areaHa: 0, percentage: 50, color: '#84cc16' },
      { typeCode: 'A2', typeName: '밭', areaHa: 0, percentage: 35, color: '#a3e635' },
      { typeCode: 'A3', typeName: '과수원', areaHa: 0, percentage: 15, color: '#bef264' },
    ],
    WETLAND: [
      { typeCode: 'W1', typeName: '하천습지', areaHa: 0, percentage: 40, color: '#0ea5e9' },
      { typeCode: 'W2', typeName: '호소습지', areaHa: 0, percentage: 35, color: '#38bdf8' },
      { typeCode: 'W3', typeName: '인공습지', areaHa: 0, percentage: 25, color: '#7dd3fc' },
    ],
    RESIDENTIAL: [
      { typeCode: 'R1', typeName: '단독주택지', areaHa: 0, percentage: 40, color: '#f97316' },
      { typeCode: 'R2', typeName: '공동주택지', areaHa: 0, percentage: 45, color: '#fb923c' },
      { typeCode: 'G2', typeName: '조경녹지', areaHa: 0, percentage: 15, color: '#22c55e' },
    ],
    COMMERCIAL: [
      { typeCode: 'C1', typeName: '상업지역', areaHa: 0, percentage: 70, color: '#ef4444' },
      { typeCode: 'C2', typeName: '업무지역', areaHa: 0, percentage: 20, color: '#f87171' },
      { typeCode: 'G2', typeName: '조경녹지', areaHa: 0, percentage: 10, color: '#22c55e' },
    ],
    INDUSTRIAL: [
      { typeCode: 'I1', typeName: '경공업지역', areaHa: 0, percentage: 35, color: '#7c3aed' },
      { typeCode: 'I2', typeName: '중공업지역', areaHa: 0, percentage: 55, color: '#8b5cf6' },
      { typeCode: 'G2', typeName: '조경녹지', areaHa: 0, percentage: 10, color: '#22c55e' },
    ],
  };

  const base = distributions[primaryType] || distributions.FOREST;

  return base.map(item => ({
    ...item,
    areaHa: Number((totalAreaHa * item.percentage / 100).toFixed(2)),
  }));
}

// 연도별 탄소 변화 시계열 데이터 생성
export interface YearlyCarbonData {
  year: number;
  cumulative: number;      // 누적 탄소 변화 (tC)
  annual: number;          // 연간 탄소 변화 (tC)
  storage: number;         // 탄소 저장량 (tC)
}

export function generateYearlyData(
  immediateEmission: number,
  netAnnualChange: number,
  initialStorage: number,
  finalStorage: number,
  years: number
): YearlyCarbonData[] {
  const data: YearlyCarbonData[] = [];
  let cumulative = -immediateEmission;

  // 저장량 변화 (선형 보간)
  const storageChangePerYear = (finalStorage - initialStorage + immediateEmission) / years;

  for (let year = 0; year <= years; year++) {
    const storage = year === 0
      ? initialStorage - immediateEmission
      : initialStorage - immediateEmission + storageChangePerYear * year;

    data.push({
      year,
      cumulative: Number(cumulative.toFixed(1)),
      annual: year === 0 ? Number((-immediateEmission).toFixed(1)) : Number(netAnnualChange.toFixed(1)),
      storage: Number(storage.toFixed(1)),
    });

    if (year > 0) {
      cumulative += netAnnualChange;
    }
  }

  return data;
}

// 시나리오 비교 데이터
export interface ScenarioComparisonData {
  scenario: string;
  label: string;
  storage: number;
  absorption: number;
  emission: number;
  netChange: number;
  color: string;
}

export function generateScenarioComparison(
  areaHa: number,
  currentType: LandUseType
): ScenarioComparisonData[] {
  const scenarios: { type: LandUseType; label: string; color: string }[] = [
    { type: currentType, label: '현재 유지', color: '#3b82f6' },
    { type: 'RESIDENTIAL', label: '주거지 개발', color: '#f97316' },
    { type: 'COMMERCIAL', label: '상업지 개발', color: '#ef4444' },
    { type: 'FOREST', label: '산림 복원', color: '#22c55e' },
  ];

  // 중복 제거
  const uniqueScenarios = scenarios.filter(
    (s, i, arr) => arr.findIndex(x => x.type === s.type) === i
  );

  const { CARBON_COEFFICIENTS } = require('./constants');

  return uniqueScenarios.map(s => {
    const coef = CARBON_COEFFICIENTS[s.type];
    return {
      scenario: s.type,
      label: s.label,
      storage: Number((coef.storage * areaHa).toFixed(0)),
      absorption: Number((coef.absorption * areaHa).toFixed(1)),
      emission: Number((coef.emission * areaHa).toFixed(1)),
      netChange: Number(((coef.absorption - coef.emission) * areaHa).toFixed(1)),
      color: s.color,
    };
  });
}
