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
import { getCarbonDataForArea, analyzeBiotopForArea, type CarbonDataFromAPI, type BiotopAnalysisResult } from '@/lib/climateApi';

// 비오톱 코드에 따른 색상 반환 헬퍼 함수
function getColorForBiotop(code: string): string {
  const colorMap: Record<string, string> = {
    'F': '#166534',   // 산림
    'G': '#22c55e',   // 초지
    'A': '#84cc16',   // 농경지
    'W': '#0ea5e9',   // 습지
    'R': '#f97316',   // 주거
    'C': '#ef4444',   // 상업
    'I': '#7c3aed',   // 공업
  };

  // 코드 첫 글자로 색상 결정
  const prefix = code.charAt(0).toUpperCase();
  return colorMap[prefix] || '#64748b';  // 기본 색상: slate-500
}

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

  // API 데이터 상태
  apiCarbonData: CarbonDataFromAPI | null;
  isLoadingApiData: boolean;
  dataSource: 'api' | 'mock';

  // 비오톱 자동 감지 상태
  biotopAnalysis: BiotopAnalysisResult | null;
  isAutoDetecting: boolean;
  autoDetectedLandUse: boolean; // 현재 토지이용이 자동 감지된 것인지 여부

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

  // API 데이터 액션
  fetchApiCarbonData: (bbox: [number, number, number, number], areaHa: number) => Promise<void>;

  // 비오톱 자동 감지 액션
  autoDetectBiotop: (bbox: [number, number, number, number], areaHa: number) => Promise<void>;
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

  // API 데이터 초기 상태
  apiCarbonData: null,
  isLoadingApiData: false,
  dataSource: 'mock',

  // 비오톱 자동 감지 초기 상태
  biotopAnalysis: null,
  isAutoDetecting: false,
  autoDetectedLandUse: false,

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
      const { currentLandUse, fetchApiCarbonData, autoDetectBiotop } = get();
      const status = calculateCarbonStatus(currentLandUse, area.areaHa);
      const biotopDist = generateBiotopDistribution(area.areaHa, currentLandUse);
      const scenarioComp = generateScenarioComparison(area.areaHa, currentLandUse);
      set({
        currentStatus: status,
        biotopDistribution: biotopDist,
        scenarioComparison: scenarioComp,
        dataSource: 'mock',
        autoDetectedLandUse: false,
      });

      // API 데이터 비동기 조회 시도
      if (area.bbox) {
        fetchApiCarbonData(area.bbox, area.areaHa);
        autoDetectBiotop(area.bbox, area.areaHa);
      }
    } else {
      set({
        currentStatus: null,
        simulationResult: null,
        biotopDistribution: [],
        yearlyData: [],
        scenarioComparison: [],
        apiCarbonData: null,
        dataSource: 'mock',
        biotopAnalysis: null,
        autoDetectedLandUse: false,
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
      apiCarbonData: null,
      dataSource: 'mock',
      biotopAnalysis: null,
      autoDetectedLandUse: false,
    }),

  // 프리셋 영역 선택
  selectPresetArea: (presetId) => {
    const preset = PRESET_AREAS.find(p => p.id === presetId);
    if (!preset) return;

    const bbox: [number, number, number, number] = [
      preset.polygon[0][0][0],
      preset.polygon[0][0][1],
      preset.polygon[0][2][0],
      preset.polygon[0][2][1],
    ];

    const area: SelectedArea = {
      id: preset.id,
      geometry: {
        type: 'Polygon',
        coordinates: preset.polygon,
      },
      areaM2: preset.areaHa * 10000,
      areaHa: preset.areaHa,
      centroid: preset.center,
      bbox,
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
      dataSource: 'mock',
      autoDetectedLandUse: false,
    });

    // API 데이터 비동기 조회 시도
    const { fetchApiCarbonData, autoDetectBiotop } = get();
    fetchApiCarbonData(bbox, preset.areaHa);
    autoDetectBiotop(bbox, preset.areaHa);
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

  // API 데이터 조회 액션
  fetchApiCarbonData: async (bbox, areaHa) => {
    set({ isLoadingApiData: true });

    try {
      const apiData = await getCarbonDataForArea(bbox, areaHa);

      if (apiData && apiData.featureCount > 0) {
        // API 데이터가 있으면 현재 상태 업데이트
        const { currentLandUse } = get();
        const mockStatus = calculateCarbonStatus(currentLandUse, areaHa);

        // API 데이터로 현재 상태 보정 (CarbonStatus 전체 필드 포함)
        const updatedStatus: CarbonStatus = {
          totalStorage: apiData.totalStorage || mockStatus.totalStorage,
          treeStorage: apiData.totalTreeStorage || mockStatus.treeStorage,
          soilStorage: apiData.totalSoilStorage || mockStatus.soilStorage,
          totalAbsorption: apiData.totalAbsorption || mockStatus.totalAbsorption,
          totalEmission: mockStatus.totalEmission,
          netBalance: (apiData.totalAbsorption || mockStatus.totalAbsorption) - mockStatus.totalEmission,
          areaHa: areaHa,
          landUseType: currentLandUse,
        };

        // API 비오톱 데이터를 BiotopDistribution 형태로 변환
        const apiBiotopDist: BiotopDistribution[] = apiData.biotopTypes.length > 0
          ? apiData.biotopTypes.map((bt, index) => ({
              typeCode: bt.code || `BT${index + 1}`,
              typeName: bt.type || '기타',
              areaHa: bt.area,
              percentage: bt.ratio,
              color: getColorForBiotop(bt.code),
            }))
          : generateBiotopDistribution(areaHa, currentLandUse);

        set({
          apiCarbonData: apiData,
          currentStatus: updatedStatus,
          biotopDistribution: apiBiotopDist,
          dataSource: 'api',
          isLoadingApiData: false,
        });
      } else {
        // API 데이터가 없으면 mock 데이터 유지
        set({
          apiCarbonData: null,
          dataSource: 'mock',
          isLoadingApiData: false,
        });
      }
    } catch (error) {
      console.error('API 데이터 조회 실패:', error);
      set({
        apiCarbonData: null,
        dataSource: 'mock',
        isLoadingApiData: false,
      });
    }
  },

  // 비오톱 자동 감지 액션
  autoDetectBiotop: async (bbox, areaHa) => {
    set({ isAutoDetecting: true });

    try {
      const analysis = await analyzeBiotopForArea(bbox, areaHa);

      if (analysis && analysis.featureCount > 0) {
        const { selectedArea } = get();

        // 감지된 토지이용 유형으로 상태 업데이트
        const dominantType = analysis.dominantType;
        const status = calculateCarbonStatus(dominantType, areaHa);
        const biotopDist = generateBiotopDistribution(areaHa, dominantType);
        const scenarioComp = generateScenarioComparison(areaHa, dominantType);

        set({
          biotopAnalysis: analysis,
          currentLandUse: dominantType,
          currentStatus: status,
          biotopDistribution: biotopDist,
          scenarioComparison: scenarioComp,
          isAutoDetecting: false,
          autoDetectedLandUse: true,
          simulationResult: null,
          yearlyData: [],
        });

        console.log(`비오톱 자동 감지 완료: ${analysis.dominantTypeName} (${analysis.dominantTypeRatio.toFixed(1)}%)`);
      } else {
        set({
          biotopAnalysis: null,
          isAutoDetecting: false,
          autoDetectedLandUse: false,
        });
      }
    } catch (error) {
      console.error('비오톱 자동 감지 실패:', error);
      set({
        biotopAnalysis: null,
        isAutoDetecting: false,
        autoDetectedLandUse: false,
      });
    }
  },
}));
