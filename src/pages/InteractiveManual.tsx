import { useEffect, useState } from 'react';
import { LoadingOverlay } from '@/components/Overlay/LoadingOverlay';
import ManualViewport from '@/components/ManualViewport';
import MobileControls from '@/components/MobileControls';
import Center from '@/components/ui/center';
import Container from '@/components/ui/container';
import {
  dispatchMobileLook,
  dispatchMobileMove,
  getLoadingLabelByType,
  isMobile,
} from '@/utils';
import type { LoaderStep } from '@/components/hooks/useThreeLoader';
import UploadScreen from '@/components/UploadScreen';

export default function InteractiveManual() {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(false);
  const [showDebug] = useState(false); // Mantém showDebug para MobileControls, mas remove setShowDebug
  const [currentType, setCurrentType] = useState<string | undefined>(undefined);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [hdrUrl, setHdrUrl] = useState<string | null>(null);

  useEffect(() => {
    if (loaded && !started) {
      setStarted(true);
      setLoaded(false);
    }
  }, [loaded, started]);

  if (!modelUrl || !hdrUrl) {
    return (
      <UploadScreen
        onUpload={(model, hdr) => {
          setModelUrl(model);
          setHdrUrl(hdr);
        }}
      />
    );
  }

  return (
    <>
      <LoadingOverlay
        progress={progress}
        label={getLoadingLabelByType(currentType)}
        showSpinner={true}
      />

      <Container className="py-8 md:max-w-full md:w-full md:p-0 md:m-0">
        <Center>
          <div className="flex w-full h-full items-center">
            <div className="flex flex-col w-full relative md:h-full md:overflow-x-hidden">
              <ManualViewport
                className="p-0 pb-8 min-h-1/3 h-96 overflow-hidden md:bg-transparent md:border-0 md:h-full md:w-full md:p-0 md:overflow-visible"
                onLoading={(step: LoaderStep) => {
                  setProgress(step.progress);
                  setLoaded(step.done);
                  setCurrentType(step.currentType);
                }}
                modelUrl={modelUrl}
                hdrUrl={hdrUrl}
              />
              {isMobile && (
                <MobileControls
                  onMove={dispatchMobileMove}
                  onLook={dispatchMobileLook}
                  showDebug={showDebug}
                />
              )}
            </div>
          </div>
        </Center>
      </Container>
    </>
  );
}
