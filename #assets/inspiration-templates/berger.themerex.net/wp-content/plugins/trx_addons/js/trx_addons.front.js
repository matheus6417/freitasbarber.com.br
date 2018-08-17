/**
 * Init scripts
 *
 * @package WordPress
 * @subpackage ThemeREX Addons
 * @since v1.0
 */

/* global jQuery:false */
/* global TRX_ADDONS_STORAGE:false */

jQuery(document).ready(function() {
	"use strict";
	TRX_ADDONS_STORAGE['vc_init_counter'] = 0;
	trx_addons_init_actions();
});

jQuery(window).on('beforeunload', function() {
    "use strict";
    // Show preloader
    if (jQuery.browser && !jQuery.browser.safari) jQuery('#page_preloader').css({display: 'block', opacity: 0}).animate({opacity:0.8}, 300);
});


// Init actions
function trx_addons_init_actions() {
	"use strict";

	if (TRX_ADDONS_STORAGE['vc_edit_mode'] > 0 && jQuery('.vc_empty-placeholder').length==0 && TRX_ADDONS_STORAGE['vc_init_counter']++ < 30) {
		setTimeout(trx_addons_init_actions, 200);
		return;
	}
	
	// Hide preloader
	jQuery('#page_preloader').animate({opacity:0}, 800, function() {
								jQuery(this).css( {display: 'none'} );
								});

	// Check for Retina display
	if (trx_addons_is_retina()) {
		trx_addons_set_cookie('trx_addons_is_retina', 1, 365);
	}


	// Add ready actions to the hidden elements actions
	jQuery(document).on('action.init_hidden_elements', trx_addons_ready_actions);

	// Init core actions
	trx_addons_ready_actions();
	trx_addons_resize_actions();
	trx_addons_scroll_actions();

	// Resize handlers
	jQuery(window).resize(function() {
		"use strict";
		trx_addons_resize_actions();
	});

	// Add resize on VC action vc-full-width-row
	jQuery(document).on('vc-full-width-row', function(e, el) {
		trx_addons_resize_actions();
	});

	// Scroll handlers
	jQuery(window).scroll(function() {
		"use strict";
		trx_addons_scroll_actions();
	});
}



