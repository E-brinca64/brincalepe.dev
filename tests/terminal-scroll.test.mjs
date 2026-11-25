import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/components/terminal-scroll.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const dataUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
const { scrollTerminalToBottom } = await import(dataUrl);

test("terminal output scrolls to the newest line", () => {
  const output = { scrollTop: 0, scrollHeight: 240 };

  scrollTerminalToBottom(output);

  assert.equal(output.scrollTop, 240);
});

test("terminal scrolling safely ignores a missing output element", () => {
  assert.doesNotThrow(() => scrollTerminalToBottom(null));
});
