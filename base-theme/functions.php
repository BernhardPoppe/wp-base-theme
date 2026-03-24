<?php
/*
 *  Author: Bernhard Poppe
 *  URL: bernhardpoppe.at
 *  Custom functions, support, custom post types and more.
 */

/*------------------------------------*\
	Theme Support
\*------------------------------------*/

if (!isset($content_width)) {
    $content_width = 900;
}

if (function_exists('add_theme_support')) {
    add_theme_support('menus');
    add_theme_support('post-thumbnails');
    add_theme_support('automatic-feed-links');
    add_theme_support('title-tag');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ));
    add_theme_support('align-wide');
    add_theme_support('responsive-embeds');
    add_theme_support('editor-styles');
    add_theme_support('wp-block-styles');
    add_theme_support('custom-logo', array(
        'height'      => 80,
        'width'       => 80,
        'flex-height' => true,
        'flex-width'  => true,
    ));
}

function register_custom_menus() {
    register_nav_menus(array(
        'main_menu' => __('Main Menu'),
    ));
}
add_action('init', 'register_custom_menus');

/*------------------------------------*\
	Asset Loading (Parcel Manifest)
\*------------------------------------*/

function manifest() {
    $manifest_path = get_template_directory() . '/dist/parcel-manifest.json';
    if (!file_exists($manifest_path)) {
        return array();
    }
    $manifest = file_get_contents($manifest_path);
    return json_decode($manifest, true);
}

function custom_header_scripts() {
    if ($GLOBALS['pagenow'] != 'wp-login.php' && !is_admin()) {
        $m = manifest();
        if (!empty($m['index.js'])) {
            wp_enqueue_script(
                'custom_scripts',
                get_template_directory_uri() . '/dist' . $m['index.js'],
                array(),
                null,
                true
            );
            wp_localize_script('custom_scripts', 'theme_vars', array(
                'stylesheet_directory' => get_stylesheet_directory_uri(),
                'ajax_url'            => admin_url('admin-ajax.php'),
            ));
        }
    }
}

function custom_styles() {
    $m = manifest();
    if (!empty($m['theme.scss'])) {
        wp_enqueue_style(
            'theme_css',
            get_template_directory_uri() . '/dist' . $m['theme.scss'],
            array(),
            null
        );
    }
}

function theme_editor_styles() {
    $m = manifest();
    if (!empty($m['editor.scss'])) {
        wp_enqueue_style(
            'editor-css',
            get_template_directory_uri() . '/dist' . $m['editor.scss']
        );
    }
}

function rich_block_editor_scripts() {
    wp_enqueue_script(
        'rich-editor',
        get_theme_file_uri('/blocks/block-styles.js'),
        array('wp-blocks', 'wp-dom'),
        wp_get_theme()->get('Version'),
        true
    );
}

add_action('init', 'custom_header_scripts');
add_action('wp_enqueue_scripts', 'custom_styles');
add_action('enqueue_block_editor_assets', 'theme_editor_styles');
add_action('enqueue_block_editor_assets', 'rich_block_editor_scripts');

/*------------------------------------*\
	Cleanup wp_head
\*------------------------------------*/

remove_action('wp_head', 'feed_links_extra', 3);
remove_action('wp_head', 'feed_links', 2);
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'index_rel_link');
remove_action('wp_head', 'parent_post_rel_link', 10, 0);
remove_action('wp_head', 'start_post_rel_link', 10, 0);
remove_action('wp_head', 'adjacent_posts_rel_link', 10, 0);
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0);
remove_action('wp_head', 'rel_canonical');
remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0);

/*------------------------------------*\
	Filters
\*------------------------------------*/

function my_wp_nav_menu_args($args = '') {
    $args['container'] = false;
    return $args;
}
add_filter('wp_nav_menu_args', 'my_wp_nav_menu_args');
add_filter('show_admin_bar', '__return_false');

remove_filter('the_excerpt', 'wpautop');

/*------------------------------------*\
	Disable Emojis
\*------------------------------------*/

function disable_emojis() {
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');
    remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
}
add_action('init', 'disable_emojis');

/*------------------------------------*\
	Remove jQuery (not needed)
\*------------------------------------*/

add_filter('wp_enqueue_scripts', 'change_default_jquery', PHP_INT_MAX);
function change_default_jquery() {
    wp_dequeue_script('jquery');
    wp_deregister_script('jquery');
}

/*------------------------------------*\
	Helpers
\*------------------------------------*/

function sprite_url() {
    static $url = null;
    if ($url !== null) return $url;

    $manifest_path = get_template_directory() . '/graphics/svgs/generated/sprite-manifest.json';
    if (!file_exists($manifest_path)) {
        $url = '';
        return $url;
    }
    $manifest = json_decode(file_get_contents($manifest_path), true);
    $url = get_template_directory_uri() . '/graphics/svgs/generated/' . $manifest['sprite'];
    return $url;
}

/**
 * Outputs an SVG icon from the generated sprite.
 * Usage: <?php icon('arrow-right'); ?>
 * With class: <?php icon('arrow-right', 'my-class'); ?>
 */
function icon($name, $class = '') {
    $cls = 'icon icon-' . esc_attr($name);
    if ($class) {
        $cls .= ' ' . esc_attr($class);
    }
    echo '<svg class="' . $cls . '" aria-hidden="true"><use href="' . sprite_url() . '#' . esc_attr($name) . '"></use></svg>';
}

/*------------------------------------*\
	Custom Blocks & Patterns
\*------------------------------------*/

require('blocks/register_blocks.php');
require('patterns/register_patterns.php');