// Page first load actions
//==============================================
function trx_addons_ready_actions(e, container) {
	"use strict";

	if (arguments.length < 2) var container = jQuery('body');

	// Tabs
    //------------------------------------
	if (container.find('.trx_addons_tabs:not(.inited)').length > 0 && jQuery.ui && jQuery.ui.tabs) {
		container.find('.trx_addons_tabs:not(.inited)').each(function () {
			"use strict";
			// Get initially opened tab
			var init = jQuery(this).data('active');
			if (isNaN(init)) {
				init = 0;
				var active = jQuery(this).find('> ul > li[data-active="true"]').eq(0);
				if (active.length > 0) {
					init = active.index();
					if (isNaN(init) || init < 0) init = 0;
				}
			} else {
				init = Math.max(0, init);
			}
			// Init tabs
			jQuery(this).addClass('inited').tabs({
				active: init,
				show: {
					effect: 'fadeIn',
					duration: 300
				},
				hide: {
					effect: 'fadeOut',
					duration: 300
				},
				create: function( event, ui ) {
				    if (ui.panel.length > 0) jQuery(document).trigger('action.init_hidden_elements', [ui.panel]);
				},
				activate: function( event, ui ) {
					if (ui.newPanel.length > 0) jQuery(document).trigger('action.init_hidden_elements', [ui.newPanel]);
				}
			});
		});
	}


	// Accordion
    //------------------------------------
	if (container.find('.trx_addons_accordion:not(.inited)').length > 0 && jQuery.ui && jQuery.ui.accordion) {
		container.find('.trx_addons_accordion:not(.inited)').each(function () {
			"use strict";
			// Get headers selector
			var accordion = jQuery(this);
			var headers = accordion.data('headers');
			if (headers===undefined) headers = 'h5';
			// Get height style
			var height_style = accordion.data('height-style');
			if (height_style===undefined) height_style = 'content';
			// Get initially opened tab
			var init = accordion.data('active');
			var active = false;
			if (isNaN(init)) {
				init = 0;
				var active = accordion.find(headers+'[data-active="true"]').eq(0);
				if (active.length > 0) {
					while (!active.parent().hasClass('trx_addons_accordion')) {
						active = active.parent();
					}
					init = active.index();
					if (isNaN(init) || init < 0) init = 0;
				}
			} else {
				init = Math.max(0, init);
			}
			// Init accordion
			accordion.addClass('inited').accordion({
				active: init,
				header: headers,
				heightStyle: height_style,
				create: function( event, ui ) {
					if (ui.panel.length > 0) {
						jQuery(document).trigger('action.init_hidden_elements', [ui.panel]);
					} else if (active !== false && active.length > 0) {
						// If headers and panels wrapped into div
						active.find('>'+headers).trigger('click');
					}
				},
				activate: function( event, ui ) {
					if (ui.newPanel.length > 0) jQuery(document).trigger('action.init_hidden_elements', [ui.newPanel]);
				}
			});
		});
	}


	// Sliders
    //----------------------------------------------
	jQuery(document).trigger('action.init_sliders', [container]);


	// Shortcodes
    //----------------------------------------------
	jQuery(document).trigger('action.init_shortcodes', [container]);


	// Video player
    //----------------------------------------------
	if (container.find('.trx_addons_video_player.with_cover .video_hover:not(.inited)').length > 0) {
		container.find('.trx_addons_video_player.with_cover .video_hover:not(.inited)')
			.addClass('inited')
			.on('click', function(e) {
				"use strict";
				jQuery(this).parents('.trx_addons_video_player')
					.addClass('video_play')
					.find('.video_embed').html(jQuery(this).data('video'));
				jQuery(window).trigger('resize');
				e.preventDefault();
				return false;
			});
	}


	// Popups
    //----------------------------------------------
	if (TRX_ADDONS_STORAGE['popup_engine'] == 'pretty') {
		container.find("a[href$='jpg']:not(.inited),a[href$='jpeg']:not(.inited),a[href$='png']:not(.inited),a[href$='gif']:not(.inited)").attr('rel', 'prettyPhoto[slideshow]');
		var images = container.find("a[rel*='prettyPhoto']:not(.inited):not(.esgbox):not([data-rel*='pretty']):not([rel*='magnific']):not([data-rel*='magnific'])").addClass('inited');
		try {
			images.prettyPhoto({
				social_tools: '',
				theme: 'facebook',
				deeplinking: false
			});
		} catch (e) {};
	} else if (TRX_ADDONS_STORAGE['popup_engine']=='magnific') {
		container.find("a[href$='jpg']:not(.inited),a[href$='jpeg']:not(.inited),a[href$='png']:not(.inited),a[href$='gif']:not(.inited)").each(function() {
            if (!jQuery(this).parent().hasClass('woocommerce-product-gallery__image'))
                jQuery(this).attr('rel', 'magnific');
        });
		var images = container.find("a[rel*='magnific']:not(.inited):not(.esgbox):not(.prettyphoto):not([rel*='pretty']):not([data-rel*='pretty'])").addClass('inited');
		try {
			images.magnificPopup({
				type: 'image',
				mainClass: 'mfp-img-mobile',
				closeOnContentClick: true,
				closeBtnInside: true,
				fixedContentPos: true,
				midClick: true,
				//removalDelay: 500, 
				preloader: true,
				tLoading: TRX_ADDONS_STORAGE['msg_magnific_loading'],
				gallery:{
					enabled: true
				},
				image: {
					tError: TRX_ADDONS_STORAGE['msg_magnific_error'],
					verticalFit: true
				},
				zoom: {
					enabled: true,
					duration: 300,
                    easing: 'ease-in-out',
					opener: function(openerElement) {
						// openerElement is the element on which popup was initialized, in this case its <a> tag
						// you don't need to add "opener" option if this code matches your needs, it's defailt one.
						if (!openerElement.is('img')) {
							if (openerElement.parents('.trx_addons_hover').find('img').length > 0)
								openerElement = openerElement.parents('.trx_addons_hover').find('img');
							else if (openerElement.siblings('img').length > 0)
								 openerElement = openerElement.siblings('img');
							else if (openerElement.parent().parent().find('img').length > 0)
								 openerElement = openerElement.parent().parent().find('img');
						}
						return openerElement; 
					}
				},
				callbacks: {
					beforeClose: function(){
						jQuery('.mfp-figure figcaption').hide();
						jQuery('.mfp-figure .mfp-arrow').hide();
					}
				}
			});
		} catch (e) {};
	}


	// Likes counter
	//---------------------------------------------
	if (container.find('.post_counters_likes:not(.inited),.comment_counters_likes:not(.inited)').length > 0) {
		container.find('.post_counters_likes:not(.inited),.comment_counters_likes:not(.inited)')
			.addClass('inited')
			.on('click', function(e) {
				"use strict";
				var button = jQuery(this);
				var inc = button.hasClass('enabled') ? 1 : -1;
				var post_id = button.hasClass('post_counters_likes') ? button.data('postid') :  button.data('commentid');
				var cookie_likes = trx_addons_get_cookie(button.hasClass('post_counters_likes') ? 'trx_addons_likes' : 'trx_addons_comment_likes');
				if (cookie_likes === undefined || cookie_likes===null) cookie_likes = '';
				jQuery.post(TRX_ADDONS_STORAGE['ajax_url'], {
					action: button.hasClass('post_counters_likes') ? 'post_counter' : 'comment_counter',
					nonce: TRX_ADDONS_STORAGE['ajax_nonce'],
					post_id: post_id,
					likes: inc
				}).done(function(response) {
					"use strict";
					var rez = {};
					try {
						rez = JSON.parse(response);
					} catch (e) {
						rez = { error: TRX_ADDONS_STORAGE['msg_ajax_error'] };
						console.log(response);
					}
					if (rez.error === '') {
						var counter = rez.counter;
						if (inc == 1) {
							var title = button.data('title-dislike');
							button.removeClass('enabled trx_addons_icon-heart-empty').addClass('disabled trx_addons_icon-heart');
							cookie_likes += (cookie_likes.substr(-1)!=',' ? ',' : '') + post_id + ',';
						} else {
							var title = button.data('title-like');
							button.removeClass('disabled trx_addons_icon-heart').addClass('enabled trx_addons_icon-heart-empty');
							cookie_likes = cookie_likes.replace(','+post_id+',', ',');
						}
						button.data('likes', counter).attr('title', title).find(button.hasClass('post_counters_likes') ? '.post_counters_number' : '.comment_counters_number').html(counter);
						trx_addons_set_cookie(button.hasClass('post_counters_likes') ? 'trx_addons_likes' : 'trx_addons_comment_likes', cookie_likes, 365);
					} else {
						alert(TRX_ADDONS_STORAGE['msg_error_like']);
					}
				});
				e.preventDefault();
				return false;
			});
	}


	// Socials share
    //----------------------------------------------
	if (container.find('.socials_share .socials_caption:not(.inited)').length > 0) {
		container.find('.socials_share .socials_caption:not(.inited)').each(function() {
			"use strict";
			jQuery(this).addClass('inited').on('click', function(e) {
				"use strict";
				jQuery(this).siblings('.social_items').fadeToggle();
				e.preventDefault();
				return false;
			});
		});
	}
	if (container.find('.socials_share .social_items:not(.inited)').length > 0) {
		container.find('.socials_share .social_items:not(.inited)').each(function() {
			"use strict";
			jQuery(this).addClass('inited').on('click', '.social_item_popup > a.social_icons', function(e) {
				"use strict";
				var url = jQuery(this).data('link');
				window.open(url, '_blank', 'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=480, height=400, toolbar=0, status=0');
				e.preventDefault();
				return false;
			});
		});
	}
	
	
	// Widgets decoration
    //----------------------------------------------

	// Decorate nested lists in widgets and side panels
	container.find('.widget ul > li').each(function() {
		"use strict";
		if (jQuery(this).find('ul').length > 0) {
			jQuery(this).addClass('has_children');
		}
	});

	// Archive widget decoration
	container.find('.widget_archive a:not(.inited)').addClass('inited').each(function() {
		"use strict";
		var val = jQuery(this).html().split(' ');
		if (val.length > 1) {
			val[val.length-1] = '<span>' + val[val.length-1] + '</span>';
			jQuery(this).html(val.join(' '))
		}
	});
		

	// Other settings
    //------------------------------------

	// Scroll to top button
	container.find('.trx_addons_scroll_to_top:not(.inited)').addClass('inited').on('click', function(e) {
		"use strict";
		jQuery('html,body').animate({
			scrollTop: 0
		}, 'slow');
		e.preventDefault();
		return false;
	});
	
} //end ready




