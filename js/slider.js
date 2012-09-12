;(function( $, window, document, undefined ){

	//Slice
	function Slice( index, width ){
		this.element = null;
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

	Slice.prototype.rotate = function( rotation, delay ){
		this.element.delay( delay ).animate( { 'border-spacing': 0 },
		{
			duration: 250,
			step: function(){
				$(this).css({
					'-webkit-transition-duration': '250ms',
					'-webkit-transform': 'rotate3d(1, 0, 0, ' + rotation + 'deg)'
				})
			},
			complete: function(){  }
		});
	}

	//Slider
	function Slider( element ){
		// this.element = $( element ).children(':not(img)').remove().end();
		this.element = $( element );
		this.rotation = 0;
		this.face = 0;
		this.animating = false;
		this.images = this.element.children('img').remove();
		this.image_current = 0;
		this.slice_total = 10;
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

		//Add navigation
		$('<nav></nav>')
			.append( $( '<a class="next">Next</a>' ).on( 'click', [ 'n' ], $.proxy( this.rotate, this ) ) )
			.append( $( '<a class="prev">Prev</a>' ).on( 'click', [ 'p' ], $.proxy( this.rotate, this ) ) )
			.appendTo( this.element );
	}

	Slider.prototype.rotate = function( direction ){
		if ( !this.animating ){
			var self = this;
			self.animating = true;

			if ( direction.data[0] !== 'n' ) {
				self.rotation += 90;
				self.face = self.face > 0 ? self.face - 1 : 3;
				self.image_current = self.image_current > 0 ? self.image_current - 1 : self.images.length - 1;
			} else {
				self.rotation -= 90;
				self.face = self.face < 3 ? self.face + 1 : 0;
				self.image_current = self.image_current < self.images.length - 1 ? self.image_current + 1 : 0;
			}

			console.log( self.face );

			$.each( self.slices, function( i ){
				this.rotate( self.rotation, 0 * i );
			});

			setTimeout( function() {
				self.animating = false;
			}, 1000 + ( self.slices.length * 0 ));

		};
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