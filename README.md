# Glass Dracula (VSCode)

Custom Dracula theme pack by **BennyWu**, rebuilt from the latest Zed theme sources.

## Included Themes

- Dracula Dark Vivid Black
- Dracula Light Vivid White
- Dracula Glass
- Dracula Glass HSV
- Dracula Glass Vivid

## Build Themes

```bash
npm run build:themes
```

This command converts the source Zed theme files from:

- `../../one-dark-pro-dracula-vivid-black-apple.json`
- `../../glass-dracula-vivid-white.json`
- `../../one-dark-pro-glass-dracula.json`
- `../../one-dark-pro-glass-dracula-hsv.json`
- `../../one-dark-pro-glass-dracula-vivid.json`

into VSCode theme files under `themes/`.

## Package / Publish

```bash
vsce login BennyWu
npm run package
npm run publish:marketplace
```

## Repository

https://github.com/Aniu456/glass-dracula-vscode
