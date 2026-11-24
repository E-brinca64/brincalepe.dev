import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

function toDataUrl(source) {
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  return `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
}

const listSource = await readFile(new URL("../src/data/project-list.ts", import.meta.url), "utf8");
const listModuleUrl = toDataUrl(listSource);
const projectsSource = await readFile(new URL("../src/data/projects.ts", import.meta.url), "utf8");
const projectsModuleSource = projectsSource.replace(
  'from "./project-list"',
  `from "${listModuleUrl}"`
);
const { categories, getPopulatedCategories, projects } = await import(toDataUrl(projectsModuleSource));

const expectedCategories = [
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
];

test("project data exposes the supported category list", () => {
  assert.deepEqual(categories, expectedCategories);
});

test("every project uses an allowed category and status", () => {
  const allowedStatuses = new Set(["completed", "in-progress", "experimental"]);

  for (const project of projects) {
    assert.ok(categories.includes(project.category), `${project.id} has invalid category`);
    assert.ok(allowedStatuses.has(project.status), `${project.id} has invalid status`);
  }
});

test("only categories with projects are visible, including new categories", () => {
  const sampleProjects = [{ category: "backend" }, { category: "backend" }, { category: "devops" }];

  assert.deepEqual(getPopulatedCategories(sampleProjects), ["backend", "devops"]);
  assert.deepEqual(getPopulatedCategories([]), []);
});
