import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

export function Starfield({ starCount = 200 }: { starCount?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create stars
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    let animationId: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016;

      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinklePhase);
        const currentOpacity = star.opacity + twinkle * 0.3;
        const currentSize = star.size + twinkle * 0.5;

        // Star glow
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, currentSize * 3
        );
        gradient.addColorStop(0, `rgba(200, 180, 255, ${currentOpacity})`);
        gradient.addColorStop(0.5, `rgba(150, 100, 255, ${currentOpacity * 0.3})`);
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(star.x, star.y, currentSize * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Star core
        ctx.beginPath();
        ctx.arc(star.x, star.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [starCount]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
}

