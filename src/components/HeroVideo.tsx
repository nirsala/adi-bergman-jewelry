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
    const maxParticles = 80;

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
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: 0,
      life: 0,
      maxLife: Math.random() * 200 + 100,
    });

    for (let i = 0; i < maxParticles; i++) {
      const p = createParticle();
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    const drawDiamond = (x: number, y: number, size: number, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = opacity;

      // Outer glow
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 4);
      gradient.addColorStop(0, 'rgba(212, 175, 55, 0.3)');
      gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, size * 4, 0, Math.PI * 2);
      ctx.fill();

      // Star shape
      ctx.fillStyle = `rgba(255, 245, 210, ${opacity})`;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const outerX = Math.cos(angle) * size * 2;
        const outerY = Math.sin(angle) * size * 2;
        const innerAngle = angle + Math.PI / 4;
        const innerX = Math.cos(innerAngle) * size * 0.5;
        const innerY = Math.sin(innerAngle) * size * 0.5;
        if (i === 0) ctx.moveTo(outerX, outerY);
        else ctx.lineTo(outerX, outerY);
        ctx.lineTo(innerX, innerY);
      }
      ctx.closePath();
      ctx.fill();

      // Center bright point
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particles.forEach((p) => {
        p.life++;
        p.x += p.speedX;
        p.y += p.speedY;

        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.1) {
          p.opacity = lifeRatio / 0.1;
        } else if (lifeRatio > 0.8) {
          p.opacity = (1 - lifeRatio) / 0.2;
        } else {
          p.opacity = 0.6 + Math.sin(p.life * 0.05) * 0.4;
        }

        if (p.life >= p.maxLife) {
          Object.assign(p, createParticle());
        }

        drawDiamond(p.x, p.y, p.size, Math.max(0, p.opacity));
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
    <section className="relative h-screen min-h-[600px] overflow-hidden bg-charcoal">
      {/* Sparkle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-transparent to-charcoal/90" style={{ zIndex: 2 }} />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/50 via-transparent to-charcoal/50" style={{ zIndex: 2 }} />

      {/* Animated Diamond Ring Illustration */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 1 }}>
        <div className="animate-float opacity-20">
          <svg width="300" height="300" viewBox="0 0 300 300" fill="none">
            {/* Ring band */}
            <ellipse cx="150" cy="200" rx="80" ry="30" stroke="#D4AF37" strokeWidth="3" fill="none" />
            <ellipse cx="150" cy="200" rx="70" ry="25" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.5" />
            {/* Diamond */}
            <polygon points="150,80 180,130 150,160 120,130" fill="none" stroke="#D4AF37" strokeWidth="2" />
            <line x1="150" y1="80" x2="150" y2="160" stroke="#D4AF37" strokeWidth="1" opacity="0.5" />
            <line x1="120" y1="130" x2="180" y2="130" stroke="#D4AF37" strokeWidth="1" opacity="0.5" />
            {/* Setting */}
            <line x1="135" y1="155" x2="130" y2="185" stroke="#D4AF37" strokeWidth="2" />
            <line x1="165" y1="155" x2="170" y2="185" stroke="#D4AF37" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center" style={{ zIndex: 3 }}>
        <div className="text-center px-4 max-w-3xl">
          <div className="animate-fade-in-up">
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-2">
              <span className="text-gradient-gold">Adi Bergman</span>
            </h1>
            <div className="w-24 h-0.5 bg-gold mx-auto my-6 animate-shimmer" />
            <h2 className="font-heading text-3xl md:text-4xl text-white/90 mb-4">
              תכשיטי מויסנייט מעוצבים
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-10 font-light">
              יוקרה שאפשר להרגיש — ברק של יהלום, עיצוב ישראלי מקורי
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/products"
                className="px-8 py-3 bg-gold text-charcoal font-semibold rounded-sm hover:bg-gold-light transition-all duration-300 text-lg"
              >
                לקולקציה
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 border-2 border-gold text-gold font-semibold rounded-sm hover:bg-gold/10 transition-all duration-300 text-lg"
              >
                כניסת לקוחות
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" style={{ zIndex: 3 }}>
        <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
