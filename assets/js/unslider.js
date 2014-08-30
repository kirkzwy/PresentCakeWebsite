/**
 *   Unslider by @idiot
 */
 
(function($, f) {
	//  If there's no jQuery, Unslider can't work, so kill the operation.
	if(!$) return f;
	
	var Unslider = function() {
		//  Set up our elements
		this.el = f;
		this.items = f;
		
		//  Dimensions
		this.sizes = [];
		this.max = [0,0];
		
		//  Current inded
		this.current = 0;
		
		//  Start/stop timer
		this.interval = f;
				
		//  Set some options
		this.opts = {
			speed: 500,
			delay: 3000, // f for no autoplay
			complete: f, // when a slide's finished
			keys: !f, // keyboard shortcuts - disable if it breaks things
			dots: f, // display 鈥⑩€⑩€⑩€鈥� pagination
			fluid: f // is it a percentage width?,
		};
		
		//  Create a deep clone for methods where context changes
		var _ = this;

		this.init = function(el, opts) {
			this.el = el;
			this.ul = el.children('ul');
			this.max = [el.outerWidth(), el.outerHeight()];			
			this.items = this.ul.children('li').each(this.calculate);
			
			// Anson
			this.itemsLen = this.items.length;
			//  Check whether we're passing any options in to Unslider
			this.opts = $.extend(this.opts, opts);
			
			//  Set up the Unslider
			this.setup();
			
			return this;
		};

		//  Get the width for an element
		//  Pass a jQuery element as the context with .call(), and the index as a parameter: Unslider.calculate.call($('li:first'), 0)
		this.calculate = function(index) {
			var me = $(this),
				width = me.outerWidth(), height = me.outerHeight();
			
			//  Add it to the sizes list
			_.sizes[index] = [width, height];
			
			//  Set the max values
			if(width > _.max[0]) _.max[0] = width;
			if(height > _.max[1]) _.max[1] = height;
		};
		
		//  Work out what methods need calling
		this.setup = function() {
			//  Set the main element
			this.el.css({
				overflow: 'hidden',
				width: _.max[0],
				height: this.items.first().outerHeight()
			});
			
			//  Set the relative widths
			//this.ul.css({width: (this.items.length * 98) + '%', position: 'relative'});
			this.ul.css('height', 'this.items.first().outerHeight()');
			//this.items.css('width', (100 / this.items.length) + '%');
			//var itemsLen = this.items.length;
			this.items.each(function(index) {
				$(this).css({
					left: ((index == _.itemsLen - 1 ? -1 : index ) * 100) + '%',
					//width: $(this).parent().width()
				});
			});
			
			if(this.opts.delay !== f) {
				this.start();
				this.el.hover(this.stop, this.start);
			}
			
			//  Custom keyboard support
			this.opts.keys && $(document).keydown(this.keys);
			
			//  Dot pagination
			this.opts.dots && this.dots();
			
			//  Little patch for fluid-width sliders. Screw those guys.
			if(this.opts.fluid) {
				var resize = function() {
					_.el.css('width', Math.min(Math.round((_.el.outerWidth() / _.el.parent().outerWidth()) * 100), 100) + '%');
				};
				
				resize();
				$(window).resize(resize);
			}
			
			if(this.opts.arrows) {
				this.el.parent().append('<p class="arrows"><span class="prev">鈫�</span><span class="next">鈫�</span></p>')
					.find('.arrows span').click(function() {
						$.isFunction(_[this.className]) && _[this.className]();
					});
			};
			
			//  Swipe support
			if($.event.swipe) {
				this.el.on('swipeleft', _.prev).on('swiperight', _.next);
			}
		};
		
		//  Move Unslider to a slide index
		this.move = function(index, sp, cb) {
			//  If it's out of bounds, go to the first slide
			if(!this.items.eq(index).length) index = 0;
			if(index < 0) index = (this.items.length - 1);
			
			var target = this.items.eq(index);
			var obj = {height: target.outerHeight()};
			var speed = sp ? sp : this.opts.speed;
			
			if(!this.items.is(':animated')) {			
				//  Handle those pesky dots
				_.el.find('.dot:eq(' + index + ')').addClass('active').siblings().removeClass('active');

				this.el.animate(obj, speed);
				this.items.eq(((_.current + 2) >= _.itemsLen ? _.current + 2 - _.itemsLen : _.current + 2 )).css('left', '200%');
				this.items.animate({left: '-=100%'}, speed, function(data){
					_.current = index
					$.isFunction(_.opts.complete) && !cb && _.opts.complete(_.el);
				})

				/**if(index === _.itemsLen-1) {
				  this.el.animate(obj, speed);
				  this.items.each(function(){
	                var mleft = (2-_.itemsLen)*1000 + 'px';
	                if ($(this).css('left') === mleft ) $(this).addClass('mleft');
                  });
				  $('.mleft').animate({left: '100%'}, speed);
				  $('.mleft').siblings().each(function(inde) {
				  	$(this).animate($.extend({left: (inde-1) * 100 +'%' }, obj), speed, function(data) {
					  _.current = 1;
					  $.isFunction(_.opts.complete) && !cb && _.opts.complete(_.el);
				  });
				});
				  $('li.mleft').removeClass('mleft');
				}else{
				  this.el.animate(obj, speed);
				  this.items.each(function(inde) {
				  	$(this).animate({left: (inde - index) * 100 + '%'}, speed)
				  })
				}**/
			}
		};
		
		//  Autoplay functionality
		this.start = function() {
			_.interval = setInterval(function() {
				_.move(_.current + 1);
			}, _.opts.delay);
		};
		
		//  Stop autoplay
		this.stop = function() {
			_.interval = clearInterval(_.interval);
			return _;
		};
		
		//  Keypresses
		this.keys = function(e) {
			var key = e.which;
			var map = {
				//  Prev/next
				37: _.prev,
				39: _.next,
				
				//  Esc
				27: _.stop
			};
			
			if($.isFunction(map[key])) {
				map[key]();
			}
		};
		
		//  Arrow navigation
		this.next = function() { return _.stop().move(_.current + 1) };
		this.prev = function() { return _.stop().move(_.current - 1) };
		
		this.dots = function() {
			//  Create the HTML
			var html = '<ol class="dots">';
				$.each(this.items, function(index) { html += '<li class="dot' + (index < 1 ? ' active' : '') + '">' + (index + 1) + '</li>'; });
				html += '</ol>';
			
			//  Add it to the Unslider
			this.el.addClass('has-dots').append(html).find('.dot').click(function() {
				var times = ($(this).index() - _.current < 0 ? $(this).index() - _.current + _.itemsLen : $(this).index() - _.current);
				//_.move($(this).index());
				//_.stop();
				for (var i = 0; i < times; i++) {
					_.items.stop(true, true);
					_.move(_.current+1, 1);
				}
				//_.start();
			});
		};
	};
	
	//  Create a jQuery plugin
	$.fn.unslider = function(o) {
		var len = this.length;
		
		//  Enable multiple-slider support
		return this.each(function(index) {
			//  Cache a copy of $(this), so it 
			var me = $(this);
			var instance = (new Unslider).init(me, o);
			
			//  Invoke an Unslider instance
			me.data('unslider' + (len > 1 ? '-' + (index + 1) : ''), instance);
		});
	};
})(window.jQuery, false);