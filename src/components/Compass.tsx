import { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LocateFixed, Minus, Plus } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ideologies, type Ideology } from "@/data/ideologies";
import { getIdeologyFigures } from "@/data/ideologyFigures";
import { useCompass, useAffinities } from "@/store/compass";

type Props = { width: number; height: number };
type MapView = { scale: number; x: number; y: number };
type PointerPoint = { x: number; y: number };

export function Compass({ width, height }: Props) {
  const x = useCompass((s) => s.x);
  const y = useCompass((s) => s.y);
  const trail = useCompass((s) => s.trail);
  const [hover, setHover] = useState<Ideology | null>(null);
  const [mouse, setMouse] = useState({ mx: 0, my: 0 });
  const [view, setView] = useState<MapView>({ scale: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const viewRef = useRef(view);
  const pointers = useRef(new Map<number, PointerPoint>());
  const lastSingle = useRef<{ id: number; point: PointerPoint } | null>(null);
  const lastPinch = useRef<{ distance: number; center: PointerPoint } | null>(null);
  const affinities = useAffinities(8);
  const topIds = useMemo(() => new Set(affinities.slice(0, 5).map((a) => a.id)), [affinities]);

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

  const applyView = (next: MapView) => {
    const scale = Math.max(1, Math.min(3.5, next.scale));
    const bounded = {
      scale,
      x: Math.max(width * (1 - scale), Math.min(0, next.x)),
      y: Math.max(height * (1 - scale), Math.min(0, next.y)),
    };
    viewRef.current = bounded;
    setView(bounded);
  };

  const zoomAt = (nextScale: number, anchorX: number, anchorY: number) => {
    const current = viewRef.current;
    const scale = Math.max(1, Math.min(3.5, nextScale));
    const factor = scale / current.scale;
    applyView({
      scale,
      x: anchorX - (anchorX - current.x) * factor,
      y: anchorY - (anchorY - current.y) * factor,
    });
  };

  const relativePoint = (clientX: number, clientY: number) => {
    const bounds = ref.current!.getBoundingClientRect();
    return { x: clientX - bounds.left, y: clientY - bounds.top };
  };

  const pinchMetrics = () => {
    const [a, b] = [...pointers.current.values()];
    return {
      distance: Math.hypot(b.x - a.x, b.y - a.y),
      center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
    };
  };

  return (
    <div
      ref={ref}
      className={`relative grid-bg neon-border rounded-lg overflow-hidden hud-corner select-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{ width, height, touchAction: "none" }}
      onWheel={(event) => {
        event.preventDefault();
        const point = relativePoint(event.clientX, event.clientY);
        zoomAt(viewRef.current.scale * (event.deltaY < 0 ? 1.16 : 0.86), point.x, point.y);
      }}
      onDoubleClick={(event) => {
        const point = relativePoint(event.clientX, event.clientY);
        zoomAt(viewRef.current.scale * 1.45, point.x, point.y);
      }}
      onPointerDown={(event) => {
        if ((event.target as HTMLElement).closest("[data-map-control]")) return;
        const point = relativePoint(event.clientX, event.clientY);
        pointers.current.set(event.pointerId, point);
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragging(true);
        if (pointers.current.size === 1) {
          lastSingle.current = { id: event.pointerId, point };
        } else if (pointers.current.size === 2) {
          lastPinch.current = pinchMetrics();
          lastSingle.current = null;
        }
      }}
      onPointerMove={(event) => {
        const bounds = ref.current!.getBoundingClientRect();
        setMouse({ mx: event.clientX - bounds.left, my: event.clientY - bounds.top });
        if (!pointers.current.has(event.pointerId)) return;

        const point = relativePoint(event.clientX, event.clientY);
        pointers.current.set(event.pointerId, point);

        if (pointers.current.size >= 2) {
          const previous = lastPinch.current;
          const current = pinchMetrics();
          if (previous && previous.distance > 0) {
            const before = viewRef.current;
            const scale = Math.max(
              1,
              Math.min(3.5, before.scale * (current.distance / previous.distance)),
            );
            const factor = scale / before.scale;
            applyView({
              scale,
              x: current.center.x - (previous.center.x - before.x) * factor,
              y: current.center.y - (previous.center.y - before.y) * factor,
            });
          }
          lastPinch.current = current;
          return;
        }

        const previous = lastSingle.current;
        if (previous?.id === event.pointerId) {
          const before = viewRef.current;
          applyView({
            ...before,
            x: before.x + point.x - previous.point.x,
            y: before.y + point.y - previous.point.y,
          });
        }
        lastSingle.current = { id: event.pointerId, point };
      }}
      onPointerUp={(event) => {
        pointers.current.delete(event.pointerId);
        lastPinch.current = null;
        const remaining = [...pointers.current.entries()][0];
        lastSingle.current = remaining ? { id: remaining[0], point: remaining[1] } : null;
        if (!remaining) setDragging(false);
      }}
      onPointerCancel={(event) => {
        pointers.current.delete(event.pointerId);
        lastPinch.current = null;
        lastSingle.current = null;
        setDragging(false);
      }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        setMouse({ mx: e.clientX - r.left, my: e.clientY - r.top });
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          width,
          height,
          transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
          transformOrigin: "0 0",
          willChange: "transform",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute"
            style={{
              left: 0,
              top: 0,
              width: "50%",
              height: "50%",
              background:
                "radial-gradient(ellipse at 30% 30%, color-mix(in oklch, var(--q-auth-left) 18%, transparent), transparent 70%)",
            }}
          />
          <div
            className="absolute"
            style={{
              right: 0,
              top: 0,
              width: "50%",
              height: "50%",
              background:
                "radial-gradient(ellipse at 70% 30%, color-mix(in oklch, var(--q-auth-right) 18%, transparent), transparent 70%)",
            }}
          />
          <div
            className="absolute"
            style={{
              left: 0,
              bottom: 0,
              width: "50%",
              height: "50%",
              background:
                "radial-gradient(ellipse at 30% 70%, color-mix(in oklch, var(--q-lib-left) 18%, transparent), transparent 70%)",
            }}
          />
          <div
            className="absolute"
            style={{
              right: 0,
              bottom: 0,
              width: "50%",
              height: "50%",
              background:
                "radial-gradient(ellipse at 70% 70%, color-mix(in oklch, var(--q-lib-right) 18%, transparent), transparent 70%)",
            }}
          />
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute left-0 right-0 top-1/2 h-px"
            style={{
              background: "color-mix(in oklch, var(--cyber-cyan) 40%, transparent)",
              boxShadow: "0 0 18px color-mix(in oklch, var(--cyber-cyan) 40%, transparent)",
            }}
          />
          <div
            className="absolute top-0 bottom-0 left-1/2 w-px"
            style={{
              background: "color-mix(in oklch, var(--cyber-cyan) 40%, transparent)",
              boxShadow: "0 0 18px color-mix(in oklch, var(--cyber-cyan) 40%, transparent)",
            }}
          />
        </div>

        <Label className="top-2 left-1/2 -translate-x-1/2">AUTORITÁRIO</Label>
        <Label className="bottom-2 left-1/2 -translate-x-1/2">LIBERTÁRIO</Label>
        <Label className="left-2 top-1/2 -translate-y-1/2 -rotate-90 origin-left translate-x-2">
          ESQUERDA
        </Label>
        <Label className="right-2 top-1/2 -translate-y-1/2 rotate-90 origin-right -translate-x-2">
          DIREITA
        </Label>

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
              onMouseLeave={() => setHover((prev) => (prev?.id === i.id ? null : prev))}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              aria-label={i.name}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: px, top: py }}
            >
              {/* Pulse ring apenas em hover ou top-affinity */}
              {(isHover || isTop) && (
                <span
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${isHover ? "pulse-ring" : ""}`}
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
                className={`absolute text-[8px] sm:text-[9px] font-mono tracking-wide sm:tracking-wider whitespace-nowrap text-foreground/70 group-hover:text-foreground ${isTop ? "block" : "hidden sm:block"}`}
                style={{
                  left: lx,
                  top: ly,
                  textShadow: isHover ? `0 0 8px ${i.color}` : "none",
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
              points={trail
                .map((t) => {
                  const p = project(t.x, t.y);
                  return `${p.px},${p.py}`;
                })
                .join(" ")}
            />
          )}
        </svg>

        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          animate={{ left: userPos.px, top: userPos.py }}
          transition={{ type: "spring", stiffness: 80, damping: 16 }}
        >
          <div className="relative">
            <div
              className="absolute -inset-6 rounded-full pulse-ring"
              style={{ border: "1px solid var(--brasil-yellow)" }}
            />
            <div
              className="absolute -inset-3 rounded-full pulse-ring"
              style={{ border: "1px solid var(--cyber-cyan)", animationDelay: "0.6s" }}
            />
            <div
              className="w-4 h-4 rounded-full"
              style={{
                background: "var(--brasil-yellow)",
                boxShadow: "0 0 24px var(--brasil-yellow), 0 0 8px var(--cyber-cyan)",
              }}
            />
            <div className="absolute left-5 top-1 text-[10px] font-mono tracking-widest text-accent text-glow whitespace-nowrap">
              VOCÊ · X {x.toFixed(2)} / Y {y.toFixed(2)}
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {hover && (
          <motion.div
            key={hover.id}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute glass-strong rounded-md p-3 sm:p-4 max-w-[calc(100%-16px)] sm:max-w-sm pointer-events-none hud-corner z-20"
            style={{
              left: clampPx(mouse.mx + 18, width, 380),
              top: clampPx(mouse.my + 18, height, 280),
              borderColor: hover.color,
              boxShadow: `0 0 30px color-mix(in oklch, ${hover.color} 30%, transparent)`,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: hover.color, boxShadow: `0 0 10px ${hover.color}` }}
              />
              <span className="text-[10px] font-mono tracking-widest opacity-70">
                CORRENTE IDEOLÓGICA
              </span>
            </div>
            <div className="prose prose-invert prose-sm max-w-none [&_h1]:text-base [&_h1]:font-semibold [&_h1]:mb-2 [&_p]:text-xs [&_p]:my-1 [&_strong]:text-foreground">
              <ReactMarkdown>{hover.markdown}</ReactMarkdown>
            </div>
            <div className="mt-3 pt-2 border-t border-border/60">
              <div className="text-[9px] font-mono tracking-[0.2em] text-cyber-cyan mb-1.5">
                FIGURAS EM DESTAQUE
              </div>
              {getIdeologyFigures(hover).map((figure) => (
                <div key={figure.name} className="mb-1.5">
                  <span className="text-[10px] font-semibold">{figure.name}</span>
                  <span className="text-[10px] opacity-65"> — {figure.note}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-[10px] font-mono opacity-60">
              X {hover.x.toFixed(1)} · Y {hover.y.toFixed(1)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        data-map-control
        className="absolute bottom-3 right-3 z-30 flex items-center overflow-hidden rounded-md border border-border/80 bg-background/80 shadow-xl backdrop-blur"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => zoomAt(viewRef.current.scale / 1.25, width / 2, height / 2)}
          className="map-zoom-button"
          aria-label="Diminuir zoom"
          title="Diminuir zoom"
        >
          <Minus size={15} />
        </button>
        <span className="min-w-12 border-x border-border/70 px-2 text-center text-[9px] font-mono">
          {Math.round(view.scale * 100)}%
        </span>
        <button
          type="button"
          onClick={() => zoomAt(viewRef.current.scale * 1.25, width / 2, height / 2)}
          className="map-zoom-button"
          aria-label="Aumentar zoom"
          title="Aumentar zoom"
        >
          <Plus size={15} />
        </button>
        <button
          type="button"
          onClick={() => applyView({ scale: 1, x: 0, y: 0 })}
          className="map-zoom-button border-l border-border/70"
          aria-label="Restaurar enquadramento"
          title="Restaurar enquadramento"
        >
          <LocateFixed size={14} />
        </button>
      </div>

      <div
        data-map-control
        className="pointer-events-none absolute bottom-3 left-3 z-30 hidden rounded border border-border/60 bg-background/65 px-2 py-1 text-[8px] font-mono tracking-wider text-foreground/55 sm:block"
      >
        ARRASTE · RODA PARA ZOOM
      </div>
    </div>
  );
}

function clampPx(v: number, container: number, tipSize: number) {
  return Math.max(8, Math.min(v, container - tipSize - 8));
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`absolute font-mono text-[8px] sm:text-[10px] tracking-[0.22em] sm:tracking-[0.4em] text-cyber-cyan opacity-80 ${className}`}
    >
      {children}
    </div>
  );
}

function QuadrantTitle({
  children,
  pos,
}: {
  children: React.ReactNode;
  pos: "tl" | "tr" | "bl" | "br";
}) {
  const map = {
    tl: "top-6 left-3 sm:left-6 text-left",
    tr: "top-6 right-3 sm:right-6 text-right",
    bl: "bottom-6 left-3 sm:left-6 text-left",
    br: "bottom-6 right-3 sm:right-6 text-right",
  };
  return (
    <div
      className={`absolute ${map[pos]} font-mono text-[8px] sm:text-[10px] tracking-[0.16em] sm:tracking-[0.3em] opacity-50`}
    >
      {children}
    </div>
  );
}
