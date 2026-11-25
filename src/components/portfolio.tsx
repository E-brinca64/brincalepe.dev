"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Command,
  Copy,
  FileCode2,
  FileText,
  Folder,
  FolderOpen,
  Grid2X2,
  List,
  Minus,
  X,
} from "lucide-react";
import { Navbar } from "@/src/components/Navbar";
import { CurrentOperations } from "@/src/components/CurrentOperations";
import { scrollTerminalToBottom } from "@/src/components/terminal-scroll";
import { getPopulatedCategories, notes, projects, type Project } from "@/src/data/projects";
import { technologyGroups } from "@/src/data/technologies";
import { services } from "@/src/data/services";
import {
  HOMELAB_START,
  LAST_UPDATED,
  PROFILE,
  SERVED_FROM_HOMELAB,
} from "@/src/data/system";
import en from "@/src/i18n/en";
import pt from "@/src/i18n/pt";

type Lang = "en" | "pt";
type Entry = {
  id: string;
  name: string;
  category: string;
  kind: "directory" | "project" | "note";
  project?: Project;
  note?: (typeof notes)[number];
};

const populatedCategories = getPopulatedCategories();

function uptimeDays() {
  return Math.max(
    0,
    Math.floor((Date.now() - new Date(`${HOMELAB_START}T00:00:00`).getTime()) / 86400000)
  );
}

