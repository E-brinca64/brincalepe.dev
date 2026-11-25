import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

async function loadLocale(path) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const dataUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
  return (await import(dataUrl)).default;
}

const [en, pt] = await Promise.all([
  loadLocale("../src/i18n/en.ts"),
  loadLocale("../src/i18n/pt.ts"),
]);

for (const [language, locale] of [["English", en], ["Portuguese", pt]]) {
  test(`${language} contact links identify each destination before the value`, () => {
    assert.equal(
      locale.email,
      language === "English"
        ? "EMAIL $ me.client802@passinbox.com"
        : "E-MAIL $ me.client802@passinbox.com"
    );
    assert.equal(locale.github, "GITHUB $ github.com/E-brinca64");
    assert.equal(locale.linkedin, "LINKEDIN $ linkedin.com/in/enzo-brincalepe");
    assert.equal(locale.instagram, "INSTAGRAM $ @enzo.brincalepe");
    assert.equal(locale.copyEmail, language === "English" ? "COPY EMAIL" : "COPIAR E-MAIL");
    assert.equal(locale.emailCopied, language === "English" ? "COPIED" : "COPIADO");
    assert.equal(locale.emailCopyFailed, language === "English" ? "COPY FAILED" : "FALHA AO COPIAR");
  });
}
