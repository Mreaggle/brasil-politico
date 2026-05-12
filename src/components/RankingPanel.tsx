import { useGlobalRanking } from '@/store/compass';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export function RankingPanel() {
  const { list, total } = useGlobalRanking(20);
  const top = list[0];
  const max = list[0]?.count ?? 1;

  return (
    <aside className="flex flex-col gap-3 w-full h-full min-h-0">
      <div className="glass rounded-lg p-3 hud-corner flex-1 min-h-0 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[10px] font-mono tracking-[0.3em] text-cyber-cyan text-glow">
            RANKING NACIONAL · TOP 20
          </h3>
          <span className="text-[9px] font-mono px-1.5 py-0.5 border border-border rounded opacity-70 blink">
            LIVE
          </span>
        </div>
        <div className="text-[9px] font-mono opacity-50 mb-2">
          {Math.round(total).toLocaleString('pt-BR')} sinais agregados em tempo real
        </div>
        <div className="flex-1 min-h-0 scroll-cyber pr-1.5 flex flex-col gap-1">
          <AnimatePresence initial={false}>
            {list.map((a, i) => (
              <motion.div
                key={a.id}
                layout
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="group"
              >
                <div className="flex items-center justify-between text-[10.5px] font-mono mb-0.5">
                  <span className="flex items-center gap-1.5 min-w-0">
                    <span className="opacity-50 w-4 shrink-0 text-right">{String(i + 1).padStart(2, '0')}</span>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: a.color, boxShadow: `0 0 6px ${a.color}` }} />
                    <span className="opacity-90 truncate">{a.name}</span>
                  </span>
                  <span className="opacity-70 shrink-0 ml-2" style={{ color: a.color }}>
                    {a.pct.toFixed(1)}%
                  </span>
                </div>
                <div className="h-[3px] bg-border/60 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(a.count / max) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: a.color, boxShadow: `0 0 6px ${a.color}` }}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {top && (
        <div className="glass rounded-lg p-3 hud-corner shrink-0" style={{ borderColor: top.color, boxShadow: `0 0 24px color-mix(in oklch, ${top.color} 18%, transparent)` }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[10px] font-mono tracking-[0.3em] text-cyber-cyan text-glow">
              CORRENTE EM ALTA · #1
            </h3>
            <span className="w-2 h-2 rounded-full" style={{ background: top.color, boxShadow: `0 0 10px ${top.color}` }} />
          </div>
          <motion.div
            key={top.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="prose prose-invert prose-sm max-w-none [&_h1]:text-sm [&_h1]:font-semibold [&_h1]:mb-1 [&_h1]:text-foreground [&_p]:text-[10.5px] [&_p]:leading-snug [&_p]:my-1 [&_p]:opacity-80 [&_strong]:text-foreground max-h-[180px] scroll-cyber pr-1.5"
          >
            <ReactMarkdown>{top.markdown}</ReactMarkdown>
          </motion.div>
        </div>
      )}
    </aside>
  );
}
