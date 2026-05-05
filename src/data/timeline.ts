export interface TimelineEntry {
  year: string;
  period?: string;
  role: string;
  company: string;
  items: string[];
}

export const timeline: TimelineEntry[] = [
  {
    year: "2022",
    period: "2022 a 2026",
    role: "Desenvolvimento Humano e Organizacional",
    company: "Afinz",
    items: [
      "Liderei iniciativas e produtos de cultura, engajamento e desenvolvimento de pessoas com abordagens de produto",
      "Geri roadmap e backlog, conduzi discovery, implantações de produtos e sustentação/evolução",
      "Evoluí a adesão no produto de clima, atingindo 61% de crescimento e construí jornadas do profissional",
      "Rodei piloto de redesenho de operações de RH e automação utilizando SCRUM",
      "Recebi reconhecimento da Prefeitura de Sorocaba — Programa Primeiros Passos (Jovem Aprendiz)",
    ],
  },
  {
    year: "2021",
    role: "Treinamento e Desenvolvimento",
    company: "Afinz",
    items: [
      "Redesenhei processos de T&D para Call Center com nova jornada do colaborador, impactando FCR, TMA, TME e pausas operacionais",
      "Implantei guia de consulta rápida que proporcionou agilidade e eficiência nos atendimentos",
      "Capacitei novos profissionais para atendimento",
    ],
  },
  {
    year: "2019",
    role: "Prevenção a Fraude",
    company: "Afinz",
    items: [
      "Ganhei profundidade em análise de comportamento suspeito e mapeamento de fluxos de risco para o produto cartão de crédito",
      "Tomei decisões antifraude com dados incompletos, equilibrando risco, experiência do usuário e impacto para o negócio",
      "Implantei régua de comunicação sobre fraudes em canais de Marketing",
    ],
  },
  {
    year: "2018",
    role: "Atendimento ao Cliente",
    company: "Afinz",
    items: [
      "Primeiro contato direto com clientes e com o contexto financeiro",
      "Atuei em atendimento a pessoa física e em canais críticos como Reclame Aqui e Procon",
      "Conheci jornadas completas dos produtos: cartão de crédito e seguros",
      "Compreendi dores reais de usuário e a visão prática da experiência",
    ],
  },
];
