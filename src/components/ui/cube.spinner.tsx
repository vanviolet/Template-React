import { cn } from '@/utils/cn';

export interface CubeSpinnerProps {
  className?: string;
  size?: number;
}

export function CubeSpinner({ className, size = 44 }: CubeSpinnerProps) {
  const halfSize = size / 2;

  return (
    <div
      className={cn('cube-spinner', className)}
      style={{ width: size, height: size }}
    >
      <div style={{ transform: `translateZ(-${halfSize}px) rotateY(180deg)` }} />
      <div style={{ transform: `rotateY(-270deg) translateX(50%)`, transformOrigin: 'top right' }} />
      <div style={{ transform: `rotateY(270deg) translateX(-50%)`, transformOrigin: 'center left' }} />
      <div style={{ transform: `rotateX(90deg) translateY(-50%)`, transformOrigin: 'top center' }} />
      <div style={{ transform: `rotateX(-90deg) translateY(50%)`, transformOrigin: 'bottom center' }} />
      <div style={{ transform: `translateZ(${halfSize}px)` }} />
    </div>
  );
}
