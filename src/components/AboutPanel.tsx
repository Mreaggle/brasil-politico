import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Compass,
  FileText,
  HeartHandshake,
  Info,
  LockKeyhole,
  RotateCcw,
  Share2,
} from "lucide-react";
import { RESULT_QUESTIONS } from "@/data/config";
import { candidates, electionUpdatedAt, latestPoll, polls } from "@/data/election2026";
import { questions } from "@/data/questions";

type AboutPanelProps = {
  onOpenMap: () => void;
  onOpenElection: () => void;
  onOpenSupport: () => void;
};

const features = [
  {
    icon: Compass,
    title: "Mapa ideológico",
    description:
      "Sua posição em dois eixos, junto às correntes e às posições editoriais dos candidatos.",
  },
  {
    icon: BookOpen,
    title: "Proposições",
    description:
      "Perguntas sobre economia, direitos, Estado, ambiente, política externa e atualidades.",
  },
  {
    icon: ArrowRight,
    title: "Afinidades",
    description: "As oito correntes e os seis candidatos mais próximos do seu ponto no mapa.",
  },
  {
    icon: FileText,
    title: "Eleições 2026",
    description:
      "Pesquisas identificadas por fonte e data, planos de governo e resumos dos candidatos.",
  },
  {
    icon: Share2,
    title: "Card de resultado",
    description: "Uma imagem vertical com seu mapa, sua corrente e o candidato mais próximo.",
  },
];

