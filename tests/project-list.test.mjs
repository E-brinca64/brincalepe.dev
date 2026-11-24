import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/data/project-list.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const dataUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
const { projectList } = await import(dataUrl);

const expectedProjectIds = [
  "homelab-srv01",
  "personal-dashboard",
  "moneta-ai",
  "pangovet",
  "smartwatch-disc",
  "portfolio",
  "github-readme-fastfetch",
];

test("the editable project list contains the existing project records", () => {
  assert.deepEqual(projectList.map((project) => project.id), expectedProjectIds);
});

test("projects in the editable list have the required fields", () => {
  for (const project of projectList) {
    assert.ok(project.id);
    assert.ok(project.name);
    assert.ok(project.description.en);
    assert.ok(project.description.pt);
    assert.ok(project.category);
    assert.ok(Array.isArray(project.technologies));
    assert.ok(["completed", "in-progress", "experimental"].includes(project.status));
  }
});
