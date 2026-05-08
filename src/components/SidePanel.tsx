import { useCompass } from '@/store/compass';
import { motion } from 'framer-motion';

export function SidePanel() {
  const { x, y } = useCompass();
  const affinities = useCompass(s => s.affinities());
  const trail = useCompass(s => s.trail);

  const econ = x < -1 ? 'Coletivista' : x > 1 ? 'Liberal' : 'Centro';
  const social = y < -1 ? 'Libertário' : y > 1 ? 'Autoritário' : 'Moderado';

  return (
    <aside className="flex flex-col gap-4 w-full lg:w-[340px] shrink-0">
      <Card title="DIAGNÓSTICO" badge="LIVE">
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <Stat label="EIXO X" value={x.toFixed(2)} hint={econ} />
          <Stat label="EIXO Y" value={y.toFixed(2)} hint={social} />
        </div>
        <div className="mt-3 text-[10px] font-mono opacity-70 leading-relaxed">
          <span className="text-cyber-cyan text-glow">{social}</span> · <span className="text-accent text-glow">{econ}</span>
          <br />
          Coordenadas atualizadas em tempo real conforme respostas.
        </div>
      </Card>

      <Card title="AFINIDADES IDEOLÓGICAS" badge={`TOP ${affinities.length}`}>
        <div className="space-y-2">
          {affinities.map((a, i) => (
            <div key={a.id} className="group">
              <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                <span className="flex items-center gap-2">
                  <span className="opacity-50 w-4">{String(i + 1).padStart(2, '0')}</span>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: a.color, boxShadow: `0 0 6px ${a.color}` }} />
                  <span className="opacity-90">{a.name}</span>
                </span>
                <span className="opacity-80" style={{ color: a.color }}>{a.pct}%</span>
              </div>
              <div className="h-1 bg-border/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${a.pct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: a.color, boxShadow: `0 0 8px ${a.color}` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="TRAJETÓRIA" badge={`${trail.length} pts`}>
        <Sparkline trail={trail} />
        <div className="text-[10px] font-mono opacity-60 mt-2">
          Movimento ideológico nas últimas {Math.min(trail.length, 40)} respostas.
        </div>
      </Card>
    </aside>
  );
}

function Card({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-lg p-4 hud-corner">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-mono tracking-[0.3em] text-cyber-cyan text-glow">{title}</h3>
        {badge && <span className="text-[9px] font-mono px-1.5 py-0.5 border border-border rounded opacity-70 blink">{badge}</span>}
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="border border-border/60 rounded p-2">
      <div className="text-[9px] tracking-widest opacity-60">{label}</div>
      <div className="text-lg font-semibold text-accent text-glow">{value}</div>
      <div className="text-[9px] opacity-70">{hint}</div>
    </div>
  );
}

function Sparkline({ trail }: { trail: { x: number; y: number }[] }) {
  const w = 280, h = 60;
  const pts = trail.map((t, i) => {
    const px = (i / Math.max(trail.length - 1, 1)) * w;
    const mag = Math.sqrt(t.x * t.x + t.y * t.y);
    const py = h - (mag / 14) * h;
    return `${px},${py}`;
  }).join(' ');
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke="var(--cyber-cyan)" strokeWidth={1.4} style={{ filter: 'drop-shadow(0 0 6px var(--cyber-cyan))' }} />
    </svg>
  );
}
