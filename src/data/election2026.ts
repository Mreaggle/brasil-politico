export type Candidate = {
  id: string;
  name: string;
  ballotName: string;
  party: string;
  color: string;
  role: string;
  spectrum: string;
  x: number;
  y: number;
  summary: string[];
  planUrl: string;
  contextUrl: string;
};

// Coordenadas editoriais: X = economia, Y = costumes e exercício do poder.
// São leituras dos planos e discursos, não posições declaradas pelas campanhas.
export const candidates: Candidate[] = [
  {
    id: "lula",
    name: "Luiz Inácio Lula da Silva",
    ballotName: "Lula",
    party: "PT",
    color: "#ed7566",
    role: "Presidente da República",
    spectrum: "Centro-esquerda · desenvolvimentista",
    x: -4.4,
    y: -0.8,
    summary: [
      "Fortalecer SUS, educação pública e proteção social.",
      "Reindustrializar com coordenação estatal e transição energética.",
      "Defender trabalho, democracia e soberania nacional.",
    ],
    planUrl:
      "https://pt.org.br/wp-content/uploads/2026/08/08_06_JOB838_PT_livroplanodegoverno_260616_BOOK%20210x297mm_pg_solta_web.pdf",
    contextUrl: "https://apnews.com/article/767e63e2ffd5a2898c84f290de816ff7",
  },
  {
    id: "flavio",
    name: "Flávio Bolsonaro",
    ballotName: "Flávio Bolsonaro",
    party: "PL",
    color: "#a798ef",
    role: "Senador pelo Rio de Janeiro",
    spectrum: "Direita · liberal conservadora",
    x: 5.3,
    y: 4.6,
    summary: [
      "Reduzir impostos e gastos; rever a reforma tributária.",
      "Endurecer o combate às facções e ampliar vigilância criminal.",
      "Priorizar família, propriedade privada e liberdade religiosa.",
    ],
    planUrl: "https://www.flaviobolsonaro.com.br/plano-de-governo/leitura",
    contextUrl:
      "https://www.cnnbrasil.com.br/eleicoes/flavio-vou-ser-um-presidente-muito-duro-na-seguranca-publica/",
  },
  {
    id: "renan",
    name: "Renan Santos",
    ballotName: "Renan Santos",
    party: "Missão",
    color: "#6fcbd0",
    role: "Presidente do Partido Missão",
    spectrum: "Direita · reformista nacional",
    x: 3.7,
    y: 2.8,
    summary: [
      "Defender ajuste fiscal e mudanças no pacto federativo.",
      "Combater facções e investir em infraestrutura e indústria.",
      "Preservar estatais estratégicas, como Petrobras e Embrapa.",
    ],
    planUrl: "https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/doc/280017002789",
    contextUrl:
      "https://www.bol.uol.com.br/noticias/2026/09/08/renan-santos-diz-que-e-contra-privatizacao-da-petrobras-e-embrapa-mas-nao-dos-correios.htm",
  },
  {
    id: "cury",
    name: "Augusto Cury",
    ballotName: "Augusto Cury",
    party: "Avante",
    color: "#e6bd7a",
    role: "Escritor e candidato",
    spectrum: "Centro · empreendedorismo social",
    x: 0.9,
    y: -1.1,
    summary: [
      "Priorizar educação integral e saúde emocional.",
      "Criar crédito e formação para microempreendedores.",
      "Propor mudanças no STF e ampliar energia limpa.",
    ],
    planUrl: "https://static.poder360.com.br/uploads/2026/08/Plano_gov_Augusto_Cury_2026.pdf",
    contextUrl:
      "https://agenciabrasil.ebc.com.br/politica/noticia/2026-09/augusto-cury-propoe-mandato-de-oito-anos-no-stf-e-semipresidencialismo",
  },
  {
    id: "caiado",
    name: "Ronaldo Caiado",
    ballotName: "Ronaldo Caiado",
    party: "PSD",
    color: "#9dc884",
    role: "Ex-governador de Goiás",
    spectrum: "Centro-direita · conservadora",
    x: 3.0,
    y: 3.7,
    summary: [
      "Criar Ministério da Segurança e integrar inteligência policial.",
      "Combinar responsabilidade fiscal, agro e infraestrutura.",
      "Investir em saúde e educação com gestão por resultados.",
    ],
    planUrl: "https://ronaldocaiado.com.br/plano_de_governo_ronaldo_caiado_presidente.pdf",
    contextUrl:
      "https://www.cnnbrasil.com.br/eleicoes/caiado-propoe-ia-para-unir-dados-financeiros-do-pais-e-asfixiar-o-crime/",
  },
  {
    id: "zema",
    name: "Romeu Zema",
    ballotName: "Romeu Zema",
    party: "Novo",
    color: "#efa26a",
    role: "Ex-governador de Minas Gerais",
    spectrum: "Direita · liberal econômica",
    x: 6.2,
    y: 1.6,
    summary: [
      "Privatizar estatais e reduzir gastos e privilégios.",
      "Flexibilizar regras trabalhistas e baixar tributos.",
      "Endurecer a segurança e ampliar ensino técnico.",
    ],
    planUrl:
      "https://zema30.com.br/wp-content/uploads/2026/08/Plano-Implacavel-Romeu-Zema-2026.pdf",
    contextUrl:
      "https://agenciabrasil.ebc.com.br/politica/noticia/2026-09/zema-propoe-saida-do-brics-e-reducao-de-supersalarios-e-de-impostos",
  },
];

