import { motion, AnimatePresence } from 'framer-motion';
import { useCompass, type AnswerValue } from '@/store/compass';

const OPTIONS: { v: AnswerValue; label: string; short: string }[] = [
  { v: -2, label: 'Discordo totalmente', short: '−−' },
  { v: -1, label: 'Discordo', short: '−' },
  { v: 0, label: 'Neutro', short: '◦' },
  { v: 1, label: 'Concordo', short: '+' },
  { v: 2, label: 'Concordo totalmente', short: '++' },
];

export function QuizPanel() {
  const q = useCompass(s => s.current());
  const cursor = useCompass(s => s.cursor);
  const answer = useCompass(s => s.answer);
  const skip = useCompass(s => s.skip);

  if (!q) return null;
  const total = useCompass.getState().queue.length;
  const progress = ((cursor % total) / total) * 100;

  return (
    <div className="glass-strong rounded-lg p-4 hud-corner">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono tracking-widest text-cyber-cyan text-glow">PROPOSIÇÃO</span>
          <span className="text-[10px] font-mono opacity-60">#{String(q.id).padStart(3, '0')}</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border opacity-80">{q.category}</span>
        </div>
        <div className="text-[10px] font-mono opacity-60">{cursor} / {total} respondidas</div>
      </div>

      <div className="h-px bg-border/60 mb-3 relative overflow-hidden">
        <div className="absolute inset-y-0 left-0" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--brasil-green), var(--cyber-cyan))', boxShadow: '0 0 10px var(--cyber-cyan)' }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.h2
          key={q.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="text-lg md:text-xl font-medium leading-snug mb-4"
        >
          "{q.text}"
        </motion.h2>
      </AnimatePresence>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {OPTIONS.map(opt => (
          <button
            key={opt.v}
            onClick={() => answer(q.id, opt.v)}
            className="group relative px-3 py-2 rounded border border-border/70 hover:border-cyber-cyan transition-all text-xs font-mono tracking-wider hover:bg-cyber-cyan/5"
          >
            <span className="block text-base font-semibold text-cyber-cyan group-hover:text-glow">{opt.short}</span>
            <span className="block opacity-70 text-[10px]">{opt.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] font-mono opacity-60">
        <span>peso vetorial · X {q.axisX.toFixed(1)} · Y {q.axisY.toFixed(1)}</span>
        <button onClick={skip} className="hover:text-cyber-cyan transition-colors">pular ›</button>
      </div>
    </div>
  );
}
