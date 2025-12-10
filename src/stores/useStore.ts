// Zustand 전역 상태 관리

import { create } from 'zustand';
import type { SelectedArea, MapViewport, MapLayer } from '@/types';
import type { LandUseType } from '@/lib/constants';
import type { CarbonStatus, CarbonChangeResult } from '@/lib/carbonCalc';
import { MAP_CONFIG } from '@/lib/constants';
import { calculateCarbonStatus, calculateCarbonChange } from '@/lib/carbonCalc';

interface AppState {
  // 지도 상태
  viewport: MapViewport;
  layers: MapLayer[];
  selectedArea: SelectedArea | null;
  isDrawing: boolean;

  // 시뮬레이션 상태
  currentLandUse: LandUseType;
  targetLandUse: LandUseType;
  timeHorizon: number;
  currentStatus: CarbonStatus | null;
  simulationResult: CarbonChangeResult | null;

  // 지도 액션
  setViewport: (viewport: MapViewport) => void;
  toggleLayer: (layerId: string) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
  setSelectedArea: (area: SelectedArea | null) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  clearSelection: () => void;

  // 시뮬레이션 액션
  setCurrentLandUse: (type: LandUseType) => void;
  setTargetLandUse: (type: LandUseType) => void;
  setTimeHorizon: (years: number) => void;
  runSimulation: () => void;
  resetSimulation: () => void;
}

// 기본 레이어 설정
const defaultLayers: MapLayer[] = [
  {
    id: 'npp',
    name: '탄소흡수지도',
    type: 'WMS',
    layerName: 'spggcee:rst_npp',
    visible: true,
    opacity: 0.7,
  },
  {
    id: 'tree_carbon',
    name: '수목탄소저장',
    type: 'WMS',
    layerName: 'spggcee:plnt_cbn_strgat_biotop',
    visible: false,
    opacity: 0.7,
  },
  {
    id: 'soil_carbon',
    name: '토양탄소저장',
    type: 'WMS',
    layerName: 'spggcee:rst_soil_cbn_strgat_32652',
    visible: false,
    opacity: 0.7,
  },
  {
    id: 'biotop',
    name: '비오톱유형도',
    type: 'WMS',
    layerName: 'spggcee:biotop_lclsf',
    visible: false,
    opacity: 0.7,
  },
];

export const useStore = create<AppState>((set, get) => ({
  // 초기 상태
  viewport: {
    center: MAP_CONFIG.CENTER,
    zoom: MAP_CONFIG.ZOOM,
  },
  layers: defaultLayers,
  selectedArea: null,
  isDrawing: false,
  currentLandUse: 'FOREST',
  targetLandUse: 'RESIDENTIAL',
  timeHorizon: 30,
  currentStatus: null,
  simulationResult: null,

  // 지도 액션
  setViewport: (viewport) => set({ viewport }),

  toggleLayer: (layerId) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      ),
    })),

  setLayerOpacity: (layerId, opacity) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === layerId ? { ...layer, opacity } : layer
      ),
    })),

  setSelectedArea: (area) => {
    set({ selectedArea: area });
    // 영역 선택 시 현재 탄소 현황 자동 계산
    if (area) {
      const { currentLandUse } = get();
      const status = calculateCarbonStatus(currentLandUse, area.areaHa);
      set({ currentStatus: status });
    } else {
      set({ currentStatus: null, simulationResult: null });
    }
  },

  setIsDrawing: (isDrawing) => set({ isDrawing }),

  clearSelection: () =>
    set({
      selectedArea: null,
      currentStatus: null,
      simulationResult: null,
    }),

  // 시뮬레이션 액션
  setCurrentLandUse: (type) => {
    set({ currentLandUse: type });
    const { selectedArea } = get();
    if (selectedArea) {
      const status = calculateCarbonStatus(type, selectedArea.areaHa);
      set({ currentStatus: status, simulationResult: null });
    }
  },

  setTargetLandUse: (type) => {
    set({ targetLandUse: type, simulationResult: null });
  },

  setTimeHorizon: (years) => {
    set({ timeHorizon: years, simulationResult: null });
  },

  runSimulation: () => {
    const { selectedArea, currentLandUse, targetLandUse, timeHorizon } = get();
    if (!selectedArea) return;

    const result = calculateCarbonChange(
      currentLandUse,
      targetLandUse,
      selectedArea.areaHa,
      timeHorizon
    );
    set({ simulationResult: result });
  },

  resetSimulation: () =>
    set({
      simulationResult: null,
      targetLandUse: 'RESIDENTIAL',
      timeHorizon: 30,
    }),
}));