// Scroll actions
//==============================================

// Do actions when page scrolled
function trx_addons_scroll_actions() {
	"use strict";

	var scroll_offset = jQuery(window).scrollTop();
	var scroll_to_top_button = jQuery('.trx_addons_scroll_to_top');
	var adminbar_height = Math.max(0, jQuery('#wpadminbar').height());

	// Scroll to top button show/hide
	if (scroll_to_top_button.length > 0) {
		if (scroll_offset > 100)
			scroll_to_top_button.addClass('show');
		else
			scroll_to_top_button.removeClass('show');
	}

	// Scroll actions for animated elements
	jQuery('[data-animation^="animated"]:not(.animated)').each(function() {
		"use strict";
		if (jQuery(this).offset().top < scroll_offset + jQuery(window).height())
			jQuery(this).addClass(jQuery(this).data('animation'));
	});
}



// Resize actions
//==============================================

// Do actions when page scrolled
function trx_addons_resize_actions(cont) {
	"use strict";
	if (window.trx_addons_resize_sliders) trx_addons_resize_sliders(cont);
	trx_addons_resize_video(cont);
}



// Fit video frames to document width
function trx_addons_resize_video(cont) {
	if (cont===undefined) cont = jQuery('body');
	cont.find('video').each(function() {
		"use strict";
		var video = jQuery(this).eq(0);
		var ratio = (video.data('ratio')!=undefined ? video.data('ratio').split(':') : [16,9]);
		ratio = ratio.length!=2 || ratio[0]==0 || ratio[1]==0 ? 16/9 : ratio[0]/ratio[1];
		var mejs_cont = video.parents('.mejs-video');
		var w_attr = video.data('width');
		var h_attr = video.data('height');
		if (!w_attr || !h_attr) {
			w_attr = video.attr('width');
			h_attr = video.attr('height');
			if (!w_attr || !h_attr) return;
			video.data({'width': w_attr, 'height': h_attr});
		}
		var percent = (''+w_attr).substr(-1)=='%';
		w_attr = parseInt(w_attr);
		h_attr = parseInt(h_attr);
		var w_real = Math.round(mejs_cont.length > 0 ? Math.min(percent ? 10000 : w_attr, mejs_cont.parents('div,article').width()) : video.width()),
			h_real = Math.round(percent ? w_real/ratio : w_real/w_attr*h_attr);
		if (parseInt(video.attr('data-last-width'))==w_real) return;
		if (mejs_cont.length > 0 && mejs) {
			trx_addons_set_mejs_player_dimensions(video, w_real, h_real);
		}
		if (percent) {
			video.height(h_real);
		} else {
			video.attr({'width': w_real, 'height': h_real}).css({'width': w_real+'px', 'height': h_real+'px'});
		}
		video.attr('data-last-width', w_real);
	});
	cont.find('.video_frame iframe').each(function() {
		"use strict";
		var iframe = jQuery(this).eq(0);
		if (iframe.attr('src').indexOf('soundcloud')>0) return;
		var ratio = (iframe.data('ratio')!=undefined 
						? iframe.data('ratio').split(':') 
						: (iframe.parent().data('ratio')!=undefined 
							? iframe.parent().data('ratio').split(':') 
							: (iframe.find('[data-ratio]').length>0 
								? iframe.find('[data-ratio]').data('ratio').split(':') 
								: [16,9]
								)
							)
						);
		ratio = ratio.length!=2 || ratio[0]==0 || ratio[1]==0 ? 16/9 : ratio[0]/ratio[1];
		var w_attr = iframe.attr('width');
		var h_attr = iframe.attr('height');
		if (!w_attr || !h_attr) {
			return;
		}
		var percent = (''+w_attr).substr(-1)=='%';
		w_attr = parseInt(w_attr);
		h_attr = parseInt(h_attr);
		var w_real = iframe.parent().width(),
			h_real = Math.round(percent ? w_real/ratio : w_real/w_attr*h_attr);
		if (parseInt(iframe.attr('data-last-width'))==w_real) return;
		iframe.css({'width': w_real+'px', 'height': h_real+'px'});
		iframe.attr('data-last-width', w_real);
	});
}


// Set Media Elements player dimensions
function trx_addons_set_mejs_player_dimensions(video, w, h) {
	"use strict";
	if (mejs) {
		for (var pl in mejs.players) {
			if (mejs.players[pl].media.src == video.attr('src')) {
				if (mejs.players[pl].media.setVideoSize) {
					mejs.players[pl].media.setVideoSize(w, h);
				}
				mejs.players[pl].setPlayerSize(w, h);
				mejs.players[pl].setControlsSize();
			}
		}
	}
}
