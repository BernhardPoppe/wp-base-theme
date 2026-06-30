# Base Theme

WordPress Base Theme (Classic Theme mit Block-Support).

## Neues Projekt starten

1. Auf GitHub "Use this template" klicken oder Repo klonen
2. `npm run init` -- fragt Projektnamen ab und passt alle Dateien an
3. `npm install`
4. `cp .env.example .env` — SFTP-Zugangsdaten eintragen (siehe README → „Deployment einrichten“)
5. Favicon-Quelle in `graphics/favicon/favicon-source.svg` ersetzen
6. Farben, Fonts und Spacings in `theme.json` anpassen
7. `npm run build`

## Entwicklung

```bash
npm run watch    # Parcel Watch + SVG Sprite Watcher
npm run build    # Production Build (inkl. Favicons + Sprite)
npm run deploy   # Build + SFTP-Upload + Git Commit/Push
npm run ssh      # SSH-Shell zum Server (liest .env)
```

## Deployment einrichten

Alle Zugangsdaten liegen in `.env` (gitignored). Vorlage: `.env.example`.

```bash
cp .env.example .env
```

### SFTP / SSH (empfohlen, falls vom Hoster verfügbar)

Viele Hoster bieten SFTP auf Port 22. Zugangsdaten und Auth-Methode hängen vom Hoster ab — oft gelten dieselben Credentials wie für FTP, manche Hoster verlangen einen SSH-Key.

`.env`-Beispiel (Passwort):

```env
SFTP_HOST=example.com
SFTP_PORT=22
SFTP_USER=username
SFTP_PASSWORD=password
SFTP_REMOTE_PATH=/var/www/html/wp-content/themes/my-theme
```

Alternativ mit Private Key:

```env
SFTP_PRIVATE_KEY=~/.ssh/id_ed25519
# SFTP_PASSPHRASE=   # nur bei passwortgeschütztem Key
```

1. `cp .env.example .env` und Werte vom Hoster eintragen
2. Testen: `npm run deploy:dry`, dann `npm run deploy`
3. Shell: `npm run ssh` (baut `ssh USER@HOST -p PORT` aus `.env`)

Terminal-Schema (falls der Hoster SSH-Shell anbietet): `ssh USERNAME@HOSTNAME -p 22`

### FTP (Fallback ohne SFTP/SSH)

Wenn der Hoster kein SFTP anbietet, in einem abgeleiteten Theme-Projekt FTP nutzen (nicht im Base Theme eingebaut). `.env`-Beispiel:

```env
FTP_HOST=ftp.example.com
FTP_PORT=21
FTP_USER=username
FTP_PASSWORD=password
FTP_REMOTE_ROOT=/pfad/zu/wp-content/themes/mein-theme
```

Deploy-Skript und npm-Scripts müssen dann projektspezifisch auf FTP umgestellt werden.

### npm Scripts

| Befehl | Beschreibung |
|---|---|
| `npm run deploy` | Build + SFTP + git commit/push |
| `npm run deploy:nogit` | Build + SFTP, ohne git |
| `npm run deploy:dry` | Nur Dateiliste, kein Upload |
| `npm run ssh` | SSH-Verbindung (aus `.env`) |

Welche Dateien hochgeladen werden, steuert `.deployignore`.

## Struktur

- `theme.json` -- Design Tokens (Farben, Typo, Spacing, Layout)
- `functions.php` -- Theme Setup, Asset Loading, Helpers
- `blocks/` -- Custom Blocks (auto-registriert via `block.json`)
- `patterns/` -- Block Patterns (auto-registriert via PHP)
- `graphics/favicon/` -- Favicon-Quelle + generierte Varianten
- `graphics/svgs/` -- SVG-Icons + generierter Sprite
- `src/js/` -- JavaScript (Parcel Entry + Module)
- `src/scss/` -- SCSS (Theme + Editor Styles)
