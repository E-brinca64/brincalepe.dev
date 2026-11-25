import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/data/system.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const dataUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
const { PROFILE } = await import(dataUrl);

test("profile exposes the requested public contact links", () => {
  assert.equal(PROFILE.email, "mailto:me.client802@passinbox.com");
  assert.equal(PROFILE.github, "https://github.com/E-brinca64");
  assert.equal(PROFILE.linkedin, "https://www.linkedin.com/in/enzo-brincalepe/");
  assert.equal(PROFILE.instagram, "https://www.instagram.com/enzo.brincalepe/");
});