export default function Portfolio() {
  const [lang, setLang] = useState<Lang>("en");
  const t = lang === "en" ? en : pt;
  const [path, setPath] = useState("/home/enzo/projects");
  const [selected, setSelected] = useState<string | null>(projects[0]?.id ?? null);
  const [view, setView] = useState<"list" | "grid">("list");
  const [lines, setLines] = useState<string[]>([
    "enzo@mainframe:~/projects$ help",
    t.help,
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [overlay, setOverlay] = useState(false);
  const [mobileStep, setMobileStep] = useState<"dirs" | "files" | "details">("files");
  const [expanded, setExpanded] = useState<string[]>(["projects"]);
  const [days, setDays] = useState(0);
  const [emailCopyStatus, setEmailCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalOutputRef = useRef<HTMLDivElement>(null);
  const categoryLabel = (category: string) =>
    t.categoryNames[category as keyof typeof t.categoryNames] ?? category;
  const statusLabel = (status: Project["status"]) => {
    switch (status) {
      case "completed":
        return t.status_completed;
      case "in-progress":
        return t["status_in-progress"];
      case "experimental":
        return t.status_experimental;
    }
  };
  
  const currentCategory = path.split("/").filter(Boolean).at(-1) || "projects";

  const entries: Entry[] = useMemo(() => {
    if (currentCategory === "projects") {
      return populatedCategories.map((category) => ({
        id: category,
        name: category,
        category,
        kind: "directory" as const,
      }));
    }

    return [
      ...projects
        .filter((p) => p.category === currentCategory)
        .map((project) => ({
          id: project.id,
          name: project.name,
          category: currentCategory,
          kind: "project" as const,
          project,
        })),
      ...notes
        .filter((n) => n.category === currentCategory)
        .map((note) => ({
          id: note.id,
          name: note.filename,
          category: currentCategory,
          kind: "note" as const,
          note,
        })),
    ];
  }, [currentCategory]);

  const selectedProject = projects.find((p) => p.id === selected) ?? null;
  const selectedNote = notes.find((n) => n.id === selected) ?? null;

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      setDays(uptimeDays());
      try {
        const stored = window.localStorage.getItem("enzo-language");
        setLang(
          stored === "pt" || stored === "en"
            ? stored
            : navigator.language.toLowerCase().startsWith("pt")
              ? "pt"
              : "en"
        );
      } catch {
        setLang(navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en");
      }
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    setLines((current) =>
      current.length <= 2
        ? ["enzo@mainframe:~/projects$ help", t.help]
        : current
    );
  }, [t.help]);

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    try {
      window.localStorage.setItem("enzo-language", lang);
    } catch {}
  }, [lang]);

  useEffect(() => {
    scrollTerminalToBottom(terminalOutputRef.current);
  }, [lines, terminalOpen]);

  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (
        event.key === "`" &&
        !(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)
      ) {
        event.preventDefault();
        setOverlay((value) => !value);
      }
      if (event.key === "Escape") setOverlay(false);
    };

    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);

  const changePath = useCallback((next: string) => {
    setPath(next);
    setSelected(null);
    setMobileStep("files");
  }, []);

  const selectEntry = useCallback(
    (entry: Entry) => {
      if (entry.kind === "directory") {
        changePath(`${path}/${entry.name}`);
        setLines((old) => [
          ...old,
          `enzo@mainframe:~/projects$ cd ${entry.name}`,
          `enzo@mainframe:~/projects/${entry.name}$ ls`,
        ]);
      } else {
        setSelected(entry.id);
        setMobileStep("details");
      }
    },
    [path, changePath]
  );

  const runCommand = useCallback(
    (raw: string) => {
      const command = raw.trim();
      if (!command) return;

      setHistory((old) => [...old, command]);
      setHistoryIndex(-1);

      const [name, ...args] = command.split(/\s+/);
      const arg = args.join(" ");
      const output: string[] = [];
      const allFiles: Entry[] = [
        ...projects.map((project) => ({
          id: project.id,
          name: project.name,
          category: project.category,
          kind: "project" as const,
          project,
        })),
        ...notes.map((note) => ({
          id: note.id,
          name: note.filename,
          category: note.category,
          kind: "note" as const,
          note,
        })),
      ];
      let nextPath = path;
      const outputEntries = (cat: string) =>
        allFiles.filter((entry) => entry.category === cat).map((entry) => entry.name);

      switch (name) {
        case "help":
          output.push(t.help);
          break;
        case "pwd":
          output.push(path);
          break;
        case "ls": {
          const cat = path.split("/").filter(Boolean).at(-1) || "projects";
          output.push(
            cat === "projects"
              ? populatedCategories.map(categoryLabel).join("  ")
              : outputEntries(cat).join("  ") || t.emptyFolder
          );
          break;
        }
        case "cd": {
          const argPath = arg.trim();
          const pieces = path.split("/").filter(Boolean);
          if (!argPath || argPath === "~") nextPath = "/home/enzo/projects";
          else if (argPath === "..")
            nextPath = pieces.length > 3 ? `/${pieces.slice(0, -1).join("/")}` : "/home/enzo/projects";
          else if (argPath === "/") nextPath = "/";
          else if (populatedCategories.some((category) => category === argPath))
            nextPath = `/home/enzo/projects/${argPath}`;
          else output.push(t.directoryNotFound.replace("{name}", argPath));

          if (!output.length) {
            changePath(nextPath);
            output.push(
              ...(nextPath.endsWith("projects")
                ? populatedCategories
                : outputEntries(nextPath.split("/").at(-1) || "")
              ).map((x) => x)
            );
          }
          break;
        }
        case "tree":
          output.push(
            `${t.projectsRoot}/\n${populatedCategories
              .map(
                (c) =>
                  `├── ${categoryLabel(c)}/\n${outputEntries(c)
                    .map((f) => `│   ├── ${f}`)
                    .join("\n")}`
              )
              .join("\n")}`
          );
          break;
        case "open": {
          const found = projects.find((p) => p.id === arg || p.name === arg);
          if (found) {
            setSelected(found.id);
            changePath(`/home/enzo/projects/${found.category}`);
            output.push(t.projectSelected.replace("{name}", found.name));
          } else {
            output.push(t.projectNotFound.replace("{name}", arg));
          }
          break;
        }
        case "cat": {
          const found = allFiles.find((f) => f.name === arg || f.id === arg);
          if (!found) output.push(t.fileNotFound.replace("{name}", arg));
          else if (found.project) {
            setSelected(found.project.id);
            output.push(found.project.description[lang]);
          } else if (found.note) {
            setSelected(found.note.id);
            output.push(found.note.body[lang]);
          }
          break;
        }
        case "projects":
          output.push(...projects.map((p) => `${p.name}  [${statusLabel(p.status)}]`));
          break;
        case "uptime":
          output.push(t.uptimeOutput.replace("{days}", String(days)));
          break;
        case "status":
          output.push(
            `${t.mainframeStatus.replace("{os}", PROFILE.os)}\n${t.serverStatus.replace("{days}", String(days))}\n${t.projectCountOutput.replace("{count}", String(projects.length))}`
          );
          break;
        case "fastfetch":
          output.push(
            fastfetch
              .map(([label, value]) => `${label.padEnd(12)}${value.replace(/\\n/g, "\n")}`)
              .join("\n")
          );
          break;
        case "whoami":
          output.push("enzo");
          break;
        case "about":
          output.push(t.about);
          break;
        case "contact":
          output.push(PROFILE.email);
          break;
        case "history":
          output.push(...history);
          break;
        case "clear":
          setLines([]);
          setInput("");
          return;
        case "sudo":
          output.push(t.sudoOutput);
          break;
        case "rm":
          output.push(t.readOnlyOutput);
          break;
        default:
          output.push(t.commandNotFound.replace("{name}", name));
      }

      setLines((old) => [
        ...old,
        `enzo@mainframe:~${path.replace("/home/enzo", "")}$ ${command}`,
        ...output,
      ]);
      setInput("");
    },
    [path, lang, days, history, t.about, t.help, changePath, t.emptyFolder]
  );

  const toggleLanguage = () => setLang((current) => (current === "en" ? "pt" : "en"));
  const openOverlay = () => {
    setOverlay(true);
    window.setTimeout(() => inputRef.current?.focus(), 50);
  };
  const goParent = () => changePath(path.split("/").slice(0, -1).join("/") || "/");
  const copyEmail = async () => {
    const address = PROFILE.email.replace(/^mailto:/, "");
    try {
      await navigator.clipboard.writeText(address);
      setEmailCopyStatus("copied");
    } catch {
      setEmailCopyStatus("failed");
    }
  };

  const fastfetch = [
    [t.fastfetchUserLabel, t.fastfetchUserValue],
    [t.fastfetchStudiesLabel, t.fastfetchStudiesValue],
    [t.fastfetchStackLabel, t.fastfetchStackValue],
    [t.fastfetchEnvironmentLabel, t.fastfetchEnvironmentValue],
    [t.fastfetchFocusLabel, t.fastfetchFocusValue],
    [t.fastfetchStatusLabel, t.fastfetchStatusValue],
  ];

  return (
    <>
      <Navbar
        language={lang}
        labels={{
          about: t.navAbout,
          projects: t.navProjects,
          arsenal: t.navArsenal,
          now: t.navNow,
          contact: t.navContact,
          openTerminal: lang === "en" ? "Open terminal" : "Abrir terminal",
          switchLanguage: lang === "en" ? "Switch language" : "Mudar idioma",
          closeMenu: t.close,
          openMenu: t.menu,
          workspace: t.workspace,
          mainNavigation: t.mainNavigation,
        }}
        onToggleLanguage={toggleLanguage}
        onBrandActivate={openOverlay}
      />

      <main id="top">
        <section className="hero wrap">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="marker">EC—001</span>
              {t.eyebrow}
            </p>
            <h1>
              {t.hero1}
              <br />
              {t.hero2}
              <br />
              <span>{t.hero3}</span>
            </h1>
            <p className="hero-sub">{t.heroSub}</p>
            <div className="hero-actions">
              <a className="action-primary" href="#projects">
                {t.openProjects}
              </a>
              <a className="action-secondary" href="#contact">
                {t.startProject}
              </a>
              
            </div>
            {PROFILE.resume && (
              <a
                className="resume-link"
                href={PROFILE.resume}
                target="_blank"
                rel="noreferrer"
              >
                {t.resume}
              </a>
            )}
          </div>

          <aside className="system-block corner-mark">
            <div className="system-title">
              <span>{t.fastfetch}</span>
              <span>SYS—01</span>
            </div>
            <div className="system-rule" />
            {fastfetch.map(([key, value]) => (
              <p className="system-row" key={key}>
                <span>{key}</span>
                <b>{value}</b>
              </p>
            ))}
            <span className="cursor" aria-hidden="true" />
          </aside>

          <p className="hero-footnote flex items-center gap-2 text-sm text-zinc-500 ">
             <ArrowDown className="w-4 h-4" /> {t.scrollToExplore}
          </p>
        </section>

        <section className="section wrap editorial" id="about">
          <div className="section-heading">
            <span>01 / {t.aboutLabel}</span>
            <span>{t.aboutAsideLabel}</span>
          </div>
          <div className="editorial-grid">
            <h2>{t.aboutTitle}</h2>
            <div>
              <div className="body-copy">
                {t.about.split("\n\n").map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <dl className="facts">
                <div>
                  <dt>{t.background}</dt>
                  <dd>{t.backgroundDetails}</dd>
                </div>
                <div>
                  <dt>{t.worksOn}</dt>
                  <dd style={{ whiteSpace: "pre-line" }}>{t.worksOnDetails}</dd>
                </div>
                <div>
                  <dt>{t.interests}</dt>
                  <dd>{t.interestsDetails}</dd>
                </div>
                <div>
                  <dt>{t.languages}</dt>
                  <dd>{t.languagesDetails}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="section wrap arsenal" id="arsenal">
          <div className="section-heading">
            <span>02 / {t.arsenalLabel}</span>
            <span>{t.technicalInventory}</span>
          </div>
          <h2>{t.arsenalTitle}</h2>
          <div className="tech-list">
            {technologyGroups.map((group) => (
              <div className="tech-row" key={group.name.en}>
                <h3>{group.name[lang]}</h3>
                <div className="tech-items">
                  {group.items.map((item) => (
                    <span className="tech-item" key={item.name.en}>
                      {item.name[lang]}
                      {item.status && <small>{item.status[lang]}</small>}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section wrap explorer-section" id="projects">
          <div className="section-heading">
            <span>03 / {t.projectsLabel}</span>
            <span>~/projects</span>
          </div>
          <div className="explorer-intro">
            <h2>{t.projectsTitle}</h2>
            <p>{t.projectsIntro}</p>
          </div>

          <div className="explorer corner-mark">
            <div className="window-bar">
              <div className="window-title">
                <span className="window-icon">EC</span>
                <strong>{t.projectsLabel}</strong>
              </div>
              <div className="breadcrumb">
                <button
                  onClick={() => changePath("/home/enzo/projects")}
                  aria-label={t.goToProjectsRoot}
                >
                  ⌂
                </button>
                {path
                  .split("/")
                  .filter(Boolean)
                  .slice(2)
                  .map((crumb, i) => (
                    <span key={i}>
                      <ChevronRight size={12} />
                      <button
                        onClick={() =>
                          changePath(
                            `/home/enzo/projects/${path
                              .split("/")
                              .filter(Boolean)
                              .slice(3, 3 + i)
                              .concat(crumb)
                              .join("/")}`
                          )
                        }
                      >
                        {crumb}
                      </button>
                    </span>
                  ))}
              </div>
              <div className="window-controls">
                <button
                  onClick={() => setView("list")}
                  aria-label={t.listView}
                  className={view === "list" ? "selected" : ""}
                >
                  <List size={15} />
                </button>
                <button
                  onClick={() => setView("grid")}
                  aria-label={t.gridView}
                  className={view === "grid" ? "selected" : ""}
                >
                  <Grid2X2 size={14} />
                </button>
                <Minus size={14} />
                <X size={14} />
              </div>
            </div>

            <div className="mobile-steps">
              <button
                onClick={() => setMobileStep("dirs")}
                className={mobileStep === "dirs" ? "selected" : ""}
              >
                {t.mobileDirs}
              </button>
              <button
                onClick={() => setMobileStep("files")}
                className={mobileStep === "files" ? "selected" : ""}
              >
                {t.mobileFiles}
              </button>
              <button
                onClick={() => setMobileStep("details")}
                className={mobileStep === "details" ? "selected" : ""}
              >
                {t.mobileDetails}
              </button>
            </div>

            <div className={`explorer-body mobile-${mobileStep}`}>
              <aside className="tree-pane">
                <div className="pane-label">{t.folder}</div>
                <button
                  className={`tree-item root ${currentCategory === "projects" ? "current" : ""}`}
                  onClick={() => changePath("/home/enzo/projects")}
                >
                  <FolderOpen size={14} /> {t.projectsRoot}
                </button>
                {populatedCategories.map((category) => (
                  <button
                    key={category}
                    className={`tree-item indent ${currentCategory === category ? "current" : ""}`}
                    onClick={() => {
                      setExpanded((old) =>
                        old.includes(category) ? old.filter((x) => x !== category) : [...old, category]
                      );
                      changePath(`/home/enzo/projects/${category}`);
                      setLines((old) => [
                        ...old,
                        `enzo@mainframe:~/projects$ cd ${category}`,
                        `enzo@mainframe:~/projects/${category}$ ls`,
                      ]);
                    }}
                  >
                    <ChevronRight
                      className={expanded.includes(category) ? "turn" : ""}
                      size={12}
                    />
                    {expanded.includes(category) ? (
                      <FolderOpen size={14} />
                    ) : (
                      <Folder size={14} />
                    )}
                    <span>{category}</span>
                  </button>
                ))}
              </aside>

              <section className="files-pane" aria-label={t.fileView}>
                <div className="pane-label file-label">
                  <span>
                    {t.fileView} <small>{path}</small>
                  </span>
                  <button
                    className="back-button"
                    onClick={goParent}
                    aria-label={t.goToParentDirectory}
                  >
                    <ArrowLeft size={14} />
                  </button>
                </div>
                <div className="file-head">
                  <span>{t.name}</span>
                  <span>{t.type}</span>
                  <span>{t.status}</span>
                  <span>{t.year}</span>
                </div>

                {entries.length === 0 ? (
                  <p className="empty-folder">{t.emptyFolder}</p>
                ) : (
                  <div className={`file-list ${view}`} role="listbox" aria-label={t.fileView}>
                    {entries.map((entry) => {
                      const isSelected = selected === entry.id;
                      const project = entry.project;

                      return (
                        <button
                          key={entry.id}
                          role="option"
                          aria-selected={isSelected}
                          className={`file-entry ${isSelected ? "selected" : ""}`}
                          onClick={() => selectEntry(entry)}
                          onDoubleClick={() => selectEntry(entry)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") selectEntry(entry);
                            if (e.key === "Backspace") goParent();
                          }}
                        >
                          <span className="file-name">
                            {entry.kind === "directory" ? (
                              <Folder size={15} />
                            ) : entry.kind === "note" ? (
                              <FileText size={15} />
                            ) : (
                              <FileCode2 size={15} />
                            )}
                            <span>{entry.name}</span>
                          </span>
                          <span>
                            {entry.kind === "directory"
                              ? t.directory
                              : entry.kind === "note"
                                ? t.noteType
                                : t.projectType}
                          </span>
                          <span>
                            {project ? t[`status_${project.status}` as keyof typeof t] : "—"}
                          </span>
                          <span>{project?.year ?? "—"}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              <aside className="details-pane">
                <div className="pane-label">{t.details}</div>
                {selectedProject ? (
                  <>
                    <div className="detail-title">
                      <span className="detail-id">
                        {selectedProject.kind === "personal" ? t.personal : selectedProject.kind === "academic" ? t.academic : t.projectLabel} / {selectedProject.year ?? "—"}
                      </span>
                      <h3>{selectedProject.name}</h3>
                      <span className="status-pill">
                        ● {t[`status_${selectedProject.status}` as keyof typeof t]}
                      </span>
                    </div>
                    <p className="detail-copy">{selectedProject.description[lang]}</p>
                    {selectedProject.image && (
                      <div className="project-image">
                        <Image
                          src={selectedProject.image}
                          alt={`${selectedProject.name} preview`}
                          fill
                          sizes="(max-width: 900px) 100vw, 320px"
                          unoptimized
                        />
                      </div>
                    )}
                    {selectedProject.purpose && (
                      <p className="detail-copy muted-copy">{selectedProject.purpose[lang]}</p>
                    )}
                    {selectedProject.kind && (
                      <div className="detail-line">
                        <span>{t.kindLabel}</span>
                        <b>{selectedProject.kind === "personal" ? t.personal : t.academic}</b>
                      </div>
                    )}
                    <div className="detail-line">
                      <span>{t.techLabel}</span>
                      <b>{selectedProject.technologies.join(" · ")}</b>
                    </div>
                    {selectedProject.conceptNote && (
                      <p className="concept-warning">{t.conceptNote}</p>
                    )}
                    <div className="detail-actions">
                      {selectedProject.github && (
                        <a
                          href={selectedProject.github}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t.openRepo}
                          <ArrowUpRight size={13} />
                        </a>
                      )}
                      {selectedProject.demo && (
                        <a href={selectedProject.demo} target="_blank" rel="noreferrer">
                          {t.viewLive}
                          <ArrowUpRight size={13} />
                        </a>
                      )}
                    </div>
                  </>
                ) : selectedNote ? (
                  <>
                    <span className="detail-id">TEXT FILE / 2026</span>
                    <h3>{selectedNote.filename}</h3>
                    <p className="detail-copy">{selectedNote.body[lang]}</p>
                  </>
                ) : (
                  <p className="select-prompt">{t.selectPrompt}</p>
                )}
              </aside>
            </div>

            <div className={`terminal-dock ${terminalOpen ? "" : "collapsed"}`}>
              <button
                className="terminal-head"
                onClick={() => setTerminalOpen(!terminalOpen)}
                aria-expanded={terminalOpen}
              >
                <span>
                  <ChevronDown className={terminalOpen ? "" : "flip"} size={13} />
                  {t.terminal}
                </span>
                <span>enzo@mainframe:~/projects$</span>
              </button>

              {terminalOpen && (
                <div className="terminal-body">
                  <div className="terminal-output" aria-live="polite" ref={terminalOutputRef}>
                    {lines.slice(-60).map((line, i) => (
                      <p
                        key={`${i}-${line}`}
                        className={
                          line.includes("not found") || line.includes("incident")
                            ? "terminal-error"
                            : ""
                        }
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                  <form
                    className="terminal-prompt"
                    onSubmit={(e) => {
                      e.preventDefault();
                      runCommand(input);
                    }}
                  >
                    <label htmlFor="terminal-command">
                      enzo@mainframe:~{path.replace("/home/enzo", "")}$
                    </label>
                    <div className="terminal-input-wrap">
                      {input.length === 0 && (
                        <span className="cursor terminal-input-cursor" aria-hidden="true" />
                      )}
                      <input
                        id="terminal-command"
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowUp") {
                            e.preventDefault();
                            const i =
                              historyIndex < 0
                                ? history.length - 1
                                : Math.max(0, historyIndex - 1);
                            setHistoryIndex(i);
                            setInput(history[i] ?? "");
                          }
                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            const i = historyIndex + 1;
                            if (i >= history.length) {
                              setHistoryIndex(-1);
                              setInput("");
                            } else {
                              setHistoryIndex(i);
                              setInput(history[i] ?? "");
                            }
                          }
                          if (e.key === "Tab") {
                            e.preventDefault();
                            const terms = [
                              ...populatedCategories,
                              ...projects.map((p) => p.name),
                              "help",
                              "ls",
                              "cd",
                              "pwd",
                              "tree",
                              "cat",
                              "open",
                              "about",
                              "projects",
                              "status",
                              "uptime",
                              "fastfetch",
                              "whoami",
                              "contact",
                              "history",
                              "clear",
                            ];
                            const match = terms.find((term) =>
                              term.startsWith(input.split(" ").at(-1) ?? "")
                            );
                            if (match) {
                              setInput(
                                (old) => old.slice(0, old.lastIndexOf(" ") + 1) + match
                              );
                            }
                          }
                        }}
                        placeholder={t.terminalHint}
                        autoComplete="off"
                        spellCheck={false}
                      />
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div className="statusbar">
              <span>
                {projects.length} {t.projectsCount} ·{" "}
                {projects.filter((p) => p.status === "in-progress").length} {t.inDevelopment} ·{" "}
                {projects.filter((p) => p.status === "experimental").length}{" "}
                {t.experimental}
              </span>
              <span>srv-01 up {days}d · UTF-8</span>
            </div>
          </div>
        </section>

        <CurrentOperations
          lang={lang}
          label={t.nowLabel}
          title={t.nowTitle}
          updated={t.updated}
          lastUpdated={LAST_UPDATED}
        />

        <section className="section wrap contact-section" id="contact">
          <div className="section-heading">
            <span>05 / {t.contactLabel}</span>
            <span>{t.contactChannel}</span>
          </div>
          <div className="contact-grid">
            <div>
              <h2>{t.contactTitle}</h2>
              <p>{t.contactSub}</p>
              <div className="service-list">
                <span>{t.whatTake}</span>
                {services.map((service) => (
                  <p key={service.en}>↳ {service[lang]}</p>
                ))}
              </div>
            </div>
            <div className="contact-links">
              {PROFILE.email.startsWith("mailto:") ? (
                <>
                  <a href={PROFILE.email}>
                    {t.email}
                    <ArrowUpRight size={14} />
                  </a>
                  <button className="contact-copy" type="button" onClick={copyEmail}>
                    <span>{emailCopyStatus === "copied" ? t.emailCopied : emailCopyStatus === "failed" ? t.emailCopyFailed : t.copyEmail}</span>
                    <Copy size={14} aria-hidden="true" />
                  </button>
                </>
              ) : (
                <span className="disabled-link">
                  {t.email}
                  <small>{"// CONFIRM: add email address"}</small>
                </span>
              )}
              {PROFILE.github ? (
                <a href={PROFILE.github} target="_blank" rel="noreferrer">
                  {t.github}
                  <ArrowUpRight size={14} />
                </a>
              ) : (
                <span className="disabled-link">
                  {t.github}
                  <small>{"// CONFIRM: add GitHub URL"}</small>
                </span>
              )}
              {PROFILE.linkedin ? (
                <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">
                  {t.linkedin}
                  <ArrowUpRight size={14} />
                </a>
              ) : (
                <span className="disabled-link">
                  {t.linkedin}
                  <small>{"// CONFIRM: add LinkedIn URL"}</small>
                </span>
              )}
              {PROFILE.instagram && (
                <a href={PROFILE.instagram} target="_blank" rel="noreferrer">
                  {t.instagram}
                  <ArrowUpRight size={14} />
                </a>
              )}
              {PROFILE.whatsapp && (
                <a href={PROFILE.whatsapp}>
                  {t.whatsapp}
                  <ArrowUpRight size={14} />
                </a>
              )}
              {PROFILE.resume && (
                <a href={PROFILE.resume}>
                  {t.resumeCommand}
                  <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer wrap">
        <span>{t.footer}</span>
        {SERVED_FROM_HOMELAB && <span>{t.served}</span>}
        <button onClick={openOverlay}>
          <Command size={13} /> `
        </button>
      </footer>

      {overlay && (
        <div className="terminal-overlay" role="dialog" aria-modal="true" aria-label={t.terminal}>
          <div className="overlay-window">
            <div className="overlay-header">
              <span>enzo@mainframe:~</span>
              <button onClick={() => setOverlay(false)} aria-label={t.close}>
                <X size={16} />
              </button>
            </div>
            <div className="overlay-copy">
              <p>enzo@mainframe:~$ whoami</p>
              <p>enzo</p>
              <p>{lang === "en" ? <>Type <b>help</b> for commands, or press Escape to close.</> : <>Digite <b>help</b> para ver os comandos ou pressione Escape para fechar.</>}</p>
            </div>
            <form
              className="terminal-prompt"
              onSubmit={(e) => {
                e.preventDefault();
                runCommand(input);
              }}
            >
              <label htmlFor="overlay-command">enzo@mainframe:~$</label>
              <input
                id="overlay-command"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                ref={inputRef}
                autoComplete="off"
                spellCheck={false}
                placeholder={t.terminalHint}
              />
              <button type="submit">↵</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}