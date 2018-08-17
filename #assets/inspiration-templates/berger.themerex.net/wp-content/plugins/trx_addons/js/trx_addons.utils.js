/**
 * JS utilities
 *
 * @package WordPress
 * @subpackage ThemeREX Addons
 * @since v1.0
 */


/* Cookies manipulations
---------------------------------------------------------------- */

function trx_addons_get_cookie(name) {
	"use strict";
	var defa = arguments[1]!=undefined ? arguments[1] : null;
	var start = document.cookie.indexOf(name + '=');
	var len = start + name.length + 1;
	if ((!start) && (name != document.cookie.substring(0, name.length))) {
		return defa;
	}
	if (start == -1)
		return defa;
	var end = document.cookie.indexOf(';', len);
	if (end == -1)
		end = document.cookie.length;
	return unescape(document.cookie.substring(len, end));
}


function trx_addons_set_cookie(name, value, expires, path, domain, secure) {
	"use strict";
	var expires = arguments[2]!=undefined ? arguments[2] : 0;
	var path    = arguments[3]!=undefined ? arguments[3] : '/';
	var domain  = arguments[4]!=undefined ? arguments[4] : '';
	var secure  = arguments[5]!=undefined ? arguments[5] : '';
	var today = new Date();
	today.setTime(today.getTime());
	if (expires) {
		expires = expires * 1000 * 60 * 60 * 24;
	}
	var expires_date = new Date(today.getTime() + (expires));
	document.cookie = name + '='
			+ escape(value)
			+ ((expires) ? ';expires=' + expires_date.toGMTString() : '')
			+ ((path)    ? ';path=' + path : '')
			+ ((domain)  ? ';domain=' + domain : '')
			+ ((secure)  ? ';secure' : '');
}


function trx_addons_del_cookie(name, path, domain) {
	"use strict";
	var path   = arguments[1]!=undefined ? arguments[1] : '/';
	var domain = arguments[2]!=undefined ? arguments[2] : '';
	if (trx_addons_get_cookie(name))
		document.cookie = name + '=' + ((path) ? ';path=' + path : '')
				+ ((domain) ? ';domain=' + domain : '')
				+ ';expires=Thu, 01-Jan-1970 00:00:01 GMT';
}



/* ListBox and ComboBox manipulations
---------------------------------------------------------------- */

function trx_addons_clear_listbox(box) {
	"use strict";
	for (var i=box.options.length-1; i>=0; i--)
		box.options[i] = null;
}

function trx_addons_add_listbox_item(box, val, text) {
	"use strict";
	var item = new Option();
	item.value = val;
	item.text = text;
    box.options.add(item);
}

function trx_addons_del_listbox_item_by_value(box, val) {
	"use strict";
	for (var i=0; i<box.options.length; i++) {
		if (box.options[i].value == val) {
			box.options[i] = null;
			break;
		}
	}
}

function trx_addons_del_listbox_item_by_text(box, txt) {
	"use strict";
	for (var i=0; i<box.options.length; i++) {
		if (box.options[i].text == txt) {
			box.options[i] = null;
			break;
		}
	}
}

function trx_addons_find_listbox_item_by_value(box, val) {
	"use strict";
	var idx = -1;
	for (var i=0; i<box.options.length; i++) {
		if (box.options[i].value == val) {
			idx = i;
			break;
		}
	}
	return idx;
}

function trx_addons_find_listbox_item_by_text(box, txt) {
	"use strict";
	var idx = -1;
	for (var i=0; i<box.options.length; i++) {
		if (box.options[i].text == txt) {
			idx = i;
			break;
		}
	}
	return idx;
}

function trx_addons_select_listbox_item_by_value(box, val) {
	"use strict";
	for (var i = 0; i < box.options.length; i++) {
		box.options[i].selected = (val == box.options[i].value);
	}
}

function trx_addons_select_listbox_item_by_text(box, txt) {
	"use strict";
	for (var i = 0; i < box.options.length; i++) {
		box.options[i].selected = (txt == box.options[i].text);
	}
}

function trx_addons_get_listbox_values(box) {
	"use strict";
	var delim = arguments[1] ? arguments[1] : ',';
	var str = '';
	for (var i=0; i<box.options.length; i++) {
		str += (str ? delim : '') + box.options[i].value;
	}
	return str;
}

function trx_addons_get_listbox_texts(box) {
	"use strict";
	var delim = arguments[1] ? arguments[1] : ',';
	var str = '';
	for (var i=0; i<box.options.length; i++) {
		str += (str ? delim : '') + box.options[i].text;
	}
	return str;
}

