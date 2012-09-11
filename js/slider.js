;(function( $, window, document, undefined ){

	//Slider
	function Slider( element ){
		this.element = $( element );
		this.build();
	}

	Slider.prototype.build = function(){
		var slides = $( '<section class="slides"></section>' ).appendTo( this.element );
		var slice = $( '<section class="slice"></section>' )
						.append('<section class="front"></section>')
						.append('<section class="top"></section>')
						.append('<section class="back"></section>')
						.append('<section class="bottom"></section>')
						.append('<section class="left"></section>')
						.append('<section class="right"></section>')
						.appendTo( slides );
	}

	$.fn.slider = function(){
		var slider = new Slider( this );
		return slider;
	}

})( jQuery, window, document );