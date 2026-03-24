<?php
/**
 * Auto-registers all custom blocks.
 *
 * Each block lives in its own subdirectory under /blocks/ and must contain
 * a block.json file. WordPress handles the rest (styles, scripts, render).
 *
 * Structure per block:
 *   blocks/block-name/
 *     ├── block.json       (required — block metadata)
 *     ├── render.php       (server-side render template)
 *     ├── style.css        (frontend + editor styles)
 *     └── editor.css       (editor-only styles)
 */

function theme_register_blocks() {
    $blocks_dir = get_template_directory() . '/blocks';

    if (!is_dir($blocks_dir)) {
        return;
    }

    $block_folders = array_filter(glob($blocks_dir . '/*'), 'is_dir');

    foreach ($block_folders as $block_folder) {
        $block_json = $block_folder . '/block.json';
        if (file_exists($block_json)) {
            register_block_type($block_folder);
        }
    }
}
add_action('init', 'theme_register_blocks');
