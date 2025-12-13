'use client';

import { useState, useCallback } from 'react';
import { useStore } from '@/stores/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Loader2, Scan } from 'lucide-react';
import type { SelectedArea } from '@/types';

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  boundingbox: string[];
}

// 좌표 주변 영역 생성 (약 200m x 200m)
const AREA_OFFSET = 0.001; // 약 100m (위도 기준)

interface AddressSearchProps {
  isMobile?: boolean;
}

export default function AddressSearch({ isMobile = false }: AddressSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const { setViewport, setSelectedArea, isAutoDetecting } = useStore();

  const searchAddress = useCallback(async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setShowResults(true);

    try {
      // OpenStreetMap Nominatim API 사용 (무료, API 키 불필요)
      // 경기도 지역 검색 강화를 위해 viewbox 사용 (경기도 범위)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=kr&viewbox=126.3,38.3,127.9,36.9&bounded=0`,
        {
          headers: {
            'Accept-Language': 'ko',
            'User-Agent': 'CarbonLand/1.0',
          },
        }
      );

      if (response.ok) {
        const data: SearchResult[] = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('주소 검색 오류:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  // 주소 선택 시 영역 생성 + 비오톱 자동 감지
  const handleSelect = async (result: SearchResult, autoDetect: boolean = false) => {
    const lon = parseFloat(result.lon);
    const lat = parseFloat(result.lat);

    setViewport({
      center: [lon, lat],
      zoom: 16,
    });

    setShowResults(false);
    setQuery(result.display_name.split(',')[0]);

    // 자동 감지 옵션이 켜져 있으면 영역 생성 + 비오톱 감지
    if (autoDetect) {
      setIsDetecting(true);

      // 좌표 중심으로 약 200m x 200m 사각형 영역 생성
      const bbox: [number, number, number, number] = [
        lon - AREA_OFFSET,
        lat - AREA_OFFSET,
        lon + AREA_OFFSET,
        lat + AREA_OFFSET,
      ];

      // 폴리곤 좌표 생성
      const polygon: [number, number][][] = [[
        [bbox[0], bbox[1]],
        [bbox[2], bbox[1]],
        [bbox[2], bbox[3]],
        [bbox[0], bbox[3]],
        [bbox[0], bbox[1]],
      ]];

      // 면적 계산 (약 4ha = 200m x 200m)
      const areaM2 = 200 * 200; // 약 4만 m²
      const areaHa = areaM2 / 10000;

      const area: SelectedArea = {
        id: `address-${Date.now()}`,
        geometry: {
          type: 'Polygon',
          coordinates: polygon,
        },
        areaM2,
        areaHa,
        centroid: [lon, lat],
        bbox,
      };

      // 영역 설정 (내부에서 자동으로 비오톱 감지 호출됨)
      setSelectedArea(area);

      // 감지 완료 대기 후 상태 업데이트
      setTimeout(() => setIsDetecting(false), 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchAddress();
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="예: 수원시 영통구 매탄동"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => results.length > 0 && setShowResults(true)}
            className={isMobile ? "text-sm placeholder:text-xs" : "placeholder:text-xs"}
          />
        </div>
        <Button
          onClick={searchAddress}
          disabled={isLoading || !query.trim()}
          size={isMobile ? "sm" : "default"}
          variant="outline"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* 검색 결과 드롭다운 */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {results.map((result, index) => (
            <div
              key={index}
              className="border-b border-slate-100 last:border-0"
            >
              {/* 주소 표시 */}
              <div className="px-3 pt-2 pb-1 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-700 line-clamp-2">
                  {result.display_name}
                </span>
              </div>
              {/* 액션 버튼들 */}
              <div className="px-3 pb-2 flex gap-2 ml-6">
                <button
                  onClick={() => handleSelect(result, false)}
                  className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                >
                  이동만
                </button>
                <button
                  onClick={() => handleSelect(result, true)}
                  disabled={isDetecting || isAutoDetecting}
                  className="text-xs px-2 py-1 rounded bg-green-100 hover:bg-green-200 text-green-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  {(isDetecting || isAutoDetecting) ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      감지 중...
                    </>
                  ) : (
                    <>
                      <Scan className="w-3 h-3" />
                      이동 + 토지 감지
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showResults && !isLoading && results.length === 0 && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 p-3">
          <p className="text-sm text-slate-500 text-center">검색 결과가 없습니다</p>
        </div>
      )}
    </div>
  );
}
