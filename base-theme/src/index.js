//import Flickity from 'flickity'
//import 'flickity-bg-lazyload'
//import imagesLoaded from 'imagesloaded'

import $ from "cash-dom"
require('./js/_custom-vh.js')
require('./js/_cash-slide.js')
//require('./js/_cash-fade.js')

$(function () {
  	$('html').addClass ( 'dom-loaded' )
	$("#trigger").on('click', function() {
		$(".box").slideToggle()
	})
})