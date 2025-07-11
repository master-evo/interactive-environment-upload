import { useEffect, useRef, useState } from 'react';

export function useFpsCounter() {
  const [fps, setFps] = useState(0);
  const lastFrame = useRef(performance.now());
  const frames = useRef(0);
  const running = useRef(true);

  useEffect(() => {
    running.current = true;
    function loop() {
      if (!running.current) return;
      frames.current++;
      const now = performance.now();
      if (now - lastFrame.current >= 1000) {
        setFps(frames.current);
        frames.current = 0;
        lastFrame.current = now;
      }
      requestAnimationFrame(loop);
    }
    loop();
    return () => {
      running.current = false;
    };
  }, []);

  return fps;
}

export function FpsCounter() {
  const fps = useFpsCounter();
  const isLowFps = fps > 0 && fps < 30;
  return (
    <div
      className={`fixed top-2 left-2 px-2 py-1 rounded z-[2000] ${
        isLowFps
          ? 'bg-red-600/80 text-yellow-300 font-bold'
          : 'bg-black/70 text-white font-normal'
      }`}
    >
      <span>FPS: {fps}</span>
      {isLowFps && <span className="ml-2">⚠️ FPS BAIXO</span>}
    </div>
  );
}
