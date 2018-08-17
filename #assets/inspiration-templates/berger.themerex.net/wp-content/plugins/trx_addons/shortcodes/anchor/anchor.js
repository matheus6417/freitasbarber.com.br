/**
 * Shortcode Anchor
 *
 * @package WordPress
 * @subpackage ThemeREX Addons
 * @since v1.2
 */

/* global jQuery:false, TRX_ADDONS_STORAGE:false */

// Init handlers
jQuery(document).on('action.init_shortcodes', function(e, container) {
	"use strict";

	var toc_menu = jQuery('#toc_menu');
	if (toc_menu.length == 0) trx_addons_build_page_toc();
	
	toc_menu = jQuery('#toc_menu:not(.inited)');
	if (toc_menu.length == 0) return;
	
	var toc_menu_items = toc_menu.addClass('inited').find('.toc_menu_item');

	var wheel_busy = false, wheel_time = 0;
	
	// One page mode for menu links (scroll to anchor)
	toc_menu.on('click', 'a', function(e) {
		"use strict";
		var href = jQuery(this).attr('href');
		if (href===undefined) return;
		var pos = href.indexOf('#');
		if (pos < 0 || href.length == 1) return;
		if (jQuery(href.substr(pos)).length > 0) {
			var loc = window.location.href;
			var pos2 = loc.indexOf('#');
			if (pos2 > 0) loc = loc.substring(0, pos2);
			var now = pos==0;
			if (!now) now = loc == href.substring(0, pos);
			if (now) {
				wheel_busy = true;
				setTimeout(function() { 
					wheel_busy = false; 
					if (TRX_ADDONS_STORAGE['update_location_from_anchor']==1) trx_addons_document_set_location(pos==0 ? loc + href : href); 
				}, trx_addons_browser_is_ios() ? 1500 : 500);
				trx_addons_document_animate_to(href.substr(pos));
				e.preventDefault();
				return false;
			}
		}
	});
	
	// Change active element then page is scrolled
	jQuery(window).on('scroll', function() {
		// TOC current items
		toc_menu_items.each(function() {
			"use strict";
			var id = jQuery(this).find('a').attr('href');
			var pos = id.indexOf('#');
			if (pos < 0 || id.length == 1) return;
			var loc = window.location.href;
			var pos2 = loc.indexOf('#');
			if (pos2 > 0) loc = loc.substring(0, pos2);
			var now = pos==0;
			if (!now) now = loc == href.substring(0, pos);
			if (!now) return;
			var off = jQuery(id).offset().top;
			var id_next  = jQuery(this).next().find('a').attr('href');
			var off_next = id_next ? jQuery(id_next).offset().top : 1000000;
			var scroll_offset = jQuery(window).scrollTop();
			if (off < scroll_offset + jQuery(window).height()*0.8 && scroll_offset < off_next - 50) {
				jQuery(this).addClass('toc_menu_item_active');
				// Comment next line if on your device page jump when scrolling
				if (TRX_ADDONS_STORAGE['update_location_from_anchor']==1 && !trx_addons_browser_is_mobile() && !trx_addons_browser_is_ios() && !wheel_busy) {
					trx_addons_document_set_location(pos==0 ? loc + id : id);
				}
			} else
				jQuery(this).removeClass('toc_menu_item_active');
		});
	});

	if (TRX_ADDONS_STORAGE['scroll_to_anchor'] == 1) {
		jQuery(window).bind('mousewheel DOMMouseScroll', function(e) {
			if (screen.width < 960 || jQuery(window).width() < 960) {
				return;
			}
			if (wheel_busy || wheel_time == e.timeStamp) {
				e.preventDefault();
				return false;
			}
			wheel_time = e.timeStamp;
			var wheel_dir = e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0 ? -1 : 1;
			var prev_item = -1, next_item = -1;
			toc_menu_items.each(function(idx) {
				"use strict";
				var id = jQuery(this).find('a').attr('href');
				var pos = id.indexOf('#');
				if (pos < 0 || id.length == 1) return;
				var loc = window.location.href;
				var pos2 = loc.indexOf('#');
				if (pos2 > 0) loc = loc.substring(0, pos2);
				var now = pos==0;
				if (!now) now = loc == href.substring(0, pos);
				if (!now) return;
				var off = jQuery(id).offset().top;
				var id_next  = jQuery(this).next().find('a').attr('href');
				var off_next = id_next ? jQuery(id_next).offset().top : 1000000;
				var scroll_offset = jQuery(window).scrollTop();
				if (off > scroll_offset + 50) {
					if (next_item < 0) next_item = idx;
				} else if (off < scroll_offset - 50)
					prev_item = idx;
			});
			var doit = false;
			if (wheel_dir == -1) {			// scroll up
				doit = true;
				setTimeout(function() {
					if (prev_item >= 0)
						toc_menu_items.eq(prev_item).find('a').trigger('click');
					else
						trx_addons_document_animate_to(0);
				}, 10);
			} else {						// scroll down
				if (next_item >= 0) {
					doit = true;
					setTimeout(function() {
						toc_menu_items.eq(next_item).find('a').trigger('click');
					}, 10);
				}
			}
			// Set busy flag while animating
			if (doit) {
				wheel_busy = true;
				setTimeout(function() { wheel_busy = false; }, trx_addons_browser_is_ios() ? 1500 : 500);
				e.preventDefault();
				return false;
			}
		});	
	}
});

// Build page TOC from the tag's id
function trx_addons_build_page_toc() {
	"use strict";

	var toc = '', toc_count = 0;

	jQuery('[id^="toc_menu_"],.sc_anchor').each(function(idx) {
		"use strict";
		var obj = jQuery(this);
		var obj_id = obj.attr('id') || ('sc_anchor_'+Math.random()).replace('.', '');
		var row = obj.parents('.wpb_row');
		if (row.length == 0) row = obj.parent();
		var row_id = row.length>0 && row.attr('id')!=undefined && row.attr('id')!='' ? row.attr('id') : '';
		var id = row_id || obj_id.substr(10);
		if (row.length>0 && row_id == '') {
			row.attr('id', id);
		}
		var url = obj.data('url');
		var icon = obj.data('icon') || 'toc_menu_icon_default';
		var title = obj.attr('title');
		var description = obj.data('description');
		var separator = obj.data('separator');
		toc_count++;
		toc += '<div class="toc_menu_item'+(separator=='yes' ? ' toc_menu_separator' : '')+'">'
			+ (title || description 
				? '<div class="toc_menu_description">'
						+ (title ? '<span class="toc_menu_description_title">' + title + '</span>' : '')
						+ (description ? '<span class="toc_menu_description_text">' + description + '</span>' : '')
					+ '</div>' 
				: '')
			+ '<a href="' + (url ? url : '#'+id) + '" class="toc_menu_icon '+icon+'">'+'</a>'
			+ '</div>';
	});

	if (toc_count > 0)
		jQuery('body').append('<div id="toc_menu" class="toc_menu"><div class="toc_menu_inner">'+toc+'</div></div>');
}