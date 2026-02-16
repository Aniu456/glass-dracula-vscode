#!/usr/bin/env python3
"""Convert Zed theme files to VSCode color theme format."""
import json
import os

# Zed syntax key -> VSCode TextMate scopes mapping
ZED_TO_VSCODE_SCOPES = {
    "attribute": ["entity.other.attribute-name"],
    "boolean": ["constant.language.boolean", "constant.language"],
    "comment": ["comment", "comment.line", "comment.block"],
    "comment.doc": ["comment.block.documentation"],
    "constant": ["constant", "constant.other", "constant.character"],
    "constructor": ["entity.name.function.constructor", "meta.function-call.constructor"],
    "embedded": ["meta.embedded", "source.embedded"],
    "emphasis": ["markup.italic"],
    "emphasis.strong": ["markup.bold"],
    "enum": ["entity.name.type.enum", "support.type.enum"],
    "function": ["entity.name.function", "support.function", "meta.function-call"],
    "hint": ["markup.hint"],
    "keyword": ["keyword", "keyword.control", "keyword.operator.new", "keyword.operator.expression", "storage.type", "storage.modifier"],
    "label": ["entity.name.label"],
    "link_text": ["markup.underline.link", "string.other.link.title"],
    "link_uri": ["markup.underline.link.url"],
    "number": ["constant.numeric"],
    "operator": ["keyword.operator", "keyword.operator.assignment", "keyword.operator.arithmetic", "keyword.operator.logical"],
    "predictive": ["markup.prediction"],
    "preproc": ["keyword.preprocessor", "meta.preprocessor"],
    "primary": ["source"],
    "property": ["variable.other.property", "support.type.property-name", "entity.other.attribute-name.css"],
    "punctuation": ["punctuation"],
    "punctuation.bracket": ["punctuation.definition.bracket", "meta.brace", "punctuation.brackets"],
    "punctuation.delimiter": ["punctuation.separator", "punctuation.terminator"],
    "punctuation.list_marker": ["markup.list punctuation.definition.list"],
    "punctuation.special": ["punctuation.special", "punctuation.definition.interpolation"],
    "string": ["string", "string.quoted"],
    "string.escape": ["constant.character.escape"],
    "string.regex": ["string.regexp"],
    "string.special": ["string.special", "string.template"],
    "string.special.symbol": ["constant.other.symbol"],
    "tag": ["entity.name.tag"],
    "text.literal": ["markup.inline.raw", "markup.fenced_code.block"],
    "title": ["markup.heading", "entity.name.section"],
    "type": ["entity.name.type", "support.type", "support.class"],
    "type.interface": ["entity.name.type.interface"],
    "type.super": ["entity.other.inherited-class"],
    "variable": ["variable", "variable.other"],
    "variable.member": ["variable.other.member", "variable.other.object.property"],
    "variable.parameter": ["variable.parameter"],
    "variable.special": ["variable.language"],
    "variant": ["entity.name.type.variant", "support.type.variant"],
}


