#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "../../..");
const OUT_DIR = path.resolve(__dirname, "..", "themes");

const THEME_INPUTS = [
  {
    src: "one-dark-pro-dracula-vivid-black-apple.json",
    out: "dracula-dark-vivid-black-color-theme.json",
  },
  {
    src: "glass-dracula-vivid-white.json",
    out: "dracula-light-vivid-white-color-theme.json",
  },
  {
    src: "one-dark-pro-glass-dracula.json",
    out: "dracula-glass-color-theme.json",
  },
  {
    src: "one-dark-pro-glass-dracula-hsv.json",
    out: "dracula-glass-hsv-color-theme.json",
  },
  {
    src: "one-dark-pro-glass-dracula-vivid.json",
    out: "dracula-glass-vivid-color-theme.json",
  },
];

const ensureObject = (value, fallback = {}) =>
  value && typeof value === "object" ? value : fallback;

const pick = (style, ...keys) => {
  for (const key of keys) {
    const value = style[key];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }
  return undefined;
};

const toFontStyle = (entry) => {
  if (!entry || typeof entry !== "object") return undefined;
  const styles = [];
  if (entry.font_style === "italic") styles.push("italic");
  if (entry.font_style === "underline") styles.push("underline");
  if (typeof entry.font_weight === "number" && entry.font_weight >= 600) {
    styles.push("bold");
  }
  return styles.length > 0 ? styles.join(" ") : undefined;
};

const addTokenRule = (rules, syntax, zedKey, scopes) => {
  const entry = syntax[zedKey];
  if (!entry || typeof entry.color !== "string") return;
  const settings = { foreground: entry.color };
  const fontStyle = toFontStyle(entry);
  if (fontStyle) settings.fontStyle = fontStyle;
  rules.push({
    name: `zed:${zedKey}`,
    scope: scopes,
    settings,
  });
};

