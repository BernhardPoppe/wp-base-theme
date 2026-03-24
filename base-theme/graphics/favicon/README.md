# Favicon Source

Hier die Quelldatei für die Favicon-Generierung ablegen.

## Anforderungen

- **Format**: PNG oder SVG
- **Grösse**: Mindestens 512x512px, quadratisch
- **Dateiname**: `favicon-source.png` oder `favicon-source.svg`

## Build

`npm run favicons` (läuft auch bei `npm run build`) generiert daraus alle Varianten in `graphics/favicon/generated/`:

- `favicon.ico` (16x16, 32x32, 48x48)
- `favicon-16x16.png`, `favicon-32x32.png`
- `apple-touch-icon-180x180.png`
- `android-chrome-192x192.png`, `android-chrome-512x512.png`
- `manifest.webmanifest`

## Anpassen

In `src/js/modules/build-scripts/generate-favicons.mjs` können `appName`, `background` und `theme_color` pro Projekt angepasst werden.
