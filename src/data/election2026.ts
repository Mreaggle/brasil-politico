export type Candidate = {
  id: string;
  name: string;
  ballotName: string;
  party: string;
  average: number;
  color: string;
  role: string;
  brief: string;
  agenda: string;
  ideologies: string[];
};

export const electionUpdatedAt = "4 de agosto de 2026";

export const candidates: Candidate[] = [
  {
    id: "lula",
    name: "Luiz Inácio Lula da Silva",
    ballotName: "Lula",
    party: "PT",
    average: 40,
    color: "oklch(0.65 0.24 25)",
    role: "Presidente da República e candidato à reeleição",
    brief:
      "Metalúrgico e líder sindical, fundou o PT e presidiu o Brasil entre 2003 e 2010, retornando ao Planalto em 2023. Chega à sua sétima disputa presidencial com Geraldo Alckmin novamente na vice.",
    agenda:
      "Combina ampliação de políticas sociais, valorização do salário mínimo, investimento público, reindustrialização e maior presença do Estado na coordenação econômica.",
    ideologies: ["Centro-esquerda", "Trabalhismo", "Social-democracia", "Desenvolvimentismo"],
  },
  {
    id: "flavio",
    name: "Flávio Bolsonaro",
    ballotName: "Flávio Bolsonaro",
    party: "PL",
    average: 34,
    color: "oklch(0.55 0.20 245)",
    role: "Senador pelo Rio de Janeiro",
    brief:
      "Advogado e senador desde 2019, foi deputado estadual por quatro mandatos. Foi escolhido pelo PL e pelo ex-presidente Jair Bolsonaro para representar o campo bolsonarista na disputa nacional.",
    agenda:
      "Defende valores conservadores, segurança pública mais rígida, redução do tamanho do Estado, agenda econômica pró-mercado e continuidade do movimento político liderado por seu pai.",
    ideologies: [
      "Direita populista",
      "Conservadorismo nacional",
      "Liberalismo econômico",
      "Direita religiosa",
    ],
  },
  {
    id: "caiado",
    name: "Ronaldo Caiado",
    ballotName: "Ronaldo Caiado",
    party: "PSD",
    average: 5,
    color: "oklch(0.80 0.20 130)",
    role: "Ex-governador de Goiás",
    brief:
      "Médico ortopedista e produtor rural, construiu uma longa carreira como deputado federal, senador e governador de Goiás. Disputou a Presidência em 1989 e retorna como alternativa de direita à polarização.",
    agenda:
      "Projeta nacionalmente sua gestão em Goiás, com ênfase em segurança pública, responsabilidade fiscal, agronegócio, municipalismo e serviços públicos administrados por metas.",
    ideologies: [
      "Centro-direita agrária",
      "Conservadorismo institucional",
      "Segurança punitivista",
      "Liberalismo conservador",
    ],
  },
  {
    id: "renan",
    name: "Renan Santos",
    ballotName: "Renan Santos",
    party: "Missão",
    average: 3,
    color: "oklch(0.80 0.16 210)",
    role: "Presidente do Partido Missão",
    brief:
      "Cofundador do Movimento Brasil Livre, estreia como candidato a cargo eletivo. Sua candidatura também marca a primeira eleição presidencial do partido Missão, criado a partir do MBL.",
    agenda:
      "Apresenta uma direita liberal de renovação geracional, com reformas econômicas, combate a privilégios, endurecimento contra o crime organizado e comunicação fortemente digital.",
    ideologies: [
      "Liberalismo econômico",
      "Anti-establishment digital",
      "Direita reformista",
      "Conservadorismo liberal",
    ],
  },
  {
    id: "zema",
    name: "Romeu Zema",
    ballotName: "Romeu Zema",
    party: "Novo",
    average: 2,
    color: "oklch(0.74 0.20 55)",
    role: "Ex-governador de Minas Gerais",
    brief:
      "Empresário eleito governador de Minas Gerais em 2018 e reeleito em primeiro turno em 2022. Deixou o governo estadual para disputar a Presidência e escolheu Eduardo Girão como vice.",
    agenda:
      "Leva à campanha uma plataforma de privatizações, ajuste fiscal, simplificação do Estado, ambiente favorável a empresas e descentralização administrativa.",
    ideologies: ["Liberalismo econômico", "Direita tecnocrática", "Privatismo", "Federalismo"],
  },
];

export const pollInstitutes = [
  "Nexus",
  "Veritá",
  "AtlasIntel",
  "Datafolha",
  "Vox Brasil",
  "PoderData",
  "Alfa Inteligência",
  "Gerp",
  "Real Time Big Data",
  "Indexa",
  "Jota",
  "Quaest",
  "100 Cidades",
  "Boas Ideias",
  "Nexus/FSB",
  "Futura Inteligência",
  "MDA",
  "American Analytics",
  "Meio/Ideia",
  "Paraná Pesquisas",
  "Vetor",
];

export const electionSources = [
  {
    label: "Agregador UOL — pesquisas nacionais registradas no TSE",
    url: "https://noticias.uol.com.br/eleicoes/agregador-de-pesquisas-eleitorais/",
  },
  {
    label: "Agregador BBC Brasil / PollingData",
    url: "https://news.test.files.bbci.co.uk/include/vjamericas/1561-poll-tracker-brazil-2026/poll-tracker/portuguese/app/embed",
  },
  {
    label: "Índice CNN / Ipespe Analítica",
    url: "https://www.cnnbrasil.com.br/eleicoes/indice-cnn-saiba-como-funciona-o-agregador-de-pesquisas-das-eleicoes-2026/",
  },
  {
    label: "Sistema de Registro de Pesquisas Eleitorais do TSE",
    url: "https://pesqele-divulgacao.tse.jus.br/app/pesquisa/listar.xhtml",
  },
];
