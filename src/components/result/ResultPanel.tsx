'use client';

import { useStore } from '@/stores/useStore';
import { CARBON_COEFFICIENTS } from '@/lib/constants';
import { formatNumber } from '@/lib/carbonCalc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TreeDeciduous, Car, Home, ArrowRight, TrendingDown, TrendingUp } from 'lucide-react';

export default function ResultPanel() {
  const { simulationResult, currentLandUse, targetLandUse, timeHorizon } = useStore();

  if (!simulationResult) {
    return (
      <div className="w-96 h-full bg-slate-50 border-l border-slate-200 flex items-center justify-center p-4">
        <div className="text-center text-slate-500">
          <p className="text-sm">영역을 선택하고</p>
          <p className="text-sm">시뮬레이션을 실행하세요</p>
        </div>
      </div>
    );
  }

  const isNegativeChange = simulationResult.cumulativeChange < 0;
  const currentInfo = CARBON_COEFFICIENTS[currentLandUse];
  const targetInfo = CARBON_COEFFICIENTS[targetLandUse];

  return (
    <div className="w-96 h-full bg-slate-50 border-l border-slate-200 flex flex-col overflow-hidden">
      {/* 헤더 */}
      <div className="p-4 border-b border-slate-200 bg-white">
        <h2 className="text-lg font-bold text-slate-800">시뮬레이션 결과</h2>
        <p className="text-sm text-slate-500">{timeHorizon}년 기준 분석</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 토지이용 변화 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">토지이용 변화</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center"
                  style={{ backgroundColor: currentInfo.color + '33' }}
                >
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: currentInfo.color }}
                  />
                </div>
                <p className="text-sm font-medium">{currentInfo.name}</p>
              </div>
              <ArrowRight className="w-6 h-6 text-slate-400" />
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center"
                  style={{ backgroundColor: targetInfo.color + '33' }}
                >
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: targetInfo.color }}
                  />
                </div>
                <p className="text-sm font-medium">{targetInfo.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 핵심 결과 */}
        <Card className={isNegativeChange ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              {isNegativeChange ? (
                <TrendingDown className="w-4 h-4 text-red-500" />
              ) : (
                <TrendingUp className="w-4 h-4 text-green-500" />
              )}
              {timeHorizon}년 누적 탄소 변화
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className={`text-3xl font-bold ${isNegativeChange ? 'text-red-600' : 'text-green-600'}`}>
                {simulationResult.cumulativeChange >= 0 ? '+' : ''}
                {formatNumber(simulationResult.cumulativeChange, 1)} tC
              </p>
              <p className="text-sm text-slate-600 mt-1">
                ({simulationResult.cumulativeChangeCO2 >= 0 ? '+' : ''}
                {formatNumber(simulationResult.cumulativeChangeCO2, 1)} tCO₂)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 상세 변화량 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">상세 변화량</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">즉시 배출량</span>
              <Badge variant="destructive">
                -{formatNumber(simulationResult.immediateEmission, 1)} tC
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">연간 흡수량 변화</span>
              <Badge variant={simulationResult.annualAbsorptionChange >= 0 ? 'default' : 'destructive'}>
                {simulationResult.annualAbsorptionChange >= 0 ? '+' : ''}
                {formatNumber(simulationResult.annualAbsorptionChange, 2)} tC/yr
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">연간 배출량 변화</span>
              <Badge variant={simulationResult.annualEmissionChange <= 0 ? 'default' : 'destructive'}>
                {simulationResult.annualEmissionChange >= 0 ? '+' : ''}
                {formatNumber(simulationResult.annualEmissionChange, 2)} tC/yr
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">순 연간 변화</span>
              <Badge variant={simulationResult.netAnnualChange >= 0 ? 'default' : 'destructive'}>
                {simulationResult.netAnnualChange >= 0 ? '+' : ''}
                {formatNumber(simulationResult.netAnnualChange, 2)} tC/yr
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* 이해하기 쉬운 환산 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">이해하기 쉬운 환산</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <TreeDeciduous className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-lg font-bold text-green-700">
                  {formatNumber(simulationResult.equivalentTrees)}그루
                </p>
                <p className="text-xs text-green-600">30년생 소나무 환산</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <Car className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-lg font-bold text-orange-700">
                  {formatNumber(simulationResult.equivalentCars)}대
                </p>
                <p className="text-xs text-orange-600">승용차 연간 배출량 환산</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Home className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-lg font-bold text-blue-700">
                  {formatNumber(simulationResult.equivalentHouseholds)}가구
                </p>
                <p className="text-xs text-blue-600">가구 연간 배출량 환산</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 비교 표 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">변경 전후 비교</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="font-medium text-slate-600">항목</div>
              <div className="font-medium text-center">현재</div>
              <div className="font-medium text-center">변경 후</div>

              <div className="text-slate-600">저장량</div>
              <div className="text-center">{formatNumber(simulationResult.beforeStatus.totalStorage, 0)}</div>
              <div className="text-center">{formatNumber(simulationResult.afterStatus.totalStorage, 0)}</div>

              <div className="text-slate-600">흡수량/yr</div>
              <div className="text-center text-green-600">+{formatNumber(simulationResult.beforeStatus.totalAbsorption, 1)}</div>
              <div className="text-center text-green-600">+{formatNumber(simulationResult.afterStatus.totalAbsorption, 1)}</div>

              <div className="text-slate-600">배출량/yr</div>
              <div className="text-center text-red-500">-{formatNumber(simulationResult.beforeStatus.totalEmission, 1)}</div>
              <div className="text-center text-red-500">-{formatNumber(simulationResult.afterStatus.totalEmission, 1)}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 푸터 */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <p className="text-xs text-slate-400 text-center">
          데이터 출처: 경기기후플랫폼
        </p>
      </div>
    </div>
  );
}
