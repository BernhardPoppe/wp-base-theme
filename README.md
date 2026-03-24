# Base Theme

WordPress Base Theme (Classic Theme mit Block-Support).

## Neues Projekt starten

1. Auf GitHub "Use this template" klicken oder Repo klonen
2. `npm run init` -- fragt Projektnamen ab und passt alle Dateien an
3. `npm install`
4. Favicon-Quelle in `graphics/favicon/favicon-source.svg` ersetzen
5. Farben, Fonts und Spacings in `theme.json` anpassen
6. `npm run build`

## Entwicklung

```bash
npm run watch    # Parcel Watch + SVG Sprite Watcher
npm run build    # Production Build (inkl. Favicons + Sprite)
npm run deploy   # Build + Git Commit + Push
```

## Struktur

- `theme.json` -- Design Tokens (Farben, Typo, Spacing, Layout)
- `functions.php` -- Theme Setup, Asset Loading, Helpers
- `blocks/` -- Custom Blocks (auto-registriert via `block.json`)
- `patterns/` -- Block Patterns (auto-registriert via PHP)
- `graphics/favicon/` -- Favicon-Quelle + generierte Varianten
- `graphics/svgs/` -- SVG-Icons + generierter Sprite
- `src/js/` -- JavaScript (Parcel Entry + Module)
- `src/scss/` -- SCSS (Theme + Editor Styles)