function trx_addons_sort_listbox(box)  {
	"use strict";
	var temp_opts = new Array();
	var temp = new Option();
	for(var i=0; i<box.options.length; i++)  {
		temp_opts[i] = box.options[i].clone();
	}
	for(var x=0; x<temp_opts.length-1; x++)  {
		for(var y=(x+1); y<temp_opts.length; y++)  {
			if(temp_opts[x].text > temp_opts[y].text)  {
				temp = temp_opts[x];
				temp_opts[x] = temp_opts[y];
				temp_opts[y] = temp;
			}  
		}  
	}
	for(var i=0; i<box.options.length; i++)  {
		box.options[i] = temp_opts[i].clone();
	}
}

function trx_addons_get_listbox_selected_index(box) {
	"use strict";
	for (var i = 0; i < box.options.length; i++) {
		if (box.options[i].selected)
			return i;
	}
	return -1;
}

function trx_addons_get_listbox_selected_value(box) {
	"use strict";
	for (var i = 0; i < box.options.length; i++) {
		if (box.options[i].selected) {
			return box.options[i].value;
		}
	}
	return null;
}

function trx_addons_get_listbox_selected_text(box) {
	"use strict";
	for (var i = 0; i < box.options.length; i++) {
		if (box.options[i].selected) {
			return box.options[i].text;
		}
	}
	return null;
}

function trx_addons_get_listbox_selected_option(box) {
	"use strict";
	for (var i = 0; i < box.options.length; i++) {
		if (box.options[i].selected) {
			return box.options[i];
		}
	}
	return null;
}



/* Radio buttons manipulations
---------------------------------------------------------------- */

function trx_addons_get_radio_value(radioGroupObj) {
	"use strict";
	for (var i=0; i < radioGroupObj.length; i++)
		if (radioGroupObj[i].checked) return radioGroupObj[i].value;
	return null;
}

function trx_addons_set_radio_checked_by_num(radioGroupObj, num) {
	"use strict";
	for (var i=0; i < radioGroupObj.length; i++)
		if (radioGroupObj[i].checked && i!=num) radioGroupObj[i].checked=false;
		else if (i==num) radioGroupObj[i].checked=true;
}

function trx_addons_set_radio_checked_by_value(radioGroupObj, val) {
	"use strict";
	for (var i=0; i < radioGroupObj.length; i++)
		if (radioGroupObj[i].checked && radioGroupObj[i].value!=val) radioGroupObj[i].checked=false;
		else if (radioGroupObj[i].value==val) radioGroupObj[i].checked=true;
}



/* Form validation
---------------------------------------------------------------- */

/*
// Usage example:
var error = trx_addons_form_validate(jQuery(form_selector), {	// -------- Options ---------
	error_message_show: true,									// Display or not error message
	error_message_time: 5000,									// Time to display error message
	error_message_class: 'trx_addons_message_box_error',		// Class, appended to error message block
	error_message_text: 'Global error text',					// Global error message text (if not specify message in the checked field)
	error_fields_class: 'trx_addons_field_error',				// Class, appended to error fields
	exit_after_first_error: false,								// Cancel validation and exit after first error
	rules: [
		{
			field: 'author',																// Checking field name
			min_length: { value: 1,	 message: 'The author name can\'t be empty' },			// Min character count (0 - don't check), message - if error occurs
			max_length: { value: 60, message: 'Too long author name'}						// Max character count (0 - don't check), message - if error occurs
		},
		{
			field: 'email',
			min_length: { value: 7,	 message: 'Too short (or empty) email address' },
			max_length: { value: 60, message: 'Too long email address'},
			mask: { value: '^([a-z0-9_\\-]+\\.)*[a-z0-9_\\-]+@[a-z0-9_\\-]+(\\.[a-z0-9_\\-]+)*\\.[a-z]{2,6}$', message: 'Invalid email address'}
		},
		{
			field: 'comment',
			min_length: { value: 1,	 message: 'The comment text can\'t be empty' },
			max_length: { value: 200, message: 'Too long comment'}
		},
		{
			field: 'pwd1',
			min_length: { value: 5,	 message: 'The password can\'t be less then 5 characters' },
			max_length: { value: 20, message: 'Too long password'}
		},
		{
			field: 'pwd2',
			equal_to: { value: 'pwd1',	 message: 'The passwords in both fields must be equals' }
		}
	]
});
*/

