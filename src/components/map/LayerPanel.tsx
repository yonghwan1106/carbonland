'use client';

import { useStore } from '@/stores/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Layers, Eye, EyeOff, Info, CheckCircle2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { isApiKeyValid } from '@/lib/climateApi';

const LAYER_INFO: Record<string, { description: string; source: string }> = {
  npp: {
    description: '순일차생산량(NPP) 기반 탄소 흡수량 분포',
    source: '경기기후플랫폼',
  },
  tree_carbon: {
    description: '비오톱 유형별 수목 탄소 저장량',
    source: '경기기후플랫폼',
  },
  soil_carbon: {
    description: '토양 유기탄소 저장량',
    source: '경기기후플랫폼',
  },
  biotop: {
    description: '토지피복 및 비오톱 유형 분류',
    source: '경기기후플랫폼',
  },
};

interface LayerPanelProps {
  isMobile?: boolean;
}

export default function LayerPanel({ isMobile = false }: LayerPanelProps) {
  const { layers, toggleLayer, setLayerOpacity } = useStore();
  const apiKeyAvailable = isApiKeyValid();

  return (
    <Card className={isMobile ? "w-full bg-white shadow-none border-0" : "absolute top-4 right-4 w-64 bg-white/95 backdrop-blur-sm shadow-lg z-10"}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Layers className="w-4 h-4" />
          레이어 관리
          {apiKeyAvailable ? (
            <Badge variant="default" className="ml-auto text-xs bg-green-600">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              연결됨
            </Badge>
          ) : (
            <Badge variant="outline" className="ml-auto text-xs">
              API 대기중
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <TooltipProvider>
          {layers.map((layer) => (
            <div key={layer.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={layer.visible}
                    onCheckedChange={() => toggleLayer(layer.id)}
                    disabled={!apiKeyAvailable}
                  />
                  <span className={`text-sm ${apiKeyAvailable ? 'text-slate-700' : 'text-slate-400'}`}>
                    {layer.name}
                  </span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3 text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-48">
                      <p className="text-xs">{LAYER_INFO[layer.id]?.description}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        출처: {LAYER_INFO[layer.id]?.source}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                {layer.visible ? (
                  <Eye className="w-4 h-4 text-green-500" />
                ) : (
                  <EyeOff className="w-4 h-4 text-slate-300" />
                )}
              </div>

              {layer.visible && (
                <div className="pl-8 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-12">투명도</span>
                    <Slider
                      value={[layer.opacity * 100]}
                      onValueChange={([v]) => setLayerOpacity(layer.id, v / 100)}
                      min={0}
                      max={100}
                      step={10}
                      className="flex-1"
                      disabled={!apiKeyAvailable}
                    />
                    <span className="text-xs text-slate-500 w-8">
                      {Math.round(layer.opacity * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </TooltipProvider>

        {!apiKeyAvailable && (
          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center">
              API 키 연동 후 활성화됩니다
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
