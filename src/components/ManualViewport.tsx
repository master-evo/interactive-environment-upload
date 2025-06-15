import DefaultScene from '@/components/DefaultScene';
import { Card } from '@/components/ui/card';
import { LoaderContext } from '@/components/context/loaderContext';
import { useThreeLoader } from '@/components/hooks/useThreeLoader';
import type { LoaderStep } from '@/components/hooks/useThreeLoader';
import { DefaultLoadingManager } from 'three';
import { useCallback } from 'react';

interface IManualViewportProps {
  className: string;
  onLoading?: (step: LoaderStep) => void;
}

export default function ManualViewport({
  className,
  onLoading,
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
      <Card className={className}>
        <DefaultScene />
      </Card>
    </LoaderContext.Provider>
  );
}
