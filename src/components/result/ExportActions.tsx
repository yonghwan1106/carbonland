'use client';

import { useState, useRef } from 'react';
import { useStore } from '@/stores/useStore';
import { CARBON_COEFFICIENTS, CONVERSION_FACTORS } from '@/lib/constants';
import { formatNumber } from '@/lib/carbonCalc';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Download, Share2, Image, FileText, Link, Check, Loader2 } from 'lucide-react';

interface ExportActionsProps {
  resultPanelRef?: React.RefObject<HTMLDivElement | null>;
  isMobile?: boolean;
}

export default function ExportActions({ resultPanelRef, isMobile = false }: ExportActionsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    simulationResult,
    currentLandUse,
    targetLandUse,
    timeHorizon,
    selectedArea,
    dataSource,
  } = useStore();

  // 이미지로 저장
  const handleExportImage = async () => {
    if (!resultPanelRef?.current) return;

    setIsExporting(true);
    try {
      const { toPng } = await import('html-to-image');

      const dataUrl = await toPng(resultPanelRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        skipFonts: true,
        filter: (node) => {
          // SVG 아이콘 등 일부 요소 제외 (필요시)
          return true;
        },
      });

      const link = document.createElement('a');
      link.download = `carbonland-simulation-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('이미지 저장 오류:', error);
      alert('이미지 저장에 실패했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  // PDF로 저장
  const handleExportPDF = async () => {
    if (!simulationResult || !selectedArea) return;

    setIsExporting(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF('p', 'mm', 'a4');

      // 한글 폰트 대신 기본 폰트 사용 (한글은 깨질 수 있음)
      doc.setFont('helvetica');

      // 제목
      doc.setFontSize(20);
      doc.text('CarbonLand Simulation Report', 105, 20, { align: 'center' });

      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString('ko-KR')}`, 105, 28, { align: 'center' });

      // 구분선
      doc.setLineWidth(0.5);
      doc.line(20, 32, 190, 32);

      // 기본 정보
      doc.setFontSize(14);
      doc.text('1. Basic Information', 20, 42);

      doc.setFontSize(11);
      const currentInfo = CARBON_COEFFICIENTS[currentLandUse];
      const targetInfo = CARBON_COEFFICIENTS[targetLandUse];

      doc.text(`Area: ${formatNumber(selectedArea.areaHa, 2)} ha`, 25, 52);
      doc.text(`Current Land Use: ${currentInfo.name}`, 25, 59);
      doc.text(`Target Land Use: ${targetInfo.name}`, 25, 66);
      doc.text(`Analysis Period: ${timeHorizon} years`, 25, 73);
      doc.text(`Data Source: ${dataSource === 'api' ? 'Gyeonggi Climate Platform API' : 'Simulation Data'}`, 25, 80);

      // 시뮬레이션 결과
      doc.setFontSize(14);
      doc.text('2. Simulation Results', 20, 95);

      doc.setFontSize(11);
      doc.text(`Immediate Emission: ${formatNumber(simulationResult.immediateEmission, 1)} tC`, 25, 105);
      doc.text(`Annual Net Change: ${formatNumber(simulationResult.netAnnualChange, 1)} tC/year`, 25, 112);
      doc.text(`Cumulative Change (${timeHorizon}yr): ${formatNumber(simulationResult.cumulativeChange, 1)} tC`, 25, 119);
      doc.text(`CO2 Equivalent: ${formatNumber(simulationResult.cumulativeChangeCO2, 1)} tCO2`, 25, 126);

      // 환산 정보
      doc.setFontSize(14);
      doc.text('3. Equivalent Values', 20, 141);

      doc.setFontSize(11);
      doc.text(`30-year Pine Trees: ${formatNumber(simulationResult.equivalentTrees, 0)} trees`, 25, 151);
      doc.text(`Cars (annual emission): ${formatNumber(simulationResult.equivalentCars, 1)} cars`, 25, 158);
      doc.text(`Households (annual emission): ${formatNumber(simulationResult.equivalentHouseholds, 1)} households`, 25, 165);

      // 전/후 비교
      doc.setFontSize(14);
      doc.text('4. Before/After Comparison', 20, 180);

      doc.setFontSize(11);
      const before = simulationResult.beforeStatus;
      const after = simulationResult.afterStatus;

      doc.text('Before:', 25, 190);
      doc.text(`  - Total Storage: ${formatNumber(before.totalStorage, 1)} tC`, 30, 197);
      doc.text(`  - Annual Absorption: ${formatNumber(before.totalAbsorption, 1)} tC/yr`, 30, 204);
      doc.text(`  - Net Balance: ${formatNumber(before.netBalance, 1)} tC/yr`, 30, 211);

      doc.text('After:', 25, 221);
      doc.text(`  - Total Storage: ${formatNumber(after.totalStorage, 1)} tC`, 30, 228);
      doc.text(`  - Annual Absorption: ${formatNumber(after.totalAbsorption, 1)} tC/yr`, 30, 235);
      doc.text(`  - Net Balance: ${formatNumber(after.netBalance, 1)} tC/yr`, 30, 242);

      // 푸터
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text('CarbonLand - Carbon Neutral Land Use Simulator', 105, 280, { align: 'center' });
      doc.text('Data Source: Gyeonggi Climate Platform', 105, 286, { align: 'center' });

      doc.save(`carbonland-report-${Date.now()}.pdf`);
    } catch (error) {
      console.error('PDF 저장 오류:', error);
      alert('PDF 저장에 실패했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  // URL 공유
  const handleShareURL = async () => {
    if (!selectedArea) return;

    const params = new URLSearchParams();
    params.set('area', selectedArea.id);
    params.set('current', currentLandUse);
    params.set('target', targetLandUse);
    params.set('years', timeHorizon.toString());

    if (selectedArea.centroid) {
      params.set('lat', selectedArea.centroid[1].toString());
      params.set('lon', selectedArea.centroid[0].toString());
    }

    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback: prompt로 URL 표시
      window.prompt('공유 URL:', url);
    }
  };

  if (!selectedArea) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={isMobile ? 'sm' : 'default'}
          disabled={isExporting}
          className="gap-2"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Share2 className="w-4 h-4" />
          )}
          {!isMobile && (isExporting ? '저장 중...' : '저장/공유')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportImage} disabled={!resultPanelRef?.current}>
          <Image className="w-4 h-4 mr-2" />
          이미지로 저장 (PNG)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF} disabled={!simulationResult}>
          <FileText className="w-4 h-4 mr-2" />
          PDF 리포트 저장
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleShareURL}>
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2 text-green-600" />
              URL 복사됨!
            </>
          ) : (
            <>
              <Link className="w-4 h-4 mr-2" />
              공유 URL 복사
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
