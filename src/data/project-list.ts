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
      en: "A self-hosted home server built from repurposed laptop hardware, running Debian and managed remotely over SSH.",
      pt: "Um servidor doméstico construído a partir de um notebook reaproveitado, executando Debian e gerenciado remotamente via SSH.",
    },
    purpose: {
      en: "A personal infrastructure lab for learning Linux administration, networking, self-hosting and server management. Planned services include Nextcloud, Gitea, n8n and system monitoring.",
      pt: "Um laboratório de infraestrutura para aprender administração Linux, redes, self-hosting e gerenciamento de servidores. Entre os serviços planejados estão Nextcloud, Gitea, n8n e monitoramento.",
    },
    status: "in-progress",
    technologies: ["Debian", "Linux", "SSH"],
    year: 2026,
  },
  
{
  id: "moneta-ai",
  name: "moneta-ai",
  category: "fullstack",
  kind: "academic",
  description: {
    en: "An AI-powered sales intelligence platform that transforms commercial meetings into actionable business insights. Selected among the Top 10 projects in the FIAP Challenge 2026.",
    pt: "Uma plataforma de inteligência comercial baseada em IA que transforma reuniões de vendas em informações estratégicas. Selecionada entre os 10 melhores projetos do Challenge FIAP 2026.",
  },
  purpose: {
    en: "Features include an Active Listening Index, churn risk detection, competitor identification, purchase intent analysis and an executive dashboard with sales team rankings and at-risk accounts.",
    pt: "Possui Índice de Escuta Ativa, identificação de riscos de churn, concorrentes, intenção de compra e um dashboard executivo com ranking da equipe comercial e carteira de clientes em risco.",
  },
  status: "completed",
  technologies: ["NestJS", "AI", "Data Science"],
  year: 2026,
},

  {
    id: "pangovet",
    name: "pangovet",
    category: "devops",
    kind: "academic",
    description: {
      en: "A containerized infrastructure project simulating the network environment of a fictional veterinary clinic specializing in black-bellied pangolins.",
      pt: "Projeto de infraestrutura conteinerizada que simula o ambiente de rede de uma clínica veterinária fictícia especializada em pangolins-de-barriga-preta.",
    },
    purpose: {
      en: "Designed to explore containerization, Docker configuration and networking concepts in a simulated business environment.",
      pt: "Desenvolvido para explorar conteinerização, configuração do Docker e conceitos de redes em um ambiente empresarial simulado.",
    },
    status: "completed",
    technologies: ["Docker", "Networking", "Linux"],
    year: 2026,
  },
  
  {
    id: "portfolio",
    name: "portfolio",
    category: "frontend",
    kind: "personal",
    description: {
      en: "A personal portfolio designed as an interactive digital workspace to showcase projects, technical interests and ongoing work.",
      pt: "Um portfólio pessoal desenvolvido como um ambiente digital interativo para apresentar projetos, interesses técnicos e trabalhos em andamento.",
    },
    purpose: {
      en: "Built to combine a distinctive interface, bilingual content and a structured project explorer into a single experience.",
      pt: "Desenvolvido para combinar uma interface diferenciada, conteúdo bilíngue e um explorador organizado de projetos em uma única experiência.",
    },
    status: "in-progress",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    year: 2026,
  },

  {
    id: "download-sorter",
    name: "DownloadSorter",
    category: "tools-utilities",
    kind: "personal",
    description: {
      en: "A Python utility that automatically organizes files into categorized folders based on their file extensions.",
      pt: "Uma ferramenta em Python que organiza automaticamente arquivos em pastas categorizadas com base em suas extensões.",
    },
    purpose: {
      en: "Built to simplify file management and reduce manual organization through a configurable extension-to-folder mapping system.",
      pt: "Desenvolvido para simplificar o gerenciamento de arquivos e reduzir a organização manual por meio de um sistema configurável de associação entre extensões e pastas.",
    },
    status: "completed",
    technologies: ["Python", "File System Automation"],
    year: 2026,
  },
  {
    id: "livescript",
    name: "LiveScript",
    category: "artificial-intelligence",
    kind: "personal",
    description: {
      en: "A concept for an intelligent, speech-aware teleprompter that follows a script in real time, even when the speaker paraphrases.",
      pt: "Conceito de um teleprompter inteligente que acompanha um roteiro em tempo real, mesmo quando o usuário utiliza palavras diferentes das originais.",
    },
    purpose: {
      en: "Designed to combine speech recognition and semantic text matching to track progress, highlight covered sections and provide contextual cues when the speaker loses track.",
      pt: "Projetado para combinar reconhecimento de fala e correspondência semântica de texto para acompanhar o progresso, destacar trechos já apresentados e fornecer sugestões quando o usuário perder a linha de raciocínio.",
    },
    status: "experimental",
    conceptNote: true,
    technologies: ["Python", "Speech Recognition", "NLP"],
    year: 2026,
  },

