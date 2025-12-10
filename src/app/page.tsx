'use client';

import dynamic from 'next/dynamic';
import ControlPanel from '@/components/panel/ControlPanel';
import ResultPanel from '@/components/result/ResultPanel';
import { Leaf } from 'lucide-react';

// OpenLayers SSR 방지를 위한 동적 import
const MapContainer = dynamic(
  () => import('@/components/map/MapContainer'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-slate-100">
        <div className="text-slate-500">지도 로딩 중...</div>
      </div>
    ),
  }
);

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      {/* 헤더 */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">CarbonLand</h1>
          </div>
        </div>
        <div className="text-sm text-slate-500">
          탄소중립 토지이용 시뮬레이터
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 flex overflow-hidden">
        {/* 지도 영역 */}
        <div className="flex-1 relative">
          <MapContainer />

          {/* 슬로건 오버레이 */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 max-w-xs">
            <p className="text-sm font-medium text-slate-700">
              &quot;이 땅을 개발하면, 탄소는 얼마나 변할까?&quot;
            </p>
            <p className="text-xs text-slate-500 mt-1">
              지도에서 영역을 선택하고 시뮬레이션을 실행하세요
            </p>
          </div>
        </div>

        {/* 컨트롤 패널 */}
        <ControlPanel />

        {/* 결과 패널 */}
        <ResultPanel />
      </main>

      {/* 푸터 */}
      <footer className="h-8 bg-slate-100 border-t border-slate-200 flex items-center justify-center text-xs text-slate-500 shrink-0">
        <span>경기 기후 바이브코딩 해커톤 2025 | 데이터 출처: 경기기후플랫폼</span>
      </footer>
    </div>
  );
}
