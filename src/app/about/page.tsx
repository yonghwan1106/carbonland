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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* 헤더 */}
      <header className="h-14 bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-between px-4 shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">CarbonLand</h1>
              <p className="text-xs text-green-100 -mt-0.5">탄소중립 토지이용 시뮬레이터</p>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-green-100 hover:text-white transition-colors">
            시뮬레이터
          </Link>
          <span className="text-sm text-white font-medium">프로젝트 소개</span>
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
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* 뒤로가기 */}
        <Link href="/" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">시뮬레이터로 돌아가기</span>
        </Link>

        {/* 히어로 섹션 */}
        <section className="text-center mb-12">
          <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
            경기 기후 바이브코딩 해커톤 2025
          </Badge>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            CarbonLand
          </h1>
          <p className="text-xl text-slate-600 mb-2">탄소중립 토지이용 시뮬레이터</p>
          <p className="text-2xl font-semibold text-green-600 mt-6">
            &quot;이 땅을 개발하면, 탄소는 얼마나 변할까?&quot;
          </p>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            개발/보전 계획에 따른 탄소 흡수/저장/배출 변화를 시뮬레이션하는 의사결정 지원 도구
          </p>
        </section>

        <Separator className="my-8" />

        {/* 해결하려는 문제 */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-slate-800">해결하려는 문제</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-orange-700">탄소 영향 파악 불가</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-2">토지이용 변경 시 탄소 영향을 알 수 없음</p>
                <p className="text-sm text-green-600 font-medium">→ 실시간 시뮬레이션 제공</p>
              </CardContent>
            </Card>
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-orange-700">전문 용역 필요</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-2">환경영향평가에 비용/시간 소요</p>
                <p className="text-sm text-green-600 font-medium">→ 웹 기반 즉시 분석</p>
              </CardContent>
            </Card>
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-orange-700">시민 이해도 부족</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-2">개발사업의 환경 영향 불투명</p>
                <p className="text-sm text-green-600 font-medium">→ 직관적 시각화</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 타겟 사용자 */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-slate-800">타겟 사용자</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
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

        {/* 주요 기능 */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-slate-800">주요 기능</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <span className="text-green-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">지도 기반 영역 선택</h3>
                    <p className="text-sm text-slate-500 mt-1">지도에서 분석할 토지 영역을 자유롭게 선택</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <span className="text-green-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">현재 탄소 현황 조회</h3>
                    <p className="text-sm text-slate-500 mt-1">선택 영역의 탄소 저장량, 흡수량 자동 계산</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <span className="text-green-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">토지이용 변경 시뮬레이션</h3>
                    <p className="text-sm text-slate-500 mt-1">개발/보전 시나리오별 탄소 변화 예측</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <span className="text-green-600 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">결과 시각화</h3>
                    <p className="text-sm text-slate-500 mt-1">차트와 환산 지표로 쉽게 이해</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 탄소 계수 */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TreePine className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-slate-800">토지이용별 탄소 계수</h2>
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
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Car className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-slate-800">이해하기 쉬운 환산 지표</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <TreePine className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500">30년생 소나무 1그루</p>
                <p className="text-lg font-bold text-slate-800">≈ 0.5 tC</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Car className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                <p className="text-sm text-slate-500">승용차 연간 배출량</p>
                <p className="text-lg font-bold text-slate-800">≈ 4.6 tCO2</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Home className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                <p className="text-sm text-slate-500">가구 연간 배출량</p>
                <p className="text-lg font-bold text-slate-800">≈ 2.5 tCO2</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 기술 스택 */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Code className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-slate-800">기술 스택</h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
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
                    <Badge variant="outline">TanStack Query</Badge>
                    <Badge variant="outline">Recharts</Badge>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-700 mb-3">데이터 소스</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">경기기후플랫폼 API</Badge>
                    <Badge variant="outline">WMS/WFS</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 참고 자료 */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <ExternalLink className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-slate-800">참고 자료</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-slate-700 mb-3">경기기후플랫폼</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="https://climate.gg.go.kr/ips" target="_blank" rel="noopener noreferrer"
                       className="text-blue-600 hover:underline flex items-center gap-1">
                      메인 사이트 <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    <a href="https://climate.gg.go.kr/ols" target="_blank" rel="noopener noreferrer"
                       className="text-blue-600 hover:underline flex items-center gap-1">
                      Open & Share <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-slate-700 mb-3">탄소 계산 기준</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>IPCC LULUCF 가이드라인</li>
                  <li>산림청 탄소흡수원 통계</li>
                  <li>국가 온실가스 인벤토리</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 border-0 text-white">
            <CardContent className="py-8">
              <h2 className="text-2xl font-bold mb-4">지금 바로 시뮬레이션을 시작하세요</h2>
              <p className="text-green-100 mb-6">
                경기도 어느 땅이든, 개발과 보전의 탄소 영향을 확인할 수 있습니다.
              </p>
              <Link href="/">
                <Button size="lg" variant="secondary" className="font-semibold">
                  시뮬레이터 시작하기
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="bg-slate-800 text-slate-400 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm mb-2">
            경기 기후 바이브코딩 해커톤 2025 참가작
          </p>
          <p className="text-xs">
            데이터 출처: 경기기후플랫폼 | 탄소 계수: IPCC 가이드라인 기반
          </p>
          <div className="mt-4">
            <a
              href="https://github.com/yonghwan1106/carbonland"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm">GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
