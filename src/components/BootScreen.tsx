import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function BootScreen({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const sequence = [
    'INIT · BRASIL POLÍTICO 2026 v0.26.1',
    'CARREGANDO MATRIZ IDEOLÓGICA · 50 CORRENTES',
    'SINCRONIZANDO BANCO DE PROPOSIÇÕES · 205 ITENS',
    'CALIBRANDO EIXO ECONÔMICO ··· OK',
    'CALIBRANDO EIXO AUTORITÁRIO/LIBERTÁRIO ··· OK',
    'INICIALIZANDO HUD VETORIAL · CYBER-INST · BR',
    'SISTEMA PRONTO · ENGAJAR',
  ];

  useEffect(() => {
    let i = 0;
    const tick = () => {
      if (i < sequence.length) {
        setLines(l => [...l, sequence[i]]);
        i++;
        setTimeout(tick, 220);
      } else {
        setTimeout(onDone, 600);
      }
    };
    tick();
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-[100] flex items-center justify-center grid-bg"
      >
        <div className="scanlines absolute inset-0 opacity-30 pointer-events-none" />
        <div className="glass-strong p-6 w-[min(560px,92vw)] rounded-lg hud-corner">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-mono tracking-[0.4em] text-cyber-cyan text-glow">CENTRAL DE INTELIGÊNCIA IDEOLÓGICA</div>
            <div className="text-[10px] font-mono opacity-60">BR · 2026</div>
          </div>
          <div className="text-[11px] font-mono space-y-1 min-h-[180px]">
            {lines.map((l, i) => (
              <div key={i} className="opacity-90">
                <span className="text-accent">▸</span> {l}
              </div>
            ))}
            <div className="opacity-60 blink">_</div>
          </div>
          <div className="mt-4 h-1 bg-border/60 rounded relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 boot-bar" style={{ background: 'linear-gradient(90deg, var(--brasil-green), var(--brasil-yellow), var(--cyber-cyan))', boxShadow: '0 0 12px var(--cyber-cyan)' }} />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
