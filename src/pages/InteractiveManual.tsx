import ManualViewport from '@/components/ManualViewport';
import Center from '@/components/ui/center';
import Container from '@/components/ui/container';
import { LoadingOverlay } from '@/features/loader/components/LoadingOverlay';
import type { LoaderStep } from '@/features/loader/hooks/useThreeLoader';
import MobileControls from '@/features/player-controller/MobileControls';
import UploadScreen from '@/features/upload/UploadScreen';
import {
  dispatchMobileLook,
  dispatchMobileMove,
  getLoadingLabelByType,
  isMobile,
} from '@/utils';
import { useEffect, useState } from 'react';

const DEFAULT_HDR_URL = '/assets/passendorf_snow_1k.exr';

export default function InteractiveManual() {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(false);
  const [showDebug] = useState(false); // Mantém showDebug para MobileControls, mas remove setShowDebug
  const [currentType, setCurrentType] = useState<string | undefined>(undefined);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [hdrUrl, setHdrUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (loaded && !started) {
      setStarted(true);
      setLoaded(false);
    }
  }, [loaded, started]);

  if (!modelUrl) {
    return (
      <UploadScreen
        onUpload={(model, hdr) => {
          setModelUrl(model);
          setHdrUrl(hdr ?? DEFAULT_HDR_URL);
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
                hdrUrl={hdrUrl ?? DEFAULT_HDR_URL}
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
