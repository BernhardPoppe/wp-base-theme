<?php
//This creates a settings-page and moves it to the admin-side-menu. (Like ACF-options-page but without pro.)

// Get values from the settings-page like this:
// the_field( 'field-name', 3333 );
function create_new_page()
{
    global $user_ID;
    if( get_page_by_title('Website Einstellungen')==NULL )
    {
    $new_post = array(
              'import_id'         =>  3333,
              'post_title' => 'Website Einstellungen',
              'post_content' => ' ',
              'post_status' => 'publish',
              'post_date' => date('Y-m-d H:i:s'),
              'post_author' => $user_ID,
              'post_type' => 'page'
        );
    $post_id = wp_insert_post($new_post);
   }
}
add_action('init','create_new_page');

add_filter('use_block_editor_for_post', 'disable_gutenberg_on_settings_page', 5, 2);

function disable_gutenberg_on_settings_page($can, $post){
    if($post){
        // Replace "website-einstellungen" with the slug of your site settings page.
        if($post->post_name === "website-einstellungen"){
            return false;
        }
    }
    return $can;
}

function hide_settings_page($query) {
    if ( !is_admin() && !is_main_query() ) {
        return;
    }    
    global $typenow;
    if ($typenow === "page") {
        // Replace "website-einstellungen" with the slug of your site settings page.
        $settings_page = get_page_by_path("website-einstellungen",NULL,"page")->ID;
        $query->set( 'post__not_in', array($settings_page) );    
    }
    return;

}

add_action('pre_get_posts', 'hide_settings_page');


// Add the page to admin menu
function add_site_settings_to_menu(){
    add_menu_page( 'Website Einstellungen', 'Website Einstellungen', 'manage_options', 'post.php?post='.get_page_by_path("website-einstellungen",NULL,"page")->ID.'&action=edit', '', 'dashicons-admin-tools', 20);
}
add_action( 'admin_menu', 'add_site_settings_to_menu' );

// Change the active menu item

add_filter('parent_file', 'higlight_custom_settings_page');

function higlight_custom_settings_page($file) {
    global $parent_file;
    global $pagenow;
    global $typenow, $self;

    $settings_page = get_page_by_path("website-einstellungen",NULL,"page")->ID;

    $post = (int)$_GET["post"];
    if ($pagenow === "post.php" && $post === $settings_page) {
        $file = "post.php?post=$settings_page&action=edit";
    }
    return $file;
}

function edit_site_settings_title() {
    global $post, $title, $action, $current_screen;
    if( isset( $current_screen->post_type ) && $current_screen->post_type === 'page' && $action == 'edit' && $post->post_name === "website-einstellungen") {
        $title = $post->post_title.' - '.get_bloginfo('name');           
    }
    return $title;  
}

add_action( 'admin_title', 'edit_site_settings_title' );
?>