function trx_addons_form_validate(form, opt) {
	"use strict";
	// Default options
	if (typeof(opt.error_message_show)=='undefined')		opt.error_message_show = true;
	if (typeof(opt.error_message_time)=='undefined')		opt.error_message_time = 5000;
	if (typeof(opt.error_message_class)=='undefined')		opt.error_message_class = 'trx_addons_message_box_error';
	if (typeof(opt.error_message_text)=='undefined')		opt.error_message_text = 'Incorrect data in the fields!';
	if (typeof(opt.error_fields_class)=='undefined')		opt.error_fields_class = 'trx_addons_field_error';
	if (typeof(opt.exit_after_first_error)=='undefined')	opt.exit_after_first_error = false;
	// Validate fields
	var error_msg = '';
	form.find(":input").each(function() {
		"use strict";
		if (error_msg!='' && opt.exit_after_first_error) return;
		for (var i = 0; i < opt.rules.length; i++) {
			if (jQuery(this).attr("name") == opt.rules[i].field) {
				var val = jQuery(this).val();
				var error = false;
				if (typeof(opt.rules[i].min_length) == 'object') {
					if (opt.rules[i].min_length.value > 0 && val.length < opt.rules[i].min_length.value) {
						if (error_msg=='') jQuery(this).get(0).focus();
						error_msg += '<p class="trx_addons_error_item">' + (typeof(opt.rules[i].min_length.message)!='undefined' ? opt.rules[i].min_length.message : opt.error_message_text ) + '</p>';
						error = true;
					}
				}
				if ((!error || !opt.exit_after_first_error) && typeof(opt.rules[i].max_length) == 'object') {
					if (opt.rules[i].max_length.value > 0 && val.length > opt.rules[i].max_length.value) {
						if (error_msg=='') jQuery(this).get(0).focus();
						error_msg += '<p class="trx_addons_error_item">' + (typeof(opt.rules[i].max_length.message)!='undefined' ? opt.rules[i].max_length.message : opt.error_message_text ) + '</p>';
						error = true;
					}
				}
				if ((!error || !opt.exit_after_first_error) && typeof(opt.rules[i].mask) == 'object') {
					if (opt.rules[i].mask.value != '') {
						var regexp = new RegExp(opt.rules[i].mask.value);
						if (!regexp.test(val)) {
							if (error_msg=='') jQuery(this).get(0).focus();
							error_msg += '<p class="trx_addons_error_item">' + (typeof(opt.rules[i].mask.message)!='undefined' ? opt.rules[i].mask.message : opt.error_message_text ) + '</p>';
							error = true;
						}
					}
				}
				if ((!error || !opt.exit_after_first_error) && typeof(opt.rules[i].equal_to) == 'object') {
					if (opt.rules[i].equal_to.value != '' && val!=jQuery(jQuery(this).get(0).form[opt.rules[i].equal_to.value]).val()) {
						if (error_msg=='') jQuery(this).get(0).focus();
						error_msg += '<p class="trx_addons_error_item">' + (typeof(opt.rules[i].equal_to.message)!='undefined' ? opt.rules[i].equal_to.message : opt.error_message_text ) + '</p>';
						error = true;
					}
				}
				if (opt.error_fields_class != '') jQuery(this).toggleClass(opt.error_fields_class, error);
			}

		}
	});
	if (error_msg!='' && opt.error_message_show) {
		var error_message_box = form.find(".trx_addons_message_box");
		if (error_message_box.length == 0) error_message_box = form.parent().find(".trx_addons_message_box");
		if (error_message_box.length == 0) {
			form.append('<div class="trx_addons_message_box"></div>');
			error_message_box = form.find(".trx_addons_message_box");
		}
		if (opt.error_message_class) error_message_box.toggleClass(opt.error_message_class, true);
		error_message_box.html(error_msg).fadeIn();
		setTimeout(function() { error_message_box.fadeOut(); }, opt.error_message_time);
	}
	return error_msg!='';
}




/* Document manipulations
---------------------------------------------------------------- */

// Animated scroll to selected id
function trx_addons_document_animate_to(id) {
	"use strict";
	var oft = !isNaN(id) ? Number(id) : 0;
	if (isNaN(id)) {
		if (id.indexOf('#')==-1) id = '#' + id;
		var obj = jQuery(id).eq(0);
		if (obj.length == 0) return;
		oft = obj.offset().top;
	}
	var st  = jQuery(window).scrollTop();
	var speed = Math.min(1600, Math.max(400, Math.round(Math.abs(oft-st) / jQuery(window).height() * 100)));
	jQuery('body,html').animate( {scrollTop: oft - jQuery('#wpadminbar').height() + 1}, speed, 'linear');
}

