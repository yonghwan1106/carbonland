// 프로젝트 공통 타입 정의

import type { LandUseType } from '@/lib/constants';

// 선택된 영역 정보
export interface SelectedArea {
  id: string;
  geometry: GeoJSON.Polygon;
  areaM2: number;
  areaHa: number;
  centroid: [number, number];
  bbox: [number, number, number, number];
}

// 시뮬레이션 입력
export interface SimulationInput {
  selectedArea: SelectedArea;
  currentLandUse: LandUseType;
  targetLandUse: LandUseType;
  timeHorizon: number;  // 시뮬레이션 기간 (년)
}

// 비오톱 유형별 분포
export interface BiotopBreakdown {
  typeCode: string;
  typeName: string;
  areaHa: number;
  percentage: number;
}

// 지도 레이어 설정
export interface MapLayer {
  id: string;
  name: string;
  type: 'WMS' | 'WFS' | 'WMTS';
  layerName: string;
  visible: boolean;
  opacity: number;
}

// 지도 뷰포트
export interface MapViewport {
  center: [number, number];
  zoom: number;
}

// GeoJSON 타입 (간소화)
export namespace GeoJSON {
  export interface Polygon {
    type: 'Polygon';
    coordinates: number[][][];
  }

  export interface Feature {
    type: 'Feature';
    geometry: Polygon;
    properties: Record<string, unknown>;
  }

  export interface FeatureCollection {
    type: 'FeatureCollection';
    features: Feature[];
  }
}
