import { BarChart3, CalendarDays, ExternalLink, Landmark, Users } from "lucide-react";
import {
  candidates,
  electionSources,
  electionUpdatedAt,
  pollInstitutes,
  type Candidate,
} from "@/data/election2026";

export function ElectionPanel() {
  const max = candidates[0].average;

  return (
    <div className="px-3 md:px-6 pb-10">
      <section className="max-w-7xl mx-auto pt-6 md:pt-10">
        <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-4 mb-6">
          <div className="glass-strong hud-corner rounded-xl p-5 md:p-8 overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none opacity-40 grid-bg" />
            <div className="relative">
              <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-cyber-cyan mb-4">
                <Landmark size={14} />
                CORRIDA AO PLANALTO
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight max-w-3xl">
                Eleições presidenciais <span className="text-accent text-glow">2026</span>
              </h2>
              <p className="mt-4 text-sm md:text-base text-foreground/70 max-w-2xl leading-relaxed">
                Panorama consolidado do primeiro turno, perfis dos nomes mais bem colocados e as
                correntes ideológicas associadas às suas trajetórias e plataformas.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-mono">
                <InfoChip
                  icon={<CalendarDays size={12} />}
                  text={`ATUALIZADO · ${electionUpdatedAt.toUpperCase()}`}
                />
                <InfoChip
                  icon={<Users size={12} />}
                  text={`${pollInstitutes.length} INSTITUTOS MAPEADOS`}
                />
              </div>
            </div>
          </div>

          <div className="glass hud-corner rounded-xl p-5">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-cyber-cyan mb-4">
              <BarChart3 size={14} />
              LEITURA DO AGREGADO
            </div>
            <p className="text-sm leading-relaxed text-foreground/75">
              O ranking combina a média publicada pelos agregadores nacionais com a ordem
              consolidada dos levantamentos estimulados registrados no TSE. O corte reúne pesquisas
              divulgadas desde janeiro de 2026, com maior peso para as coletas recentes.
            </p>
            <div className="mt-5 border-t border-border/60 pt-4">
              <div className="text-[9px] font-mono tracking-[0.25em] opacity-50 mb-2">
                INSTITUTOS INCLUÍDOS
              </div>
              <p className="text-[10px] font-mono leading-relaxed text-foreground/60">
                {pollInstitutes.join(" · ")}
              </p>
            </div>
          </div>
        </div>

        <section className="glass hud-corner rounded-xl p-4 md:p-6 mb-6">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
            <div>
              <div className="text-[10px] font-mono tracking-[0.3em] text-cyber-cyan text-glow mb-2">
                MÉDIA NACIONAL · 1º TURNO
              </div>
              <h3 className="text-xl md:text-2xl font-semibold">Ranking consolidado</h3>
            </div>
            <span className="text-[10px] font-mono opacity-50">INTENÇÃO DE VOTO · %</span>
          </div>
          <div className="space-y-4">
            {candidates.map((candidate, index) => (
              <div
                key={candidate.id}
                className="grid grid-cols-[36px_minmax(110px,220px)_1fr_44px] items-center gap-3"
              >
                <span className="text-sm font-mono opacity-40">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{candidate.ballotName}</div>
                  <div className="text-[10px] font-mono opacity-50">{candidate.party}</div>
                </div>
                <div className="h-3 rounded-full bg-border/50 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(candidate.average / max) * 100}%`,
                      background: candidate.color,
                      boxShadow: `0 0 12px ${candidate.color}`,
                    }}
                  />
                </div>
                <span
                  className="text-right font-mono font-semibold"
                  style={{ color: candidate.color }}
                >
                  {candidate.average}%
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-4">
            <div className="text-[10px] font-mono tracking-[0.3em] text-cyber-cyan text-glow mb-2">
              QUEM É QUEM
            </div>
            <h3 className="text-xl md:text-2xl font-semibold">Briefing dos candidatos</h3>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {candidates.map((candidate, index) => (
              <CandidateCard key={candidate.id} candidate={candidate} rank={index + 1} />
            ))}
          </div>
        </section>

        <section className="glass rounded-xl p-5 md:p-6">
          <div className="text-[10px] font-mono tracking-[0.3em] text-cyber-cyan text-glow mb-4">
            FONTES DO PAINEL
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {electionSources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-4 py-3 text-sm hover:border-cyber-cyan hover:text-cyber-cyan transition-colors"
              >
                <span>{source.label}</span>
                <ExternalLink size={14} className="shrink-0 opacity-60" />
              </a>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}

function CandidateCard({ candidate, rank }: { candidate: Candidate; rank: number }) {
  return (
    <article className="glass hud-corner rounded-xl p-5 flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="text-[9px] font-mono tracking-[0.2em] opacity-50 mb-1">
            #{rank} · {candidate.party}
          </div>
          <h4 className="text-lg font-semibold">{candidate.name}</h4>
          <p className="text-[10px] font-mono mt-1" style={{ color: candidate.color }}>
            {candidate.role}
          </p>
        </div>
        <span
          className="text-2xl font-mono font-semibold text-glow"
          style={{ color: candidate.color }}
        >
          {candidate.average}%
        </span>
      </div>
      <p className="text-xs leading-relaxed text-foreground/75">{candidate.brief}</p>
      <p className="text-xs leading-relaxed text-foreground/65 mt-3">{candidate.agenda}</p>
      <div className="mt-auto pt-5 flex flex-wrap gap-1.5">
        {candidate.ideologies.map((tag) => (
          <span
            key={tag}
            className="text-[9px] font-mono px-2 py-1 rounded-full border"
            style={{ borderColor: candidate.color, color: candidate.color }}
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

function InfoChip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-2 border border-border/70 rounded-full px-3 py-1.5 bg-background/30">
      {icon}
      {text}
    </span>
  );
}