const createTheme = (themeFamily) => {
  const theme = themeFamily.themes?.[0];
  if (!theme || !theme.style) {
    throw new Error("Invalid Zed theme file: missing themes[0].style");
  }
  const style = ensureObject(theme.style);
  const syntax = ensureObject(style.syntax);

  const colors = {
    foreground: pick(style, "text", "editor.foreground"),
    focusBorder: pick(style, "border.focused", "panel.focused_border"),
    "widget.border": pick(style, "border", "border.variant"),
    "widget.shadow": "#00000040",

    "selection.background": pick(style, "element.selected", "editor.document_highlight.write_background"),

    "editor.background": pick(style, "editor.background", "background"),
    "editor.foreground": pick(style, "editor.foreground", "text"),
    "editorLineNumber.foreground": pick(style, "editor.line_number", "text.muted"),
    "editorLineNumber.activeForeground": pick(style, "editor.active_line_number", "text"),
    "editorLineHighlightBackground": pick(style, "editor.active_line.background"),
    "editorCursor.foreground": pick(style, "text.accent", "border.focused", "icon.accent"),
    "editor.selectionBackground": pick(style, "element.selected", "editor.document_highlight.write_background"),
    "editor.selectionHighlightBackground": pick(style, "editor.document_highlight.read_background"),
    "editor.wordHighlightBackground": pick(style, "editor.document_highlight.read_background"),
    "editor.wordHighlightStrongBackground": pick(style, "editor.document_highlight.write_background"),
    "editorBracketMatch.background": pick(style, "editor.document_highlight.bracket_background"),
    "editorWhitespace.foreground": pick(style, "editor.invisible"),
    "editorIndentGuide.background1": pick(style, "editor.indent_guide"),
    "editorIndentGuide.activeBackground1": pick(style, "editor.indent_guide_active"),

    "editorGutter.background": pick(style, "editor.gutter.background", "editor.background"),

    "activityBar.background": pick(style, "panel.background", "surface.background", "background"),
    "activityBar.foreground": pick(style, "icon", "text"),
    "activityBar.inactiveForeground": pick(style, "icon.muted", "text.muted"),
    "activityBarBadge.background": pick(style, "text.accent", "border.focused"),
    "activityBarBadge.foreground": pick(style, "text", "editor.foreground"),

    "sideBar.background": pick(style, "panel.background", "surface.background", "background"),
    "sideBar.foreground": pick(style, "text", "editor.foreground"),
    "sideBar.border": pick(style, "border", "pane_group.border"),

    "titleBar.activeBackground": pick(style, "title_bar.background", "background"),
    "titleBar.inactiveBackground": pick(style, "title_bar.inactive_background", "title_bar.background"),
    "titleBar.activeForeground": pick(style, "text", "editor.foreground"),

    "tab.activeBackground": pick(style, "tab.active_background", "editor.background"),
    "tab.inactiveBackground": pick(style, "tab.inactive_background", "tab_bar.background"),
    "tab.activeForeground": pick(style, "text", "editor.foreground"),
    "tab.inactiveForeground": pick(style, "text.muted", "icon.muted"),
    "tab.border": pick(style, "border.variant", "border"),
    "tab.activeBorderTop": pick(style, "border.focused", "text.accent"),

    "statusBar.background": pick(style, "status_bar.background", "background"),
    "statusBar.foreground": pick(style, "text", "editor.foreground"),
    "statusBar.border": pick(style, "border", "border.variant"),

    "panel.background": pick(style, "panel.background", "surface.background"),
    "panel.border": pick(style, "border", "border.variant"),

    "input.background": pick(style, "element.background", "surface.background"),
    "input.foreground": pick(style, "text", "editor.foreground"),
    "input.placeholderForeground": pick(style, "text.placeholder", "text.muted"),
    "input.border": pick(style, "border.variant", "border"),

    "dropdown.background": pick(style, "element.background", "surface.background"),
    "dropdown.foreground": pick(style, "text", "editor.foreground"),
    "dropdown.border": pick(style, "border.variant", "border"),

    "list.hoverBackground": pick(style, "element.hover"),
    "list.activeSelectionBackground": pick(style, "element.selected"),
    "list.inactiveSelectionBackground": pick(style, "ghost_element.selected", "element.selected"),
    "list.activeSelectionForeground": pick(style, "text", "editor.foreground"),
    "list.inactiveSelectionForeground": pick(style, "text", "editor.foreground"),

    "scrollbarSlider.background": pick(style, "scrollbar.thumb.background"),
    "scrollbarSlider.hoverBackground": pick(style, "scrollbar.thumb.hover_background"),

    "terminal.background": pick(style, "terminal.background", "editor.background"),
    "terminal.foreground": pick(style, "terminal.foreground", "editor.foreground"),
    "terminalCursor.foreground": pick(style, "terminal.bright_foreground", "editor.foreground"),
    "terminal.ansiBlack": pick(style, "terminal.ansi.black"),
    "terminal.ansiRed": pick(style, "terminal.ansi.red"),
    "terminal.ansiGreen": pick(style, "terminal.ansi.green"),
    "terminal.ansiYellow": pick(style, "terminal.ansi.yellow"),
    "terminal.ansiBlue": pick(style, "terminal.ansi.blue"),
    "terminal.ansiMagenta": pick(style, "terminal.ansi.magenta"),
    "terminal.ansiCyan": pick(style, "terminal.ansi.cyan"),
    "terminal.ansiWhite": pick(style, "terminal.ansi.white"),
    "terminal.ansiBrightBlack": pick(style, "terminal.ansi.bright_black"),
    "terminal.ansiBrightRed": pick(style, "terminal.ansi.bright_red"),
    "terminal.ansiBrightGreen": pick(style, "terminal.ansi.bright_green"),
    "terminal.ansiBrightYellow": pick(style, "terminal.ansi.bright_yellow"),
    "terminal.ansiBrightBlue": pick(style, "terminal.ansi.bright_blue"),
    "terminal.ansiBrightMagenta": pick(style, "terminal.ansi.bright_magenta"),
    "terminal.ansiBrightCyan": pick(style, "terminal.ansi.bright_cyan"),
    "terminal.ansiBrightWhite": pick(style, "terminal.ansi.bright_white"),
  };

  const filteredColors = Object.fromEntries(
    Object.entries(colors).filter(([, value]) => typeof value === "string")
  );

  const tokenColors = [];
  addTokenRule(tokenColors, syntax, "comment", ["comment"]);
  addTokenRule(tokenColors, syntax, "comment.doc", ["comment.block.documentation"]);
  addTokenRule(tokenColors, syntax, "keyword", ["keyword", "storage", "storage.type"]);
  addTokenRule(tokenColors, syntax, "operator", ["keyword.operator"]);
  addTokenRule(tokenColors, syntax, "attribute", ["entity.other.attribute-name"]);
  addTokenRule(tokenColors, syntax, "function", ["entity.name.function", "support.function"]);
  addTokenRule(tokenColors, syntax, "constructor", ["entity.name.type.class"]);
  addTokenRule(tokenColors, syntax, "type", ["entity.name.type", "support.type"]);
  addTokenRule(tokenColors, syntax, "type.interface", ["entity.name.type.interface"]);
  addTokenRule(tokenColors, syntax, "type.super", ["entity.other.inherited-class"]);
  addTokenRule(tokenColors, syntax, "constant", ["constant"]);
  addTokenRule(tokenColors, syntax, "enum", ["entity.name.type.enum"]);
  addTokenRule(tokenColors, syntax, "number", ["constant.numeric"]);
  addTokenRule(tokenColors, syntax, "boolean", ["constant.language.boolean"]);
  addTokenRule(tokenColors, syntax, "string", ["string"]);
  addTokenRule(tokenColors, syntax, "string.escape", ["constant.character.escape"]);
  addTokenRule(tokenColors, syntax, "string.regex", ["string.regexp"]);
  addTokenRule(tokenColors, syntax, "string.special", ["string.other"]);
  addTokenRule(tokenColors, syntax, "string.special.symbol", ["constant.other.symbol"]);
  addTokenRule(tokenColors, syntax, "text.literal", ["markup.raw", "markup.inline.raw"]);
  addTokenRule(tokenColors, syntax, "link_uri", ["markup.underline.link"]);
  addTokenRule(tokenColors, syntax, "link_text", ["string.other.link.title"]);
  addTokenRule(tokenColors, syntax, "tag", ["entity.name.tag"]);
  addTokenRule(tokenColors, syntax, "property", ["variable.other.property"]);
  addTokenRule(tokenColors, syntax, "variable", ["variable"]);
  addTokenRule(tokenColors, syntax, "variable.member", ["variable.other.member"]);
  addTokenRule(tokenColors, syntax, "variable.parameter", ["variable.parameter"]);
  addTokenRule(tokenColors, syntax, "variable.special", ["variable.language"]);
  addTokenRule(tokenColors, syntax, "label", ["entity.name.label"]);
  addTokenRule(tokenColors, syntax, "title", ["entity.name.section"]);
  addTokenRule(tokenColors, syntax, "punctuation", ["punctuation"]);
  addTokenRule(tokenColors, syntax, "punctuation.bracket", ["punctuation.bracket"]);
  addTokenRule(tokenColors, syntax, "punctuation.delimiter", ["punctuation.separator"]);
  addTokenRule(tokenColors, syntax, "punctuation.special", ["punctuation.definition.tag"]);
  addTokenRule(tokenColors, syntax, "preproc", ["meta.preprocessor"]);
  addTokenRule(tokenColors, syntax, "emphasis", ["markup.italic"]);
  addTokenRule(tokenColors, syntax, "emphasis.strong", ["markup.bold"]);

  const semanticTokenColors = {};
  if (syntax.comment?.color) semanticTokenColors.comment = syntax.comment.color;
  if (syntax.keyword?.color) semanticTokenColors.keyword = syntax.keyword.color;
  if (syntax.function?.color) {
    semanticTokenColors.function = syntax.function.color;
    semanticTokenColors.method = syntax.function.color;
  }
  if (syntax.type?.color) {
    semanticTokenColors.type = syntax.type.color;
    semanticTokenColors.class = syntax.type.color;
    semanticTokenColors.interface = syntax.type.color;
  }
  if (syntax.enum?.color) semanticTokenColors.enum = syntax.enum.color;
  if (syntax.variant?.color) semanticTokenColors.enumMember = syntax.variant.color;
  if (syntax.variable?.color) semanticTokenColors.variable = syntax.variable.color;
  if (syntax["variable.parameter"]?.color) {
    semanticTokenColors.parameter = syntax["variable.parameter"].color;
  }
  if (syntax.property?.color) semanticTokenColors.property = syntax.property.color;
  if (syntax.string?.color) semanticTokenColors.string = syntax.string.color;
  if (syntax.number?.color) semanticTokenColors.number = syntax.number.color;
  if (syntax["string.regex"]?.color) {
    semanticTokenColors.regexp = syntax["string.regex"].color;
  }
  if (syntax.operator?.color) semanticTokenColors.operator = syntax.operator.color;

  return {
    $schema: "vscode://schemas/color-theme",
    name: theme.name,
    type: theme.appearance === "light" ? "light" : "dark",
    semanticHighlighting: true,
    colors: filteredColors,
    tokenColors,
    semanticTokenColors,
  };
};

const main = () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const item of THEME_INPUTS) {
    const inPath = path.join(ROOT_DIR, item.src);
    const outPath = path.join(OUT_DIR, item.out);
    const raw = fs.readFileSync(inPath, "utf8");
    const zedTheme = JSON.parse(raw);
    const vscodeTheme = createTheme(zedTheme);
    fs.writeFileSync(outPath, `${JSON.stringify(vscodeTheme, null, 2)}\n`);
    process.stdout.write(`generated ${path.basename(outPath)}\n`);
  }
};

main();
