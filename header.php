<!doctype html>
<html <?php language_attributes(); ?> class="no-js">
	<head>
		<meta charset="<?php bloginfo('charset'); ?>">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<?php
		$palette = wp_get_global_settings(array('color', 'palette', 'theme'));
		$theme_color = '#ffffff';
		foreach ($palette as $color) {
			if ($color['slug'] === 'primary') {
				$theme_color = $color['color'];
				break;
			}
		}
		?>
		<meta name="theme-color" content="<?php echo esc_attr($theme_color); ?>">

		<?php $icons = get_template_directory_uri() . '/graphics/favicon/generated'; ?>
		<link rel="icon" type="image/x-icon" href="<?php echo $icons; ?>/favicon.ico">
		<link rel="icon" type="image/png" sizes="32x32" href="<?php echo $icons; ?>/favicon-32x32.png">
		<link rel="icon" type="image/png" sizes="16x16" href="<?php echo $icons; ?>/favicon-16x16.png">
		<link rel="apple-touch-icon" sizes="180x180" href="<?php echo $icons; ?>/apple-touch-icon-180x180.png">
		<link rel="manifest" href="<?php echo $icons; ?>/manifest.webmanifest">

		<?php wp_head(); ?>
	</head>

	<body <?php body_class(); ?>>

		<?php wp_body_open(); ?>

		<header class="header" role="banner">

			<a id="skip-nav-link" href="#main">Zum Hauptinhalt springen</a>

			<?php if (has_custom_logo()) : ?>
				<?php the_custom_logo(); ?>
			<?php else : ?>
				<a id="logo" href="<?php echo esc_url(home_url('/')); ?>"><?php bloginfo('name'); ?></a>
			<?php endif; ?>

			<nav>
				<?php wp_nav_menu(array('theme_location' => 'main_menu')); ?>
			</nav>

		</header>
