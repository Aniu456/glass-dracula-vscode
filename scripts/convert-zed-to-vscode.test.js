#!/usr/bin/env node
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const { createTheme } = require("./convert-zed-to-vscode");

const ROOT_DIR = path.resolve(__dirname, "../../..");
const zedPath = path.join(
  ROOT_DIR,
  "zed/glass-dracula/themes/dracula-dark-vivid-black.json"
);
const vscodePath = path.resolve(
  __dirname,
  "../themes/dracula-dark-vivid-black-color-theme.json"
);

test("Dracula Dark Vivid Black matches the current Zed source", () => {
  const zedTheme = JSON.parse(fs.readFileSync(zedPath, "utf8"));
  const actualTheme = JSON.parse(fs.readFileSync(vscodePath, "utf8"));
  const expectedTheme = createTheme(zedTheme);

  assert.deepEqual(actualTheme, expectedTheme);
});

test("uses the VS Code editor line highlight color key", () => {
  const zedTheme = JSON.parse(fs.readFileSync(zedPath, "utf8"));
  const style = zedTheme.themes[0].style;
  const convertedTheme = createTheme(zedTheme);

  assert.equal(
    convertedTheme.colors["editor.lineHighlightBackground"],
    style["editor.active_line.background"]
  );
  assert.equal(convertedTheme.colors.editorLineHighlightBackground, undefined);
});

test("maps Zed tab containers and focused explorer rows", () => {
  const zedTheme = JSON.parse(fs.readFileSync(zedPath, "utf8"));
  const style = zedTheme.themes[0].style;
  const colors = createTheme(zedTheme).colors;

  assert.equal(colors["editorGroupHeader.tabsBackground"], style["tab_bar.background"]);
  assert.equal(colors["editorGroupHeader.noTabsBackground"], style["tab_bar.background"]);
  assert.equal(colors["editorGroup.emptyBackground"], style["editor.background"]);
  assert.equal(colors["list.focusBackground"], style["element.selected"]);
  assert.equal(colors["list.focusAndSelectionBackground"], style["element.selected"]);
  assert.equal(colors["list.inactiveFocusBackground"], style["ghost_element.selected"]);
  assert.equal(colors["tab.activeBorderTop"], style["border.focused"]);
});

test("keeps JSX tag names pink and renders tag delimiters like Zed brackets", () => {
  const zedTheme = JSON.parse(fs.readFileSync(zedPath, "utf8"));
  const convertedTheme = createTheme(zedTheme);
  const bracketRule = convertedTheme.tokenColors.find(
    (rule) => rule.name === "zed:punctuation.bracket"
  );
  const specialRule = convertedTheme.tokenColors.find(
    (rule) => rule.name === "zed:punctuation.special"
  );

  assert.ok(bracketRule.scope.includes("punctuation.definition.tag"));
  assert.ok(!specialRule.scope.includes("punctuation.definition.tag"));
});

test("uses Zed muted colors for unselected sidebar text and activity icons", () => {
  const zedTheme = JSON.parse(fs.readFileSync(zedPath, "utf8"));
  const style = zedTheme.themes[0].style;
  const colors = createTheme(zedTheme).colors;

  assert.equal(colors["sideBar.foreground"], style["text.muted"]);
  assert.equal(colors["list.hoverForeground"], style.text);
  assert.equal(colors["activityBar.inactiveForeground"], style["icon.muted"]);
  assert.equal(colors["activityBarTop.foreground"], style.icon);
  assert.equal(colors["activityBarTop.inactiveForeground"], style["icon.muted"]);
});
