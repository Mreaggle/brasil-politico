import type { Ideology } from "@/data/ideologies";

export type IdeologyFigure = {
  name: string;
  note: string;
};

const F = {
  marx: {
    name: "Karl Marx",
    note: "Formulou a crítica do capitalismo e a teoria da luta de classes.",
  },
  lenin: {
    name: "Vladimir Lênin",
    note: "Associou revolução socialista, partido de vanguarda e poder estatal.",
  },
  trotsky: {
    name: "Leon Trotsky",
    note: "Desenvolveu a tese da revolução permanente e criticou o stalinismo.",
  },
  bernstein: {
    name: "Eduard Bernstein",
    note: "Defendeu a transformação socialista gradual pela democracia.",
  },
  furtado: {
    name: "Celso Furtado",
    note: "Explicou o subdesenvolvimento e influenciou o planejamento econômico brasileiro.",
  },
  vargas: {
    name: "Getúlio Vargas",
    note: "Consolidou legislação trabalhista, industrialização e Estado desenvolvimentista.",
  },
  brizola: {
    name: "Leonel Brizola",
    note: "Ligou trabalhismo, nacionalismo econômico e educação pública.",
  },
  kropotkin: {
    name: "Piotr Kropotkin",
    note: "Defendeu apoio mútuo, federações livres e comunismo sem Estado.",
  },
  bakunin: {
    name: "Mikhail Bakunin",
    note: "Foi referência do anarquismo coletivista e da crítica ao poder estatal.",
  },
  hayek: {
    name: "Friedrich Hayek",
    note: "Defendeu mercados descentralizados e limites ao planejamento estatal.",
  },
  locke: {
    name: "John Locke",
    note: "Fundamentou direitos individuais, propriedade e governo limitado.",
  },
  nozick: {
    name: "Robert Nozick",
    note: "Teorizou o Estado mínimo e uma concepção libertária de justiça.",
  },
  rothbard: {
    name: "Murray Rothbard",
    note: "Sistematizou o libertarianismo radical e o anarcocapitalismo.",
  },
  burke: {
    name: "Edmund Burke",
    note: "Valorizou tradição, prudência e mudança institucional gradual.",
  },
  scruton: {
    name: "Roger Scruton",
    note: "Articulou uma defesa contemporânea de tradição, pertencimento e instituições.",
  },
  maritain: {
    name: "Jacques Maritain",
    note: "Inspirou a democracia cristã com personalismo e bem comum.",
  },
  alceu: {
    name: "Alceu Amoroso Lima",
    note: "Foi uma voz brasileira do humanismo cristão e da democracia.",
  },
  carson: {
    name: "Rachel Carson",
    note: "Impulsionou o ambientalismo moderno ao expor impactos de pesticidas.",
  },
  marina: {
    name: "Marina Silva",
    note: "Projetou no Brasil a ligação entre floresta, clima e justiça social.",
  },
  beauvoir: {
    name: "Simone de Beauvoir",
    note: "Analisou a construção social da condição feminina.",
  },
  lelia: { name: "Lélia Gonzalez", note: "Conectou feminismo, raça e formação social brasileira." },
  lessig: {
    name: "Lawrence Lessig",
    note: "Popularizou debates sobre cultura livre, copyright e poder das plataformas.",
  },
  swartz: {
    name: "Aaron Swartz",
    note: "Tornou-se símbolo de acesso aberto, transparência e liberdade digital.",
  },
  huxley: {
    name: "Julian Huxley",
    note: "Criou o termo transumanismo para a ampliação consciente das capacidades humanas.",
  },
  bostrom: {
    name: "Nick Bostrom",
    note: "Sistematizou debates sobre aprimoramento humano e riscos tecnológicos.",
  },
  hobbes: {
    name: "Thomas Hobbes",
    note: "Justificou autoridade política forte como resposta à insegurança e ao conflito.",
  },
  ferrajoli: {
    name: "Luigi Ferrajoli",
    note: "Estruturou o garantismo penal como limite jurídico ao poder punitivo.",
  },
  rui: {
    name: "Rui Barbosa",
    note: "Defendeu federalismo, liberdades civis e primazia constitucional.",
  },
  montoro: {
    name: "André Franco Montoro",
    note: "Foi referência brasileira de descentralização e fortalecimento municipal.",
  },
  tocqueville: {
    name: "Alexis de Tocqueville",
    note: "Destacou associações locais e descentralização na vida democrática.",
  },
  pettit: {
    name: "Philip Pettit",
    note: "Renovou o republicanismo ao definir liberdade como não dominação.",
  },
  ulysses: {
    name: "Ulysses Guimarães",
    note: "Simbolizou redemocratização, cidadania e Constituição de 1988.",
  },
  habermas: {
    name: "Jürgen Habermas",
    note: "Formulou o patriotismo constitucional e a democracia deliberativa.",
  },
  sen: {
    name: "Amartya Sen",
    note: "Relacionou justiça, liberdade substantiva e capacidades humanas.",
  },
  beveridge: {
    name: "William Beveridge",
    note: "Desenhou bases institucionais do Estado de bem-estar moderno.",
  },
  list: {
    name: "Friedrich List",
    note: "Defendeu proteção temporária e política industrial para economias em formação.",
  },
  baran: {
    name: "Paul Baran",
    note: "Influenciou a visão de desenvolvimento tecnológico soberano e redes distribuídas.",
  },
  zuboff: {
    name: "Shoshana Zuboff",
    note: "Analisa concentração de poder e exploração de dados pelas plataformas digitais.",
  },
  khan: {
    name: "Lina Khan",
    note: "Tornou-se referência na política antitruste aplicada às grandes empresas de tecnologia.",
  },
  laclau: {
    name: "Ernesto Laclau",
    note: "Estudou como demandas diversas se articulam em identidades políticas populares.",
  },
  gramsci: {
    name: "Antonio Gramsci",
    note: "Explicou hegemonia cultural, sociedade civil e disputa política.",
  },
  mussolini: {
    name: "Benito Mussolini",
    note: "Liderou o fascismo italiano e um regime totalitário corporativista.",
  },
  salgadо: {
    name: "Plínio Salgado",
    note: "Liderou o integralismo brasileiro, movimento nacionalista e autoritário dos anos 1930.",
  },
  fhc: {
    name: "Fernando Henrique Cardoso",
    note: "Representou reformismo de centro, estabilidade monetária e modernização institucional.",
  },
  campos: {
    name: "Roberto Campos",
    note: "Foi um formulador brasileiro de abertura econômica e reformas pró-mercado.",
  },
  torres: {
    name: "Alberto Torres",
    note: "Pensou organização nacional, mundo rural e fortalecimento institucional do Estado.",
  },
  caiado: {
    name: "Ronaldo Caiado",
    note: "Expressa contemporaneamente a representação política do agronegócio e do conservadorismo rural.",
  },
  davis: {
    name: "Angela Davis",
    note: "Conectou raça, classe, gênero e crítica ao sistema penal.",
  },
  russell: {
    name: "Bertrand Russell",
    note: "Defendeu racionalismo, liberdade de pensamento e humanismo secular.",
  },
  erasmus: {
    name: "Erasmo de Roterdã",
    note: "Associou humanismo, educação e tolerância religiosa.",
  },
};

