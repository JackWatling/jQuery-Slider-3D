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
		var parts = ['front', 'top', 'back', 'bottom', 'left', 'right'];
		var slice = $( '<section class="slice"></section>' ).css( { width: this.width } );

		$.each( parts, function( i ){
			slice.append(
				$( '<section></section>', { class: this } )
					.css( this == 'right' ? { left: -400 + self.width } : this != 'left' ? { 'background-position': -self.index * self.width } : {} )
			);
		});

		this.element = slice;
	}

	Slice.prototype.rotate = function( rotation, duration, delay, transition, face, background ){
		this.update( face, background );
		this.element.delay( delay ).animate( { 'border-spacing': 0 },
		{
			duration: duration,
			step: function(){
				$(this).css({
					'-webkit-transition-duration': duration + 'ms',
					'-webkit-transform': 'rotate3d(1, 0, 0, ' + rotation + 'deg)'
				})
			},
			complete: function(){  }
		});
	}

	Slice.prototype.update = function( face, background ){
		this.element.children().eq(face).css({
			'background-image': 'url(\'' + background + '\')'
		});
	}

	//Slider
	function Slider( element, options ){
		this.element = $( element );
		this.options = $.extend( {}, $.fn.slider.options, options );

		this.init();
		this.build();
	}

	Slider.prototype.init = function(){
		this.element.addClass('slider').css( { '-webkit-perspective': this.options.perspective } );
		this.caption = null;
		this.rotation = 0;
		this.face = 0;
		this.animating = false;
		this.images = this.element.children('img');
		this.image_current = this.options.start < this.images.length - 1 ? this.options.start : 0;
		this.slices = new Array();
		this.slice_total = this.options.slices;
		this.slice_width = this.element.width() / this.slice_total;
		this.total_duration = this.options.duration + ( this.slice_total * this.options.delay );

		this.element.empty();
		this.preload( this.images );	//Preload images into DOM
	}

	Slider.prototype.preload = function( images ){
		$.each( images, function(){
			$('<img />', {
				src: $(this).attr( 'src' )
			});
		});
	}

	Slider.prototype.build = function(){
		var slides = $('<section></section>', { 
			class: 'slides'
		}).appendTo( this.element );

		//Construct slices
		for (var i = 0; i < this.slice_total; i++){
			this.slices.push( new Slice( i, this.slice_width ) );
			this.slices[i].update( 0, this.images.eq( this.image_current ).attr('src') );
			slides.append( this.slices[i].element );
		}

		//Add navigation
		$('<nav></nav>')
			.append( $( '<a class="prev">' + this.options.prev + '</a>' ).on( 'click', [ 'p' ], $.proxy( this.rotate, this ) ) )
			.append( $( '<a class="next">' + this.options.next + '</a>' ).on( 'click', [ 'n' ], $.proxy( this.rotate, this ) ) )
			.appendTo( this.element );

		//Add caption
		if ( this.options.caption ){
			this.caption = $('<section></section>', {
				class: 'caption'
			}).appendTo( this.element );
			this.caption_hide();
			this.caption_show();
		}
		//Start slideshow loop
		if ( this.options.slideshow ){
			this.slideshow_start();
		}
	}

	Slider.prototype.slideshow = function(){
		this.rotate( { data: [ ( this.options.slideshow_forward ? 'n' : 'p' ) ] } );
		this.slideshow_timeout = setTimeout( $.proxy( this.slideshow, this ), this.total_duration + this.options.slideshow_delay );
	}

	Slider.prototype.slideshow_start = function(){
		setTimeout( $.proxy( this.slideshow, this ), this.options.slideshow_delay );
	}

	Slider.prototype.slideshow_stop = function(){
		clearTimeout( this.slideshow_timeout );
	}

	Slider.prototype.rotate = function( direction ){
		var shuffle = function( slices ){
			var j, x, i = slices.length;
			while ( i ){
				j = parseInt( Math.random() * i );
				x = slices[--i];
				slices[i] = slices[j];
				slices[j] = x;
			}
			return slices;
		};

		if ( !this.animating ){
			var self = this;
			self.animating = true;

			if ( direction.data[0] === 'n' ) {
				self.rotation += 90;
				self.face = self.face > 0 ? self.face - 1 : 3;
				self.image_current = self.image_current < self.images.length - 1 ? self.image_current + 1 : 0;
			} else {
				self.rotation -= 90;
				self.face = self.face < 3 ? self.face + 1 : 0;
				self.image_current = self.image_current > 0 ? self.image_current - 1 : self.images.length - 1;
			}

			$.each( self.options.sequential ? self.slices : shuffle( self.slices ), function( i ){
				this.rotate( self.rotation, self.options.duration, self.options.delay * i, self.options.transition, self.face, self.images.eq( self.image_current ).attr('src') );
			});

			setTimeout( function() {
				self.animating = false;
			}, self.total_duration);

			if ( this.options.caption ){
				self.caption_hide();
				setTimeout( function(){
					self.caption_show();
				}, self.total_duration / 2);
			}
		};
	}

	Slider.prototype.caption_hide = function(){
		this.caption.stop().css({
			opacity: 0
		});
	}

	Slider.prototype.caption_show = function(){
		var caption = ( this.images.eq( this.image_current ).attr( 'title' ) || this.images.eq( this.image_current ).attr( 'alt' ) ) || null;
		if ( caption ){
			this.caption
				.text( caption )
				.css({
					left: 30
				})
				.animate({
					left: 0,
					opacity: 1
				}, 750 );
		}
	}

	$.fn.slider = function( options ){
		return this.each( function(){
			$.data( this, 'slider', new Slider( this, options ) );
		});
	}

	$.fn.slider.options = {
		perspective: 1000,
		slices: 10,
		duration: 500,
		delay: 150,
		start: 0,
		sequential: true,
		next: '',
		prev: '',
		caption: true,
		slideshow: true,
		slideshow_delay: 5000,
		slideshow_forward: true
	}

})( jQuery, window, document );