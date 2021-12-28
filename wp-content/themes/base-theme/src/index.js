//import Flickity from 'flickity'
//import 'flickity-bg-lazyload'
//import imagesLoaded from 'imagesloaded'

const jquery = require('jquery')
window.$ = window.jQuery = jquery

$( document ).ready(() => {
	require('./js/_custom_vh.js')
	console.log('ready')
})