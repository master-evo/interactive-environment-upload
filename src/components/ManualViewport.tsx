import { Card } from '@/components/ui/card';
import { scene } from '@/consts/scene';
import { SettingsProvider } from '@/features/debug/context/SettingsProvider';
import SceneController from '@/features/debug/SceneController';
import { LoaderContext } from '@/features/loader/contexts/loaderContext';
import type { LoaderStep } from '@/features/loader/hooks/useThreeLoader';
import { useThreeLoader } from '@/features/loader/hooks/useThreeLoader';
import { useCallback } from 'react';
import { DefaultLoadingManager } from 'three';

interface IManualViewportProps {
  className: string;
  onLoading?: (step: LoaderStep) => void;
  modelUrl: string;
  hdrUrl: string;
}

export default function ManualViewport({
  className,
  onLoading,
  modelUrl,
  hdrUrl,
}: IManualViewportProps) {
  const manager = DefaultLoadingManager;

  const handleLoading = useCallback(
    (step: LoaderStep) => {
      if (onLoading) onLoading(step);
    },
    [onLoading],
  );

  useThreeLoader(manager, handleLoading);

  return (
    <LoaderContext.Provider value={manager}>
      <SettingsProvider>
        <Card className={className}>
          <SceneController
            modelUrl={modelUrl}
            hdrUrl={hdrUrl}
            sceneSettings={scene}
          />
        </Card>
      </SettingsProvider>
    </LoaderContext.Provider>
  );
}
