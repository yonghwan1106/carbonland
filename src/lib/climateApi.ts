// 경기기후플랫폼 API 유틸리티

import { CLIMATE_API } from './constants';

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
