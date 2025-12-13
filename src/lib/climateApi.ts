// 경기기후플랫폼 API 유틸리티

import { CLIMATE_API, type LandUseType } from './constants';

// API 키 (환경 변수에서 가져옴)
export const API_KEY = process.env.NEXT_PUBLIC_CLIMATE_API_KEY || '';

// WMS GetMap URL 생성
export function getWMSUrl(layerName: string): string {
  const params = new URLSearchParams({
    apiKey: API_KEY,
    SERVICE: 'WMS',
    VERSION: '1.3.0',
    REQUEST: 'GetMap',
    LAYERS: layerName,
    CRS: 'EPSG:3857',
    FORMAT: 'image/png',
    TRANSPARENT: 'TRUE',
    STYLES: '',
  });

  return `${CLIMATE_API.BASE_URL}/wms?${params.toString()}`;
}

// WMS GetCapabilities URL 생성
export function getWMSCapabilitiesUrl(): string {
  const params = new URLSearchParams({
    apiKey: API_KEY,
    SERVICE: 'WMS',
    VERSION: '1.3.0',
    REQUEST: 'GetCapabilities',
  });

  return `${CLIMATE_API.BASE_URL}/wms?${params.toString()}`;
}

// WFS GetFeature URL 생성
export function getWFSUrl(
  layerName: string,
  bbox?: number[],
  maxFeatures?: number
): string {
  const params = new URLSearchParams({
    apiKey: API_KEY,
    SERVICE: 'WFS',
    VERSION: '1.1.0',
    REQUEST: 'GetFeature',
    TYPENAMES: layerName,
    OUTPUTFORMAT: 'application/json',
  });

  if (bbox) {
    params.set('BBOX', [...bbox, 'EPSG:3857'].join(','));
  }

  if (maxFeatures) {
    params.set('MAXFEATURES', maxFeatures.toString());
  }

  return `${CLIMATE_API.BASE_URL}/wfs?${params.toString()}`;
}