const steps = [
  {
    title: "Leia a proposição",
    description:
      "Cada pergunta aparece abaixo do mapa. Você pode responder na ordem apresentada ou pular.",
  },
  {
    title: "Escolha sua posição",
    description:
      "Há cinco respostas, de discordo totalmente a concordo totalmente. Pular não conta como resposta.",
  },
  {
    title: "Acompanhe seu ponto",
    description:
      "O mapa muda a cada resposta. Arraste, amplie e toque nos candidatos para ver suas classificações.",
  },
  {
    title: "Libere seu card",
    description: `Após ${RESULT_QUESTIONS} respostas, o card fica disponível. O contador passa de vermelho a amarelo e, ao liberar, a verde.`,
  },
  {
    title: "Compartilhe se quiser",
    description:
      "Use Compartilhar por apps, Baixar imagem ou Copiar link. O link da página pode ser copiado desde o início.",
  },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function AboutPanel({ onOpenMap, onOpenElection, onOpenSupport }: AboutPanelProps) {
  return (
    <article className="about-page">
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero-copy">
          <span className="eyebrow">GUIA DO PROJETO / BRASIL POLÍTICO 2026</span>
          <h2 id="about-title">
            Entenda o mapa<span className="text-accent">.</span>
            <br />
            Use o seu critério<span className="text-accent">.</span>
          </h2>
          <p>
            Uma ferramenta para explorar ideias políticas, conhecer propostas e comparar
            proximidades. Você responde sem cadastro e decide o que fazer com o resultado.
          </p>
          <div className="about-hero-actions">
            <button type="button" className="about-button about-button-primary" onClick={onOpenMap}>
              Explorar o mapa <ArrowRight size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="about-button about-button-secondary"
              onClick={() => scrollToSection("about-method")}
            >
              Como funciona
            </button>
          </div>
        </div>
        <div className="about-visual" aria-hidden="true">
          <div className="about-visual-label">UM PONTO, MUITAS IDEIAS</div>
          <div className="about-mini-map">
            <span className="about-mini-axis about-mini-axis-x" />
            <span className="about-mini-axis about-mini-axis-y" />
            <span className="about-mini-point about-mini-point-a" />
            <span className="about-mini-point about-mini-point-b" />
            <span className="about-mini-point about-mini-point-c" />
            <span className="about-mini-you" />
            <span className="about-mini-left">ESQUERDA</span>
            <span className="about-mini-right">DIREITA</span>
            <span className="about-mini-top">AUTORITÁRIO</span>
            <span className="about-mini-bottom">LIBERTÁRIO</span>
          </div>
          <p>A posição muda com suas respostas.</p>
        </div>
      </section>

      <div className="about-stat-strip" aria-label="Resumo do projeto">
        <div>
          <strong>{questions.length}</strong>
          <span>proposições disponíveis</span>
        </div>
        <div>
          <strong>{RESULT_QUESTIONS}</strong>
          <span>respostas para o card</span>
        </div>
        <div>
          <strong>{candidates.length}</strong>
          <span>planos de governo</span>
        </div>
        <div>
          <strong>{polls.length}</strong>
          <span>rodadas documentadas</span>
        </div>
      </div>

      <nav className="about-index" aria-label="Nesta página">
        <span>NESTA PÁGINA</span>
        {[
          ["about-features", "O projeto"],
          ["about-use", "Como usar"],
          ["about-method", "O resultado"],
          ["about-sources", "Fontes"],
          ["about-privacy", "Privacidade"],
        ].map(([id, label]) => (
          <button type="button" key={id} onClick={() => scrollToSection(id)}>
            {label}
          </button>
        ))}
      </nav>

      <section id="about-features" className="about-section">
        <div className="about-section-heading">
          <span className="eyebrow">01 / O PROJETO</span>
          <h3>O que você encontra</h3>
          <p>
            Um caminho para refletir sobre posições políticas e consultar os documentos por trás das
            comparações.
          </p>
        </div>
        <div className="about-feature-grid">
          {features.map(({ icon: Icon, title, description }, index) => (
            <div className="about-feature" key={title}>
              <div className="about-feature-top">
                <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h4>{title}</h4>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about-use" className="about-section about-section-split">
        <div className="about-section-heading">
          <span className="eyebrow">02 / PRIMEIROS PASSOS</span>
          <h3>Como usar</h3>
          <p>
            Você não precisa terminar todas as perguntas. Continue depois da 30ª se quiser refinar
            seu mapa.
          </p>
          <div className="about-reset-note">
            <RotateCcw size={16} aria-hidden="true" />
            <span>
              <strong>Reset</strong> reinicia o mapa e apaga as respostas desta sessão.
            </span>
          </div>
        </div>
        <ol className="about-steps">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="about-step-number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="about-method" className="about-section">
        <div className="about-section-heading">
          <span className="eyebrow">03 / LEITURA DO MAPA</span>
          <h3>Como ler o resultado</h3>
        </div>
        <div className="about-method-grid">
          <div className="about-method-card">
            <span className="about-card-kicker">COORDENADAS</span>
            <h4>Dois eixos, uma posição</h4>
            <p>
              Na horizontal, esquerda e direita <strong>econômica</strong>. Na vertical, libertário
              e autoritário, ligados a costumes e ao exercício do poder.
            </p>
            <p>
              Cada proposição tem direção e intensidade definidas editorialmente. Concordar move seu
              ponto nessa direção; discordar o move no sentido oposto. A resposta neutra não desloca
              o ponto.
            </p>
          </div>
          <div className="about-method-card">
            <span className="about-card-kicker">AFINIDADE</span>
            <h4>Proximidade dentro do modelo</h4>
            <p>
              As listas mostram os pontos de correntes e candidatos mais próximos das suas
              coordenadas. Nas correntes, o percentual também ganha força conforme você responde,
              até completar {RESULT_QUESTIONS} respostas.
            </p>
            <p>
              O card destaca a corrente e o candidato mais próximos naquele momento. Os percentuais{" "}
              <strong>não são chance de voto, apoio político ou concordância integral</strong> com
              um plano.
            </p>
          </div>
        </div>
        <div className="about-caveat">
          <Info size={19} aria-hidden="true" />
          <p>
            Esta é uma <strong>exploração editorial de ideias</strong>. O resultado não é um
            diagnóstico científico, uma recomendação de voto nem uma pesquisa eleitoral. As posições
            e os títulos dos candidatos são interpretações de planos de governo e falas públicas,
            sem endosso ou declaração das campanhas.
          </p>
        </div>
      </section>

      <section id="about-sources" className="about-section">
        <div className="about-section-heading">
          <span className="eyebrow">04 / DOCUMENTOS E DADOS</span>
          <h3>Eleições 2026 e fontes</h3>
          <p>
            O recorte publicado foi atualizado em {electionUpdatedAt}. Consulte sempre a data e o
            levantamento original: números eleitorais mudam.
          </p>
        </div>
        <div className="about-source-grid">
          <div className="about-source-card">
            <div className="about-source-title">
              <span className="about-card-kicker">PESQUISAS</span>
              <span>{polls.length} RODADAS</span>
            </div>
            <h4>Uma rodada por vez</h4>
            <p>
              As barras de Eleições 2026 usam o levantamento de {latestPoll.institute}, publicado em{" "}
              {latestPoll.published}. A guia informa coleta, amostra, margem de erro, cenário e
              registro no TSE. As rodadas abaixo têm cenários e métodos próprios; elas não formam
              uma média ou uma série homogênea.
            </p>
            <ul className="about-source-list">
              {polls.map((poll) => (
                <li key={poll.registration}>
                  <a href={poll.sourceUrl} target="_blank" rel="noreferrer">
                    <span>
                      {poll.institute}
                      <small>
                        {poll.published} · TSE {poll.registration}
                      </small>
                    </span>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="about-source-card">
            <div className="about-source-title">
              <span className="about-card-kicker">PLANOS DE GOVERNO</span>
              <span>{candidates.length} PERFIS</span>
            </div>
            <h4>Propostas em fonte aberta</h4>
            <p>
              Os resumos e as posições no mapa partem dos planos e de falas públicas recentes. Cada
              perfil na guia eleitoral oferece o plano completo e uma notícia de contexto.
            </p>
            <ul className="about-source-list">
              {candidates.map((candidate) => (
                <li key={candidate.id}>
                  <a href={candidate.planUrl} target="_blank" rel="noreferrer">
                    <span>
                      {candidate.name}
                      <small>{candidate.party} · ver plano de governo</small>
                    </span>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="about-source-footer">
          <p>
            As fontes incluem documentos públicos do TSE, planos divulgados pelas campanhas e
            publicações dos institutos ou veículos que reproduzem os levantamentos.
          </p>
          <button type="button" onClick={onOpenElection}>
            Abrir Eleições 2026 <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </section>

      <section id="about-privacy" className="about-section">
        <div className="about-section-heading">
          <span className="eyebrow">05 / SEUS DADOS</span>
          <h3>Privacidade, com clareza</h3>
        </div>
        <div className="about-privacy-grid">
          <div>
            <LockKeyhole size={21} aria-hidden="true" />
            <h4>Sem identificação</h4>
            <p>O questionário não pede nome, e-mail, documento ou cadastro.</p>
          </div>
          <div>
            <Compass size={21} aria-hidden="true" />
            <h4>Respostas na memória</h4>
            <p>
              Respostas e coordenadas ficam na memória da página. O código atual não as salva no
              navegador nem as envia a um servidor. Recarregar ou fechar reinicia o resultado.
            </p>
          </div>
          <div>
            <Share2 size={21} aria-hidden="true" />
            <h4>Você decide compartilhar</h4>
            <p>
              O card é gerado no navegador. Você pode baixá-lo no dispositivo ou enviá-lo a outros
              aplicativos se escolher compartilhar.
            </p>
          </div>
        </div>
        <p className="about-analytics">
          <strong>Sobre métricas de acesso:</strong> a página inclui Google Analytics. Esse serviço
          pode tratar dados técnicos de navegação; o conteúdo das respostas não é enviado pelo
          código do questionário.
        </p>
      </section>

      <section className="about-contribute">
        <div>
          <span className="eyebrow">O PROJETO É ABERTO A CORREÇÕES</span>
          <h3>Viu algo que merece revisão?</h3>
          <p>
            Uma pergunta ambígua, um dado antigo ou uma classificação discutível? Abra uma issue com
            a fonte e uma proposta concreta. O apoio financeiro é voluntário e não altera resultados
            nem libera recursos extras.
          </p>
        </div>
        <div className="about-contribute-actions">
          <a
            href="https://github.com/Mreaggle/brasil-politico/issues"
            target="_blank"
            rel="noreferrer"
            className="about-button about-button-primary"
          >
            Abrir uma issue <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={onOpenSupport}
            className="about-button about-button-secondary"
          >
            <HeartHandshake size={16} aria-hidden="true" /> Apoiar o projeto
          </button>
        </div>
      </section>

      <details className="about-tech-details">
        <summary>Para quem quiser executar o projeto localmente</summary>
        <p>O projeto usa React, TypeScript e Vite. Com Node.js instalado:</p>
        <pre>
          <code>npm install{"\n"}npm run dev</code>
        </pre>
        <p>
          Para gerar a versão de produção: <code>npm run build</code>. As proposições estão em{" "}
          <code>src/data/questions.ts</code>; os planos, posições editoriais e pesquisas em{" "}
          <code>src/data/election2026.ts</code>. Um push em <code>main</code> publica a versão
          gerada no GitHub Pages.
        </p>
        <a
          href="https://github.com/Mreaggle/brasil-politico#readme"
          target="_blank"
          rel="noreferrer"
        >
          Ver README no repositório <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </details>
    </article>
  );
}
