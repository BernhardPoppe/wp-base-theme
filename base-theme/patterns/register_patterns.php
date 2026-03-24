<?php
/**
 * Auto-registers all block patterns from this directory.
 *
 * Each pattern is a PHP file (except this one) that returns an array:
 *   return [
 *       'title'       => 'Pattern Name',
 *       'description' => 'Beschreibung',
 *       'categories'  => ['theme'],
 *       'content'     => '<!-- wp:paragraph -->...',
 *   ];
 */

function theme_register_pattern_category() {
    register_block_pattern_category('theme', [
        'label' => __('Theme Patterns'),
    ]);
}
add_action('init', 'theme_register_pattern_category');

function theme_register_patterns() {
    $patterns_dir = get_template_directory() . '/patterns';

    foreach (glob($patterns_dir . '/*.php') as $file) {
        if (basename($file) === 'register_patterns.php') {
            continue;
        }

        $pattern = require $file;

        if (!is_array($pattern) || empty($pattern['title']) || empty($pattern['content'])) {
            continue;
        }

        $slug = 'theme/' . basename($file, '.php');
        register_block_pattern($slug, $pattern);
    }
}
add_action('init', 'theme_register_patterns');
