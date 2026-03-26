# SVG Icons

Hier einzelne SVG-Dateien ablegen. Der Dateiname (ohne `.svg`) wird zum Icon-Name.

## Build

`npm run sprite` (läuft auch bei `npm run build`) kombiniert alle SVGs zu `graphics/svgs/generated/sprite.{hash}.svg`. Der Hash steht in `graphics/svgs/generated/sprite-manifest.json` — PHP (`sprite_url()`, `icon()`) löst das automatisch auf.

## Verwendung in Templates (PHP)

```php
<?php icon('dateiname'); ?>
<?php icon('dateiname', 'extra-css-klasse'); ?>
```

Gleiche Ausgabe als String (z. B. für Filter, eigene Wrapper):

```php
echo theme_icon_markup('dateiname');
echo theme_icon_markup('dateiname', 'extra-css-klasse');
```

Ausgabe: `<svg class="icon icon-dateiname" aria-hidden="true">…</svg>`

Icons erben die Textfarbe (`fill: currentColor`) und sind 1em gross.

## Shortcode (Beiträge, Seiten, Widgets, Block „Shortcode“)

```
[theme_icon name="dateiname"]
[theme_icon name="dateiname" class="meine-klasse noch-eine"]
```

| Attribut | Pflicht | Beschreibung |
|----------|---------|----------------|
| `name`   | ja      | Icon-Id wie der Dateiname ohne `.svg` |
| `class`  | nein    | Zusätzliche CSS-Klassen (Leerzeichen-getrennt) |

Ohne gültigen `name` oder wenn kein Sprite gebaut wurde, gibt der Shortcode einen leeren String zurück (keine Ausgabe).

**Hinweis:** Shortcodes in Gutenberg-Absätzen funktionieren; in reinen HTML-Blöcken musst du den Shortcode-Block nutzen oder auf PHP/Templates ausweichen.
