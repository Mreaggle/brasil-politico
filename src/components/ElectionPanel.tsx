import { ArrowUpRight, CalendarDays } from "lucide-react";
import {
  candidates,
  electionUpdatedAt,
  latestPoll,
  polls,
  type Candidate,
} from "@/data/election2026";

const pct = (value: number) => `${value.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;

export function ElectionPanel() {
  const ordered = [...candidates].sort(
    (a, b) => latestPoll.results[b.id] - latestPoll.results[a.id],
  );
  const max = latestPoll.results[ordered[0].id];

  return (
    <div className="election-page">
      <div className="election-intro">
        <div>
          <span className="eyebrow">CADERNO ELEITORAL / 2026</span>
          <h2>
            Eleições em perspectiva<span className="text-accent">.</span>
          </h2>
          <p>
            Pesquisas com fonte e data, propostas dos planos de governo e uma leitura editorial do
            espectro dos seis candidatos.
          </p>
        </div>
        <div className="election-date">
          <CalendarDays size={18} /> Atualizado em {electionUpdatedAt}
        </div>
      </div>

      <section className="editorial-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">PESQUISA MAIS RECENTE NA BASE</span>
            <h3>{latestPoll.institute}</h3>
          </div>
          <a href={latestPoll.sourceUrl} target="_blank" rel="noreferrer">
            Ver levantamento <ArrowUpRight size={15} />
          </a>
        </div>
        <p className="method-note">
          {latestPoll.scenario} · Coleta: {latestPoll.fieldwork} ·{" "}
          {latestPoll.sample.toLocaleString("pt-BR")} entrevistas · Margem {latestPoll.margin} · TSE{" "}
          {latestPoll.registration}. Os percentuais abaixo são desta rodada, sem média entre
          cenários ou institutos.
        </p>
        <div className="poll-list">
          {ordered.map((candidate, index) => (
            <div className="poll-row" key={candidate.id}>
              <span className="poll-rank">{String(index + 1).padStart(2, "0")}</span>
              <div className="poll-name">
                <strong>{candidate.ballotName}</strong>
                <small>{candidate.party}</small>
              </div>
              <div className="poll-track">
                <div
                  style={{
                    width: `${(latestPoll.results[candidate.id] / max) * 100}%`,
                    background: candidate.color,
                  }}
                />
              </div>
              <strong className="poll-value">{pct(latestPoll.results[candidate.id])}</strong>
            </div>
          ))}
        </div>
        <p className="method-note">
          Outros candidatos, brancos, nulos e indecisos não aparecem nas barras. Intenção de voto
          não representa afinidade ideológica.
        </p>
      </section>

      <section className="election-history">
        <div>
          <span className="eyebrow">BASE DE LEVANTAMENTOS</span>
          <h3>Rodadas documentadas</h3>
        </div>
        <div className="history-list">
          {polls.map((poll) => (
            <a key={poll.registration} href={poll.sourceUrl} target="_blank" rel="noreferrer">
              <span>{poll.published}</span>
              <strong>{poll.institute}</strong>
              <small>{poll.scenario}</small>
              <ArrowUpRight size={16} />
            </a>
          ))}
        </div>
        <p className="method-note">
          As rodadas têm cenários e metodologias próprios. Compare diretamente nas fontes antes de
          inferir tendências.
        </p>
      </section>

      <section className="candidate-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">PLANOS DE GOVERNO / LEITURA EDITORIAL</span>
            <h3>Quem propõe o quê</h3>
          </div>
        </div>
        <p className="method-note">
          Os títulos e pontos no mapa são uma interpretação das propostas econômicas, de costumes e
          de exercício do poder. Não são autodeclarações nem endossos. Cada perfil traz o plano e
          uma fala ou notícia contextual.
        </p>
        <div className="candidate-grid">
          {ordered.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      </section>
    </div>
  );
}

function CandidateCard({ candidate }: { candidate: Candidate }) {
  return (
    <article className="candidate-card" style={{ borderTopColor: candidate.color }}>
      <div className="candidate-top">
        <div>
          <span className="eyebrow">
            {candidate.party} / X {candidate.x.toFixed(1)} · Y {candidate.y.toFixed(1)}
          </span>
          <h4>{candidate.name}</h4>
          <small>{candidate.role}</small>
        </div>
        <span className="candidate-dot" style={{ background: candidate.color }} />
      </div>
      <strong className="spectrum" style={{ color: candidate.color }}>
        {candidate.spectrum}
      </strong>
      <ul>
        {candidate.summary.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <div className="candidate-links">
        <a href={candidate.planUrl} target="_blank" rel="noreferrer">
          Plano completo <ArrowUpRight size={14} />
        </a>
        <a href={candidate.contextUrl} target="_blank" rel="noreferrer">
          Fala / contexto <ArrowUpRight size={14} />
        </a>
      </div>
    </article>
  );
}
