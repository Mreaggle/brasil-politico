import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Compass } from "@/components/Compass";
import { QuizPanel } from "@/components/QuizPanel";
import { SidePanel } from "@/components/SidePanel";
import { RankingPanel } from "@/components/RankingPanel";
import { ElectionPanel } from "@/components/ElectionPanel";
import { AboutPanel } from "@/components/AboutPanel";
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
          "Explore seu mapa ideológico, compare propostas de seis candidatos e crie um card para compartilhar após 30 respostas.",
      },
      { property: "og:title", content: "Brasil Político 2026" },
      {
        property: "og:description",
        content: "Responda, descubra suas afinidades e compartilhe seu mapa político.",
      },
    ],
  }),
  component: Page,
});

type PageTab = "compass" | "election" | "about";

export function Page() {
  const [activeTab, setActiveTab] = useState<PageTab>("compass");
  const [supportOpen, setSupportOpen] = useState(false);
  const reset = useCompass((s) => s.reset);
  const shuffle = useCompass((s) => s.shuffle);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 800, h: 520 });

  useEffect(() => {
    shuffle();
  }, [shuffle]);

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
  }, []);

  return (
    <div className="h-[100dvh] min-h-[100dvh] w-full overflow-hidden text-foreground relative">
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
          <main className="flex-1 min-h-0 px-3 sm:px-5 xl:px-7 py-4 overflow-y-auto scroll-cyber">
            <div className="mx-auto max-w-[1800px] grid grid-cols-1 lg:grid-cols-[minmax(220px,260px)_minmax(0,1fr)_minmax(235px,280px)] 2xl:grid-cols-[minmax(250px,290px)_minmax(0,1fr)_minmax(260px,310px)] gap-4 items-start">
              <div className="order-2 lg:order-1 min-w-0">
                <SidePanel />
              </div>

              <div className="order-1 lg:order-2 flex flex-col gap-4 min-w-0">
                <div
                  ref={wrapRef}
                  className="h-[min(56vh,520px)] min-h-[340px] sm:h-[min(62vh,590px)] lg:h-[clamp(400px,58dvh,680px)] min-w-0 w-full"
                >
                  <Compass width={dims.w} height={dims.h} />
                </div>
                <div className="shrink-0">
                  <QuizPanel />
                </div>
              </div>

              <div className="order-3 min-w-0">
                <RankingPanel />
              </div>
            </div>
          </main>
        ) : activeTab === "election" ? (
          <main className="flex-1 min-h-0 overflow-y-auto scroll-cyber">
            <ElectionPanel />
          </main>
        ) : (
          <main className="flex-1 min-h-0 overflow-y-auto scroll-cyber">
            <AboutPanel
              onOpenMap={() => setActiveTab("compass")}
              onOpenElection={() => setActiveTab("election")}
              onOpenSupport={() => setSupportOpen(true)}
            />
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
  activeTab: PageTab;
  onTabChange: (tab: PageTab) => void;
  onReset: () => void;
  onOpenSupport: () => void;
  supportOpen: boolean;
}) {
  return (
    <header className="px-3 md:px-6 py-2.5 md:py-3 grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-3 border-b border-border/50">
      <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
        <Logo />
        <div className="min-w-0">
          <h1 className="text-[11px] sm:text-[13px] md:text-base font-semibold tracking-tight whitespace-nowrap">
            BRASIL POLÍTICO <span className="text-accent text-glow">2026</span>
          </h1>
          <div className="hidden sm:block text-[10px] font-mono opacity-60 tracking-widest truncate">
            DESCUBRA SEU LUGAR NO MAPA
          </div>
        </div>
      </div>
      <nav
        aria-label="Seções do site"
        className="order-3 lg:order-none col-span-2 lg:col-span-1 flex items-center justify-center rounded-md border border-border/70 p-1 bg-background/30"
      >
        <button
          type="button"
          onClick={() => onTabChange("compass")}
          aria-pressed={activeTab === "compass"}
          className={`flex-1 md:flex-none whitespace-nowrap px-1.5 sm:px-2.5 md:px-3 py-1.5 rounded text-[9px] sm:text-[10px] font-mono tracking-wider sm:tracking-widest transition-all ${activeTab === "compass" ? "bg-cyber-cyan/10 text-cyber-cyan text-glow" : "opacity-60 hover:opacity-100"}`}
        >
          MAPA IDEOLÓGICO
        </button>
        <button
          type="button"
          onClick={() => onTabChange("election")}
          aria-pressed={activeTab === "election"}
          className={`flex-1 md:flex-none whitespace-nowrap px-1.5 sm:px-2.5 md:px-3 py-1.5 rounded text-[9px] sm:text-[10px] font-mono tracking-wider sm:tracking-widest transition-all ${activeTab === "election" ? "bg-accent/10 text-accent text-glow" : "opacity-60 hover:opacity-100"}`}
        >
          ELEIÇÕES 2026
        </button>
        <button
          type="button"
          onClick={() => onTabChange("about")}
          aria-pressed={activeTab === "about"}
          className={`flex-1 md:flex-none whitespace-nowrap px-1.5 sm:px-2.5 md:px-3 py-1.5 rounded text-[9px] sm:text-[10px] font-mono tracking-wider sm:tracking-widest transition-all ${activeTab === "about" ? "bg-brasil-green/10 text-brasil-green" : "opacity-60 hover:opacity-100"}`}
        >
          SOBRE
        </button>
      </nav>
      <div className="flex items-center justify-end gap-1.5 md:gap-3">
        <div className="hidden md:flex items-center gap-2 text-[10px] font-mono opacity-70">
          <span className="w-1.5 h-1.5 rounded-full bg-primary blink" />
          SEU MAPA
        </div>
        <button
          onClick={onOpenSupport}
          className="support-trigger"
          aria-label="Apoiar o projeto"
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
          className={`${activeTab !== "compass" ? "invisible" : ""} mobile-reset inline-flex items-center gap-1.5 text-[10px] font-mono p-2 md:px-3 md:py-1.5 rounded border border-border hover:border-accent hover:text-accent transition-colors tracking-widest`}
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
