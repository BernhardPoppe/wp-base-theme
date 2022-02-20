<?php
/*
 *  Author: Bernhard Poppe
 *  URL: (?)
 *  Custom functions, support, custom post types and more.
 */
/*------------------------------------*\
	External Modules/Files
\*------------------------------------*/

// Load any external files you have here

/*------------------------------------*\
	Theme Support
\*------------------------------------*/

if (!isset($content_width))
{
    $content_width = 900;
}

if (function_exists('add_theme_support'))
{
    // Add Menu Support
    add_theme_support('menus');

    // Add Thumbnail Theme Support
   add_theme_support('post-thumbnails');

    // Enables post and comment RSS feed links to head
    add_theme_support('automatic-feed-links');

}

function register_custom_menus() {
register_nav_menus(
    array(
        'main_menu' => __( 'Main Menu' )
     )
 );
}
add_action( 'init', 'register_custom_menus' );

/*------------------------------------*\
	Functions
\*------------------------------------*/


function manifest(){
    $manifest = file_get_contents("dist/parcel-manifest.json", FILE_USE_INCLUDE_PATH);
    return json_decode($manifest, true);
}

// Load scripts (header.php)
function custom_header_scripts()
{
    if ($GLOBALS['pagenow'] != 'wp-login.php' && !is_admin()){
        wp_register_script('custom_scripts', get_template_directory_uri() . '/dist' . manifest()['index.js']); // Custom scripts
        wp_enqueue_script('custom_scripts'); // Enqueue it!
    }
    function localize_vars() {
        return array(
            'stylesheet_directory' => get_stylesheet_directory_uri()
        );
    }
    wp_localize_script( 'custom_scripts', 'wp', localize_vars() );
    //in js: get the theme-path via wp.stylesheet_directory
}

// Load styles
function custom_styles()
{
    wp_register_style('theme_css', get_template_directory_uri() . '/dist'  . manifest()['theme.scss'], array(), '1.0', 'all');
    wp_enqueue_style('theme_css'); // Enqueue it!
}

function theme_editor_styles() {
    wp_enqueue_style( 'editor-css', get_template_directory_uri() . '/dist'  . manifest()['editor.scss'] );
}

add_action( 'enqueue_block_editor_assets', 'theme_editor_styles' );


/**
 * Enqueue theme block editor scripts. // Custom Block-Styles
 */
function rich_block_editor_scripts() {
    wp_enqueue_script( 'rich-editor', get_theme_file_uri( '/blocks/block-styles.js' ), array( 'wp-blocks', 'wp-dom' ), wp_get_theme()->get( 'Version' ), true );
}
add_action( 'enqueue_block_editor_assets', 'rich_block_editor_scripts' );


// Remove the <div> surrounding the dynamic navigation to cleanup markup
function my_wp_nav_menu_args($args = '')
{
    $args['container'] = false;
    return $args;
}

// Remove invalid rel attribute values in the categorylist
function remove_category_rel_from_category_list($thelist)
{
    return str_replace('rel="category tag"', 'rel="tag"', $thelist);
}

// Remove wp_head() injected Recent Comment styles
function my_remove_recent_comments_style()
{
    global $wp_widget_factory;
    remove_action('wp_head', array(
        $wp_widget_factory->widgets['WP_Widget_Recent_Comments'],
        'recent_comments_style'
    ));
}

// Remove Admin bar
function remove_admin_bar()
{
    return false;
}

// Remove 'text/css' from our enqueued stylesheet
function html5_style_remove($tag)
{
    return preg_replace('~\s+type=["\'][^"\']++["\']~', '', $tag);
}

/*------------------------------------*\
	Actions + Filters + ShortCodes
\*------------------------------------*/

// Add Actions
add_action('init', 'custom_header_scripts'); // Add Custom Scripts to wp_head
add_action('wp_enqueue_scripts', 'custom_styles'); // Add Theme Stylesheet
add_action('widgets_init', 'my_remove_recent_comments_style'); // Remove inline Recent Comment Styles from wp_head()

// Remove Actions
remove_action('wp_head', 'feed_links_extra', 3); // Display the links to the extra feeds such as category feeds
remove_action('wp_head', 'feed_links', 2); // Display the links to the general feeds: Post and Comment Feed
remove_action('wp_head', 'rsd_link'); // Display the link to the Really Simple Discovery service endpoint, EditURI link
remove_action('wp_head', 'wlwmanifest_link'); // Display the link to the Windows Live Writer manifest file.
remove_action('wp_head', 'index_rel_link'); // Index link
remove_action('wp_head', 'parent_post_rel_link', 10, 0); // Prev link
remove_action('wp_head', 'start_post_rel_link', 10, 0); // Start link
remove_action('wp_head', 'adjacent_posts_rel_link', 10, 0); // Display relational links for the posts adjacent to the current post.
remove_action('wp_head', 'wp_generator'); // Display the XHTML generator that is generated on the wp_head hook, WP version
remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0);
remove_action('wp_head', 'rel_canonical');
remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0);

// Add Filters
add_filter('wp_nav_menu_args', 'my_wp_nav_menu_args'); // Remove surrounding <div> from 
add_filter('show_admin_bar', 'remove_admin_bar'); // Remove Admin bar
add_filter('style_loader_tag', 'html5_style_remove'); // Remove 'text/css' from enqueued stylesheet

// Remove Filters
remove_filter('the_excerpt', 'wpautop'); // Remove <p> tags from Excerpt altogether

/**
 * Disable the emoji's
 */
function disable_emojis() {
  remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
  remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
  remove_action( 'wp_print_styles', 'print_emoji_styles' );
  remove_action( 'admin_print_styles', 'print_emoji_styles' );  
  remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
  remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );  
  remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
  // Remove from TinyMCE
  add_filter( 'tiny_mce_plugins', 'disable_emojis_tinymce' );
}
add_action( 'init', 'disable_emojis' );
/**
 * Filter out the tinymce emoji plugin.
 */
function disable_emojis_tinymce( $plugins ) {
  if ( is_array( $plugins ) ) {
    return array_diff( $plugins, array( 'wpemoji' ) );
  } else {
    return array();
  }
}

/**
 * Disable jQuery Migrate in WordPress.
 *
 * @author Guy Dumais.
 * @link https://en.guydumais.digital/disable-jquery-migrate-in-wordpress/
 */
add_filter( 'wp_default_scripts', $af = static function( &$scripts) {
    if(!is_admin()) {
        $scripts->remove( 'jquery');
        $scripts->add( 'jquery', false, array( 'jquery-core' ), '1.12.4' );
    }    
}, PHP_INT_MAX );
unset( $af );

//Import custom registered ACF-Blocks.
require('blocks/register_blocks.php');

//Options Page
if( function_exists('acf_add_options_page') ) {
    acf_add_options_page();
}
?>