'use client';

import { useEffect, useRef } from 'react';

export default function ViewerCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let frame = 0;
    const draw = () => {
      frame += 0.02;
      const size = Math.min(canvas.width, canvas.height) / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(frame);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(-size / 2, -size / 2, size, size);
      ctx.restore();
      requestAnimationFrame(draw);
    };
    draw();
    return () => {};
  }, []);

  return <canvas ref={canvasRef} width={300} height={300} className="border" />;
}