export type Poll = {
  institute: string;
  published: string;
  fieldwork: string;
  sample: number;
  margin: string;
  registration: string;
  scenario: string;
  sourceUrl: string;
  results: Record<string, number>;
};

export const polls: Poll[] = [
  {
    institute: "Palver",
    published: "24/09/2026",
    fieldwork: "20 a 23/09/2026",
    sample: 5000,
    margin: "±2,5 p.p.",
    registration: "BR-09587/2026",
    scenario: "1º turno estimulado, Brasil",
    sourceUrl:
      "https://www.bol.uol.com.br/noticias/2026/09/24/palver-lula-e-flavio-tem-empate-tecnico-no-1-e-no-2-turno.ghtm",
    results: { lula: 43, flavio: 43, renan: 8, cury: 2, caiado: 1, zema: 1 },
  },
  {
    institute: "Real Time Big Data",
    published: "24/09/2026",
    fieldwork: "19 a 23/09/2026",
    sample: 2000,
    margin: "±2 p.p.",
    registration: "BR-04202/2026",
    scenario: "1º turno estimulado, Brasil",
    sourceUrl:
      "https://exame.com/brasil/pesquisa-real-time-big-data-flavio-bolsonaro-cresce-7-pontos-e-empata-com-lula-no-1o-turno/",
    results: { lula: 41, flavio: 37, cury: 6, renan: 6, caiado: 2, zema: 1 },
  },
  {
    institute: "AtlasIntel / Bloomberg",
    published: "23/09/2026",
    fieldwork: "17 a 22/09/2026",
    sample: 5015,
    margin: "±1 p.p.",
    registration: "BR-04739/2026",
    scenario: "1º turno estimulado, Brasil",
    sourceUrl: "https://atlasintel.org/poll/brazil-national-2026-09-23",
    results: { lula: 45.8, flavio: 43.4, renan: 4.5, cury: 2.1, caiado: 1.3, zema: 0.9 },
  },
  {
    institute: "Datafolha",
    published: "21/09/2026",
    fieldwork: "15 a 17/09/2026",
    sample: 2001,
    margin: "±2 p.p.",
    registration: "BR-04029/2026",
    scenario: "1º turno estimulado, Brasil",
    sourceUrl:
      "https://datafolha.folha.uol.com.br/eleicoes/2026/09/lula-pt-e-flavio-bolsonaro-pl-empatam-no-1o-e-2o-turnos.shtml",
    results: { lula: 39, flavio: 36, cury: 6, caiado: 4, renan: 3, zema: 2 },
  },
  {
    institute: "Nexus / BTG Pactual",
    published: "14/09/2026",
    fieldwork: "11 a 13/09/2026",
    sample: 2003,
    margin: "±2 p.p.",
    registration: "BR-04076/2026",
    scenario: "1º turno estimulado com Pablo Marçal, Brasil",
    sourceUrl:
      "https://www.cnnbrasil.com.br/eleicoes/nexus-btg-no-1-turno-lula-tem-40-flavio-36-e-cury-7/",
    results: { lula: 40, flavio: 36, cury: 7, caiado: 4, renan: 4, zema: 1 },
  },
];

export const latestPoll = polls[0];
export const electionUpdatedAt = "24 de setembro de 2026";

export function getCandidateAffinity(x: number, y: number) {
  return candidates
    .map((candidate) => {
      const distance = Math.hypot(candidate.x - x, candidate.y - y);
      return {
        ...candidate,
        proximity: Math.max(0, Math.round((1 - distance / Math.sqrt(200)) * 100)),
      };
    })
    .sort((a, b) => b.proximity - a.proximity);
}
