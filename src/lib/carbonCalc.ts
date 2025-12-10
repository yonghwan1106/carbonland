// 탄소 계산 로직

import {
  CARBON_COEFFICIENTS,
  CONVERSION_FACTORS,
  type LandUseType
} from './constants';

// 타입 정의
export interface CarbonStatus {
  totalStorage: number;       // 총 탄소저장량 (tC)
  treeStorage: number;        // 수목 탄소저장량 (tC)
  soilStorage: number;        // 토양 탄소저장량 (tC)
  totalAbsorption: number;    // 연간 총 탄소흡수량 (tC/year)
  totalEmission: number;      // 연간 총 탄소배출량 (tC/year)
  netBalance: number;         // 순 탄소수지 (tC/year)
  areaHa: number;             // 면적 (ha)
  landUseType: LandUseType;   // 토지이용 유형
}

export interface CarbonChangeResult {
  // 탄소 변화량
  immediateEmission: number;      // 토지전환 시 즉시 배출 (tC)
  annualAbsorptionChange: number; // 연간 흡수량 변화 (tC/year)
  annualEmissionChange: number;   // 연간 배출량 변화 (tC/year)
  netAnnualChange: number;        // 순 연간 변화 (tC/year)
  cumulativeChange: number;       // 설정 기간 누적 변화 (tC)

  // CO2 환산
  cumulativeChangeCO2: number;    // 누적 변화량 CO2 환산 (tCO2)

  // 이해하기 쉬운 환산값
  equivalentTrees: number;        // 30년생 소나무 환산 (그루)
  equivalentCars: number;         // 승용차 연간 배출량 환산 (대)
  equivalentHouseholds: number;   // 가구 연간 배출량 환산 (가구)

  // 비교 정보
  beforeStatus: CarbonStatus;
  afterStatus: CarbonStatus;
}

/**
 * 특정 토지이용 유형의 탄소 현황 계산
 */
export function calculateCarbonStatus(
  landUseType: LandUseType,
  areaHa: number
): CarbonStatus {
  const coef = CARBON_COEFFICIENTS[landUseType];

  const treeStorage = coef.storage * 0.7 * areaHa;  // 수목 70%
  const soilStorage = coef.storage * 0.3 * areaHa;  // 토양 30%
  const totalStorage = coef.storage * areaHa;
  const totalAbsorption = coef.absorption * areaHa;
  const totalEmission = coef.emission * areaHa;
  const netBalance = totalAbsorption - totalEmission;

  return {
    totalStorage,
    treeStorage,
    soilStorage,
    totalAbsorption,
    totalEmission,
    netBalance,
    areaHa,
    landUseType,
  };
}

/**
 * 토지이용 변경에 따른 탄소 변화량 계산
 */
export function calculateCarbonChange(
  currentType: LandUseType,
  newType: LandUseType,
  areaHa: number,
  years: number = 30
): CarbonChangeResult {
  const current = CARBON_COEFFICIENTS[currentType];
  const future = CARBON_COEFFICIENTS[newType];

  // 현재 및 미래 탄소 현황
  const beforeStatus = calculateCarbonStatus(currentType, areaHa);
  const afterStatus = calculateCarbonStatus(newType, areaHa);

  // 즉시 배출량 (토지 전환 시 방출되는 저장 탄소의 50%)
  const storageLoss = Math.max(0, current.storage - future.storage) * areaHa;
  const immediateEmission = storageLoss * 0.5;

  // 연간 흡수량 변화
  const annualAbsorptionChange = (future.absorption - current.absorption) * areaHa;

  // 연간 배출량 변화
  const annualEmissionChange = (future.emission - current.emission) * areaHa;

  // 순 연간 변화
  const netAnnualChange = annualAbsorptionChange - annualEmissionChange;

  // 누적 탄소 변화 (N년간)
  const cumulativeChange = netAnnualChange * years - immediateEmission;

  // CO2 환산
  const cumulativeChangeCO2 = cumulativeChange * CONVERSION_FACTORS.C_TO_CO2;

  // 이해하기 쉬운 환산값 계산
  const absCumulativeC = Math.abs(cumulativeChange);
  const absCumulativeCO2 = Math.abs(cumulativeChangeCO2);

  return {
    immediateEmission,
    annualAbsorptionChange,
    annualEmissionChange,
    netAnnualChange,
    cumulativeChange,
    cumulativeChangeCO2,
    equivalentTrees: Math.round(absCumulativeC / CONVERSION_FACTORS.TREE_CARBON_30Y),
    equivalentCars: Math.round(absCumulativeCO2 / CONVERSION_FACTORS.CAR_ANNUAL_CO2),
    equivalentHouseholds: Math.round(absCumulativeCO2 / CONVERSION_FACTORS.HOUSEHOLD_ANNUAL_CO2),
    beforeStatus,
    afterStatus,
  };
}

/**
 * 숫자 포맷팅 (천 단위 구분)
 */
export function formatNumber(num: number, decimals: number = 0): string {
  return num.toLocaleString('ko-KR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * 면적 변환 (m² → ha)
 */
export function m2ToHa(m2: number): number {
  return m2 / 10000;
}

/**
 * 면적 변환 (ha → m²)
 */
export function haToM2(ha: number): number {
  return ha * 10000;
}
