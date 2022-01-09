import $ from "cash-dom";
import domSlider from 'dom-fader';
const {fadeIn, fadeOut, fadeToggle} = window.domFader

const fadeParameters = {
  fadeSpeed: 1000,
  easing: 'ease',
  delay: 0,
  preventDisplayNone: false,
  visibleDisplayValue: 'block'
}

//extending cash-dom to include toggles like in jquery.
$.fn.extend({
  fadeToggle: function(parameters) {
    return this.each(function() {
    	const finalParameters = Object.assign(fadeParameters, parameters);
    	finalParameters.element = this;
    	fadeToggle(finalParameters);
    });
  },
  fadeIn: function(parameters) {
    return this.each(function() {
    	const finalParameters = Object.assign(fadeParameters, parameters);
    	finalParameters.element = this;
    	fadeIn(finalParameters);
    });
  },
  fadeOut: function(parameters) {
    return this.each(function() {
    	const finalParameters = Object.assign(fadeParameters, parameters);
    	finalParameters.element = this;
    	fadeOut(finalParameters);
    });
  },
});
