'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useStore } from '@/stores/useStore';
import { MAP_CONFIG, CARBON_COEFFICIENTS } from '@/lib/constants';
import { m2ToHa } from '@/lib/carbonCalc';

// OpenLayers 타입
import type OlMap from 'ol/Map';
import type { Draw as OlDraw } from 'ol/interaction';
import type { Vector as OlVectorSource } from 'ol/source';
import type { Feature as OlFeature } from 'ol';

export default function MapContainer() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<OlMap | null>(null);
  const drawRef = useRef<OlDraw | null>(null);
  const vectorSourceRef = useRef<OlVectorSource | null>(null);
  const presetLayerRef = useRef<OlVectorSource | null>(null);

  const [isMapReady, setIsMapReady] = useState(false);
  const {
    isDrawing,
    setSelectedArea,
    setIsDrawing,
    layers,
    viewport,
    selectedArea,
    presetAreas
  } = useStore();

  // OpenLayers 모듈 동적 로드 및 지도 초기화
  useEffect(() => {
    if (mapInstanceRef.current) return;

    const initMap = async () => {
      try {
        console.log('initMap started');
        const { default: OlMap } = await import('ol/Map');
        const { default: View } = await import('ol/View');
        const { Tile: TileLayer, Vector: VectorLayer } = await import('ol/layer');
        const { OSM, Vector: VectorSource } = await import('ol/source');
        const { Style, Fill, Stroke } = await import('ol/style');
        const { fromLonLat } = await import('ol/proj');
        console.log('All imports done');

        if (!mapRef.current) {
          console.log('mapRef.current is null');
          return;
        }

        // 프리셋 영역 소스
        const presetSource = new VectorSource();
        presetLayerRef.current = presetSource;

        // 프리셋 영역 스타일 함수 생성
        const createPresetStyle = (isSelected: boolean, color: string) => {
          return new Style({
            fill: new Fill({
              color: isSelected ? `${color}40` : `${color}20`,
            }),
            stroke: new Stroke({
              color: isSelected ? color : `${color}99`,
              width: isSelected ? 3 : 2,
              lineDash: isSelected ? undefined : [5, 5],
            }),
          });
        };

        // 프리셋 영역 레이어 (데모 지역 표시)
        const presetLayer = new VectorLayer({
          source: presetSource,
          style: (feature) => {
            const isSelected = feature.get('isSelected');
            const landUseType = feature.get('landUseType');
            const color = CARBON_COEFFICIENTS[landUseType as keyof typeof CARBON_COEFFICIENTS]?.color || '#3b82f6';
            return createPresetStyle(isSelected, color);
          },
        });

        // 벡터 소스 (직접 선택 영역용)
        const vectorSource = new VectorSource();
        vectorSourceRef.current = vectorSource;

        // 벡터 레이어 (선택 영역 표시)
        const vectorLayer = new VectorLayer({
          source: vectorSource,
          style: new Style({
            fill: new Fill({
              color: 'rgba(34, 197, 94, 0.3)',
            }),
            stroke: new Stroke({
              color: '#16a34a',
              width: 3,
            }),
          }),
        });

        // 지도 생성
        const map = new OlMap({
          target: mapRef.current,
          layers: [
            new TileLayer({
              source: new OSM(),
            }),
            presetLayer,
            vectorLayer,
          ],
          view: new View({
            center: fromLonLat(MAP_CONFIG.CENTER),
            zoom: MAP_CONFIG.ZOOM,
            minZoom: MAP_CONFIG.MIN_ZOOM,
            maxZoom: MAP_CONFIG.MAX_ZOOM,
          }),
        });

        mapInstanceRef.current = map;
        console.log('Map created successfully');
        setIsMapReady(true);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 드로잉 인터랙션 관리
  useEffect(() => {
    if (!mapInstanceRef.current || !vectorSourceRef.current || !isMapReady) return;

    const setupDrawing = async () => {
      const { Draw } = await import('ol/interaction');
      const { toLonLat } = await import('ol/proj');
      const { getArea } = await import('ol/sphere');
      const { Polygon } = await import('ol/geom');

      const map = mapInstanceRef.current!;

      // 기존 드로잉 인터랙션 제거
      if (drawRef.current) {
        map.removeInteraction(drawRef.current);
        drawRef.current = null;
      }

      if (isDrawing) {
        const draw = new Draw({
          source: vectorSourceRef.current!,
          type: 'Polygon',
        });

        draw.on('drawend', (event) => {
          const feature = event.feature;
          const geometry = feature.getGeometry();

          if (geometry && geometry instanceof Polygon) {
            // 면적 계산
            const areaM2 = getArea(geometry);
            const coords = geometry.getCoordinates();

            // 중심점 계산
            const extent = geometry.getExtent();
            const centerX = (extent[0] + extent[2]) / 2;
            const centerY = (extent[1] + extent[3]) / 2;
            const centroid = toLonLat([centerX, centerY]) as [number, number];

            // bbox 계산
            const bbox = [
              ...toLonLat([extent[0], extent[1]]),
              ...toLonLat([extent[2], extent[3]]),
            ] as [number, number, number, number];

            // GeoJSON 좌표로 변환
            const geoJsonCoords = coords.map(ring =>
              ring.map(coord => toLonLat(coord))
            );

            setSelectedArea({
              id: `area-${Date.now()}`,
              geometry: {
                type: 'Polygon',
                coordinates: geoJsonCoords,
              },
              areaM2,
              areaHa: m2ToHa(areaM2),
              centroid,
              bbox,
            });

            setIsDrawing(false);
          }
        });

        map.addInteraction(draw);
        drawRef.current = draw;
      }
    };

    setupDrawing();
  }, [isDrawing, isMapReady, setSelectedArea, setIsDrawing]);

  // 레이어 표시/숨김 관리 (향후 WMS 레이어 추가 시 사용)
  useEffect(() => {
    // TODO: API 키 설정 후 WMS 레이어 추가
  }, [layers]);

  // 프리셋 영역 표시
  useEffect(() => {
    if (!isMapReady || !presetLayerRef.current) return;

    const loadPresets = async () => {
      const { Feature } = await import('ol');
      const { Polygon } = await import('ol/geom');
      const { fromLonLat } = await import('ol/proj');

      const source = presetLayerRef.current!;
      source.clear();

      presetAreas.forEach((preset) => {
        // 좌표 변환 (lon/lat -> map projection)
        const coords = preset.polygon[0].map((coord) => fromLonLat(coord));

        const feature = new Feature({
          geometry: new Polygon([coords]),
          id: preset.id,
          name: preset.name,
          landUseType: preset.currentLandUse,
          isSelected: selectedArea?.id === preset.id,
        });

        feature.setId(preset.id);
        source.addFeature(feature);
      });
    };

    loadPresets();
  }, [isMapReady, presetAreas, selectedArea?.id]);

  // 뷰포트 변경 시 지도 이동
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    const updateView = async () => {
      const { fromLonLat } = await import('ol/proj');
      const view = mapInstanceRef.current!.getView();
      view.animate({
        center: fromLonLat(viewport.center),
        zoom: viewport.zoom,
        duration: 500,
      });
    };

    updateView();
  }, [viewport, isMapReady]);

  // 선택 영역 변경 시 프리셋 레이어 업데이트
  useEffect(() => {
    if (!presetLayerRef.current) return;

    const source = presetLayerRef.current;
    source.getFeatures().forEach((feature) => {
      feature.set('isSelected', feature.getId() === selectedArea?.id);
    });
  }, [selectedArea?.id]);

  return (
    <div className="relative w-full h-full">
      {/* 지도 컨테이너 - 항상 렌더링되어야 함 */}
      <div ref={mapRef} className="w-full h-full" />

      {/* 로딩 오버레이 */}
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <div className="animate-pulse text-slate-500 flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-green-500 rounded-full animate-spin" />
            <span>지도 로딩 중...</span>
          </div>
        </div>
      )}

      {/* 지도 범례 */}
      {isMapReady && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 text-xs">
          <div className="font-medium text-slate-700 mb-2">범례</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 border-2 border-dashed border-green-600 bg-green-600/20 rounded-sm" />
              <span className="text-slate-600">데모 영역</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 border-2 border-green-600 bg-green-600/30 rounded-sm" />
              <span className="text-slate-600">선택된 영역</span>
            </div>
          </div>
        </div>
      )}

      {/* 드로잉 모드 안내 */}
      {isDrawing && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium">
          지도에서 다각형을 그려주세요 (클릭으로 꼭지점, 더블클릭으로 완료)
        </div>
      )}
    </div>
  );
}
