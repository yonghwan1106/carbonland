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
    id: 'gwanggyo-forest',
    name: '광교산 산림',
    description: '수원시 광교산 자연산림지역',
    center: [127.0350, 37.3050],
    areaHa: 8.0,
    currentLandUse: 'FOREST',
    polygon: [[
      [127.0320, 37.3020],
      [127.0380, 37.3020],
      [127.0380, 37.3080],
      [127.0320, 37.3080],
      [127.0320, 37.3020],
    ]],
  },
  {
    id: 'yuldong-park',
    name: '분당 율동공원',
    description: '성남시 분당구 율동공원 녹지',
    center: [127.1050, 37.3650],
    areaHa: 5.0,
    currentLandUse: 'GRASSLAND',
    polygon: [[
      [127.1020, 37.3630],
      [127.1080, 37.3630],
      [127.1080, 37.3670],
      [127.1020, 37.3670],
      [127.1020, 37.3630],
    ]],
  },
  {
    id: 'icheon-farm',
    name: '이천 농업지역',
    description: '이천시 호법면 농경지대',
    center: [127.4100, 37.2650],
    areaHa: 10.0,
    currentLandUse: 'AGRICULTURAL',
    polygon: [[
      [127.4050, 37.2620],
      [127.4150, 37.2620],
      [127.4150, 37.2680],
      [127.4050, 37.2680],
      [127.4050, 37.2620],
    ]],
  },
  {
    id: 'cheonggyesan-forest',
    name: '청계산 산림',
    description: '과천시 청계산 자연산림',
    center: [127.0550, 37.4450],
    areaHa: 8.0,
    currentLandUse: 'FOREST',
    polygon: [[
      [127.0520, 37.4420],
      [127.0580, 37.4420],
      [127.0580, 37.4480],
      [127.0520, 37.4480],
      [127.0520, 37.4420],
    ]],
  },
  {
    id: 'ilsan-lake',
    name: '일산호수공원',
    description: '고양시 일산호수공원 습지',
    center: [126.7700, 37.6680],
    areaHa: 6.0,
    currentLandUse: 'WETLAND',
    polygon: [[
      [126.7670, 37.6660],
      [126.7730, 37.6660],
      [126.7730, 37.6700],
      [126.7670, 37.6700],
      [126.7670, 37.6660],
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
  // 모든 시나리오 포함 (다중 시나리오 비교)
  const allScenarios: { type: LandUseType; label: string; color: string }[] = [
    { type: 'FOREST', label: '산림 복원', color: '#166534' },
    { type: 'WETLAND', label: '습지 조성', color: '#0ea5e9' },
    { type: 'GRASSLAND', label: '공원녹지', color: '#22c55e' },
    { type: 'AGRICULTURAL', label: '농경지', color: '#84cc16' },
    { type: 'RESIDENTIAL', label: '주거지 개발', color: '#f97316' },
    { type: 'COMMERCIAL', label: '상업지 개발', color: '#ef4444' },
    { type: 'INDUSTRIAL', label: '공업지 개발', color: '#7c3aed' },
  ];

  // 현재 유지 시나리오를 맨 앞에 추가
  const scenarios = [
    { type: currentType, label: '현재 유지', color: '#3b82f6' },
    ...allScenarios.filter(s => s.type !== currentType),
  ];

  const { CARBON_COEFFICIENTS } = require('./constants');

  return scenarios.map(s => {
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
