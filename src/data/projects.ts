// Project records are maintained separately in project-list.ts.
import { projectList } from "./project-list";

export const categories = [
  "frontend",
  "backend",
  "fullstack",
  "automation",
  "tools-utilities",
  "devops",
  "cybersecurity",
  "artificial-intelligence",
  "embedded",
  "data-science",
  "experiments",
] as const;

export type Category = (typeof categories)[number];
export type Status = "completed" | "in-progress" | "experimental";
export type Kind = "personal" | "academic";
export type LocalizedText = { en: string; pt: string };

export interface Project {
  id: string;
  name: string;
  description: LocalizedText;
  category: Category;
  technologies: string[];
  status: Status;
  github?: string;
  demo?: string;
  image?: string;

  // Optional metadata retained by the existing Explorer.
  kind?: Kind;
  year?: number;
  purpose?: LocalizedText;
  conceptNote?: boolean;
}

export interface Note {
  id: string;
  category: Category;
  filename: string;
  body: LocalizedText;
}

export const projects: Project[] = projectList;

export function getPopulatedCategories(
  projectList: readonly Pick<Project, "category">[] = projects
): Category[] {
  return categories.filter((category) => projectList.some((project) => project.category === category));
}

export const notes: Note[] = [
  {
    id: "client-work",
    category: "fullstack",
    filename: "client-work.md",
    body: {
      en: "I take freelance full-stack and automation work. Client names and details are private by default. Anonymized case studies will be added here with the client's permission.",
      pt: "Faço trabalhos freelance de full-stack e automação. Nomes e detalhes de clientes são privados por padrão. Estudos de caso anônimos serão adicionados com a permissão do cliente.",
    },
  },
];
