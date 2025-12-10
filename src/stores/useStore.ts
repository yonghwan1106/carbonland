// Zustand 전역 상태 관리

import { create } from 'zustand';
import type { SelectedArea, MapViewport, MapLayer } from '@/types';
import type { LandUseType } from '@/lib/constants';
import type { CarbonStatus, CarbonChangeResult } from '@/lib/carbonCalc';
import { MAP_CONFIG } from '@/lib/constants';
import { calculateCarbonStatus, calculateCarbonChange } from '@/lib/carbonCalc';
import {
  PRESET_AREAS,
  generateBiotopDistribution,
  generateYearlyData,
  generateScenarioComparison,
  type PresetArea,
  type BiotopDistribution,
  type YearlyCarbonData,
  type ScenarioComparisonData,
} from '@/lib/mockData';

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

  // Mock 데이터 상태
  presetAreas: PresetArea[];
  biotopDistribution: BiotopDistribution[];
  yearlyData: YearlyCarbonData[];
  scenarioComparison: ScenarioComparisonData[];

  // 지도 액션
  setViewport: (viewport: MapViewport) => void;
  toggleLayer: (layerId: string) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
  setSelectedArea: (area: SelectedArea | null) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  clearSelection: () => void;

  // 프리셋 영역 액션
  selectPresetArea: (presetId: string) => void;

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

  // Mock 데이터 초기 상태
  presetAreas: PRESET_AREAS,
  biotopDistribution: [],
  yearlyData: [],
  scenarioComparison: [],

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
      const biotopDist = generateBiotopDistribution(area.areaHa, currentLandUse);
      const scenarioComp = generateScenarioComparison(area.areaHa, currentLandUse);
      set({
        currentStatus: status,
        biotopDistribution: biotopDist,
        scenarioComparison: scenarioComp,
      });
    } else {
      set({
        currentStatus: null,
        simulationResult: null,
        biotopDistribution: [],
        yearlyData: [],
        scenarioComparison: [],
      });
    }
  },

  setIsDrawing: (isDrawing) => set({ isDrawing }),

  clearSelection: () =>
    set({
      selectedArea: null,
      currentStatus: null,
      simulationResult: null,
      biotopDistribution: [],
      yearlyData: [],
      scenarioComparison: [],
    }),

  // 프리셋 영역 선택
  selectPresetArea: (presetId) => {
    const preset = PRESET_AREAS.find(p => p.id === presetId);
    if (!preset) return;

    const area: SelectedArea = {
      id: preset.id,
      geometry: {
        type: 'Polygon',
        coordinates: preset.polygon,
      },
      areaM2: preset.areaHa * 10000,
      areaHa: preset.areaHa,
      centroid: preset.center,
      bbox: [
        preset.polygon[0][0][0],
        preset.polygon[0][0][1],
        preset.polygon[0][2][0],
        preset.polygon[0][2][1],
      ] as [number, number, number, number],
    };

    const status = calculateCarbonStatus(preset.currentLandUse, preset.areaHa);
    const biotopDist = generateBiotopDistribution(preset.areaHa, preset.currentLandUse);
    const scenarioComp = generateScenarioComparison(preset.areaHa, preset.currentLandUse);

    set({
      selectedArea: area,
      currentLandUse: preset.currentLandUse,
      currentStatus: status,
      biotopDistribution: biotopDist,
      scenarioComparison: scenarioComp,
      simulationResult: null,
      yearlyData: [],
      viewport: {
        center: preset.center,
        zoom: 14,
      },
    });
  },

  // 시뮬레이션 액션
  setCurrentLandUse: (type) => {
    set({ currentLandUse: type });
    const { selectedArea } = get();
    if (selectedArea) {
      const status = calculateCarbonStatus(type, selectedArea.areaHa);
      const biotopDist = generateBiotopDistribution(selectedArea.areaHa, type);
      const scenarioComp = generateScenarioComparison(selectedArea.areaHa, type);
      set({
        currentStatus: status,
        simulationResult: null,
        biotopDistribution: biotopDist,
        scenarioComparison: scenarioComp,
        yearlyData: [],
      });
    }
  },

  setTargetLandUse: (type) => {
    set({ targetLandUse: type, simulationResult: null, yearlyData: [] });
  },

  setTimeHorizon: (years) => {
    set({ timeHorizon: years, simulationResult: null, yearlyData: [] });
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

    // 연도별 시계열 데이터 생성
    const yearlyData = generateYearlyData(
      result.immediateEmission,
      result.netAnnualChange,
      result.beforeStatus.totalStorage,
      result.afterStatus.totalStorage,
      timeHorizon
    );

    set({ simulationResult: result, yearlyData });
  },

  resetSimulation: () =>
    set({
      simulationResult: null,
      targetLandUse: 'RESIDENTIAL',
      timeHorizon: 30,
      yearlyData: [],
    }),
}));
