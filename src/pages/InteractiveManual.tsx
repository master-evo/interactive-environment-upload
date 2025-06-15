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

export default function InteractiveManual() {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [currentType, setCurrentType] = useState<string | undefined>(undefined);
  const envMode = import.meta.env.DEV;

  useEffect(() => {
    if (loaded && !started) {
      setStarted(true);
      setLoaded(false);
    }
  }, [loaded, started]);

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
              />
              {isMobile && (
                <>
                  <MobileControls
                    onMove={dispatchMobileMove}
                    onLook={dispatchMobileLook}
                    showDebug={showDebug}
                  />
                  {envMode && (
                    <button
                      onClick={() => setShowDebug((prev) => !prev)}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        zIndex: 50,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 10px',
                        fontSize: '12px',
                      }}
                    >
                      {showDebug ? 'Ocultar Debug' : 'Mostrar Debug'}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </Center>
      </Container>
    </>
  );
}
