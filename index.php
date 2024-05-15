<!-- Index.-->

<?php get_header(); ?> 
	<div id="main" data-barba="container" data-barba-namespace="home">
		<!-- Start the Loop. -->
		<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

		 	<h1><?php the_title() ?></h1>
		 	<?php the_content(); ?>
		 
		 <?php endwhile; else : ?>
		 	<p><?php esc_html_e( 'Sorry, es konnte kein Betrag gefunden werden.' ); ?></p>
		<?php endif; ?>
	</div>
		  
<?php get_footer(); ?>
