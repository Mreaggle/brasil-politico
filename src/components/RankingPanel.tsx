import { candidates, getCandidateAffinity } from "@/data/election2026";
import { useCompass } from "@/store/compass";

export function RankingPanel() {
  const x = useCompass((state) => state.x);
  const y = useCompass((state) => state.y);
  const answered = useCompass((state) => Object.keys(state.answers).length);
  const ranking = answered
    ? getCandidateAffinity(x, y)
    : [...candidates]
        .sort((a, b) => a.ballotName.localeCompare(b.ballotName, "pt-BR"))
        .map((candidate) => ({ ...candidate, proximity: 0 }));

  return (
    <aside className="affinity-panel">
      <div className="affinity-header">
        <span className="eyebrow">SEU QUADRANTE ELEITORAL</span>
        <h3>
          6 candidatos<span className="text-accent">.</span>
        </h3>
        <p>
          {answered
            ? `Afinidade estimada após ${answered} ${answered === 1 ? "resposta" : "respostas"}.`
            : "Responda às proposições para mover seu ponto."}
        </p>
      </div>
      <ol className="affinity-list">
        {ranking.map((candidate, index) => (
          <li key={candidate.id}>
            <span className="affinity-rank">{String(index + 1).padStart(2, "0")}</span>
            <span className="candidate-dot" style={{ background: candidate.color }} />
            <span className="affinity-name">
              <strong>{candidate.ballotName}</strong>
              <small>{candidate.spectrum}</small>
            </span>
            <strong className="affinity-value">{answered ? `${candidate.proximity}%` : "—"}</strong>
          </li>
        ))}
      </ol>
      <p className="affinity-method">
        Proximidade geométrica entre seu ponto e a posição editorial de cada plano no mapa. O número
        indica distância relativa no modelo, não apoio eleitoral ou concordância com todas as
        propostas.
      </p>
    </aside>
  );
}
