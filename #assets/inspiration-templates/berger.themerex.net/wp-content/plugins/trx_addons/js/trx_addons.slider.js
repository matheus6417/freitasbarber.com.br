/**
 * Init and resize sliders
 *
 * @package WordPress
 * @subpackage ThemeREX Addons
 * @since v1.1
 */

/* global jQuery:false */
/* global TRX_ADDONS_STORAGE:false */

jQuery(document).on('action.init_sliders', trx_addons_init_sliders);

jQuery(document).on('action.init_hidden_elements', trx_addons_init_hidden_sliders);

// Init sliders with engine=swiper
function trx_addons_init_sliders(e, container) {
	"use strict";
	// Swiper Slider
	if (container.find('.slider_swiper:not(.inited)').length > 0) {
		// Min width of the slides in swiper (used for validate slides_per_view on small screen)
		container.find('.slider_swiper:not(.inited)')
			.each(function () {
				"use strict";

				// If slider inside the invisible block - exit
				if (jQuery(this).parents('div:hidden,article:hidden').length > 0)
					return;
				
				// Check attr id for slider. If not exists - generate it
				var id = jQuery(this).attr('id');
				if (id == undefined) {
					id = 'swiper_'+Math.random();
					id = id.replace('.', '');
					jQuery(this).attr('id', id);
				}

				// Show slider, but make it invisible
				jQuery(this).css({
					'display': 'block',
					'opacity': 0
					})
					.addClass(id)
					.addClass('inited')
					.data('settings', {mode: 'horizontal'});		// VC hook

				// Slides min width
				var smw = jQuery(this).data('slides-min-width');
				if (smw == undefined) {
					smw = 250;
					jQuery(this).attr('data-slides-min-width', smw);
				}

				// Validate Slides per view on small screen
				var width = jQuery(this).width();
				if (width == 0) width = jQuery(this).parent().width();
				var spv = jQuery(this).data('slides-per-view');
				if (spv == undefined) {
					spv = 1;
					jQuery(this).attr('data-slides-per-view', spv);
				}
				if (width / spv < smw) spv = Math.max(1, Math.floor(width / smw));

				// Space between slides
				var space = jQuery(this).data('slides-space');
				if (space == undefined) space = 0;
					
				if (TRX_ADDONS_STORAGE['swipers'] === undefined) TRX_ADDONS_STORAGE['swipers'] = {};

				TRX_ADDONS_STORAGE['swipers'][id] = new Swiper('.'+id, {
					calculateHeight: !jQuery(this).hasClass('slider_height_fixed'),
					resizeReInit: true,
					autoResize: true,
					loop: true,
					grabCursor: true,
					pagination: jQuery(this).hasClass('slider_pagination') ? '#'+id+' .slider_pagination_wrap' : false,
				    paginationClickable: jQuery(this).hasClass('slider_pagination') ? '#'+id+' .slider_pagination_wrap' : false,
			        nextButton: jQuery(this).hasClass('slider_controls') ? '#'+id+' .slider_next' : false,
			        prevButton: jQuery(this).hasClass('slider_controls') ? '#'+id+' .slider_prev' : false,
			        autoplay: jQuery(this).hasClass('slider_noautoplay') 
								? false 
								: (jQuery(this).data('interval')=='' || isNaN(jQuery(this).data('interval')) 
									? 7000 
									: parseInt(jQuery(this).data('interval'))
									),
        			autoplayDisableOnInteraction: false,
					initialSlide: 0,
					slidesPerView: spv,
					loopedSlides: spv,
					spaceBetween: space,
					speed: 600
				});
				
				jQuery(this).animate({'opacity':1}, 'fast');
			});
	}
}


// Init previously hidden sliders with engine=swiper
function trx_addons_init_hidden_sliders(e, container) {
	"use strict";
	// Init sliders in this container
	trx_addons_init_sliders(e, container);
	// Check slides per view on current window size
	trx_addons_resize_sliders(container);
}

// Sliders: Resize
function trx_addons_resize_sliders(container) {
	"use strict";

	if (container === undefined) container = jQuery('body');
	container.find('.slider_swiper.inited').each(function() {
		"use strict";
		
		// If slider in the hidden block - don't resize it
		if (jQuery(this).parents('div:hidden,article:hidden').length > 0) return;

		var id = jQuery(this).attr('id');
		var width = jQuery(this).width();
		var last_width = jQuery(this).data('last-width');
		if (isNaN(last_width)) last_width = 0;
		var ratio = jQuery(this).data('ratio');
		if (ratio===undefined) ratio = "16:9";
		ratio = ratio.split(':');
		var ratio_x = !isNaN(ratio[0]) ? Number(ratio[0]) : 16;
		var ratio_y = !isNaN(ratio[1]) ? Number(ratio[1]) : 9;

		// Change slides_per_view
		if (last_width==0 || last_width!=width) {
			var smw = jQuery(this).data('slides-min-width');
			var spv = jQuery(this).data('slides-per-view');
			if (width / spv < smw) spv = Math.max(1, Math.floor(width / smw));
			jQuery(this).data('last-width', width);
			if (TRX_ADDONS_STORAGE['swipers'][id].params.slidesPerView != spv) {
				TRX_ADDONS_STORAGE['swipers'][id].params.slidesPerView = spv;
				TRX_ADDONS_STORAGE['swipers'][id].params.loopedSlides = spv;
				//TRX_ADDONS_STORAGE['swipers'][id].reInit();
			}
			TRX_ADDONS_STORAGE['swipers'][id].onResize();
		}
		
		// Resize slider
		if ( !jQuery(this).hasClass('slider_height_fixed') ) {
			var h = 0;
			if ( jQuery(this).find('.swiper-slide > img').length > 0 ) {
				jQuery(this).find('.swiper-slide > img').each(function() {
					if (jQuery(this).height() > h) h = jQuery(this).height();
				});
				jQuery(this).height(h);
			} else if ( jQuery(this).find('.swiper-slide').text()=='' || jQuery(this).hasClass('slider_height_auto') ) {
				jQuery(this).height( Math.floor(width/ratio_x*ratio_y) );
			}
		}
	});
}
