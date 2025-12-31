
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { FireworkEngine } from '../utils/fireworkEngine';

export interface FireworksCanvasRef {
  launch: (x?: number) => void;
}

interface FireworksCanvasProps {
  onExplodeSound: () => void;
}

const FireworksCanvas = forwardRef<FireworksCanvasRef, FireworksCanvasProps>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<FireworkEngine | null>(null);

  useImperativeHandle(ref, () => ({
    launch: (x?: number) => {
      engineRef.current?.launch(x);
    }
  }));

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const engine = new FireworkEngine(
      canvas,
      props.onExplodeSound
    );
    engineRef.current = engine;

    let animationId: number;
    const animate = () => {
      engine.updateAndDraw();
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      engine.resize(canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [props.onExplodeSound]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
});

export default FireworksCanvas;
