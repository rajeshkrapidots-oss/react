import { useEffect, useRef, useState, type ReactNode } from 'react';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: LucideIcon;
  index?: number;
  accentColor?: string;
}

/** Animates a number from 0 → target over `duration` ms */
const useCountUp = (target: number, duration = 1200, start = false) => {
  const [current, setCurrent] = useState(0);
  const raf = useRef<number>();

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCurrent(Math.round(target * ease));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration, start]);

  return current;
};

/** Parse numeric value from formatted string like "$48,352" or "3.24%" */
const parseStatValue = (val: string): { numeric: number; prefix: string; suffix: string; hasDecimal: boolean } => {
  const prefix = val.match(/^[^0-9]*/)?.[0] || '';
  const suffix = val.match(/[^0-9,.]*$/)?.[0] || '';
  const numStr = val.replace(/[^0-9.]/g, '');
  const hasDecimal = numStr.includes('.');
  return { numeric: parseFloat(numStr) || 0, prefix, suffix, hasDecimal };
};

const formatNumber = (n: number, hasDecimal: boolean): string => {
  if (hasDecimal) return n.toFixed(2);
  return n.toLocaleString();
};

export const StatCard = ({ label, value, change, up, icon: Icon, index = 0, accentColor }: StatCardProps) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { numeric, prefix, suffix, hasDecimal } = parseStatValue(value);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const count = useCountUp(hasDecimal ? numeric * 100 : numeric, 1400, visible);
  const displayValue = hasDecimal ? (count / 100).toFixed(2) : formatNumber(count, false);

  return (
    <div
      ref={ref}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Accent glow */}
      <div
        className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
        style={{ backgroundColor: accentColor || 'hsl(var(--primary))' }}
      />

      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="mt-3 text-3xl font-bold tracking-tight text-card-foreground">
          {prefix}{displayValue}{suffix}
        </div>

        <div className="mt-2 flex items-center gap-1.5">
          <div className={cn(
            'flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold',
            up ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          )}>
            {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {change}
          </div>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      </div>
    </div>
  );
};