// Change browser address without reload page
function trx_addons_document_set_location(curLoc){
	"use strict";
	if (history.pushState===undefined || navigator.userAgent.match(/MSIE\s[6-9]/i) != null) return;
	try {
		history.pushState(null, null, curLoc);
		return;
	} catch(e) {}
	location.href = curLoc;
}

// Add/Change arguments to the url address
function trx_addons_add_to_url(prm) {
	"use strict";
	var ignore_empty = arguments[1] !== undefined ? arguments[1] : true;
	var loc = location.href;
	var q = loc.indexOf('?');
	var attr = {};
	if (q > 0) {
		var qq = loc.substr(q+1).split('&');
		var parts = '';
		for (var i=0; i<qq.length; i++) {
			var parts = qq[i].split('=');
			attr[parts[0]] = parts.length>1 ? parts[1] : ''; 
		}
	}
	for (var p in prm) {
		attr[p] = prm[p];
	}
	loc = (q > 0 ? loc.substr(0, q) : loc) + '?';
	var i = 0;
	for (p in attr) {
		if (ignore_empty && attr[p]=='') continue;
		loc += (i++ > 0 ? '&' : '') + p + '=' + attr[p];
	}
	return loc;
}



/* Browsers detection
---------------------------------------------------------------- */

function trx_addons_browser_is_mobile() {
	"use strict";
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
}
function trx_addons_browser_is_ios() {
	"use strict";
	return navigator.userAgent.match(/iPad|iPhone|iPod/i) != null || navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i)?true:false;
}
function trx_addons_is_retina() {
	"use strict";
	var mediaQuery = '(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)';
	return (window.devicePixelRatio > 1) || (window.matchMedia && window.matchMedia(mediaQuery).matches);
}



/* File functions
---------------------------------------------------------------- */

function trx_addons_get_file_name(path) {
	"use strict";
	path = path.replace(/\\/g, '/');
	var pos = path.lastIndexOf('/');
	if (pos >= 0)
		path = path.substr(pos+1);
	return path;
}

function trx_addons_get_file_ext(path) {
	"use strict";
	var pos = path.lastIndexOf('.');
	path = pos >= 0 ? path.substr(pos+1) : '';
	return path;
}



/* Image functions
---------------------------------------------------------------- */

// Return true, if all images in the specified container are loaded
function trx_addons_check_images_complete(cont) {
	"use strict";
	var complete = true;
	cont.find('img').each(function() {
		if (!complete) return;
		if (!jQuery(this).get(0).complete) complete = false;
	});
	return complete;
}



/* Utils
---------------------------------------------------------------- */

// Generates a storable representation of a value
function trx_addons_serialize(mixed_val) {
	"use strict";
	var obj_to_array = arguments.length==1 || argument[1]===true;

	switch ( typeof(mixed_val) ) {

		case "number":
			if ( isNaN(mixed_val) || !isFinite(mixed_val) )
				return false;
			else
				return (Math.floor(mixed_val) == mixed_val ? "i" : "d") + ":" + mixed_val + ";";

		case "string":
			return "s:" + mixed_val.length + ":\"" + mixed_val + "\";";

		case "boolean":
			return "b:" + (mixed_val ? "1" : "0") + ";";

		case "object":
			if (mixed_val == null)
				return "N;";
			else if (mixed_val instanceof Array) {
				var idxobj = { idx: -1 };
				var map = [];
				for (var i=0; i<mixed_val.length; i++) {
					idxobj.idx++;
					var ser = trx_addons_serialize(mixed_val[i]);
					if (ser)
						map.push(trx_addons_serialize(idxobj.idx) + ser);
				}                                      
				return "a:" + mixed_val.length + ":{" + map.join("") + "}";
			} else {
				var class_name = trx_addons_get_class(mixed_val);
				if (class_name == undefined)
					return false;
				var props = new Array();
				for (var prop in mixed_val) {
					var ser = trx_addons_serialize(mixed_val[prop]);
					if (ser)
						props.push(trx_addons_serialize(prop) + ser);
				}
				if (obj_to_array)
					return "a:" + props.length + ":{" + props.join("") + "}";
				else
					return "O:" + class_name.length + ":\"" + class_name + "\":" + props.length + ":{" + props.join("") + "}";
			}

		case "undefined":
			return "N;";
	}
	return false;
}

// Returns the name of the class of an object
function trx_addons_get_class(obj) {
	"use strict";
	if (obj instanceof Object && !(obj instanceof Array) && !(obj instanceof Function) && obj.constructor) {
		var arr = obj.constructor.toString().match(/function\s*(\w+)/);
		if (arr && arr.length == 2) return arr[1];
	}
	return false;
}
