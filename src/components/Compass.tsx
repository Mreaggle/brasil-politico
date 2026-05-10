import { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ideologies, type Ideology } from '@/data/ideologies';
import { useCompass, useAffinities } from '@/store/compass';

type Props = { width: number; height: number };

export function Compass({ width, height }: Props) {
  const x = useCompass(s => s.x);
  const y = useCompass(s => s.y);
  const trail = useCompass(s => s.trail);
  const [hover, setHover] = useState<Ideology | null>(null);
  const [mouse, setMouse] = useState({ mx: 0, my: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const affinities = useAffinities(8);
  const topIds = useMemo(() => new Set(affinities.slice(0, 5).map(a => a.id)), [affinities]);

  const project = (wx: number, wy: number) => ({
    px: ((wx + 10) / 20) * width,
    py: ((10 - wy) / 20) * height,
  });

  // Anti-overlap: deterministic jitter based on id hash, applied only to label position.
  const labelOffset = (i: Ideology) => {
    let h = 0;
    for (let k = 0; k < i.id.length; k++) h = (h * 31 + i.id.charCodeAt(k)) | 0;
    const ang = (Math.abs(h) % 360) * (Math.PI / 180);
    const r = 14 + (Math.abs(h >> 8) % 10);
    return { lx: Math.cos(ang) * r, ly: Math.sin(ang) * r };
  };

  const userPos = project(x, y);

  return (
    <div
      ref={ref}
      className="relative grid-bg neon-border rounded-lg overflow-hidden hud-corner"
      style={{ width, height }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        setMouse({ mx: e.clientX - r.left, my: e.clientY - r.top });
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute" style={{ left: 0, top: 0, width: '50%', height: '50%', background: 'radial-gradient(ellipse at 30% 30%, color-mix(in oklch, var(--q-auth-left) 18%, transparent), transparent 70%)' }} />
        <div className="absolute" style={{ right: 0, top: 0, width: '50%', height: '50%', background: 'radial-gradient(ellipse at 70% 30%, color-mix(in oklch, var(--q-auth-right) 18%, transparent), transparent 70%)' }} />
        <div className="absolute" style={{ left: 0, bottom: 0, width: '50%', height: '50%', background: 'radial-gradient(ellipse at 30% 70%, color-mix(in oklch, var(--q-lib-left) 18%, transparent), transparent 70%)' }} />
        <div className="absolute" style={{ right: 0, bottom: 0, width: '50%', height: '50%', background: 'radial-gradient(ellipse at 70% 70%, color-mix(in oklch, var(--q-lib-right) 18%, transparent), transparent 70%)' }} />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 right-0 top-1/2 h-px" style={{ background: 'color-mix(in oklch, var(--cyber-cyan) 40%, transparent)', boxShadow: '0 0 18px color-mix(in oklch, var(--cyber-cyan) 40%, transparent)' }} />
        <div className="absolute top-0 bottom-0 left-1/2 w-px" style={{ background: 'color-mix(in oklch, var(--cyber-cyan) 40%, transparent)', boxShadow: '0 0 18px color-mix(in oklch, var(--cyber-cyan) 40%, transparent)' }} />
      </div>

      <Label className="top-2 left-1/2 -translate-x-1/2">AUTORITÁRIO</Label>
      <Label className="bottom-2 left-1/2 -translate-x-1/2">LIBERTÁRIO</Label>
      <Label className="left-2 top-1/2 -translate-y-1/2 -rotate-90 origin-left translate-x-2">ESQUERDA</Label>
      <Label className="right-2 top-1/2 -translate-y-1/2 rotate-90 origin-right -translate-x-2">DIREITA</Label>

      <QuadrantTitle pos="tl">AUT · ESQ</QuadrantTitle>
      <QuadrantTitle pos="tr">AUT · DIR</QuadrantTitle>
      <QuadrantTitle pos="bl">LIB · ESQ</QuadrantTitle>
      <QuadrantTitle pos="br">LIB · DIR</QuadrantTitle>

      <div className="absolute inset-0 pointer-events-none scanlines opacity-40" />

      {ideologies.map((i) => {
        const { px, py } = project(i.x, i.y);
        const isHover = hover?.id === i.id;
        const isTop = topIds.has(i.id);
        const { lx, ly } = labelOffset(i);
        return (
          <button
            key={i.id}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(prev => prev?.id === i.id ? null : prev)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            aria-label={i.name}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: px, top: py }}
          >
            {/* Pulse ring apenas em hover ou top-affinity */}
            {(isHover || isTop) && (
              <span
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${isHover ? 'pulse-ring' : ''}`}
                style={{
                  width: isHover ? 26 : 18,
                  height: isHover ? 26 : 18,
                  border: `1px solid ${i.color}`,
                  opacity: isHover ? 0.9 : 0.55,
                }}
              />
            )}
            <span
              className="block rounded-full transition-all"
              style={{
                width: isHover ? 14 : isTop ? 11 : 8,
                height: isHover ? 14 : isTop ? 11 : 8,
                background: i.color,
                boxShadow: isHover
                  ? `0 0 24px ${i.color}, 0 0 4px ${i.color}`
                  : isTop
                    ? `0 0 12px ${i.color}`
                    : `0 0 6px color-mix(in oklch, ${i.color} 50%, transparent)`,
                opacity: isHover || isTop ? 1 : 0.85,
              }}
            />
            <span
              className="absolute text-[9px] font-mono tracking-wider whitespace-nowrap text-foreground/70 group-hover:text-foreground"
              style={{
                left: lx,
                top: ly,
                textShadow: isHover ? `0 0 8px ${i.color}` : 'none',
                opacity: isHover ? 1 : 0.55,
              }}
            >
              {i.short.toUpperCase()}
            </span>
          </button>
        );
      })}

      <svg className="absolute inset-0 pointer-events-none" width={width} height={height}>
        {trail.length > 1 && (
          <polyline
            fill="none"
            stroke="var(--cyber-cyan)"
            strokeWidth={1.5}
            strokeOpacity={0.6}
            strokeDasharray="3 4"
            points={trail.map(t => {
              const p = project(t.x, t.y);
              return `${p.px},${p.py}`;
            }).join(' ')}
          />
        )}
      </svg>

      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        animate={{ left: userPos.px, top: userPos.py }}
        transition={{ type: 'spring', stiffness: 80, damping: 16 }}
      >
        <div className="relative">
          <div className="absolute -inset-6 rounded-full pulse-ring" style={{ border: '1px solid var(--brasil-yellow)' }} />
          <div className="absolute -inset-3 rounded-full pulse-ring" style={{ border: '1px solid var(--cyber-cyan)', animationDelay: '0.6s' }} />
          <div className="w-4 h-4 rounded-full" style={{ background: 'var(--brasil-yellow)', boxShadow: '0 0 24px var(--brasil-yellow), 0 0 8px var(--cyber-cyan)' }} />
          <div className="absolute left-5 top-1 text-[10px] font-mono tracking-widest text-accent text-glow whitespace-nowrap">
            VOCÊ · X {x.toFixed(2)} / Y {y.toFixed(2)}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {hover && (
          <motion.div
            key={hover.id}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute glass-strong rounded-md p-4 max-w-sm pointer-events-none hud-corner z-20"
            style={{
              left: clampPx(mouse.mx + 18, width, 380),
              top: clampPx(mouse.my + 18, height, 280),
              borderColor: hover.color,
              boxShadow: `0 0 30px color-mix(in oklch, ${hover.color} 30%, transparent)`,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full" style={{ background: hover.color, boxShadow: `0 0 10px ${hover.color}` }} />
              <span className="text-[10px] font-mono tracking-widest opacity-70">CORRENTE IDEOLÓGICA</span>
            </div>
            <div className="prose prose-invert prose-sm max-w-none [&_h1]:text-base [&_h1]:font-semibold [&_h1]:mb-2 [&_p]:text-xs [&_p]:my-1 [&_strong]:text-foreground">
              <ReactMarkdown>{hover.markdown}</ReactMarkdown>
            </div>
            <div className="mt-2 text-[10px] font-mono opacity-60">X {hover.x.toFixed(1)} · Y {hover.y.toFixed(1)}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function clampPx(v: number, container: number, tipSize: number) {
  return Math.max(8, Math.min(v, container - tipSize - 8));
}

function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`absolute font-mono text-[10px] tracking-[0.4em] text-cyber-cyan opacity-80 ${className}`}>
      {children}
    </div>
  );
}

function QuadrantTitle({ children, pos }: { children: React.ReactNode; pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const map = {
    tl: 'top-6 left-6 text-left',
    tr: 'top-6 right-6 text-right',
    bl: 'bottom-6 left-6 text-left',
    br: 'bottom-6 right-6 text-right',
  };
  return (
    <div className={`absolute ${map[pos]} font-mono text-[10px] tracking-[0.3em] opacity-50`}>
      {children}
    </div>
  );
}
