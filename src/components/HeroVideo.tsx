'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export default function HeroVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: Particle[] = [];
    const maxParticles = 40;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: 0,
      life: 0,
      maxLife: Math.random() * 300 + 150,
    });

    for (let i = 0; i < maxParticles; i++) {
      const p = createParticle();
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particles.forEach((p) => {
        p.life++;
        p.x += p.speedX;
        p.y += p.speedY;

        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.1) p.opacity = lifeRatio / 0.1;
        else if (lifeRatio > 0.8) p.opacity = (1 - lifeRatio) / 0.2;
        else p.opacity = 0.4 + Math.sin(p.life * 0.03) * 0.3;

        if (p.life >= p.maxLife) Object.assign(p, createParticle());

        // Soft warm sparkle
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity) * 0.6;
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, 'rgba(230, 144, 127, 0.5)');
        gradient.addColorStop(1, 'rgba(230, 144, 127, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Center dot
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, p.opacity) * 0.8})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative h-[85vh] min-h-[500px] max-h-[800px] overflow-hidden bg-[#f5f0ec]">
      {/* Sparkle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }} />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f5f0ec]/30 to-[#f5f0ec]/60" style={{ zIndex: 2 }} />

      {/* Content */}
      <div className="relative h-full flex items-center justify-center" style={{ zIndex: 3 }}>
        <div className="text-center px-5 max-w-2xl">
          <h2 className="font-heading text-[48px] md:text-[72px] font-normal text-text leading-[1.1] mb-4 animate-fade-in-up">
            Adi Bergman
          </h2>
          <div className="w-10 h-[1px] bg-accent mx-auto my-5" />
          <p className="font-heading text-[20px] md:text-[26px] text-text-light font-normal mb-3 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            תכשיטי מויסנייט מעוצבים
          </p>
          <p className="text-[15px] text-text-muted mb-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            יוקרה שאפשר להרגיש — ברק של יהלום, עיצוב ישראלי מקורי
          </p>
          <div className="flex gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
            <Link href="/products" className="btn-primary">
              לקולקציה
            </Link>
            <Link href="/login" className="btn-outline">
              כניסת לקוחות
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
