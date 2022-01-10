<!doctype html>
<html <?php language_attributes(); ?> class="no-js">
	<head>

		<meta charset="<?php bloginfo('charset'); ?>">
		<title><?php the_title() ?><?php if(wp_title('', false)) { echo ' :'; } ?> <?php bloginfo('name'); ?></title>

        <link href="<?php echo get_template_directory_uri(); ?>/graphics/icons/favicon.ico" rel="shortcut icon">
        <link href="<?php echo get_template_directory_uri(); ?>/graphics/icons/touch.png" rel="apple-touch-icon">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="description" content="<?php bloginfo('description'); ?>">
		<meta name="theme-color" content="#5394c7" />
		
		<?php wp_head(); ?>

	</head>



	<body <?php body_class(); ?> data-barba="wrapper">

		<header class="header clear" role="banner">

			<a href="<?php echo get_home_url(); ?>">
				<img id="logo" src="<?php echo get_template_directory_uri(); ?>/graphics/logo.svg">
			</a>

			<nav>
				<?php wp_nav_menu( array( 'theme_location' => 'main_menu' ) ); ?>
			</nav>

		</header>