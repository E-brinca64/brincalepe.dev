import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

async function loadModule(path) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const dataUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
  return import(dataUrl);
}

const [{ operations }, { services }, { technologyGroups }] = await Promise.all([
  loadModule("../src/data/now.ts"),
  loadModule("../src/data/services.ts"),
  loadModule("../src/data/technologies.ts"),
]);

test("current operation labels have English and Portuguese versions", () => {
  assert.deepEqual(operations.map((item) => item.label.pt), [
    "CONSTRUINDO",
    "ESTUDANDO",
    "EXPLORANDO",
    "ATENDENDO",
  ]);
});

test("service descriptions have English and Portuguese versions", () => {
  assert.equal(services[0].pt, "Aplicações web (React / Next.js / TypeScript)");
  assert.equal(services[1].pt, "Automação de processos (n8n, Python)");
  assert.equal(services[2].pt, "Protótipos de dados e inteligência artificial");
});

test("technology groups have translated labels and values", () => {
  assert.equal(technologyGroups[0].name.pt, "LINGUAGENS");
  assert.equal(technologyGroups[2].name.pt, "SISTEMAS");
  assert.equal(technologyGroups[0].items[0].name.pt, "Python");
});
