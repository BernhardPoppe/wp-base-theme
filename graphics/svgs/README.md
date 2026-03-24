# SVG Icons

Hier einzelne SVG-Dateien ablegen. Der Dateiname (ohne `.svg`) wird zum Icon-Name.

## Build

`npm run sprite` (läuft auch bei `npm run build`) kombiniert alle SVGs zu `graphics/sprite.svg`.

## Verwendung in Templates

```php
<?php icon('dateiname'); ?>
<?php icon('dateiname', 'extra-css-klasse'); ?>
```

Ausgabe: `<svg class="icon icon-dateiname">...</svg>`

Icons erben die Textfarbe (`fill: currentColor`) und sind 1em gross.
