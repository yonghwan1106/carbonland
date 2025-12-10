'use client';

import { useStore } from '@/stores/useStore';
import { CARBON_COEFFICIENTS, SIMULATION_SCENARIOS, type LandUseType } from '@/lib/constants';
import { formatNumber } from '@/lib/carbonCalc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, TreePine, Trash2, Play, RotateCcw } from 'lucide-react';

export default function ControlPanel() {
  const {
    selectedArea,
    isDrawing,
    setIsDrawing,
    clearSelection,
    currentLandUse,
    setCurrentLandUse,
    targetLandUse,
    setTargetLandUse,
    timeHorizon,
    setTimeHorizon,
    currentStatus,
    runSimulation,
    resetSimulation,
  } = useStore();

  const landUseOptions = Object.entries(CARBON_COEFFICIENTS).map(([key, value]) => ({
    value: key as LandUseType,
    label: value.name,
    color: value.color,
  }));

  return (
    <div className="w-80 h-full bg-white border-l border-slate-200 flex flex-col overflow-hidden">
      {/* 헤더 */}
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-800">컨트롤 패널</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 영역 선택 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              영역 선택
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Button
                onClick={() => setIsDrawing(true)}
                disabled={isDrawing}
                size="sm"
                className="flex-1"
              >
                {isDrawing ? '선택 중...' : '영역 그리기'}
              </Button>
              <Button
                onClick={clearSelection}
                disabled={!selectedArea}
                variant="outline"
                size="sm"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {selectedArea && (
              <div className="bg-slate-50 rounded-lg p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">면적</span>
                  <span className="font-medium">
                    {formatNumber(selectedArea.areaHa, 2)} ha
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">({formatNumber(selectedArea.areaM2, 0)} m²)</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 현재 토지이용 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TreePine className="w-4 h-4" />
              현재 토지이용
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select
              value={currentLandUse}
              onValueChange={(v) => setCurrentLandUse(v as LandUseType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {landUseOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {currentStatus && (
              <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">탄소 저장량</span>
                  <span className="font-medium text-green-600">
                    {formatNumber(currentStatus.totalStorage, 1)} tC
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">연간 흡수량</span>
                  <span className="font-medium text-green-600">
                    +{formatNumber(currentStatus.totalAbsorption, 1)} tC/yr
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">연간 배출량</span>
                  <span className="font-medium text-red-500">
                    -{formatNumber(currentStatus.totalEmission, 1)} tC/yr
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">순 탄소수지</span>
                  <Badge variant={currentStatus.netBalance >= 0 ? 'default' : 'destructive'}>
                    {currentStatus.netBalance >= 0 ? '+' : ''}
                    {formatNumber(currentStatus.netBalance, 1)} tC/yr
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 시뮬레이션 설정 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">시뮬레이션 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-600">변경 시나리오</label>
              <Select
                value={targetLandUse}
                onValueChange={(v) => setTargetLandUse(v as LandUseType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SIMULATION_SCENARIOS.map((scenario) => (
                    <SelectItem key={scenario.id} value={scenario.targetType}>
                      {scenario.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-slate-600">분석 기간</label>
                <span className="text-sm font-medium">{timeHorizon}년</span>
              </div>
              <Slider
                value={[timeHorizon]}
                onValueChange={([v]) => setTimeHorizon(v)}
                min={10}
                max={50}
                step={5}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={runSimulation}
                disabled={!selectedArea}
                className="flex-1"
              >
                <Play className="w-4 h-4 mr-2" />
                시뮬레이션
              </Button>
              <Button onClick={resetSimulation} variant="outline" size="icon">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