def convert_zed_to_vscode(zed_path, vscode_path, theme_name):
    with open(zed_path) as f:
        zed = json.load(f)

    style = zed["themes"][0]["style"]
    syntax = style.get("syntax", {})

    # Build tokenColors from syntax
    token_colors = []
    for zed_key, scopes in ZED_TO_VSCODE_SCOPES.items():
        if zed_key not in syntax:
            continue
        entry = syntax[zed_key]
        color = entry.get("color")
        if not color:
            continue

        settings = {"foreground": color}
        font_style_parts = []
        if entry.get("font_style") == "italic":
            font_style_parts.append("italic")
        if entry.get("font_weight") and entry["font_weight"] >= 700:
            font_style_parts.append("bold")
        if font_style_parts:
            settings["fontStyle"] = " ".join(font_style_parts)

        token_colors.append({
            "name": zed_key,
            "scope": scopes,
            "settings": settings
        })

    # Build workbench colors from Zed style
    colors = {
        # Editor
        "editor.background": style.get("editor.background", "#08090900"),
        "editor.foreground": style.get("editor.foreground", "#abb2bf"),
        "editorLineNumber.foreground": style.get("editor.line_number", "#495162"),
        "editorLineNumber.activeForeground": style.get("editor.active_line_number", "#abb2bf"),
        "editor.lineHighlightBackground": style.get("editor.active_line.background", "#08090900"),
        "editorBracketMatch.background": style.get("editor.document_highlight.bracket_background", "#abb2bf30"),
        "editor.wordHighlightBackground": style.get("editor.document_highlight.read_background", "#555a6345"),
        "editor.wordHighlightStrongBackground": style.get("editor.document_highlight.write_background", "#555a6345"),
        "editor.findMatchHighlightBackground": style.get("search.match_background", "#d19a6644"),
        "editorIndentGuide.background": style.get("editor.wrap_guide", "#212121"),

        # Title bar, status bar, sidebar
        "titleBar.activeBackground": style.get("title_bar.background", "#080909DD"),
        "titleBar.inactiveBackground": style.get("title_bar.background", "#080909DD"),
        "statusBar.background": style.get("status_bar.background", "#080909DD"),
        "statusBar.foreground": "#abb2bf",
        "sideBar.background": style.get("panel.background", "#08090900"),
        "sideBar.foreground": "#abb2bf",
        "sideBarSectionHeader.background": style.get("surface.background", "#080909"),

        # Tabs
        "editorGroupHeader.tabsBackground": style.get("tab_bar.background", "#08090900"),
        "tab.activeBackground": style.get("tab.active_background", "#080909"),
        "tab.inactiveBackground": style.get("tab.inactive_background", "#08090900"),
        "tab.activeForeground": "#ffffff",
        "tab.inactiveForeground": "#abb2bf",

        # Borders
        "editorGroup.border": style.get("border", "#212121"),
        "sideBar.border": style.get("border", "#212121"),
        "panel.border": style.get("border", "#212121"),
        "titleBar.border": style.get("border", "#212121"),
        "statusBar.border": style.get("border", "#212121"),
        "tab.border": style.get("border", "#212121"),

        # General surfaces
        "activityBar.background": style.get("background", "#080909DD"),
        "activityBar.foreground": "#abb2bf",
        "panel.background": style.get("panel.background", "#08090900"),

        # Scrollbar
        "scrollbarSlider.background": style.get("scrollbar.thumb.background", "#4e566680"),
        "scrollbarSlider.hoverBackground": style.get("scrollbar.thumb.hover_background", "#5a6375"),
        "scrollbarSlider.activeBackground": style.get("scrollbar.thumb.hover_background", "#5a6375"),

        # Selections / highlights
        "editor.selectionBackground": "#67769660",
        "editor.selectionHighlightBackground": "#67769640",

        # Lists
        "list.activeSelectionBackground": style.get("element.selected", "#2c313a"),
        "list.hoverBackground": style.get("element.hover", "#2c313a"),
        "list.focusBackground": style.get("element.selected", "#2c313a"),

        # Input
        "input.background": style.get("surface.background", "#080909"),
        "input.border": style.get("border", "#212121"),
        "dropdown.background": style.get("surface.background", "#080909"),
        "dropdown.border": style.get("border", "#212121"),

        # Terminal
        "terminal.background": style.get("terminal.background", "#08090900"),
        "terminal.ansiBlack": style.get("terminal.ansi.black", "#3f4451"),
        "terminal.ansiBrightBlack": style.get("terminal.ansi.bright_black", "#4f5666"),
        "terminal.ansiRed": style.get("terminal.ansi.red", "#e05561"),
        "terminal.ansiBrightRed": style.get("terminal.ansi.bright_red", "#ff616e"),
        "terminal.ansiGreen": style.get("terminal.ansi.green", "#8cc265"),
        "terminal.ansiBrightGreen": style.get("terminal.ansi.bright_green", "#a5e075"),
        "terminal.ansiYellow": style.get("terminal.ansi.yellow", "#d18f52"),
        "terminal.ansiBrightYellow": style.get("terminal.ansi.bright_yellow", "#f0a45d"),
        "terminal.ansiBlue": style.get("terminal.ansi.blue", "#4aa5f0"),
        "terminal.ansiBrightBlue": style.get("terminal.ansi.bright_blue", "#4dc4ff"),
        "terminal.ansiMagenta": style.get("terminal.ansi.magenta", "#c162de"),
        "terminal.ansiBrightMagenta": style.get("terminal.ansi.bright_magenta", "#de73ff"),
        "terminal.ansiCyan": style.get("terminal.ansi.cyan", "#42b3c2"),
        "terminal.ansiBrightCyan": style.get("terminal.ansi.bright_cyan", "#4cd1e0"),
        "terminal.ansiWhite": style.get("terminal.ansi.white", "#d7dae0"),
        "terminal.ansiBrightWhite": style.get("terminal.ansi.bright_white", "#e6e6e6"),

        # Diagnostics
        "editorError.foreground": style.get("error", "#c24038"),
        "editorWarning.foreground": style.get("warning", "#d19a66"),
        "editorInfo.foreground": "#4aa5f0",

        # Git colors
        "gitDecoration.addedResourceForeground": style.get("created", "#a5e075"),
        "gitDecoration.modifiedResourceForeground": style.get("modified", "#e5c07b"),
        "gitDecoration.deletedResourceForeground": style.get("deleted", "#ff616e"),
        "gitDecoration.ignoredResourceForeground": style.get("ignored", "#636b78"),

        # Minimap
        "minimap.background": "#08090900",

        # Breadcrumb
        "breadcrumb.foreground": "#abb2bf",
        "breadcrumb.background": "#08090900",

        # Widget
        "editorWidget.background": style.get("elevated_surface.background", "#080909"),
        "editorWidget.border": style.get("border", "#212121"),
    }

    vscode_theme = {
        "$schema": "vscode://schemas/color-theme",
        "name": theme_name,
        "type": "dark",
        "colors": colors,
        "tokenColors": token_colors
    }

    with open(vscode_path, "w") as f:
        json.dump(vscode_theme, f, indent=2, ensure_ascii=False)
    print(f"Created: {vscode_path}")


themes = [
    ("glass-dracula.json", "glass-dracula-color-theme.json", "Glass Dracula"),
    ("glass-dracula-pure.json", "glass-dracula-pure-color-theme.json", "Glass Dracula Pure"),
    ("glass-dracula-soft.json", "glass-dracula-soft-color-theme.json", "Glass Dracula Soft"),
    ("glass-dracula-vivid.json", "glass-dracula-vivid-color-theme.json", "Glass Dracula Vivid"),
]

zed_dir = "/Users/benny/Documents/theme_extension/zed/glass-dracula/themes"
vscode_dir = "/Users/benny/Documents/theme_extension/vscode/glass-dracula/themes"

for zed_file, vscode_file, name in themes:
    convert_zed_to_vscode(
        os.path.join(zed_dir, zed_file),
        os.path.join(vscode_dir, vscode_file),
        name
    )
