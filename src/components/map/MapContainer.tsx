'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/stores/useStore';
import { MAP_CONFIG } from '@/lib/constants';
import { m2ToHa } from '@/lib/carbonCalc';

// OpenLayers 타입
import type OlMap from 'ol/Map';
import type { Draw as OlDraw } from 'ol/interaction';
import type { Vector as OlVectorSource } from 'ol/source';

export default function MapContainer() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<OlMap | null>(null);
  const drawRef = useRef<OlDraw | null>(null);
  const vectorSourceRef = useRef<OlVectorSource | null>(null);

  const [isMapReady, setIsMapReady] = useState(false);
  const { isDrawing, setSelectedArea, setIsDrawing, layers } = useStore();

  // OpenLayers 모듈 동적 로드 및 지도 초기화
  useEffect(() => {
    if (mapInstanceRef.current) return;

    const initMap = async () => {
      const { default: OlMap } = await import('ol/Map');
      const { default: View } = await import('ol/View');
      const { Tile: TileLayer, Vector: VectorLayer } = await import('ol/layer');
      const { OSM, Vector: VectorSource } = await import('ol/source');
      const { Style, Fill, Stroke } = await import('ol/style');
      const { fromLonLat } = await import('ol/proj');

      if (!mapRef.current) return;

      // 벡터 소스 (선택 영역용)
      const vectorSource = new VectorSource();
      vectorSourceRef.current = vectorSource;

      // 벡터 레이어 (선택 영역 표시)
      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          fill: new Fill({
            color: 'rgba(34, 197, 94, 0.2)',
          }),
          stroke: new Stroke({
            color: '#22c55e',
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
      setIsMapReady(true);
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

  if (!isMapReady) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100">
        <div className="text-slate-500">지도 로딩 중...</div>
      </div>
    );
  }

  return (
    <div ref={mapRef} className="w-full h-full" />
  );
}