{
  id: "passa-a-bola",
  name: "passa-a-bola",
  category: "frontend",
  kind: "academic",
  description: {
    en: "An interactive minigame developed as part of the FIAP Challenge 2025. The team placed 4th in the competition and was selected among 9 first-year Software Engineering teams to present at NEXT FIAP.",
    pt: "Um minigame interativo desenvolvido para o Challenge FIAP 2025. A equipe conquistou o 4º lugar na competição e foi selecionada entre 9 equipes do primeiro ano de Engenharia de Software para apresentar no NEXT FIAP.",
  },
  purpose: {
    en: "Presented at NEXT FIAP, where the game engaged more than 30 participants through an interactive experience.",
    pt: "Apresentado no NEXT FIAP, onde o jogo envolveu mais de 30 participantes por meio de uma experiência interativa.",
  },
  status: "completed",
  technologies: ["Frontend Development", "Web Technologies"],
  year: 2025,
  demo: "https://frontend-passa-a-bola.vercel.app",
},
{
  id: "encryption",
  name: "encryption",
  category: "cybersecurity",
  kind: "personal",
  description: {
    en: "An encrypted messaging system designed to securely exchange messages between two computers.",
    pt: "Um sistema de mensagens criptografadas desenvolvido para permitir a troca segura de mensagens entre dois computadores.",
  },
  purpose: {
    en: "An exploration of encryption and secure communication, focusing on protecting messages exchanged between connected machines.",
    pt: "Um projeto de exploração de criptografia e comunicação segura, com foco na proteção de mensagens trocadas entre máquinas conectadas.",
  },
  status: "completed",
  technologies: ["Encryption", "Networking"],
  year: 2026,
},
{
  id: "watchlist",
  name: "watchlist",
  category: "frontend",
  kind: "personal",
  description: {
    en: "A movie discovery and tracking application built to explore API integration using The Movie Database (TMDB) API.",
    pt: "Uma aplicação para descobrir e acompanhar filmes, desenvolvida para explorar integração com APIs utilizando a The Movie Database (TMDB) API.",
  },
  purpose: {
    en: "A hands-on project focused on consuming external REST APIs and working with movie data.",
    pt: "Um projeto prático focado no consumo de APIs REST externas e na manipulação de dados sobre filmes.",
  },
  status: "completed",
  technologies: ["REST APIs", "TMDB API"],
  year: 2026,
},
{
  id: "gourmeton",
  name: "gourmeton",
  category: "frontend",
  kind: "personal",
  description: {
    en: "A recipe discovery website designed to make browsing and exploring food recipes simple and accessible.",
    pt: "Um site de descoberta de receitas desenvolvido para tornar a navegação e a exploração de receitas culinárias simples e acessíveis.",
  },
  status: "completed",
  technologies: ["Web Development"],
  year: 2026,
  github: "https://github.com/E-brinca64/gourmeton",
  demo: "https://gourmeton-chi.vercel.app",
},
{
  id: "bmi-calculator",
  name: "bmi-calculator",
  category: "frontend",
  kind: "personal",
  description: {
    en: "A simple Body Mass Index calculator that explores user input, mathematical calculations and result presentation through a web interface.",
    pt: "Uma calculadora simples de Índice de Massa Corporal que explora entrada de dados, cálculos matemáticos e apresentação de resultados em uma interface web.",
  },
  status: "completed",
  technologies: ["Web Development"],
  year: 2026,
},
{
  id: "ghostty-config",
  name: "ghostty-config",
  category: "tools-utilities",
  kind: "personal",
  description: {
    en: "A personalized Ghostty terminal configuration focused on a minimal cyberpunk-inspired aesthetic and an efficient command-line workflow.",
    pt: "Uma configuração personalizada do terminal Ghostty, com foco em uma estética cyberpunk minimalista e em um fluxo de trabalho eficiente no terminal.",
  },
  status: "in-progress",
  technologies: ["Ghostty", "Linux", "Terminal Customization"],
  year: 2026,
},
{
  id: "linux-layout",
  name: "linux-layout",
  category: "automation",
  kind: "personal",
  description: {
    en: "A collection of shell scripts designed to automate my Linux desktop setup and launch applications in predefined workspaces.",
    pt: "Uma coleção de scripts shell desenvolvidos para automatizar a configuração do desktop Linux e abrir aplicações em espaços de trabalho predefinidos.",
  },
  purpose: {
    en: "An exploration of shell scripting, desktop automation and customized Linux workflows.",
    pt: "Uma exploração de shell scripting, automação de desktop e fluxos de trabalho personalizados no Linux.",
  },
  status: "in-progress",
  technologies: ["Bash", "Linux", "Shell Scripting"],
  year: 2026,
},
{
  id: "upscale-images",
  name: "upscale-images",
  category: "artificial-intelligence",
  kind: "personal",
  description: {
    en: "An image upscaling project that uses a trained AI model to increase image resolution and enhance visual quality.",
    pt: "Um projeto de aumento de resolução de imagens que utiliza um modelo de IA treinado para ampliar imagens e melhorar sua qualidade visual.",
  },
  purpose: {
    en: "An experiment in applying machine learning models to image enhancement and processing.",
    pt: "Um experimento com aplicação de modelos de machine learning para aprimoramento e processamento de imagens.",
  },
  status: "completed",
  technologies: ["AI", "Image Processing", "Machine Learning"],
  year: 2026,
},

];
