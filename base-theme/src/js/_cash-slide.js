import $ from "cash-dom";
import domSlider from 'dom-slider';
const {slideDown, slideUp, slideToggle} = window.domSlider

const slideParameters = {
	slideSpeed: 600,
	easing: 'ease',
	delay: 0,
	visibleDisplayValue: 'block'
}

//extending cash-dom to include toggles like in jquery.
$.fn.extend({
  slideToggle: function(parameters) {
    return this.each(function() {
    	const finalParameters = Object.assign(slideParameters, parameters);
    	finalParameters.element = this;
    	slideToggle(finalParameters);
    });
  },
  slideUp: function(parameters) {
    return this.each(function() {
    	const finalParameters = Object.assign(slideParameters, parameters);
    	finalParameters.element = this;
    	slideUp(finalParameters);
    });
  },
  slideDown: function(parameters) {
    return this.each(function() {
    	const finalParameters = Object.assign(slideParameters, parameters);
    	finalParameters.element = this;
    	slideDown(finalParameters);
    });
  },
});
