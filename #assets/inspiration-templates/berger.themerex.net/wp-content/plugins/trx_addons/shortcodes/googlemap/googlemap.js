/**
 * Shortcode Google map
 *
 * @package WordPress
 * @subpackage ThemeREX Addons
 * @since v1.2
 */

/* global jQuery:false, TRX_ADDONS_STORAGE:false */


jQuery(document).on('action.init_hidden_elements', trx_addons_sc_googlemap_init);
jQuery(document).on('action.init_shortcodes', trx_addons_sc_googlemap_init);

function trx_addons_sc_googlemap_init(e, container) {

	if (arguments.length < 2) var container = jQuery('body');

	if (container.find('.sc_googlemap:not(.inited)').length > 0) {
		container.find('.sc_googlemap:not(.inited)')
			.each(function () {
				"use strict";
				if (jQuery(this).parents('div:hidden,article:hidden').length > 0) return;
				var map 		= jQuery(this).addClass('inited');
				var map_id		= map.attr('id');
				var map_zoom	= map.data('zoom');
				var map_style	= map.data('style');
				var map_markers = [];
				map.find('.sc_googlemap_marker').each(function() {
					"use strict";
					var marker = jQuery(this);
					map_markers.push({
						icon:			marker.data('icon'),
						address:		marker.data('address'),
						latlng:			marker.data('latlng'),
						description:	marker.data('description'),
						title:			marker.data('title')
					});
				});
				trx_addons_sc_googlemap_create( jQuery('#'+map_id).get(0), {
					style: map_style,
					zoom: map_zoom,
					markers: map_markers
					}
				);
			});
	}
}


