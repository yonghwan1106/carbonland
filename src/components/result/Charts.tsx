'use client';

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
export function ScenarioComparisonChart() {
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
}

// 연도별 탄소 변화 시계열 차트
export function YearlyCarbonChart() {
  const { yearlyData, timeHorizon } = useStore();

  if (yearlyData.length === 0) return null;

  // 5년 단위로 데이터 필터링 (표시 최적화)
  const filteredData = yearlyData.filter(
    (_, index) => index === 0 || index % 5 === 0 || index === yearlyData.length - 1
  );

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
}

// 변경 전후 비교 막대 차트
export function BeforeAfterChart() {
  const { simulationResult } = useStore();

  if (!simulationResult) return null;

  const data = [
    {
      name: '저장량',
      현재: simulationResult.beforeStatus.totalStorage,
      변경후: simulationResult.afterStatus.totalStorage,
    },
  ];

  const absorptionData = [
    {
      name: '연간흡수',
      현재: simulationResult.beforeStatus.totalAbsorption,
      변경후: simulationResult.afterStatus.totalAbsorption,
    },
  ];

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
}
