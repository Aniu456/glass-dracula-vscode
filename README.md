# Glass Dracula (VSCode)

A custom Dracula theme pack by **BennyWu**, primarily designed for Zed with a VSCode port included.
由 **BennyWu** 制作的 Dracula 自定义主题包，主要为 Zed 设计，同时提供 VSCode 适配版本。

## Included Themes / 主题列表

- Dracula Dark Vivid Black
- Dracula Light Vivid White
- Dracula Glass
- Dracula Glass Vivid

## Development / 开发

**Build themes / 构建主题**（converts Zed source files → VSCode theme files under `themes/` / 将 Zed 源文件转换为 VSCode 主题文件）:
```bash
npm run build:themes
```

**Publish / 发布:**
```bash
vsce login BennyWu
npm run package
npm run publish:marketplace
```

## Custom Token Colors / 自定义 Token 颜色

Add to `settings.json` to fine-tune **Dracula Light Vivid White**.
将以下配置添加到 `settings.json` 以微调 **Dracula Light Vivid White** 主题：

```jsonc
"editor.tokenColorCustomizations": {
  "[Dracula Light Vivid White]": {
    "textMateRules": [
      // 控制流关键字 / Control flow keywords
      {
        "scope": ["keyword", "storage.type"],
        "settings": { "fontStyle": "bold" }
      },
      // (Zed: #036A96) 类型与接口标识符（去斜体）/ Type & interface identifiers (no italic)
      {
        "scope": [
          "support.class",
          "meta.object-literal.key",
          // "meta.block",
          "punctuation.definition.tag"
        ],
        "settings": { "foreground": "#036A96", "fontStyle": "" }
      },
      // 字符串 / Strings
      {
        "scope": ["punctuation.definition.string"],
        "settings": { "foreground": "#846E15" }
      },
      // 注释 / Comments
      {
        "scope": ["punctuation.definition.comment"],
        "settings": { "foreground": "#635D97" }
      }
    ]
  }
}
```

## Repository

https://github.com/Aniu456/glass-dracula-vscode