function trx_addons_sc_googlemap_create(dom_obj, coords) {
	"use strict";
	if (typeof TRX_ADDONS_STORAGE['googlemap_init_obj'] == 'undefined') trx_addons_sc_googlemap_init_styles();
	TRX_ADDONS_STORAGE['googlemap_init_obj'].geocoder = '';
	try {
		var id = dom_obj.id;
		TRX_ADDONS_STORAGE['googlemap_init_obj'][id] = {
			dom: dom_obj,
			markers: coords.markers,
			geocoder_request: false,
			opt: {
				zoom: coords.zoom,
				center: null,
				scrollwheel: false,
				scaleControl: false,
				disableDefaultUI: false,
				panControl: true,
				zoomControl: true,
				mapTypeControl: false,
				streetViewControl: false,
				overviewMapControl: false,
				styles: TRX_ADDONS_STORAGE['googlemap_styles'][coords.style ? coords.style : 'default'],
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
		};
		trx_addons_sc_googlemap_build(id);
	} catch (e) {
		console.log(TRX_ADDONS_STORAGE['msg_sc_googlemap_not_avail']);
	};
}

function trx_addons_sc_googlemap_refresh() {
	"use strict";
	for (id in TRX_ADDONS_STORAGE['googlemap_init_obj']) {
		trx_addons_sc_googlemap_build(id);
	}
}

function trx_addons_sc_googlemap_build(id) {
	"use strict";

	// Create map
	TRX_ADDONS_STORAGE['googlemap_init_obj'][id].map = new google.maps.Map(TRX_ADDONS_STORAGE['googlemap_init_obj'][id].dom, TRX_ADDONS_STORAGE['googlemap_init_obj'][id].opt);

	// Add markers
	for (var i in TRX_ADDONS_STORAGE['googlemap_init_obj'][id].markers)
		TRX_ADDONS_STORAGE['googlemap_init_obj'][id].markers[i].inited = false;
	trx_addons_sc_googlemap_add_markers(id);
	
	// Add resize listener
	jQuery(window).resize(function() {
		if (TRX_ADDONS_STORAGE['googlemap_init_obj'][id].map)
			TRX_ADDONS_STORAGE['googlemap_init_obj'][id].map.setCenter(TRX_ADDONS_STORAGE['googlemap_init_obj'][id].opt.center);
	});
}

function trx_addons_sc_googlemap_add_markers(id) {
	"use strict";
	for (var i in TRX_ADDONS_STORAGE['googlemap_init_obj'][id].markers) {
		
		if (TRX_ADDONS_STORAGE['googlemap_init_obj'][id].markers[i].inited) continue;
		
		if (TRX_ADDONS_STORAGE['googlemap_init_obj'][id].markers[i].latlng == '') {
			
			if (TRX_ADDONS_STORAGE['googlemap_init_obj'][id].geocoder_request!==false) continue;
			
			if (TRX_ADDONS_STORAGE['googlemap_init_obj'].geocoder == '') TRX_ADDONS_STORAGE['googlemap_init_obj'].geocoder = new google.maps.Geocoder();
			TRX_ADDONS_STORAGE['googlemap_init_obj'][id].geocoder_request = i;
			TRX_ADDONS_STORAGE['googlemap_init_obj'].geocoder.geocode({address: TRX_ADDONS_STORAGE['googlemap_init_obj'][id].markers[i].address}, function(results, status) {
				"use strict";
				if (status == google.maps.GeocoderStatus.OK) {
					var idx = TRX_ADDONS_STORAGE['googlemap_init_obj'][id].geocoder_request;
					if (results[0].geometry.location.lat && results[0].geometry.location.lng) {
						TRX_ADDONS_STORAGE['googlemap_init_obj'][id].markers[idx].latlng = '' + results[0].geometry.location.lat() + ',' + results[0].geometry.location.lng();
					} else {
						TRX_ADDONS_STORAGE['googlemap_init_obj'][id].markers[idx].latlng = results[0].geometry.location.toString().replace(/\(\)/g, '');
					}
					TRX_ADDONS_STORAGE['googlemap_init_obj'][id].geocoder_request = false;
					setTimeout(function() { 
						trx_addons_sc_googlemap_add_markers(id); 
						}, 200);
				} else
					dcl(TRX_ADDONS_STORAGE['msg_sc_googlemap_geocoder_error'] + ' ' + status);
			});
		
		} else {
			
			// Prepare marker object
			var latlngStr = TRX_ADDONS_STORAGE['googlemap_init_obj'][id].markers[i].latlng.split(',');
			var markerInit = {
				map: TRX_ADDONS_STORAGE['googlemap_init_obj'][id].map,
				position: new google.maps.LatLng(latlngStr[0], latlngStr[1]),
				clickable: TRX_ADDONS_STORAGE['googlemap_init_obj'][id].markers[i].description!=''
			};
			if (TRX_ADDONS_STORAGE['googlemap_init_obj'][id].markers[i].icon) markerInit.icon = TRX_ADDONS_STORAGE['googlemap_init_obj'][id].markers[i].icon;
			if (TRX_ADDONS_STORAGE['googlemap_init_obj'][id].markers[i].title) markerInit.title = TRX_ADDONS_STORAGE['googlemap_init_obj'][id].markers[i].title;
			TRX_ADDONS_STORAGE['googlemap_init_obj'][id].markers[i].marker = new google.maps.Marker(markerInit);
			
			// Set Map center
			if (TRX_ADDONS_STORAGE['googlemap_init_obj'][id].opt.center == null) {
				TRX_ADDONS_STORAGE['googlemap_init_obj'][id].opt.center = markerInit.position;
				TRX_ADDONS_STORAGE['googlemap_init_obj'][id].map.setCenter(TRX_ADDONS_STORAGE['googlemap_init_obj'][id].opt.center);				
			}
			
			// Add description window
			if (TRX_ADDONS_STORAGE['googlemap_init_obj'][id].markers[i].description!='') {
				TRX_ADDONS_STORAGE['googlemap_init_obj'][id].markers[i].infowindow = new google.maps.InfoWindow({
					content: TRX_ADDONS_STORAGE['googlemap_init_obj'][id].markers[i].description
				});
				google.maps.event.addListener(TRX_ADDONS_STORAGE['googlemap_init_obj'][id].markers[i].marker, "click", function(e) {
					var latlng = e.latLng.toString().replace("(", '').replace(")", "").replace(" ", "");
					for (var i in TRX_ADDONS_STORAGE['googlemap_init_obj'][id].markers) {
						if (trx_addons_googlemap_compare_latlng(latlng, TRX_ADDONS_STORAGE['googlemap_init_obj'][id].markers[i].latlng)) {
							TRX_ADDONS_STORAGE['googlemap_init_obj'][id].markers[i].infowindow.open(
								TRX_ADDONS_STORAGE['googlemap_init_obj'][id].map,
								TRX_ADDONS_STORAGE['googlemap_init_obj'][id].markers[i].marker
							);
							break;
						}
					}
				});
			}
			
			TRX_ADDONS_STORAGE['googlemap_init_obj'][id].markers[i].inited = true;
		}
	}
}

// Compare two latlng strings
function trx_addons_googlemap_compare_latlng(l1, l2) {
	"use strict";
	var l1 = l1.replace(/\s/g, '', l1).split(',');
	var l2 = l2.replace(/\s/g, '', l2).split(',');
	var m0 = Math.min(l1[0].length, l2[0].length);
	var m1 = Math.min(l1[1].length, l2[1].length);
	return l1[0].substring(0, m0)==l2[0].substring(0, m0) && l1[1].substring(0, m1)==l2[1].substring(0, m1);
}


// Add styles for Google map
function trx_addons_sc_googlemap_init_styles() {
	TRX_ADDONS_STORAGE['googlemap_init_obj'] = {};
	TRX_ADDONS_STORAGE['googlemap_styles'] = {
		'default': [],
		'greyscale': [
			{ "stylers": [
				{ "saturation": -100 }
				]
			}
		],
		'inverse': [
			{ "stylers": [
				{ "invert_lightness": true },
				{ "visibility": "on" }
				]
			}
		],
		'simple': [
			{ stylers: [
				{ hue: "#00ffe6" },
				{ saturation: -20 }
				]
			},
			{ featureType: "road",
			  elementType: "geometry",
			  stylers: [
				{ lightness: 100 },
				{ visibility: "simplified" }
				]
			},
			{ featureType: "road",
			  elementType: "labels",
			  stylers: [
				{ visibility: "off" }
				]
			}
		]
	};
}