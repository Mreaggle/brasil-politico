import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Compass } from "@/components/Compass";
import { QuizPanel } from "@/components/QuizPanel";
import { SidePanel } from "@/components/SidePanel";
import { RankingPanel } from "@/components/RankingPanel";
import { BootScreen } from "@/components/BootScreen";
import { ElectionPanel } from "@/components/ElectionPanel";
import { SupportModal } from "@/components/SupportModal";
import { useCompass } from "@/store/compass";
import { HeartHandshake, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brasil Político 2026 — Mapa Ideológico Interativo" },
      {
        name: "description",
        content:
          "Central futurista de análise ideológica brasileira para as eleições de 2026. Political compass interativo com 50+ correntes e 200+ proposições.",
      },
      { property: "og:title", content: "Brasil Político 2026" },
      {
        property: "og:description",
        content:
          "Explore o espectro ideológico brasileiro em uma central interativa cyber-institucional.",
      },
    ],
  }),
  component: Page,
});

export function Page() {
  const [booting, setBooting] = useState(true);
  const [activeTab, setActiveTab] = useState<"compass" | "election">("compass");
  const [supportOpen, setSupportOpen] = useState(false);
  const reset = useCompass((s) => s.reset);
  const shuffle = useCompass((s) => s.shuffle);
  const startSimulation = useCompass((s) => s.startSimulation);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 800, h: 520 });

  useEffect(() => {
    shuffle();
  }, [shuffle]);
  useEffect(() => startSimulation(), [startSimulation]);

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
    window.addEventListener("resize", calc);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", calc);
    };
  }, [booting]);

  return (
    <div className="h-[100dvh] min-h-[100dvh] w-full overflow-hidden text-foreground relative">
      {booting && <BootScreen onDone={() => setBooting(false)} />}

      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 80% -10%, color-mix(in oklch, var(--brasil-green) 25%, transparent), transparent 50%), radial-gradient(circle at -10% 110%, color-mix(in oklch, var(--brasil-blue) 30%, transparent), transparent 50%)",
        }}
      />

      <div className="relative z-10 h-full flex flex-col">
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onReset={reset}
          onOpenSupport={() => setSupportOpen(true)}
          supportOpen={supportOpen}
        />

        {activeTab === "compass" ? (
          <main className="flex-1 min-h-0 px-2.5 sm:px-3 md:px-5 pb-3 md:pb-5 overflow-y-auto lg:overflow-hidden scroll-cyber">
            <div className="min-h-full lg:h-full grid grid-cols-1 lg:grid-cols-[300px_1fr_320px] gap-3 lg:gap-4">
              <div className="hidden lg:block h-full min-h-0 overflow-hidden">
                <SidePanel />
              </div>

              <div className="flex flex-col gap-3 min-h-0 pt-3 lg:pt-0">
                <div
                  ref={wrapRef}
                  className="h-[min(56vh,480px)] min-h-[350px] sm:h-[520px] lg:h-auto lg:flex-1 lg:min-h-0 w-full"
                >
                  <Compass width={dims.w} height={dims.h} />
                </div>
                <div className="shrink-0">
                  <QuizPanel />
                </div>
              </div>

              <div className="hidden lg:block h-full min-h-0 overflow-hidden">
                <RankingPanel />
              </div>
            </div>

            <div className="lg:hidden mt-3 space-y-3 pb-[max(0px,env(safe-area-inset-bottom))]">
              <SidePanel />
              <RankingPanel />
            </div>
          </main>
        ) : (
          <main className="flex-1 min-h-0 overflow-y-auto scroll-cyber">
            <ElectionPanel />
          </main>
        )}
      </div>

      {supportOpen && <SupportModal onClose={() => setSupportOpen(false)} />}
    </div>
  );
}

function Header({
  activeTab,
  onTabChange,
  onReset,
  onOpenSupport,
  supportOpen,
}: {
  activeTab: "compass" | "election";
  onTabChange: (tab: "compass" | "election") => void;
  onReset: () => void;
  onOpenSupport: () => void;
  supportOpen: boolean;
}) {
  return (
    <header className="px-3 md:px-6 py-2.5 md:py-3 grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-3 border-b border-border/50">
      <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
        <Logo />
        <div className="min-w-0">
          <h1 className="text-[13px] md:text-base font-semibold tracking-tight whitespace-nowrap">
            BRASIL POLÍTICO <span className="text-accent text-glow">2026</span>
          </h1>
          <div className="hidden sm:block text-[10px] font-mono opacity-60 tracking-widest truncate">
            CENTRAL · MAPA IDEOLÓGICO INTERATIVO
          </div>
        </div>
      </div>
      <div className="order-3 md:order-none col-span-2 md:col-span-1 flex items-center justify-center rounded-md border border-border/70 p-1 bg-background/30">
        <button
          onClick={() => onTabChange("compass")}
          className={`flex-1 md:flex-none px-2.5 md:px-3 py-1.5 rounded text-[9px] sm:text-[10px] font-mono tracking-wider sm:tracking-widest transition-all ${activeTab === "compass" ? "bg-cyber-cyan/10 text-cyber-cyan text-glow" : "opacity-60 hover:opacity-100"}`}
        >
          MAPA IDEOLÓGICO
        </button>
        <button
          onClick={() => onTabChange("election")}
          className={`flex-1 md:flex-none px-2.5 md:px-3 py-1.5 rounded text-[9px] sm:text-[10px] font-mono tracking-wider sm:tracking-widest transition-all ${activeTab === "election" ? "bg-accent/10 text-accent text-glow" : "opacity-60 hover:opacity-100"}`}
        >
          ELEIÇÕES 2026
        </button>
      </div>
      <div className="flex items-center justify-end gap-1.5 md:gap-3">
        <div className="hidden md:flex items-center gap-2 text-[10px] font-mono opacity-70">
          <span className="w-1.5 h-1.5 rounded-full bg-primary blink" />
          PAINEL ATIVO
        </div>
        <button
          onClick={onOpenSupport}
          className="support-trigger"
          aria-haspopup="dialog"
          aria-expanded={supportOpen}
        >
          <HeartHandshake size={15} aria-hidden="true" />
          <span>APOIAR</span>
        </button>
        <button
          onClick={onReset}
          aria-label="Reiniciar mapa ideológico"
          title="Reiniciar mapa ideológico"
          className={`${activeTab === "election" ? "invisible" : ""} mobile-reset inline-flex items-center gap-1.5 text-[10px] font-mono p-2 md:px-3 md:py-1.5 rounded border border-border hover:border-accent hover:text-accent transition-colors tracking-widest`}
        >
          <span className="hidden md:inline">RESET</span>
          <RotateCcw size={13} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div
      className="relative w-8 h-8 md:w-9 md:h-9 rounded-md flex items-center justify-center shrink-0"
      style={{
        background:
          "conic-gradient(from 0deg, var(--brasil-green), var(--brasil-yellow), var(--brasil-blue), var(--brasil-green))",
        boxShadow: "0 0 18px color-mix(in oklch, var(--brasil-green) 60%, transparent)",
      }}
    >
      <div className="absolute inset-[2px] rounded bg-background flex items-center justify-center">
        <span className="text-[10px] font-mono font-bold text-accent text-glow">BR</span>
      </div>
    </div>
  );
}