const includes = (value: string, terms: string[]) => terms.some((term) => value.includes(term));

export function getIdeologyFigures(
  ideology: Pick<Ideology, "id" | "name"> & Partial<Pick<Ideology, "x" | "y">>,
): IdeologyFigure[] {
  const key = `${ideology.id} ${ideology.name}`.toLocaleLowerCase("pt-BR");

  if (includes(key, ["trotsk"])) return [F.trotsky, F.marx];
  if (includes(key, ["marxismo-lenin", "socialismo-estatal"])) return [F.lenin, F.marx];
  if (includes(key, ["anarqu", "comunismo-libert", "sindicalismo-revolucion"]))
    return [F.kropotkin, F.bakunin];
  if (includes(key, ["socialismo-democr", "esquerda-democr", "social-democr"]))
    return [F.bernstein, F.furtado];
  if (includes(key, ["trabalh", "sindical"])) return [F.brizola, F.vargas];
  if (
    includes(key, [
      "desenv",
      "industrial",
      "soberanismo-econom",
      "nacionalismo-econom",
      "protecion",
    ])
  )
    return [F.furtado, F.list];
  if (includes(key, ["estatismo", "populismo-econom", "welfar", "igualitar"]))
    return [F.beveridge, F.sen];
  if (includes(key, ["femin", "identitaria", "pluralismo-cultural"])) return [F.lelia, F.beauvoir];
  if (includes(key, ["ambient", "ecolog", "verde", "ecofederal"])) return [F.carson, F.marina];
  if (includes(key, ["transhuman", "transuman", "aceleracion"])) return [F.huxley, F.bostrom];
  if (includes(key, ["pirata", "ciber", "democracia-digital", "anti-censura"]))
    return [F.lessig, F.swartz];
  if (includes(key, ["regulacao-plataformas"])) return [F.khan, F.zuboff];
  if (includes(key, ["soberania-tecnologica"])) return [F.baran, F.furtado];
  if (includes(key, ["garantismo"])) return [F.ferrajoli, F.rui];
  if (includes(key, ["punitivismo"])) return [F.hobbes, F.ferrajoli];
  if (includes(key, ["const-liberal"])) return [F.rui, F.locke];
  if (includes(key, ["const-conservador"])) return [F.burke, F.scruton];
  if (includes(key, ["patriotismo-const"])) return [F.habermas, F.ulysses];
  if (includes(key, ["republicanismo"])) return [F.pettit, F.ulysses];
  if (includes(key, ["federal", "municipal"])) return [F.tocqueville, F.montoro];
  if (includes(key, ["humanismo", "secularismo"])) return [F.russell, F.erasmus];
  if (includes(key, ["religioso", "religiosa", "cristã", "cristao", "moralismo"]))
    return [F.maritain, F.alceu];
  if (includes(key, ["agrar", "rural"])) return [F.torres, F.caiado];
  if (includes(key, ["fascismo", "autoritarismo-nacionalista"])) return [F.mussolini, F.salgadо];
  if (includes(key, ["populismo", "anti-establishment"])) return [F.laclau, F.gramsci];
  if (includes(key, ["conservador", "direita-nacional", "direita-relig"]))
    return [F.burke, F.scruton];
  if (includes(key, ["libertarian", "privatismo"])) return [F.nozick, F.rothbard];
  if (
    includes(key, [
      "liberalismo",
      "livre-camb",
      "meritocracia",
      "empresarial",
      "tecnocracia-liberal",
      "direita-tecnocr",
    ])
  )
    return [F.hayek, F.campos];
  if (includes(key, ["centro", "reformismo", "tecnocracia", "fisiologico"]))
    return [F.fhc, F.ulysses];
  if ((ideology.x ?? 0) <= -3) return [F.marx, F.sen];
  if ((ideology.x ?? 0) >= 3) return [F.locke, F.burke];
  return [F.ulysses, F.fhc];
}
