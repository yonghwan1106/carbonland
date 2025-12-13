'use client';

import Link from 'next/link';
import {
  Leaf,
  ArrowLeft,
  Target,
  Users,
  Lightbulb,
  Code,
  TreePine,
  Car,
  Home,
  Building2,
  Factory,
  Flower2,
  Droplets,
  Github,
  ExternalLink,
  MapPin,
  Layers,
  BarChart3,
  Download,
  Share2,
  Sparkles,
  Database,
  Zap,
  CheckCircle2,
  Play,
  Search,
  MousePointer2,
  Settings,
  FileText,
  Wheat,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* 헤더 */}
      <header className="h-12 md:h-14 bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-between px-3 md:px-4 shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-2 md:gap-3">
          <Link href="/" className="flex items-center gap-2 md:gap-3 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Leaf className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold text-white">CarbonLand</h1>
              <p className="text-[10px] md:text-xs text-green-100 -mt-0.5 hidden sm:block">탄소중립 토지이용 시뮬레이터</p>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/" className="text-xs md:text-sm text-green-100 hover:text-white transition-colors">
            시뮬레이터
          </Link>
          <span className="text-xs md:text-sm text-white font-medium hidden sm:inline">프로젝트 소개</span>
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

      {/* 메인 컨텐츠 */}
      <main className="max-w-5xl mx-auto px-3 md:px-4 py-6 md:py-8">
        {/* 뒤로가기 */}
        <Link href="/" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-4 md:mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs md:text-sm">시뮬레이터로 돌아가기</span>
        </Link>

        {/* 히어로 섹션 */}
        <section className="text-center mb-8 md:mb-12">
          <div className="flex justify-center gap-2 mb-3 md:mb-4 flex-wrap">
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
              경기 기후 바이브코딩 해커톤 2025
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs">
              경기기후플랫폼 API 연동
            </Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-2 md:mb-4">
            Carbon<span className="text-green-600">Land</span>
          </h1>
          <p className="text-base md:text-xl text-slate-600 mb-2">탄소중립 토지이용 시뮬레이터</p>
          <p className="text-xl md:text-3xl font-semibold text-green-600 mt-4 md:mt-6">
            &quot;이 땅을 개발하면, 탄소는 얼마나 변할까?&quot;
          </p>
          <p className="text-sm md:text-base text-slate-500 mt-3 md:mt-4 max-w-2xl mx-auto px-2">
            경기기후플랫폼의 실제 데이터를 활용하여 토지이용 변경에 따른
            탄소 흡수/저장/배출 변화를 실시간으로 시뮬레이션하는 의사결정 지원 도구
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/">
              <Button className="gap-2">
                <Play className="w-4 h-4" />
                시뮬레이터 시작
              </Button>
            </Link>
            <a href="https://github.com/yonghwan1106/carbonland" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                <Github className="w-4 h-4" />
                GitHub
              </Button>
            </a>
          </div>
        </section>

        {/* 핵심 특징 배너 */}
        <section className="mb-8 md:mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-0 text-white">
              <CardContent className="pt-4 pb-4 text-center">
                <Database className="w-8 h-8 mx-auto mb-2 opacity-90" />
                <p className="text-xs font-medium opacity-90">실제 API 연동</p>
                <p className="text-lg font-bold">WMS/WFS</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 border-0 text-white">
              <CardContent className="pt-4 pb-4 text-center">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-90" />
                <p className="text-xs font-medium opacity-90">AI 자동감지</p>
                <p className="text-lg font-bold">비오톱 분석</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500 to-pink-600 border-0 text-white">
              <CardContent className="pt-4 pb-4 text-center">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-90" />
                <p className="text-xs font-medium opacity-90">다중 비교</p>
                <p className="text-lg font-bold">7개 시나리오</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-500 to-red-600 border-0 text-white">
              <CardContent className="pt-4 pb-4 text-center">
                <Share2 className="w-8 h-8 mx-auto mb-2 opacity-90" />
                <p className="text-xs font-medium opacity-90">결과 공유</p>
                <p className="text-lg font-bold">PDF/이미지</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-6 md:my-8" />

        {/* 사용 방법 */}
        <section className="mb-8 md:mb-12">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <Play className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">사용 방법</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <Search className="w-4 h-4 text-green-600" />
                  위치 검색
                </h3>
                <p className="text-sm text-slate-500">
                  주소를 검색하거나 지도에서 관심 지역으로 이동
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <MousePointer2 className="w-4 h-4 text-blue-600" />
                  영역 선택
                </h3>
                <p className="text-sm text-slate-500">
                  지도에서 분석할 영역을 직접 그리거나 데모 영역 선택
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-purple-600" />
                  시나리오 설정
                </h3>
                <p className="text-sm text-slate-500">
                  토지이용 변경 시나리오와 분석 기간 설정
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500" />
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                  <span className="text-orange-600 font-bold">4</span>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-orange-600" />
                  결과 확인
                </h3>
                <p className="text-sm text-slate-500">
                  탄소 변화량 확인 후 PDF/이미지로 저장
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 해결하려는 문제 */}
        <section className="mb-8 md:mb-12">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <Target className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">해결하려는 문제</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-orange-700">탄소 영향 파악 불가</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-2">토지이용 변경 시 탄소 영향을 알 수 없음</p>
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  실시간 시뮬레이션 제공
                </div>
              </CardContent>
            </Card>
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-orange-700">전문 용역 필요</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-2">환경영향평가에 비용/시간 소요</p>
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  웹 기반 즉시 분석
                </div>
              </CardContent>
            </Card>
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-orange-700">시민 이해도 부족</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-2">개발사업의 환경 영향 불투명</p>
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  직관적 시각화
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 주요 기능 */}
        <section className="mb-8 md:mb-12">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">주요 기능</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">지도 기반 영역 선택</h3>
                    <p className="text-sm text-slate-500 mt-1">주소 검색, 직접 그리기, 데모 영역 선택 지원</p>
                    <div className="flex gap-1 mt-2">
                      <Badge variant="outline" className="text-xs">OpenLayers</Badge>
                      <Badge variant="outline" className="text-xs">Nominatim</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <Layers className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">WMS 레이어 시각화</h3>
                    <p className="text-sm text-slate-500 mt-1">탄소흡수지도, 수목/토양탄소, 비오톱 레이어</p>
                    <div className="flex gap-1 mt-2">
                      <Badge variant="outline" className="text-xs">경기기후플랫폼</Badge>
                      <Badge variant="outline" className="text-xs">WMS</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">비오톱 자동 감지</h3>
                    <p className="text-sm text-slate-500 mt-1">WFS 데이터로 선택 영역의 토지유형 자동 분석</p>
                    <div className="flex gap-1 mt-2">
                      <Badge variant="outline" className="text-xs">WFS</Badge>
                      <Badge variant="outline" className="text-xs">자동감지</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">다중 시나리오 비교</h3>
                    <p className="text-sm text-slate-500 mt-1">7개 토지이용 시나리오 동시 비교 분석</p>
                    <div className="flex gap-1 mt-2">
                      <Badge variant="outline" className="text-xs">Recharts</Badge>
                      <Badge variant="outline" className="text-xs">비교 테이블</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                    <Download className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">결과 저장/공유</h3>
                    <p className="text-sm text-slate-500 mt-1">PNG 이미지, PDF 리포트, URL 공유 지원</p>
                    <div className="flex gap-1 mt-2">
                      <Badge variant="outline" className="text-xs">html2canvas</Badge>
                      <Badge variant="outline" className="text-xs">jsPDF</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">실시간 탄소 계산</h3>
                    <p className="text-sm text-slate-500 mt-1">즉각적인 흡수/저장/배출량 계산 및 환산</p>
                    <div className="flex gap-1 mt-2">
                      <Badge variant="outline" className="text-xs">Turf.js</Badge>
                      <Badge variant="outline" className="text-xs">IPCC 계수</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 타겟 사용자 */}
        <section className="mb-8 md:mb-12">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <Users className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">타겟 사용자</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-500" />
                  공무원
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500 mb-1">니즈: 도시계획/개발허가 의사결정</p>
                <p className="text-sm text-green-600">제공 가치: 정량적 탄소 영향 근거</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Factory className="w-5 h-5 text-purple-500" />
                  개발사업자
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500 mb-1">니즈: 환경영향평가 사전검토</p>
                <p className="text-sm text-green-600">제공 가치: 빠른 사전 분석</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-500" />
                  시민
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500 mb-1">니즈: 개발사업 환경 영향 이해</p>
                <p className="text-sm text-green-600">제공 가치: 쉬운 시각화</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 탄소 계수 */}
        <section className="mb-8 md:mb-12">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <TreePine className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">토지이용별 탄소 계수</h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 font-semibold text-slate-700">토지이용</th>
                      <th className="text-right py-2 px-3 font-semibold text-slate-700">저장량 (tC/ha)</th>
                      <th className="text-right py-2 px-3 font-semibold text-slate-700">흡수량 (tC/ha/yr)</th>
                      <th className="text-right py-2 px-3 font-semibold text-slate-700">배출량 (tC/ha/yr)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-slate-50">
                      <td className="py-2 px-3 flex items-center gap-2">
                        <TreePine className="w-4 h-4 text-green-800" />
                        산림지
                      </td>
                      <td className="text-right py-2 px-3 text-green-600 font-medium">150</td>
                      <td className="text-right py-2 px-3 text-green-600">8</td>
                      <td className="text-right py-2 px-3 text-slate-400">0</td>
                    </tr>
                    <tr className="border-b hover:bg-slate-50">
                      <td className="py-2 px-3 flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-sky-500" />
                        습지
                      </td>
                      <td className="text-right py-2 px-3 text-green-600 font-medium">200</td>
                      <td className="text-right py-2 px-3 text-green-600">5</td>
                      <td className="text-right py-2 px-3 text-slate-400">0</td>
                    </tr>
                    <tr className="border-b hover:bg-slate-50">
                      <td className="py-2 px-3 flex items-center gap-2">
                        <Flower2 className="w-4 h-4 text-green-500" />
                        초지/공원
                      </td>
                      <td className="text-right py-2 px-3 text-green-600 font-medium">50</td>
                      <td className="text-right py-2 px-3 text-green-600">3</td>
                      <td className="text-right py-2 px-3 text-slate-400">0</td>
                    </tr>
                    <tr className="border-b hover:bg-slate-50">
                      <td className="py-2 px-3 flex items-center gap-2">
                        <Wheat className="w-4 h-4 text-lime-600" />
                        농경지
                      </td>
                      <td className="text-right py-2 px-3 text-green-600 font-medium">40</td>
                      <td className="text-right py-2 px-3 text-green-600">2</td>
                      <td className="text-right py-2 px-3 text-slate-400">0.5</td>
                    </tr>
                    <tr className="border-b hover:bg-slate-50">
                      <td className="py-2 px-3 flex items-center gap-2">
                        <Home className="w-4 h-4 text-orange-500" />
                        주거지
                      </td>
                      <td className="text-right py-2 px-3 text-slate-600">10</td>
                      <td className="text-right py-2 px-3 text-slate-600">0.5</td>
                      <td className="text-right py-2 px-3 text-red-500">5</td>
                    </tr>
                    <tr className="border-b hover:bg-slate-50">
                      <td className="py-2 px-3 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-red-500" />
                        상업지
                      </td>
                      <td className="text-right py-2 px-3 text-slate-600">5</td>
                      <td className="text-right py-2 px-3 text-slate-600">0.2</td>
                      <td className="text-right py-2 px-3 text-red-500">10</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-3 flex items-center gap-2">
                        <Factory className="w-4 h-4 text-violet-600" />
                        공업지
                      </td>
                      <td className="text-right py-2 px-3 text-slate-600">2</td>
                      <td className="text-right py-2 px-3 text-slate-600">0.1</td>
                      <td className="text-right py-2 px-3 text-red-500">20</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-400 mt-4">
                * 출처: IPCC LULUCF 가이드라인, 산림청 탄소흡수원 통계 기반 추정치
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 환산 지표 */}
        <section className="mb-8 md:mb-12">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <Car className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">이해하기 쉬운 환산 지표</h2>
          </div>
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <Card className="text-center">
              <CardContent className="pt-4 md:pt-6 px-2 md:px-6">
                <TreePine className="w-8 h-8 md:w-12 md:h-12 text-green-600 mx-auto mb-2 md:mb-3" />
                <p className="text-[10px] md:text-sm text-slate-500">30년생 소나무</p>
                <p className="text-sm md:text-lg font-bold text-slate-800">≈ 0.5 tC</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-4 md:pt-6 px-2 md:px-6">
                <Car className="w-8 h-8 md:w-12 md:h-12 text-orange-500 mx-auto mb-2 md:mb-3" />
                <p className="text-[10px] md:text-sm text-slate-500">승용차 연간</p>
                <p className="text-sm md:text-lg font-bold text-slate-800">≈ 4.6 tCO2</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-4 md:pt-6 px-2 md:px-6">
                <Home className="w-8 h-8 md:w-12 md:h-12 text-blue-500 mx-auto mb-2 md:mb-3" />
                <p className="text-[10px] md:text-sm text-slate-500">가구 연간</p>
                <p className="text-sm md:text-lg font-bold text-slate-800">≈ 2.5 tCO2</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 기술 스택 */}
        <section className="mb-8 md:mb-12">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <Code className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">기술 스택</h2>
          </div>
          <Card>
            <CardContent className="pt-4 md:pt-6">
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <h3 className="font-semibold text-slate-700 mb-3">프론트엔드</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Next.js 16</Badge>
                    <Badge variant="outline">React 19</Badge>
                    <Badge variant="outline">TypeScript</Badge>
                    <Badge variant="outline">Tailwind CSS 4</Badge>
                    <Badge variant="outline">shadcn/ui</Badge>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-700 mb-3">지도/분석</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">OpenLayers</Badge>
                    <Badge variant="outline">Turf.js</Badge>
                    <Badge variant="outline">proj4js</Badge>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-700 mb-3">상태관리/차트</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Zustand</Badge>
                    <Badge variant="outline">Recharts</Badge>
                    <Badge variant="outline">html2canvas</Badge>
                    <Badge variant="outline">jsPDF</Badge>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-700 mb-3">데이터 소스</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">경기기후플랫폼 API</Badge>
                    <Badge variant="outline">WMS/WFS</Badge>
                    <Badge variant="outline">Nominatim</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 데이터 출처 */}
        <section className="mb-8 md:mb-12">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <Database className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">데이터 출처</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Database className="w-4 h-4 text-green-600" />
                  경기기후플랫폼 API
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">WMS</Badge>
                    탄소흡수지도, 수목탄소, 토양탄소, 비오톱
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">WFS</Badge>
                    비오톱 대분류, 탄소흡수량, 수목탄소저장량
                  </li>
                </ul>
                <div className="mt-3 pt-3 border-t">
                  <a href="https://climate.gg.go.kr/ols" target="_blank" rel="noopener noreferrer"
                     className="text-blue-600 hover:underline flex items-center gap-1 text-sm">
                    경기기후플랫폼 Open & Share <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  탄소 계산 기준
                </h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• IPCC LULUCF 가이드라인</li>
                  <li>• 산림청 탄소흡수원 통계</li>
                  <li>• 국가 온실가스 인벤토리</li>
                  <li>• 탄소-CO2 환산계수: 3.67</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-6 md:py-8">
          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 border-0 text-white">
            <CardContent className="py-6 md:py-8 px-4">
              <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">지금 바로 시뮬레이션을 시작하세요</h2>
              <p className="text-sm md:text-base text-green-100 mb-4 md:mb-6">
                경기도 어느 땅이든, 개발과 보전의 탄소 영향을 확인할 수 있습니다.
              </p>
              <div className="flex justify-center gap-3">
                <Link href="/">
                  <Button size="default" variant="secondary" className="font-semibold text-sm md:text-base gap-2">
                    <Play className="w-4 h-4" />
                    시뮬레이터 시작하기
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="bg-slate-800 text-slate-400 py-6 md:py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs md:text-sm mb-2">
            경기 기후 바이브코딩 해커톤 2025 참가작
          </p>
          <p className="text-[10px] md:text-xs">
            데이터 출처: 경기기후플랫폼 | 탄소 계수: IPCC 가이드라인 기반
          </p>
          <div className="mt-3 md:mt-4 flex justify-center gap-4">
            <a
              href="https://github.com/yonghwan1106/carbonland"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="text-xs md:text-sm">GitHub</span>
            </a>
            <a
              href="https://climate.gg.go.kr/ols"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <Database className="w-4 h-4" />
              <span className="text-xs md:text-sm">경기기후플랫폼</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
