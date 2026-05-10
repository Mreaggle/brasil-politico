import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { Compass } from '@/components/Compass';
import { QuizPanel } from '@/components/QuizPanel';
import { SidePanel } from '@/components/SidePanel';
import { BootScreen } from '@/components/BootScreen';
import { useCompass } from '@/store/compass';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Brasil Político 2026 — Mapa Ideológico Interativo' },
      { name: 'description', content: 'Central futurista de análise ideológica brasileira para as eleições de 2026. Political compass interativo com 50+ correntes e 200+ proposições.' },
      { property: 'og:title', content: 'Brasil Político 2026' },
      { property: 'og:description', content: 'Explore o espectro ideológico brasileiro em uma central interativa cyber-institucional.' },
    ],
  }),
  component: Page,
});

function Page() {
  const [booting, setBooting] = useState(true);
  const reset = useCompass(s => s.reset);
  const shuffle = useCompass(s => s.shuffle);
  const cursor = useCompass(s => s.cursor);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 800, h: 520 });

  useEffect(() => { shuffle(); }, [shuffle]);

  useEffect(() => {
    const calc = () => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setDims({ w: Math.max(320, Math.floor(r.width)), h: Math.max(280, Math.floor(r.height)) });
    };
    calc();
    const ro = new ResizeObserver(calc);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener('resize', calc);
    return () => { ro.disconnect(); window.removeEventListener('resize', calc); };
  }, [booting]);

  return (
    <div className="min-h-screen h-screen w-screen overflow-hidden text-foreground relative">
      {booting && <BootScreen onDone={() => setBooting(false)} />}

      <div className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: 'radial-gradient(circle at 80% -10%, color-mix(in oklch, var(--brasil-green) 25%, transparent), transparent 50%), radial-gradient(circle at -10% 110%, color-mix(in oklch, var(--brasil-blue) 30%, transparent), transparent 50%)' }} />

      <div className="relative z-10 h-full flex flex-col">
        <Header onReset={reset} answered={cursor} />

        <main className="flex-1 min-h-0 px-3 md:px-5 pb-3 md:pb-5">
          <div className="h-full grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
            <div className="hidden lg:block overflow-y-auto pr-1 [scrollbar-width:thin]">
              <SidePanel />
            </div>

            <div className="flex flex-col gap-4 min-h-0">
              <div ref={wrapRef} className="flex-1 min-h-0 w-full">
                <Compass width={dims.w} height={dims.h} />
              </div>
              <div className="shrink-0">
                <QuizPanel />
              </div>
            </div>
          </div>

          <div className="lg:hidden mt-4">
            <SidePanel />
          </div>
        </main>
      </div>
    </div>
  );
}

function Header({ onReset, answered }: { onReset: () => void; answered: number }) {
  return (
    <header className="px-4 md:px-6 py-3 flex items-center justify-between border-b border-border/50">
      <div className="flex items-center gap-3">
        <Logo />
        <div>
          <h1 className="text-sm md:text-base font-semibold tracking-tight">
            BRASIL POLÍTICO <span className="text-accent text-glow">2026</span>
          </h1>
          <div className="text-[10px] font-mono opacity-60 tracking-widest">CENTRAL · MAPA IDEOLÓGICO INTERATIVO</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 text-[10px] font-mono opacity-70">
          <span className="w-1.5 h-1.5 rounded-full bg-primary blink" />
          SINCRONIZADO · {answered} RESPOSTAS
        </div>
        <button onClick={onReset} className="text-[10px] font-mono px-3 py-1.5 rounded border border-border hover:border-accent hover:text-accent transition-colors tracking-widest">
          RESET ⟲
        </button>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="relative w-9 h-9 rounded-md flex items-center justify-center" style={{ background: 'conic-gradient(from 0deg, var(--brasil-green), var(--brasil-yellow), var(--brasil-blue), var(--brasil-green))', boxShadow: '0 0 18px color-mix(in oklch, var(--brasil-green) 60%, transparent)' }}>
      <div className="absolute inset-[2px] rounded bg-background flex items-center justify-center">
        <span className="text-[10px] font-mono font-bold text-accent text-glow">BR</span>
      </div>
    </div>
  );
}
