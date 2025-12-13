'use client';

import { useState, useCallback } from 'react';
import { useStore } from '@/stores/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Loader2 } from 'lucide-react';

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  boundingbox: string[];
}

interface AddressSearchProps {
  isMobile?: boolean;
}

export default function AddressSearch({ isMobile = false }: AddressSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { setViewport } = useStore();

  const searchAddress = useCallback(async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setShowResults(true);

    try {
      // OpenStreetMap Nominatim API 사용 (무료, API 키 불필요)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' 경기도')}&limit=5&countrycodes=kr`,
        {
          headers: {
            'Accept-Language': 'ko',
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

  const handleSelect = (result: SearchResult) => {
    const lon = parseFloat(result.lon);
    const lat = parseFloat(result.lat);

    setViewport({
      center: [lon, lat],
      zoom: 15,
    });

    setShowResults(false);
    setQuery(result.display_name.split(',')[0]);
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
            placeholder="주소 검색 (예: 수원시 영통구)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => results.length > 0 && setShowResults(true)}
            className={isMobile ? "text-sm" : ""}
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
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleSelect(result)}
              className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-start gap-2 border-b border-slate-100 last:border-0"
            >
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <span className="text-sm text-slate-700 line-clamp-2">
                {result.display_name}
              </span>
            </button>
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
