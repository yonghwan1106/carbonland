'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import ControlPanel from '@/components/panel/ControlPanel';
import ResultPanel from '@/components/result/ResultPanel';
import LayerPanel from '@/components/map/LayerPanel';
import { Leaf, Github, Info, Map, Settings, BarChart3, X, Layers } from 'lucide-react';

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

type MobileTab = 'map' | 'layers' | 'control' | 'result';

export default function Home() {
  const [mobileTab, setMobileTab] = useState<MobileTab>('map');
  const [showMobilePanel, setShowMobilePanel] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      {/* 헤더 */}
      <header className="h-12 md:h-14 bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-between px-3 md:px-4 shrink-0 shadow-md">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-9 md:h-9 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <Leaf className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-white">CarbonLand</h1>
            <p className="text-[10px] md:text-xs text-green-100 -mt-0.5 hidden sm:block">탄소중립 토지이용 시뮬레이터</p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <span className="text-xs md:text-sm text-green-100 hidden lg:block">
            경기 기후 바이브코딩 해커톤 2025
          </span>
          <Link
            href="/about"
            className="flex items-center gap-1 md:gap-1.5 text-white/80 hover:text-white transition-colors text-xs md:text-sm"
          >
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">프로젝트 소개</span>
          </Link>
          <a
            href="https://github.com/yonghwan1106/carbonland"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-white/80 hover:text-white transition-colors"
          >
            <Github className="w-4 h-4 md:w-5 md:h-5" />
          </a>
        </div>
      </header>

      {/* 메인 컨텐츠 - Desktop */}
      <main className="flex-1 hidden md:flex overflow-hidden">
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

      {/* 메인 컨텐츠 - Mobile */}
      <main className="flex-1 flex flex-col md:hidden overflow-hidden relative">
        {/* 지도 영역 (항상 표시) */}
        <div className="flex-1 relative">
          <MapContainer />

          {/* 간소화된 슬로건 오버레이 - 모바일 */}
          {mobileTab === 'map' && !showMobilePanel && (
            <div className="absolute top-2 left-2 right-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-green-100">
              <p className="text-xs font-semibold text-slate-800">
                &quot;이 땅을 개발하면, 탄소는 얼마나 변할까?&quot;
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                아래 탭에서 설정 또는 결과를 확인하세요
              </p>
            </div>
          )}

          {/* 레이어 패널 - 모바일에서 숨김 */}
          <div className="hidden">
            <LayerPanel />
          </div>
        </div>

        {/* 모바일 패널 슬라이드 업 */}
        {showMobilePanel && (
          <div className="absolute inset-0 z-20 flex flex-col">
            {/* 배경 오버레이 */}
            <div
              className="flex-1 bg-black/30"
              onClick={() => setShowMobilePanel(false)}
            />

            {/* 패널 컨텐츠 */}
            <div className="bg-white rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col animate-slide-up">
              {/* 패널 헤더 */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                <h3 className="font-semibold text-slate-800">
                  {mobileTab === 'layers' ? '레이어 관리' : mobileTab === 'control' ? '컨트롤 패널' : '분석 결과'}
                </h3>
                <button
                  onClick={() => setShowMobilePanel(false)}
                  className="p-1 rounded-full hover:bg-slate-100"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* 패널 컨텐츠 */}
              <div className="flex-1 overflow-hidden">
                {mobileTab === 'layers' ? (
                  <div className="h-full overflow-y-auto p-4">
                    <LayerPanel isMobile />
                  </div>
                ) : mobileTab === 'control' ? (
                  <ControlPanel isMobile />
                ) : (
                  <ResultPanel isMobile />
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 모바일 하단 탭 네비게이션 */}
      <nav className="md:hidden h-14 bg-white border-t border-slate-200 flex items-center justify-around shrink-0 safe-area-bottom">
        <button
          onClick={() => {
            setMobileTab('map');
            setShowMobilePanel(false);
          }}
          className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors ${
            mobileTab === 'map' && !showMobilePanel
              ? 'text-green-600 bg-green-50'
              : 'text-slate-500'
          }`}
        >
          <Map className="w-5 h-5" />
          <span className="text-[10px] font-medium">지도</span>
        </button>
        <button
          onClick={() => {
            setMobileTab('layers');
            setShowMobilePanel(true);
          }}
          className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors ${
            mobileTab === 'layers' && showMobilePanel
              ? 'text-green-600 bg-green-50'
              : 'text-slate-500'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] font-medium">레이어</span>
        </button>
        <button
          onClick={() => {
            setMobileTab('control');
            setShowMobilePanel(true);
          }}
          className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors ${
            mobileTab === 'control' && showMobilePanel
              ? 'text-green-600 bg-green-50'
              : 'text-slate-500'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium">설정</span>
        </button>
        <button
          onClick={() => {
            setMobileTab('result');
            setShowMobilePanel(true);
          }}
          className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors ${
            mobileTab === 'result' && showMobilePanel
              ? 'text-green-600 bg-green-50'
              : 'text-slate-500'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] font-medium">결과</span>
        </button>
      </nav>

      {/* 푸터 - Desktop only */}
      <footer className="hidden md:flex h-8 bg-slate-800 items-center justify-center text-xs text-slate-400 shrink-0">
        <span>데이터 출처: 경기기후플랫폼 | 경기 기후 바이브코딩 해커톤 2025</span>
      </footer>
    </div>
  );
}
