
import { Particle, Firework } from '../types';

const COLORS = [
  '#FF3D3D', // Brilliant Red
  '#FFD700', // Gold
  '#FF00FF', // Neon Magenta
  '#00FFFF', // Electric Cyan
  '#7FFF00', // Chartreuse
  '#FFFFFF', // Pure White
  '#FF8C00'  // Dark Orange
];

export class FireworkEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private fireworks: Firework[] = [];
  private width: number;
  private height: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Canvas context not found');
    this.ctx = context;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  public resize(w: number, h: number) {
    this.width = w;
    this.height = h;
  }

  public launch(startX?: number) {
    const x = startX || (0.2 + Math.random() * 0.6) * this.width;
    const targetY = Math.random() * (this.height * 0.4) + this.height * 0.1;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    this.fireworks.push({
      x,
      y: this.height,
      targetY,
      speed: 15 + Math.random() * 5,
      particles: [],
      exploded: false,
      color
    });
  }

  private createExplosion(firework: Firework) {
    const count = 150 + Math.floor(Math.random() * 100);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const force = Math.random() * 10 + 2;
      firework.particles.push({
        x: firework.x,
        y: firework.y,
        vx: Math.cos(angle) * force,
        vy: Math.sin(angle) * force,
        alpha: 1,
        color: firework.color,
        size: Math.random() * 2.5 + 0.5,
        friction: 0.95,
        gravity: 0.18,
        life: 0.008 + Math.random() * 0.015
      });
    }
  }

  public updateAndDraw() {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, '#020617');
    gradient.addColorStop(0.6, '#0f172a');
    gradient.addColorStop(1, '#1e1b4b');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.globalCompositeOperation = 'lighter';

    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const f = this.fireworks[i];

      if (!f.exploded) {
        f.y -= f.speed;
        this.ctx.beginPath();
        const rocketGlow = this.ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 10);
        rocketGlow.addColorStop(0, f.color);
        rocketGlow.addColorStop(1, 'transparent');
        this.ctx.fillStyle = rocketGlow;
        this.ctx.arc(f.x, f.y, 10, 0, Math.PI * 2);
        this.ctx.fill();

        if (f.y <= f.targetY) {
          f.exploded = true;
          this.createExplosion(f);
        }
      } else {
        for (let j = f.particles.length - 1; j >= 0; j--) {
          const p = f.particles[j];
          p.vx *= p.friction;
          p.vy *= p.friction;
          p.vy += p.gravity;
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.life;

          if (p.alpha <= 0) {
            f.particles.splice(j, 1);
          } else {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${this.hexToRgb(p.color)}, ${p.alpha})`;
            this.ctx.fill();
            
            if (p.alpha > 0.5) {
              this.ctx.beginPath();
              this.ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
              this.ctx.fillStyle = `rgba(${this.hexToRgb(p.color)}, ${p.alpha * 0.2})`;
              this.ctx.fill();
            }
          }
        }
        
        if (f.particles.length === 0) {
          this.fireworks.splice(i, 1);
        }
      }
    }
    
    this.ctx.globalCompositeOperation = 'source-over';
  }

  private hexToRgb(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }
}