// WFS 피처 조회
export async function getFeatures(
  layerName: string,
  bbox?: number[],
  maxFeatures?: number
): Promise<GeoJSON.FeatureCollection | null> {
  try {
    const url = getWFSUrl(layerName, bbox, maxFeatures);
    const response = await fetch(url);

    if (!response.ok) {
      console.error('WFS 요청 실패:', response.status, response.statusText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('WFS 피처 조회 오류:', error);
    return null;
  }
}

// OpenLayers TileWMS 소스 설정 객체 생성
export function createWMSSourceConfig(layerName: string) {
  return {
    url: `${CLIMATE_API.BASE_URL}/wms`,
    params: {
      apiKey: API_KEY,
      LAYERS: layerName,
      TILED: true,
      FORMAT: 'image/png',
      TRANSPARENT: true,
      VERSION: '1.3.0',
    },
    serverType: 'geoserver' as const,
    crossOrigin: 'anonymous',
  };
}

// 레이어별 WMS 설정
export const WMS_LAYERS = {
  npp: {
    id: 'npp',
    name: '탄소흡수지도',
    layerName: CLIMATE_API.LAYERS.NPP,
    description: '순일차생산성(NPP) 기반 탄소흡수량 (tC/ha/year)',
  },
  tree_carbon: {
    id: 'tree_carbon',
    name: '수목탄소저장',
    layerName: CLIMATE_API.LAYERS.TREE_CARBON,
    description: '수목의 지상부 바이오매스 탄소저장량 (tC/ha)',
  },
  soil_carbon: {
    id: 'soil_carbon',
    name: '토양탄소저장',
    layerName: CLIMATE_API.LAYERS.SOIL_CARBON,
    description: '토양 탄소축적량 (tC/ha)',
  },
  biotop: {
    id: 'biotop',
    name: '비오톱유형도',
    layerName: CLIMATE_API.LAYERS.BIOTOP,
    description: '토지이용 유형 분류',
  },
} as const;

// API 키 유효성 검사
export function isApiKeyValid(): boolean {
  return API_KEY.length > 0;
}

// 탄소 데이터 타입 정의
export interface CarbonDataFromAPI {
  totalAbsorption: number;      // 총 탄소흡수량 (tC/yr)
  totalTreeStorage: number;     // 수목 탄소저장량 (tC)
  totalSoilStorage: number;     // 토양 탄소저장량 (tC)
  totalStorage: number;         // 총 탄소저장량 (tC)
  featureCount: number;         // 조회된 피처 수
  dataSource: 'api' | 'mock';   // 데이터 출처
  biotopTypes: BiotopTypeData[]; // 비오톱 유형별 분포
}

export interface BiotopTypeData {
  type: string;                  // 비오톱 유형명
  code: string;                  // 비오톱 코드
  area: number;                  // 면적 (ha)
  ratio: number;                 // 비율 (%)
  carbonAbsorption: number;      // 탄소 흡수량 (tC/yr)
  carbonStorage: number;         // 탄소 저장량 (tC)
}

// EPSG:4326 (WGS84) bbox를 EPSG:5186 (Korea 2000 / Central Belt)으로 변환
// EPSG:5186 원점: 경도 127°E, 위도 38°N, False Easting 200000, False Northing 600000
function transformBboxToEPSG5186(bbox: [number, number, number, number]): number[] {
  const [minLon, minLat, maxLon, maxLat] = bbox;

  // EPSG:5186 Korea 2000 / Central Belt 파라미터
  const lonOrigin = 127.0;      // 중심 경도
  const latOrigin = 38.0;       // 원점 위도
  const falseEasting = 200000;  // False Easting
  const falseNorthing = 600000; // False Northing

  // 경기도 지역 근사 변환 계수 (TM 투영)
  const meterPerDegLon = 88804;  // cos(37.5°) * 111320
  const meterPerDegLat = 111000; // 위도 1도당 거리

  const minX = falseEasting + (minLon - lonOrigin) * meterPerDegLon;
  const minY = falseNorthing + (minLat - latOrigin) * meterPerDegLat;
  const maxX = falseEasting + (maxLon - lonOrigin) * meterPerDegLon;
  const maxY = falseNorthing + (maxLat - latOrigin) * meterPerDegLat;

  return [minX, minY, maxX, maxY];
}

// WFS 피처 조회 (EPSG:5186 좌표계 지원)
export async function getFeaturesInArea(
  layerName: string,
  bbox: [number, number, number, number],
  maxFeatures: number = 100
): Promise<GeoJSON.FeatureCollection | null> {
  try {
    // bbox를 EPSG:5186으로 변환
    const transformedBbox = transformBboxToEPSG5186(bbox);

    const params = new URLSearchParams({
      apiKey: API_KEY,
      SERVICE: 'WFS',
      VERSION: '1.1.0',
      REQUEST: 'GetFeature',
      TYPENAMES: layerName,
      OUTPUTFORMAT: 'application/json',
      BBOX: [...transformedBbox, 'EPSG:5186'].join(','),
      MAXFEATURES: maxFeatures.toString(),
      SRSNAME: 'EPSG:5186',
    });

    const url = `${CLIMATE_API.BASE_URL}/wfs?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.warn('WFS 요청 실패:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('WFS 피처 조회 오류:', error);
    return null;
  }
}

// 비오톱 코드와 이름을 LandUseType으로 매핑
// 이름(name)을 우선 사용하고, 없으면 코드(code)로 매핑
export function mapBiotopToLandUseType(biotopCode: string, biotopName?: string): LandUseType {
  // 1. 먼저 이름 기반 매핑 (가장 정확함)
  if (biotopName) {
    const name = biotopName.toUpperCase();

    // 산림 관련 (자연산림, 인공산림, 산림 등)
    if (name.includes('산림') || name.includes('FOREST') || name.includes('수림') || name.includes('임지')) {
      return 'FOREST';
    }
    // 초지/녹지 관련 (조성녹지 포함)
    if (name.includes('초지') || name.includes('녹지') || name.includes('GRASS') || name.includes('잔디')) {
      return 'GRASSLAND';
    }
    // 습지 관련 (습지가 농경지보다 먼저 체크되어야 함)
    if (name.includes('습지') || name.includes('하천') || name.includes('WET') || name.includes('수역') || name.includes('호수')) {
      return 'WETLAND';
    }
    // 농경지 관련
    if (name.includes('농경') || name.includes('밭') || name.includes('논') || name.includes('AGRI') || name.includes('경작')) {
      return 'AGRICULTURAL';
    }
    // 시가화건조지 (도시화 지역) → 주거지로 분류 (공업지 아님!)
    if (name.includes('시가화') || name.includes('건조지') || name.includes('도시')) {
      return 'RESIDENTIAL';
    }
    // 주거지 관련
    if (name.includes('주거') || name.includes('주택') || name.includes('RESI') || name.includes('아파트') || name.includes('단독')) {
      return 'RESIDENTIAL';
    }
    // 상업지 관련
    if (name.includes('상업') || name.includes('업무') || name.includes('COMM') || name.includes('상가')) {
      return 'COMMERCIAL';
    }
    // 공업지 관련 (명확히 공업/공장인 경우만)
    if (name.includes('공업') || name.includes('공장') || name.includes('INDU') || name.includes('산업단지')) {
      return 'INDUSTRIAL';
    }
  }

  // 2. 코드 기반 매핑 (이름이 없거나 매칭 안된 경우)
  const codePrefix = biotopCode.substring(0, 1).toUpperCase();
  const fullCode = biotopCode.toUpperCase();

  // 경기도 비오톱 대분류 코드 매핑
  // A: 자연산림, B: 인공산림, C: 자연초지, D: 인공초지
  // E: 하천습지, F: 호소습지, G: 농경지
  // H: 조성녹지, I: 시가화건조지 (도시지역, 공업지 아님!)
  switch (codePrefix) {
    case 'A': // 자연산림
    case 'B': // 인공산림
      return 'FOREST';
    case 'C': // 자연초지
    case 'D': // 인공초지
    case 'H': // 조성녹지
      return 'GRASSLAND';
    case 'E': // 하천습지
    case 'F': // 호소습지
      return 'WETLAND';
    case 'G': // 농경지
      return 'AGRICULTURAL';
    case 'I': // 시가화건조지 → 주거지 (일반 도시지역)
      return 'RESIDENTIAL';
  }

  // 숫자 코드 기반 매핑 (비오톱 대분류 코드)
  if (/^[1-9]/.test(biotopCode)) {
    const numCode = parseInt(biotopCode.charAt(0));
    switch (numCode) {
      case 1: // 산림
      case 2: // 녹지
        return 'FOREST';
      case 3: // 초지
        return 'GRASSLAND';
      case 4: // 농경지
        return 'AGRICULTURAL';
      case 5: // 습지
        return 'WETLAND';
      case 6: // 주거
        return 'RESIDENTIAL';
      case 7: // 상업/업무
        return 'COMMERCIAL';
      case 8: // 공업
        return 'INDUSTRIAL';
    }
  }

  // 기본값: 초지
  return 'GRASSLAND';
}

// 비오톱 분석 결과 타입
export interface BiotopAnalysisResult {
  dominantType: LandUseType;
  dominantTypeName: string;
  dominantTypeRatio: number;
  allTypes: Array<{
    type: LandUseType;
    typeName: string;
    area: number;
    ratio: number;
  }>;
  featureCount: number;
  dataSource: 'api' | 'mock';
}

// 선택 영역의 비오톱 분석 (주요 토지이용 유형 감지)
export async function analyzeBiotopForArea(
  bbox: [number, number, number, number],
  areaHa: number
): Promise<BiotopAnalysisResult | null> {
  if (!isApiKeyValid()) {
    console.log('API 키 없음 - 비오톱 자동 감지 불가');
    return null;
  }

  try {
    // 비오톱 대분류 레이어에서 피처 조회
    const biotopFeatures = await getFeaturesInArea(
      CLIMATE_API.WFS_LAYERS.BIOTOP_LARGE,
      bbox,
      100
    );

    if (!biotopFeatures?.features?.length) {
      console.log('비오톱 피처 없음');
      return null;
    }

    // 토지이용 유형별 면적 집계
    const typeAreas = new Map<LandUseType, { area: number; name: string }>();

    for (const feature of biotopFeatures.features) {
      const props = feature.properties as Record<string, unknown>;

      // 비오톱 코드 및 이름 추출 (다양한 속성명 지원)
      const biotopCode = String(
        props.lclsf_cd || props.biotop_cd || props.code || ''
      );
      const biotopName = String(
        props.lclsf_nm || props.biotop_nm || props.name || '기타'
      );
      const featureArea = Number(props.biotop_area || props.area || props.shp_area || 0) / 10000; // m² -> ha

      if (!biotopCode && !biotopName) continue;

      // 코드와 이름 둘 다 전달하여 정확한 매핑
      const landUseType = mapBiotopToLandUseType(biotopCode, biotopName);

      if (typeAreas.has(landUseType)) {
        const existing = typeAreas.get(landUseType)!;
        existing.area += featureArea;
      } else {
        typeAreas.set(landUseType, {
          area: featureArea,
          name: biotopName,
        });
      }
    }

    // 면적 기준 정렬
    const sortedTypes = Array.from(typeAreas.entries())
      .map(([type, data]) => ({
        type,
        typeName: data.name,
        area: data.area,
        ratio: areaHa > 0 ? (data.area / areaHa) * 100 : 0,
      }))
      .sort((a, b) => b.area - a.area);

    if (sortedTypes.length === 0) {
      return null;
    }

    const dominant = sortedTypes[0];

    console.log(`비오톱 자동 감지: ${dominant.typeName} (${dominant.ratio.toFixed(1)}%)`);

    return {
      dominantType: dominant.type,
      dominantTypeName: dominant.typeName,
      dominantTypeRatio: dominant.ratio,
      allTypes: sortedTypes,
      featureCount: biotopFeatures.features.length,
      dataSource: 'api',
    };
  } catch (error) {
    console.error('비오톱 분석 오류:', error);
    return null;
  }
}

// 선택 영역의 탄소 데이터 조회
export async function getCarbonDataForArea(
  bbox: [number, number, number, number],
  areaHa: number
): Promise<CarbonDataFromAPI | null> {
  if (!isApiKeyValid()) {
    console.log('API 키 없음 - mock 데이터 사용');
    return null;
  }

  try {
    // 비오톱 탄소흡수량 레이어 조회
    const biotopFeatures = await getFeaturesInArea(
      CLIMATE_API.WFS_LAYERS.BIOTOP_CARBON,
      bbox,
      200
    );

    // 수목 탄소저장량 레이어 조회
    const treeFeatures = await getFeaturesInArea(
      CLIMATE_API.WFS_LAYERS.TREE_CARBON,
      bbox,
      200
    );

    // 피처가 없으면 null 반환 (mock 데이터 사용하도록)
    if (!biotopFeatures?.features?.length && !treeFeatures?.features?.length) {
      console.log('WFS 피처 없음 - mock 데이터 사용');
      return null;
    }

    // 데이터 집계
    let totalAbsorption = 0;
    let totalTreeStorage = 0;
    let totalSoilStorage = 0;
    const biotopMap = new Map<string, BiotopTypeData>();

    // 비오톱 탄소흡수량 데이터 처리
    if (biotopFeatures?.features) {
      for (const feature of biotopFeatures.features) {
        const props = feature.properties as Record<string, unknown>;

        // 탄소 흡수량 속성 (레이어마다 속성명이 다를 수 있음)
        const absorption = Number(props.cbn_abpvl || props.sqmt1_npp || props.npp || props.absorption || 0);
        const area = Number(props.biotop_area || props.area || props.shp_area || 0) / 10000; // m² -> ha
        const biotopCode = String(props.biotop_cd || props.code || 'UNKNOWN');
        const biotopName = String(props.biotop_nm || props.name || '기타');

        totalAbsorption += absorption * area;

        // 비오톱 유형별 집계
        if (biotopMap.has(biotopCode)) {
          const existing = biotopMap.get(biotopCode)!;
          existing.area += area;
          existing.carbonAbsorption += absorption * area;
        } else {
          biotopMap.set(biotopCode, {
            type: biotopName,
            code: biotopCode,
            area: area,
            ratio: 0,
            carbonAbsorption: absorption * area,
            carbonStorage: 0,
          });
        }
      }
    }

    // 수목 탄소저장량 데이터 처리
    if (treeFeatures?.features) {
      for (const feature of treeFeatures.features) {
        const props = feature.properties as Record<string, unknown>;

        const treeStorage = Number(props.cbn_strgat || props.sqmt1_cbn_strgat || props.plnt_cbn_strgat || props.tree_carbon || props.storage || 0);
        const soilStorage = Number(props.soil_cbn_strgat || props.soil_carbon || 0);
        const area = Number(props.biotop_area || props.area || props.shp_area || 0) / 10000; // m² -> ha
        const biotopCode = String(props.biotop_cd || props.code || 'UNKNOWN');

        totalTreeStorage += treeStorage * area;
        totalSoilStorage += soilStorage * area;

        // 비오톱 유형별 저장량 업데이트
        if (biotopMap.has(biotopCode)) {
          const existing = biotopMap.get(biotopCode)!;
          existing.carbonStorage += (treeStorage + soilStorage) * area;
        }
      }
    }

    // 비율 계산
    const biotopTypes = Array.from(biotopMap.values()).map(bt => ({
      ...bt,
      ratio: areaHa > 0 ? (bt.area / areaHa) * 100 : 0,
    })).sort((a, b) => b.area - a.area);

    const totalStorage = totalTreeStorage + totalSoilStorage;
    const featureCount = (biotopFeatures?.features?.length || 0) + (treeFeatures?.features?.length || 0);

    console.log(`WFS 데이터 조회 완료: ${featureCount}개 피처, 흡수량=${totalAbsorption.toFixed(2)}tC/yr, 저장량=${totalStorage.toFixed(2)}tC`);

    return {
      totalAbsorption,
      totalTreeStorage,
      totalSoilStorage,
      totalStorage,
      featureCount,
      dataSource: 'api',
      biotopTypes,
    };
  } catch (error) {
    console.error('탄소 데이터 조회 오류:', error);
    return null;
  }
}
