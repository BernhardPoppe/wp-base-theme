<!-- Index.-->

<?php get_header(); ?> 
	<div id="main">
			<!-- Start the Loop. -->
			<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

				<!--Titel der Seite. -> Automatische Side-Bar-Beschriftung bei z.B. page.php -->
			 	<h1><?php the_title() ?></h1>
			 		
			 	<?php the_content(); ?>
			 
			 <?php endwhile; else : ?>

			 	<p><?php esc_html_e( 'Sorry, es konnte kein Betrag gefunden werden.' ); ?></p>
			 	<!-- REALLY stop The Loop. -->
			<?php endif; ?>
		  
<?php get_footer(); ?>
