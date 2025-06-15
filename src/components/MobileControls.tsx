import { FpsCounter } from '@/components/Overlay/FpsCounter';
import clsx from 'clsx';
import nipplejs from 'nipplejs';
import { useEffect, useRef, useState } from 'react';

interface MobileControlsProps {
  onMove: (angle: number | null, force: number) => void;
  onLook: (dyaw: number, dpitch: number) => void;
  showDebug?: boolean;
}

const JOYSTICK_SIZE = 80;
const LOOK_SENSITIVITY = 0.009;

export default function MobileControls({
  onMove,
  onLook,
  showDebug = false,
}: MobileControlsProps) {
  const leftZoneRef = useRef<HTMLDivElement>(null);
  const rightZoneRef = useRef<HTMLDivElement>(null);
  const lastTouch = useRef<{ x: number; y: number } | null>(null);
  const [touchPosition, setTouchPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Armazenar informações de controle para debug
  const [controlState, setControlState] = useState<{
    angle: number | null;
    force: number;
    directionX: number;
    directionZ: number;
  }>({
    angle: null,
    force: 0,
    directionX: 0,
    directionZ: 0,
  });

  // Joystick para movimento - versão melhorada
  useEffect(() => {
    if (!leftZoneRef.current) return;

    const manager = nipplejs.create({
      zone: leftZoneRef.current,
      mode: 'static',
      position: { left: '25%', bottom: '25%' },
      color: 'rgba(255, 255, 255, 0.8)',
      size: JOYSTICK_SIZE,
      restOpacity: 0.5,
      fadeTime: 100,
      lockX: false,
      lockY: false,
      restJoystick: true,
      dynamicPage: true,
      threshold: 0.1, // Limiar para começar a detectar movimento
      maxNumberOfNipples: 1,
    });

    // Resposta mais suave aos movimentos e logging para debug
    manager.on('move', (_, data) => {
      const angle = data.angle?.radian ?? null;
      // Aplicamos uma curva de resposta para melhor controle
      // Início suave, aceleração no meio, melhor controle fino
      let force = Math.min(data.force ?? 0, 1.0);

      // Aplicar uma curva suave para melhor controle
      force = Math.pow(force, 1.5);

      // Calcular direção X/Z para debugação
      const dirX = angle !== null ? Math.cos(angle) * force : 0;
      const dirZ = angle !== null ? -Math.sin(angle) * force : 0;

      // Atualizar estado para o debug visual
      setControlState({
        angle,
        force,
        directionX: dirX,
        directionZ: dirZ,
      });

      // Debug: visualizar informações do joystick
      if (showDebug && angle !== null) {
        console.log(
          `Joystick - Ângulo: ${angle.toFixed(2)} (${((angle * 180) / Math.PI).toFixed(0)}°), X: ${dirX.toFixed(2)}, Z: ${dirZ.toFixed(2)}, Força: ${force.toFixed(2)}`,
        );
      }

      onMove(angle, force);
    });

    manager.on('end', () => {
      // Resetar o estado do controle para o debug visual
      setControlState({
        angle: null,
        force: 0,
        directionX: 0,
        directionZ: 0,
      });
      onMove(null, 0);
    });

    return () => manager.destroy();
  }, [onMove, showDebug]);

  const [lookTouchId, setLookTouchId] = useState<number | null>(null);

  // Touchpad para olhar/rotacionar - versão mais suave
  useEffect(() => {
    const right = rightZoneRef.current;
    if (!right) return;

    const handleTouchStart = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (lookTouchId === null) {
          setLookTouchId(t.identifier);
          lastTouch.current = { x: t.clientX, y: t.clientY };
          setTouchPosition({ x: t.clientX, y: t.clientY });
          break;
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (lookTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === lookTouchId && lastTouch.current) {
          const dx = t.clientX - lastTouch.current.x;
          const dy = t.clientY - lastTouch.current.y;
          lastTouch.current = { x: t.clientX, y: t.clientY };
          setTouchPosition({ x: t.clientX, y: t.clientY });

          // Sensibilidade ajustada para movimento mais natural
          onLook(-dx * LOOK_SENSITIVITY, -dy * LOOK_SENSITIVITY);
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (lookTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === lookTouchId) {
          setLookTouchId(null);
          lastTouch.current = null;
          setTouchPosition(null);
          break;
        }
      }
    };

    right.addEventListener('touchstart', handleTouchStart, { passive: false });
    right.addEventListener('touchmove', handleTouchMove, { passive: false });
    right.addEventListener('touchend', handleTouchEnd);

    return () => {
      right.removeEventListener('touchstart', handleTouchStart);
      right.removeEventListener('touchmove', handleTouchMove);
      right.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onLook, lookTouchId]);

  // UI responsiva com feedback visual
  return (
    <>
      <div
        ref={leftZoneRef}
        className={clsx(
          'absolute left-0 bottom-0 w-1/2 h-full z-20 touch-none bg-transparent',
        )}
      ></div>
      <div
        ref={rightZoneRef}
        className={clsx(
          'absolute right-0 bottom-0 w-1/2 h-full z-20 touch-none bg-transparent',
        )}
      >
        {/* Hint visual para a área de olhar */}
        <div
          className={clsx(
            'absolute flex items-center justify-center text-[12px] rounded-full border-2 pointer-events-none',
            'right-1/4 bottom-1/2 translate-y-1/2',
            touchPosition ? 'opacity-80' : 'opacity-30',
            'w-[80px] h-[80px] border-white/30 text-white/70',
          )}
        >
          {touchPosition ? null : 'OLHAR'}
        </div>

        {/* Indicador de toque atual */}
        {touchPosition &&
          rightZoneRef.current &&
          (() => {
            // Calcula a posição relativa ao elemento rightZoneRef
            const rect = rightZoneRef.current.getBoundingClientRect();
            const relX = touchPosition.x - rect.left;
            const relY = touchPosition.y - rect.top;
            return (
              <div
                className={clsx(
                  'absolute pointer-events-none z-30',
                  'w-[30px] h-[30px] -translate-x-1/2 -translate-y-1/2',
                )}
                style={{
                  left: relX,
                  top: relY,
                }}
              >
                <div className="w-full h-full rounded-full border-2 border-white/70 bg-white/30" />
              </div>
            );
          })()}
      </div>

      {/* Debug information */}
      {showDebug && (
        <div className="absolute top-2.5 left-2.5 bg-black/70 text-white p-2.5 rounded-md text-xs z-[100] max-w-[90%]">
          <div>
            Touch Position:{' '}
            {touchPosition
              ? `X: ${touchPosition.x.toFixed(0)}, Y: ${touchPosition.y.toFixed(0)}`
              : 'None'}
          </div>

          <div>
            Joystick:{' '}
            {controlState.angle !== null
              ? `Ângulo: ${((controlState.angle * 180) / Math.PI).toFixed(0)}°, Força: ${controlState.force.toFixed(2)}`
              : 'Inativo'}
          </div>

          <div>
            Direção: X: {controlState.directionX.toFixed(2)}, Z:{' '}
            {controlState.directionZ.toFixed(2)}{' '}
          </div>

          {/* FPS Counter */}
          <FpsCounter />

          {/* Indicador visual de direção para ajudar no debug */}
          <div className="mt-2.5 w-[100px] h-[100px] relative border border-white/30 rounded-full">
            {/* Cruz central */}
            <div
              className="absolute left-1/2 top-1/2 w-2.5 h-2.5 bg-white/80 rounded-full"
              style={{ transform: 'translate(-50%, -50%)' }}
            />

            {/* Indicador de direção atual */}
            {controlState.force > 0 && (
              <div
                className="absolute w-4 h-4 bg-green-400/80 rounded-full"
                style={{
                  left: `${50 + controlState.directionX * 40}%`,
                  top: `${50 + controlState.directionZ * 40}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            )}

            {/* Indicadores de direção */}
            <div
              className="absolute left-1/2 top-1.5 text-white text-[10px]"
              style={{ transform: 'translateX(-50%)' }}
            >
              ↑ Frente
            </div>
            <div
              className="absolute left-1/2 bottom-1.5 text-white text-[10px]"
              style={{ transform: 'translateX(-50%)' }}
            >
              ↓ Trás
            </div>
            <div
              className="absolute right-1.5 top-1/2 text-white text-[10px]"
              style={{ transform: 'translateY(-50%)' }}
            >
              → Dir
            </div>
            <div
              className="absolute left-1.5 top-1/2 text-white text-[10px]"
              style={{ transform: 'translateY(-50%)' }}
            >
              ← Esq
            </div>
          </div>
        </div>
      )}
    </>
  );
}
