
export enum AppState {
  INTRO = 'INTRO',
  INTERACTIVE = 'INTERACTIVE',
  FINALE = 'FINALE'
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  friction: number;
  gravity: number;
  life: number;
}

export interface Firework {
  x: number;
  y: number;
  targetY: number;
  speed: number;
  particles: Particle[];
  exploded: boolean;
  color: string;
}
