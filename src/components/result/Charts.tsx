'use client';

import { memo, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { useStore } from '@/stores/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/lib/carbonCalc';

// 시나리오 비교 막대 차트
export const ScenarioComparisonChart = memo(function ScenarioComparisonChart() {
  const { scenarioComparison } = useStore();

  if (scenarioComparison.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">시나리오별 탄소 현황 비교</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={scenarioComparison} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" fontSize={10} />
            <YAxis dataKey="label" type="category" fontSize={10} width={70} />
            <Tooltip
              formatter={(value: number) => [`${formatNumber(value, 0)} tC`, '']}
              labelStyle={{ fontSize: 12 }}
            />
            <Bar dataKey="storage" name="탄소 저장량">
              {scenarioComparison.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

// 연도별 탄소 변화 시계열 차트
export const YearlyCarbonChart = memo(function YearlyCarbonChart() {
  const { yearlyData, timeHorizon } = useStore();

  // 5년 단위로 데이터 필터링 (표시 최적화)
  const filteredData = useMemo(() =>
    yearlyData.filter(
      (_, index) => index === 0 || index % 5 === 0 || index === yearlyData.length - 1
    ),
    [yearlyData]
  );

  if (yearlyData.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{timeHorizon}년간 누적 탄소 변화</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              fontSize={10}
              tickFormatter={(value) => `${value}년`}
            />
            <YAxis fontSize={10} />
            <Tooltip
              formatter={(value: number, name: string) => [
                `${formatNumber(value, 1)} tC`,
                name === 'cumulative' ? '누적 변화량' : '탄소 저장량',
              ]}
              labelFormatter={(label) => `${label}년차`}
              labelStyle={{ fontSize: 12 }}
            />
            <Legend
              formatter={(value) =>
                value === 'cumulative' ? '누적 변화량' : '탄소 저장량'
              }
            />
            <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="storage"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: '#22c55e', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

// 변경 전후 비교 막대 차트
export const BeforeAfterChart = memo(function BeforeAfterChart() {
  const { simulationResult } = useStore();

  const { data, absorptionData } = useMemo(() => {
    if (!simulationResult) return { data: [], absorptionData: [] };
    return {
      data: [{
        name: '저장량',
        현재: simulationResult.beforeStatus.totalStorage,
        변경후: simulationResult.afterStatus.totalStorage,
      }],
      absorptionData: [{
        name: '연간흡수',
        현재: simulationResult.beforeStatus.totalAbsorption,
        변경후: simulationResult.afterStatus.totalAbsorption,
      }],
    };
  }, [simulationResult]);

  if (!simulationResult) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">변경 전후 비교</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 저장량 비교 */}
        <div>
          <p className="text-xs text-slate-500 mb-1">탄소 저장량 (tC)</p>
          <ResponsiveContainer width="100%" height={60}>
            <BarChart data={data} layout="vertical">
              <XAxis type="number" fontSize={10} hide />
              <YAxis dataKey="name" type="category" hide />
              <Tooltip
                formatter={(value: number) => [`${formatNumber(value, 0)} tC`, '']}
              />
              <Bar dataKey="현재" fill="#3b82f6" barSize={20} />
              <Bar dataKey="변경후" fill="#f97316" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-blue-500">
              현재: {formatNumber(simulationResult.beforeStatus.totalStorage, 0)} tC
            </span>
            <span className="text-orange-500">
              변경 후: {formatNumber(simulationResult.afterStatus.totalStorage, 0)} tC
            </span>
          </div>
        </div>

        {/* 흡수량 비교 */}
        <div>
          <p className="text-xs text-slate-500 mb-1">연간 흡수량 (tC/yr)</p>
          <ResponsiveContainer width="100%" height={60}>
            <BarChart data={absorptionData} layout="vertical">
              <XAxis type="number" fontSize={10} hide />
              <YAxis dataKey="name" type="category" hide />
              <Tooltip
                formatter={(value: number) => [`${formatNumber(value, 1)} tC/yr`, '']}
              />
              <Bar dataKey="현재" fill="#3b82f6" barSize={20} />
              <Bar dataKey="변경후" fill="#f97316" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-blue-500">
              현재: {formatNumber(simulationResult.beforeStatus.totalAbsorption, 1)} tC/yr
            </span>
            <span className="text-orange-500">
              변경 후: {formatNumber(simulationResult.afterStatus.totalAbsorption, 1)} tC/yr
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// 다중 시나리오 비교 테이블
export const MultiScenarioTable = memo(function MultiScenarioTable() {
  const { scenarioComparison, timeHorizon } = useStore();

  // 순 탄소수지 기준으로 정렬 (높은 것이 좋음)
  const sortedScenarios = useMemo(() =>
    [...scenarioComparison].sort((a, b) => b.netChange - a.netChange),
    [scenarioComparison]
  );

  // 현재 시나리오의 순 탄소수지
  const currentNetChange = useMemo(() => {
    const currentScenario = scenarioComparison.find(s => s.label === '현재 유지');
    return currentScenario?.netChange || 0;
  }, [scenarioComparison]);

  if (scenarioComparison.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">전체 시나리오 상세 비교</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-1 font-medium text-slate-600">시나리오</th>
                <th className="text-right py-2 px-1 font-medium text-slate-600">저장량</th>
                <th className="text-right py-2 px-1 font-medium text-slate-600">순수지</th>
                <th className="text-right py-2 px-1 font-medium text-slate-600">{timeHorizon}년 누적</th>
                <th className="text-right py-2 px-1 font-medium text-slate-600">비교</th>
              </tr>
            </thead>
            <tbody>
              {sortedScenarios.map((scenario, index) => {
                const cumulativeChange = scenario.netChange * timeHorizon;
                const diffFromCurrent = scenario.netChange - currentNetChange;
                const isBest = index === 0;
                const isCurrent = scenario.label === '현재 유지';

                return (
                  <tr
                    key={scenario.scenario}
                    className={`border-b border-slate-100 ${
                      isCurrent ? 'bg-blue-50' : isBest ? 'bg-green-50' : ''
                    }`}
                  >
                    <td className="py-2 px-1">
                      <div className="flex items-center gap-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: scenario.color }}
                        />
                        <span className={isBest ? 'font-medium' : ''}>
                          {scenario.label}
                          {isBest && !isCurrent && ' ★'}
                        </span>
                      </div>
                    </td>
                    <td className="text-right py-2 px-1 font-mono">
                      {formatNumber(scenario.storage, 0)}
                    </td>
                    <td className={`text-right py-2 px-1 font-mono ${
                      scenario.netChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {scenario.netChange >= 0 ? '+' : ''}
                      {formatNumber(scenario.netChange, 1)}
                    </td>
                    <td className={`text-right py-2 px-1 font-mono ${
                      cumulativeChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {cumulativeChange >= 0 ? '+' : ''}
                      {formatNumber(cumulativeChange, 0)}
                    </td>
                    <td className={`text-right py-2 px-1 font-mono text-[10px] ${
                      diffFromCurrent > 0 ? 'text-green-600' : diffFromCurrent < 0 ? 'text-red-600' : 'text-slate-400'
                    }`}>
                      {isCurrent ? '-' : (
                        <>
                          {diffFromCurrent > 0 ? '▲' : diffFromCurrent < 0 ? '▼' : ''}
                          {Math.abs(diffFromCurrent).toFixed(1)}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-slate-500 mt-2">
          ★ 탄소중립 관점 최적 시나리오 / 단위: tC, tC/yr
        </p>
      </CardContent>
    </Card>
  );
});
