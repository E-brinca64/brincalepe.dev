/*
 * Adicione, edite ou remova projetos neste array.
 * Categorias válidas:
 * "frontend", "backend", "fullstack", "automation", "tools-utilities",
 * "devops", "cybersecurity", "artificial-intelligence", "embedded",
 * "data-science", "experiments".
 *
 * Links opcionais: coloque estas propriedades dentro do projeto quando existirem:
 * github: "https://github.com/usuario/repositorio",
 * demo: "https://seu-projeto-rodando.com",
 * Se não houver link, deixe a propriedade de fora.
 */
import type { Project } from "./projects";

export const projectList: Project[] = [
  {
    id: "homelab-srv01",
    name: "homelab-srv01",
    category: "devops",
    kind: "personal",
    description: {
      en: "A repurposed notebook running Debian Server, managed over SSH from my Fedora machine.",
      pt: "Um notebook reaproveitado rodando Debian Server, gerenciado por SSH pelo meu computador Fedora.",
    },
    purpose: {
      en: "A home server for learning and self-hosted services. Planned services include n8n, Nextcloud, Gitea, photo storage and monitoring; not all are running yet.",
      pt: "Um servidor doméstico para aprender e hospedar serviços. Serviços planejados incluem n8n, Nextcloud, Gitea, fotos e monitoramento; nem todos estão em execução.",
    },
    status: "in-progress",
    technologies: ["Debian", "Linux", "SSH"],
    year: 2026,
  },
  {
    id: "personal-dashboard",
    name: "personal-dashboard",
    category: "automation",
    kind: "personal",
    description: {
      en: "A personal progress dashboard combining n8n automations, an AI agent called Hermes and the home server.",
      pt: "Um painel pessoal de progresso que combina automações n8n, um agente de IA chamado Hermes e o servidor doméstico.",
    },
    status: "experimental",
    technologies: ["n8n", "AI agents"],
    year: 2026,
  },
  {
    id: "moneta-ai",
    name: "moneta-ai",
    category: "data-science",
    kind: "academic",
    description: {
      en: "A university project exploring AI analysis of sales-meeting transcripts. My contribution is data science.",
      pt: "Projeto universitário que explora análise de transcrições de reuniões de vendas com IA. Minha contribuição é em ciência de dados.",
    },
    status: "in-progress",
    technologies: ["AI", "Data science"],
    year: 2026,
  },
  {
    id: "pangovet",
    name: "pangovet",
    category: "devops",
    kind: "academic",
    description: {
      en: "A networking and Docker checkpoint for a fictional veterinary clinic specializing in black-bellied pangolins.",
      pt: "Checkpoint de redes e Docker para uma clínica veterinária fictícia especializada em pangolins-de-barriga-preta.",
    },
    status: "completed",
    technologies: ["Docker", "Networking"],
    year: 2026,
  },
  {
    id: "smartwatch-disc",
    name: "smartwatch-disc",
    category: "embedded",
    kind: "personal",
    description: {
      en: "Concept for a coin-sized disc that could turn a watch into a smartwatch, with early feasibility, cost and nRF52-based PCB ideas.",
      pt: "Conceito de um disco do tamanho de uma moeda para transformar um relógio em smartwatch, com ideias iniciais de viabilidade, custo e PCB baseada em nRF52.",
    },
    purpose: {
      en: "Concept stage only — this is not a built or tested device.",
      pt: "Apenas na fase de conceito — este dispositivo não foi construído nem testado.",
    },
    status: "experimental",
    conceptNote: true,
    technologies: ["nRF52 (idea)", "PCB (idea)"],
    year: 2026,
  },
  {
    id: "portfolio",
    name: "portfolio",
    category: "frontend",
    kind: "personal",
    description: {
      en: "This portfolio: a bilingual window into my work, systems and current operations.",
      pt: "Este portfólio: uma janela bilíngue para meus projetos, sistemas e operações atuais.",
    },
    status: "in-progress",
    technologies: ["React", "TypeScript", "Tailwind"],
    year: 2026,
  },
  {
    id: "github-readme-fastfetch",
    name: "github-readme-fastfetch",
    category: "experiments",
    kind: "personal",
    description: {
      en: "A custom SVG that mimics colored fastfetch output for my GitHub profile README.",
      pt: "Um SVG personalizado que imita a saída colorida do fastfetch no README do meu perfil GitHub.",
    },
    status: "completed",
    technologies: ["SVG", "fastfetch"],
    year: 2026,
  },
];
