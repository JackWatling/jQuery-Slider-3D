;(function( $, window, document, undefined ){

	//Slice
	function Slice( index, width ){
		this.index = index;
		this.width = width;
		this.build();
	}

	Slice.prototype.build = function(){
		var self = this;
		var parts = ["front", "top", "back", "bottom", "left", "right"];
		var slice = $( '<section class="slice"></section>' ).css( { width: this.width } );

		$.each( parts, function( i ){
			slice.append(
				$( '<section></section>', { class: this } )
					.css( this == 'right' ? { left: -400 + self.width } : {} )
			);
		});

		this.element = slice;
	}

	//Slider
	function Slider( element ){
		this.element = $( element );
		this.slice_total = 2;
		this.slice_width = this.element.width() / this.slice_total;
		this.slices = new Array();
		this.build();
		this.display();
	}

	Slider.prototype.build = function(){
		//Construct slices
		for (var i = 0; i < this.slice_total; i++){
			this.slices.push( new Slice( i, this.slice_width ) );
		}
	}

	Slider.prototype.display = function(){
		var slides = $('<section></section', { 
			class: 'slides'
		});

		$.each( this.slices, function() {
			slides.append( this.element );
		});

		this.element.append( slides );
	}

	$.fn.slider = function(){
		var slider = new Slider( this );
		return slider;
	}

})( jQuery, window, document );