'use client';

import dynamic from 'next/dynamic';
import ControlPanel from '@/components/panel/ControlPanel';
import ResultPanel from '@/components/result/ResultPanel';
import LayerPanel from '@/components/map/LayerPanel';
import { Leaf, Github } from 'lucide-react';

// OpenLayers SSR 방지를 위한 동적 import
const MapContainer = dynamic(
  () => import('@/components/map/MapContainer'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-slate-100">
        <div className="animate-pulse text-slate-500 flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-green-500 rounded-full animate-spin" />
          <span>지도 로딩 중...</span>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      {/* 헤더 */}
      <header className="h-14 bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-between px-4 shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">CarbonLand</h1>
            <p className="text-xs text-green-100 -mt-0.5">탄소중립 토지이용 시뮬레이터</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-green-100 hidden sm:block">
            경기 기후 바이브코딩 해커톤 2025
          </span>
          <a
            href="https://github.com/yonghwan1106/carbonland"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-white/80 hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 flex overflow-hidden">
        {/* 지도 영역 */}
        <div className="flex-1 relative">
          <MapContainer />

          {/* 슬로건 오버레이 */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-xs border border-green-100">
            <p className="text-sm font-semibold text-slate-800">
              &quot;이 땅을 개발하면, 탄소는 얼마나 변할까?&quot;
            </p>
            <p className="text-xs text-slate-500 mt-2">
              오른쪽 패널에서 데모 영역을 선택하거나<br />
              직접 영역을 그려 시뮬레이션하세요
            </p>
          </div>

          {/* 레이어 패널 */}
          <LayerPanel />
        </div>

        {/* 컨트롤 패널 */}
        <ControlPanel />

        {/* 결과 패널 */}
        <ResultPanel />
      </main>

      {/* 푸터 */}
      <footer className="h-8 bg-slate-800 flex items-center justify-center text-xs text-slate-400 shrink-0">
        <span>데이터 출처: 경기기후플랫폼 | Mock 데이터 사용 중</span>
      </footer>
    </div>
  );
}
