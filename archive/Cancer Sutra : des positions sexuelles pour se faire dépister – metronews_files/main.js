
// â BEGIN FILE:/templates/v3/javascript/events.js â

      // Event listener objects
function NotifyEvent() { 
    this.callbacks = new Array();
    
    this.registerCb = function (callback) { 
	this.callbacks[this.callbacks.length] = callback; 
    }; 
    
    this.notify = function (value) { 
	$.each(this.callbacks,function (i,cb) { 
	  try {
		cb(value);
	  }
	  catch(e) { /* Do nothing.. */ } 
	}); 
    }; 
}

// Create events
var wib_page_load_event = new NotifyEvent();
var wib_gallery_paging_slideshow_event = new NotifyEvent();
var wib_overlay_paging_slideshow_event = new NotifyEvent();

// â END FILE:/templates/v3/javascript/events.js â
    
// â BEGIN FILE:/templates/v3/javascript/strings.js â

      
    
    
    var msg_advertisement = 'PUBLICITÉ';
    
    // Poll
    var msg_metro_poll_voted = 'personnes ont déjà voté';

  

// â END FILE:/templates/v3/javascript/strings.js â
    
// â BEGIN FILE:/templates/v3/javascript/params.js â

      
    
    
    var gallery_overlay_ad_config = {};
    
    gallery_overlay_ad_config[3 - 1] = true;
    
    gallery_overlay_ad_config[6 - 1] = true;
    
    gallery_overlay_ad_config[9 - 1] = true;
    
      function gtm_register_pageview() {
        dataLayer.push({'event': 'galleryNavBtnClick'});
      }
      
      
	wib_gallery_paging_slideshow_event.registerCb(gtm_register_pageview);
      
      function global_rollup(){
        var rollupTrackSrc = location.protocol +"//microreporting.metronews.fr/rolluptracker_fr.php?host=" + window.location.hostname + "&cachekey=" + Math.floor(Math.random()*10000);
      
        getUrl(rollupTrackSrc);
      }
      
	wib_page_load_event.registerCb(global_rollup);
	wib_gallery_paging_slideshow_event.registerCb(global_rollup);
	wib_overlay_paging_slideshow_event.registerCb(global_rollup);
      

// â END FILE:/templates/v3/javascript/params.js â
    
// â BEGIN FILE:/templates/v3/javascript/metro.js â

      /* global $ */
function metroCookie(name, value, options)
{
  // write
  if (value !== undefined) {
    options = options || {};

    if (value === null) {
      options.expires = -1;
    }

    if (typeof options.expires === 'number') {
      var days = options.expires, t = options.expires = new Date();
      t.setDate(t.getDate() + days);
    }

    return (document.cookie = [
      encodeURIComponent(name), '=', value,
      options.expires ? '; expires=' + options.expires.toUTCString() : '',
      options.path    ? '; path=' + options.path : '',
      options.domain  ? '; domain=' + options.domain : '',
      options.secure  ? '; secure' : ''
    ].join(''));
  }

  // read
  var cookies = document.cookie.split('; ');
  for (var i = 0, l = cookies.length; i < l; i++) {
    var parts = cookies[i].split('=');
    if (parts.shift() === name) {
      return parts.join('=');
    }
  }

  return null;
}

function setDeviceCookie(value) {
  metroCookie('v2device', value, { expires: 7, path: '/' });
  window.location.reload();
  return false;
}

function onClickTeaser(id, show_tab, hide_tab) {
  if (!id || !show_tab || !hide_tab) {
    return;
  }

  var active_position;
  if (show_tab == "most-read") {
    active_position = "right";
  }
  else if (show_tab == "most-recent") {
    active_position = "left";
  }
  
  $("#"+show_tab + "-" + id).attr("class", "active-" + active_position);
  $("#"+hide_tab + "-" + id).attr("class", "passive");
  $("#"+hide_tab + "-list-" + id).hide();
  $("#"+show_tab + "-list-" + id).show();
}


// Menu button positioning
$(document).ready(function () {

  // Initialization
  $("#close-button").hide();
  
  var menu_button = $("#menu-button-wrapper"),
      nav = $("#nav-wrapper nav"),
      top,
      right,
      nav_is_open = false,
      nav_is_initialized;

  function updateButtonScrollBreakpoint() {
    var prev = menu_button.prev(); // Could be an ad or the extended toolbar.
    top = prev.offset().top + prev.outerHeight();
  }
  
  function updateButtonYPosition() {
    var y;

    if (nav_is_open) return;

    // what the y position of the scroll is
    y = $(this).scrollTop();
    
    // whether that's below the top
    if (y >= top) {
      // if so, ad the fixed class
      menu_button.addClass("fixed");
      menu_button.css("right", right+"px");     
    } else {
      // otherwise remove it
      menu_button.removeClass("fixed");
      menu_button.css("right", "");
    }
  }

  function updateButtonXPosition() {
    right = ($(document).width() - $("#wrapper").width()) / 2;
    updateButtonYPosition();
  }

  function lockButtonPosition() {
    var top = menu_button.offset().top - $("#wrapper").position().top;
    menu_button.removeClass("fixed");
    menu_button.css({ "position" : "absolute",
                      "top": top+"px",
                      "right": ""
                    });
  }

  function releaseButtonPosition() {
    menu_button.css({ "position": "",
                      "top": ""
                    });
  }

  function updateNavPosition() {
    var top = menu_button.position().top + 50;
    nav.css("top", top+"px");
  }

  function showNavigation () {
    if ($("#overlay").show().length === 0) {
      $("<div/>", { "id": "overlay" }).appendTo("#body-wrapper").click(leaveNavigation);
    }
    lockButtonPosition();
    updateNavPosition();
    $("#nav-wrapper").show();
    nav_is_open = true;
    $(document.body).addClass("open-nav");

    // Keybindings
    $(document).keyup(navKeyHandler);

    if (!nav_is_initialized) {
      initNavigation();
    }
  }

  function hideNavigation () {
    releaseButtonPosition();
    $("#overlay").hide();
    $("#nav-wrapper").hide();
    nav_is_open = false;
    $(document.body).removeClass("open-nav");
    updateButtonXPosition();
  }

  function goToNavigation() {
    showNavigation();
  //  if (window.history.replaceState)
  //    window.history.pushState({page: 2}, "", "#main-nav");
  }

  function leaveNavigation() {
	$("#menu-button").show();	
	/*if (window.history.replaceState) {
      window.history.back();
    } else {
  */
	  hideNavigation();
	//}
  }

  function navKeyHandler(e) {
    if (e.keyCode == 27) {   // esc
      leaveNavigation();
    }
  }

  function initNavigation() {
    var level1,
        pathname = window.location.pathname;
    nav_is_initialized = true;

    if (pathname.substr(0,1) != "/") // Does it start with a slash in all browsers?
      pathname = "/" + pathname;
    level1 = window.location.pathname.split("/")[1];
    if (level1.length > 0)
      level1 = level1 + "/";
    $("#main-nav > li > a[href^='/"+level1+"']").first().parent().addClass("selected");

    $("#main-nav > li > a").click(function (e) {
      if (!$(this).parent().hasClass("selected") ||
          $(this).parent().hasClass("more"))
        e.preventDefault();
      $("#main-nav > li").removeClass("selected");
      $(this).parent().addClass("selected");
    });
  }
/*
  $(window).bind("popstate", function (e) {
    if (e.originalEvent.state && e.originalEvent.state.page == 2)
      showNavigation();
    else if (e.originalEvent.state && e.originalEvent.state.page == 1)
      hideNavigation();
  });
*/
  // Run immediatly on ready

  if (menu_button.length > 0) {
    updateButtonScrollBreakpoint();
    updateButtonXPosition();
    window.setTimeout(function () { 
      // Update if there is an asynchronous ad above the header.
      updateButtonScrollBreakpoint();
    }, 3000);
  }


  // Attach event handlers
/*
  if (window.history.replaceState) {
    window.history.replaceState({page: 1}, "", "");
  }
*/

  $("#menu-button").click(function () {
    if (nav_is_open) {
      leaveNavigation();
    }
    else {
      goToNavigation();
	  $("#close-button").show();
	  $("#menu-button").hide();
    }
  });
  
  $("#close-button").click(function () {
	leaveNavigation();
	$("#close-button").hide();
	$("#menu-button").show();
  });

  // Development only? Show nav button first when it is ready to receive clicks.
  $("#menu-button").show();

  // Attach more event handlers

  $(window).scroll(function () {
    if (menu_button.length > 0) {
      updateButtonYPosition();
    }
  });

  $(window).resize(function () {
    updateButtonXPosition();
  });

  $(window).load(function () {
    // Layout hacks

    var is_background_ad = 0;
    // Try to detect takeover ad
    if ($("body").css("background-image") !== "none") {
      
      is_background_ad = 1; //Set this value to 1 when background ad on page
      
      //Do not add takeover-netbook class if class added already
      if(isFrontend && !$("body").hasClass("takeover-netbook"))
        $("body").addClass("takeover-netbook");
      
      updateButtonXPosition();

      /* This code is commented to fix the campaign overlapping issue
      // Setting position for campaign logo in pushes
      $('.push-component.campaign-push-wrapper.medium-high, .push-component.campaign-push-wrapper.small-low').setCampaignPos({
        textIndent: 10,
        paddingBottom: 7
      });
      */


      /*Wib-1113 - Galleria Hack for takeover ad */
      //Galleria custom functionality
      if ( $('#galleria').length ) { /* Check length of galleria div to avoid galleria error*/
          Galleria.run('#galleria', {
            extend: function(options) {
            this.refreshImage(); // Refreshes the image scale & position.
          }
        });
      }
      
      /*Wib-823 - Galleria Hack for news-carousel-component when takeover ad  */
      //Galleria custom functionality
      
      // Check length of news-carousel-component push class to avoid galleria error
      if ( $('.news-carousel-component .galleria-container').length ) { 
          Galleria.ready(function(options) 
          {
              var galleries = Galleria.get(); //Get all galleria instances
              //Resize each news-carousel-component
              $.each(galleries,function(index,val){
                  val.resize(); //This will resize the entire gallery.
              });
          });
      }

    }
    
    //Update the background ad flag value
    if(isFrontend && updateVarsScriptUrl !='') {
      $.ajax({
        url: updateVarsScriptUrl,
        data:{"var":'IS_BACKGROUND_AD',"value":is_background_ad},
        dataType:"jsonp",
        success: function(data) {
            //success
        }
      });
    }

  });
  
});
  
 // Support function for submitting extra search boxes. E.g. populates
 // the q variable from query.
 function extraSearchSubmit(query, q, form) {
  $('#'+q).val($('#'+query).val());
  $('#'+form).submit();
 }
 
 // Used to fetch an URL, e.g. statistic scripts etc.
function getUrl(url) {

    var hiddenDiv = document.getElementById('hidden_div');
    var iFrame = document.createElement('iframe');
    
    iFrame.src = url;
    hiddenDiv.appendChild(iFrame);
}

$(function() {

  // Extending jQuery plugin
  $.fn.extend({

    // Script to set campaign logo position
    setCampaignPos: function(options) {

      this.each(function() {
        var defaultOptions, target, image, logo;
        
        target = $(this);
        image = target.find('.image img');
        logo = target.find('.campaign-push');

        if(image.length) {
          defaultOptions = {
            textIndent: 0,
            paddingLeft: 0,
            paddingBottom: 0
          };
          
          $.extend(options, defaultOptions);

          target.find('> div').css({
            overflow: 'hidden',
            paddingBottom: (logo.outerHeight() + (options.paddingBottom * 2))
          });

          image.css({
            marginBottom: -(logo.outerHeight() + options.paddingBottom)
          });

          logo.css({
            position: 'absolute',
            left: 0,
            bottom: options.paddingBottom
          });
        }
      });
    }
  });

  /* This code is commented to fix the campaign overlapping issue
  // Setting position for campaign logo in pushes
  $('.push-component.campaign-push-wrapper.medium-high, .push-component.campaign-push-wrapper.small-low').setCampaignPos({
    textIndent: 10,
    paddingBottom: 7
  });

  $(window).on('resize', function() {
    // Setting position for campaign logo in pushes
    $('.push-component.campaign-push-wrapper.medium-high, .push-component.campaign-push-wrapper.small-low').setCampaignPos({
      textIndent: 10,
      paddingBottom: 7
    });
  });
  */
});

// â END FILE:/templates/v3/javascript/metro.js â
    
// â BEGIN FILE:/templates/v3/javascript/columnist.js â

      /* global $ */
(function () {

  // This is a port form a prototype.js implementation, and could be
  // done more effectively with a modern jQuery implementation.

  // IE 7 and 8 is causing the need to set opacity individually on the
  // text and image elements.
  //
  // http://mattsnider.com/xbrowser/ie-issues-to-avoid/
  // If you have an element in the DOM with children element(s)
  // positioned outside of the parent's dimensions, say with
  // "position:relative" or using margins, and then apply an opacity to
  // the parent element, IE will crop all elements positioned outside of
  // the parent. This happens because IE uses a special Microsoft filter
  // to render the opacity, which redraws the parent element and its
  // children to the right opacity, but only considers the dimensions
  // inside the parent element for this redraw. Thus, everything
  // positioned outside of the parents dimensions are lost.

  var current_text, current_image, current_index = 0, delay;
  var step = 0.05;
  var speed = 50;
  var pause = false;

  $(document).ready(function(e) {
    if ($(window).width() <= 980) {
      addPromo2();
    }

    var divs = $(".promo-1");
    if (divs.length < 2) return;

    // Initialize style properties in all due to IE.
    $(".promo-1 .image").each(function () {
        $(this).css("opacity", "0");
    });
    $(".promo-1 .text").each(function () {
      $(this).css("opacity", "0");
    });


    delay = parseInt(divs.first().attr("data-delay"), 10);

    current_index = Math.floor(Math.random() * divs.length);
    showFirst(divs);

    current_text = $("#columnist-text-" + current_index);
    current_image = $("#columnist-image-" + current_index);
    window.setTimeout(fadeOut, delay*1000);

    divs.each(function () {
      $(this).mouseover(function (event) {
        pause = true;
      });
      $(this).mouseout(function (event) {
        pause = false;
      });
    });
  });

  var showFirst = function (divs) {
    if (current_index != 1) {
      $("#columnist-1").css({ display: "none" });
      $("#columnist-text-1").css({ opacity: "0" });
      $("#columnist-image-1").css({ opacity: "0" });
    }
    $("#columnist-"+(current_index+1)).css({ display: "block" });
    $("#columnist-text-"+(current_index+1)).css({ opacity: "1" });
    $("#columnist-image-"+(current_index+1)).css({ opacity: "1" });
  };

  var next = function () {
    $("#columnist-"+(current_index+1)).css({ display: "none" });
    var divs = $(".promo-1");
    current_index = ((current_index+1) % divs.length);
    $("#columnist-"+(current_index+1)).css({ display: "block" });
    fadeIn();
  };

  var fadeOut = function () {
    if (pause) {
      $("#columnist-text-"+(current_index+1)).css({ opacity: "1" });
      $("#columnist-image-"+(current_index+1)).css({ opacity: "1" });
      window.setTimeout(fadeOut, speed);
      return;
    }
    var opacity = parseFloat($("#columnist-text-"+(current_index+1)).css("opacity"));
    if (opacity > 0) {
      opacity = Math.max(opacity - step, 0);
      $("#columnist-text-"+(current_index+1)).fadeTo(0,opacity);
      $("#columnist-image-"+(current_index+1)).fadeTo(0,opacity);
      window.setTimeout(fadeOut, speed);
    } else {
      next();
    }
  };

  var fadeIn = function () {
    var opacity = parseFloat($("#columnist-text-"+(current_index+1)).css("opacity"));
    if (opacity < 1) {
      opacity = opacity + step;
      $("#columnist-text-"+(current_index+1)).fadeTo(0,opacity);
      $("#columnist-image-"+(current_index+1)).fadeTo(0,opacity);
      window.setTimeout(fadeIn, speed);
    } else {
      // Prevent rounding error
      $("#columnist-text-"+(current_index+1)).css({ opacity: "1" });
      $("#columnist-image-"+(current_index+1)).css({ opacity: "1" });
      window.setTimeout(fadeOut, delay*1000);
    }
  };

  var addPromo2 = function () {
    var promo2 = $(".promo-2").first();
    if (!promo2) return;

    var promo1s = $(".promo-1");
    if (!promo1s) return;

    var index = promo1s.length+1;

    var new_promo = promo1s.first().clone();
    new_promo.attr("id", "columnist-"+(index));
    new_promo.find(".image").replaceWith(promo2.find(".image").clone());
    new_promo.find(".image").attr("id", "columnist-image-"+index);
    new_promo.find(".image").css("opacity", 0);
    new_promo.find(".text").replaceWith(promo2.find(".text").clone());
    new_promo.find(".text").attr("id", "columnist-text-"+index);
    new_promo.find(".text").css("opacity", 0);
    new_promo.insertAfter(promo1s.last());
  };


})();

// â END FILE:/templates/v3/javascript/columnist.js â
    
// â BEGIN FILE:/templates/v3/javascript/date.format.js â

      
/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default. 
 */

// Found on: http://blog.stevenlevithan.com/archives/date-time-format
// Downloaded from: http://stevenlevithan.com/assets/misc/date.format.js
   
   
//    Mask  	Description
//    d 	Day of the month as digits; no leading zero for single-digit days.
//    dd 	Day of the month as digits; leading zero for single-digit days.
//    ddd 	Day of the week as a three-letter abbreviation.
//    dddd 	Day of the week as its full name.
//    m 	Month as digits; no leading zero for single-digit months.
//    mm 	Month as digits; leading zero for single-digit months.
//    mmm 	Month as a three-letter abbreviation.
//    mmmm 	Month as its full name.
//    yy 	Year as last two digits; leading zero for years less than 10.
//    yyyy 	Year represented by four digits.
//    h 	Hours; no leading zero for single-digit hours (12-hour clock).
//    hh 	Hours; leading zero for single-digit hours (12-hour clock).
//    H 	Hours; no leading zero for single-digit hours (24-hour clock).
//    HH 	Hours; leading zero for single-digit hours (24-hour clock).
//    M 	Minutes; no leading zero for single-digit minutes.
//    		Uppercase M unlike CF timeFormat's m to avoid conflict with months.
//    MM 	Minutes; leading zero for single-digit minutes.
//    		Uppercase MM unlike CF timeFormat's mm to avoid conflict with months.
//    s 	Seconds; no leading zero for single-digit seconds.
//    ss 	Seconds; leading zero for single-digit seconds.
//    l or L 	Milliseconds. l gives 3 digits. L gives 2 digits.
//    t 	Lowercase, single-character time marker string: a or p.
//    		No equivalent in CF.
//    tt 	Lowercase, two-character time marker string: am or pm.
//    		No equivalent in CF.
//    T 	Uppercase, single-character time marker string: A or P.
//    		Uppercase T unlike CF's t to allow for user-specified casing.
//    TT 	Uppercase, two-character time marker string: AM or PM.
//    		Uppercase TT unlike CF's tt to allow for user-specified casing.
//    Z 	US timezone abbreviation, e.g. EST or MDT. With non-US timezones or in the Opera browser, the GMT/UTC offset is returned, e.g. GMT-0500
//    		No equivalent in CF.
//    o 	GMT/UTC timezone offset, e.g. -0500 or +0230.
//    		No equivalent in CF.
//    S 	The date's ordinal suffix (st, nd, rd, or th). Works well with d.
//    		No equivalent in CF.
//    UTC: 	Must be the first four characters of the mask. Converts the date from local time to UTC/GMT/Zulu time before applying the mask. The "UTC:" prefix is removed.
//    		No equivalent in CF.
//    'â¦' or "â¦" 	Literal character sequence. Surrounding quotes are removed.
//         		No equivalent in CF.
//   	
//   
//    And here are the named masks provided by default (you can easily change these or add your own):
//    Name 	     	Mask 	     	      	 	 Example
//    default 		ddd mmm dd yyyy HH:MM:ss 	 Sat Jun 09 2007 17:46:21
//    shortDate 	m/d/yy 	   			 6/9/07
//    mediumDate 	mmm d, yyyy			 Jun 9, 2007
//    longDate 		mmmm d, yyyy 			 June 9, 2007
//    fullDate 		dddd, mmmm d, yyyy 		 Saturday, June 9, 2007
//    shortTime 	h:MM TT 			 5:46 PM
//    mediumTime 	h:MM:ss TT 			 5:46:21 PM
//    longTime 		h:MM:ss TT Z 			 5:46:21 PM EST
//    isoDate 		yyyy-mm-dd 			 2007-06-09
//    isoTime 		HH:MM:ss 			 17:46:21
//    isoDateTime 	yyyy-mm-dd'T'HH:MM:ss 		 2007-06-09T17:46:21
//    isoUtcDateTime 	UTC:yyyy-mm-dd'T'HH:MM:ss'Z' 	 2007-06-09T22:46:21Z
//   
//    A couple issues:
//   
//        * In the unlikely event that there is ambiguity in the meaning of your mask (e.g., m followed by mm, with no separating characters), put a pair of empty quotes between your metasequences. The quotes will be removed automatically.
//        * If you need to include literal quotes in your mask, the following rules apply:
//              o Unpaired quotes do not need special handling.
//              o To include literal quotes inside masks which contain any other quote marks of the same type, you need to enclose them with the alternative quote type (i.e., double quotes for single quotes, and vice versa).
//                E.g., date.format('h "o\'clock, y\'all!"') returns "6 o'clock, y'all". This can get a little hairy, perhaps, but I doubt people will really run into it that often.
//                The previous example can also be written as date.format("h") + "o'clock, y'all!".
   

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};



// â END FILE:/templates/v3/javascript/date.format.js â
    
// â BEGIN FILE:/templates/v3/javascript/wib-ads.js â

      function WibAds() {
    var reloadable_ads;
    var gallery_overlay_ad;    
    var gallery_overlay_ad_html = 
	"<div class='ad' id='ad22'>" + 
	"  <div class='ad-msg'>" +
	"    <span class='ad-msg'>" + msg_advertisement + "</span>" +
	"  </div>" +
	"  <div id='ad22_rectangle' class='ad-rectangle'>" +
	"    <div id='ad22_expander'>" +
	"    </div>" +
	"  </div>" +
	"</div>";
    
    var append_fif = function(ad) {
	var iframe = document.createElement("iframe");
	iframe.style.margin = "0px";
	iframe.style.padding = "0px";
	iframe.style.borderWidth = "0px";
	iframe.style.visibility = "hidden";
	iframe.scrolling = "no";
	iframe.frameBorder = "0";
	iframe.allowTransparency = "true";
	iframe.ad_src = ad.src;
	iframe.ad_width = ad.width;
	iframe.ad_height = ad.height;
	iframe.src = "/templates/v3/html/wib-ads-fif.html?__toolbar=0&provider=" + ad.provider;

  var ad_expander = $("#ad" + ad.pos + "_expander");
	ad_expander.html("");	
	ad_expander.append(iframe);
    }
    
    
    // API

    // Constructor function
    this.init = function() {
	reloadable_ads = new Array();
    }
    
    // Reload a specific or all reloadable ads
    this.reload = function(ad_pos, extra) {
	if (ad_pos == 22) {
	    // Show the ad only on configured image positions
	    if (!gallery_overlay_ad || !gallery_overlay_ad_config[extra.to % 10])
		return;

	    // Ad pos 22 is special: the HTML ad container doesn't exist in the page
	    // normally, so before we create the fif we need to create and append the 
	    // HTML container. We also hide the lightbox stuff
	    
      $("#imageContainer").css({ visibility : "hidden" });
	    $("#imageData").css({ visibility : "hidden" });
	    $("#imageContainer").before("<div id='wibAdOverlay' class='wibAdOverlay'>" + 
					             gallery_overlay_ad_html + 
					          "</div>");
	    
	    // Append the fif to the ad container
	    append_fif(gallery_overlay_ad);

	} else {
	    for (i = 0; i < reloadable_ads.length; i++) {
		append_fif(reloadable_ads[i]);
	    }
	}
    }

    // Initiate the reloadable ads
    this.set_reloadable_ad = function(provider, pos, src, width, height) {
	var reloadable_ad = { 
	    "provider" : provider,
	    "pos" : pos,
	    "src" : src,
	    "width" : width,
	    "height" : height
	};
	reloadable_ads.push(reloadable_ad);
    }

    // Initiate the gallery overlay ad
    this.set_gallery_overlay_ad = function(provider, pos, src, width, height) {
	gallery_overlay_ad = { 
	    "provider" : provider,
	    "pos" : pos,
	    "src" : src,
	    "width" : width,
	    "height" : height
	};
    }

    // Closes the gallery overlay ad. Called by ad providers from inside a fif
    this.close_gallery_overlay = function() {
	var wib_ad_overlay = $("#wibAdOverlay");
	if (!wib_ad_overlay)
	    return;

	wib_ad_overlay.remove();
	$("#imageContainer").css({ visibility : "visible" });
	$("#imageData").css({ visibility : "visible" });
    }    
}

// Callback from Lightbox upon image switch
function wibAdsShowGalleryOverlay(from, to) {
    wib_ads.close_gallery_overlay();
    wib_ads.reload("22", { "from" : from ? from : 0,
			   "to"   : to });
}

wib_ads = new WibAds();
wib_ads.init();

// Register listener
wib_gallery_paging_slideshow_event.registerCb(wib_ads.reload);

// â END FILE:/templates/v3/javascript/wib-ads.js â
    
// â BEGIN FILE:/templates/v3/javascript/metro-poll.js â

      
function pollVote(poll_component_id, page_path, cookie, form_div, results_div, form_total_p, 
		  results_total_p, clicked_input) {

  if (clicked_input)
    var choice = clicked_input;
  
    if (choice) {
      $.ajax({
      url: page_path,
      type:"GET",
      data: {
        __xsl: '/poll-actions.xsl',
        __toolbar: 0,
        action: 'vote',
        choice: choice,
        poll: poll_component_id,
        v2device:'v3'//for responsive request
      },
      success: function( data ) {
         $("." + form_div).each(function(index,dom_form_div) {
          $(dom_form_div).fadeOut();
        });
        pollUpdate(data, results_div, form_total_p,results_total_p);
      }
    });
    } else
	return false; 
}

function pollLoad(url_path, cookie, form_div, results_div, form_total_p, results_total_p) {
    var client_has_voted = pollClientVoted(cookie);  
    var renderPoll = function(poll) {
      if (client_has_voted || poll.status == "closed") {
          if (poll.status == "open") {
            // Make some guesses about the correct votes to display	      
            poll = doDummyVote(poll, cookie);
          }
          pollUpdate(poll, results_div, form_total_p, results_total_p);
      } else {
        pollUpdate(poll, null, form_total_p, results_total_p);
        $("." + form_div).each(function(index,el) {
              $(el).show();
          });
      }
    };

    $.ajax({
      url: url_path,
      type:"GET",
      
      data: {
        __xsl: '/poll-actions.xsl',
        __toolbar: 0,
        v2device:'v3'//for responsive request
      }
    }).done(function( data ) {
        renderPoll(data, results_div, form_total_p, results_total_p);
    });
}

function pollUpdate(poll, results_div, results_total_p, form_total_p) {
    // These seemingly overkill DOM procedures is about tip-toe:ing around
    // IE8 that crashes if this isn't done exactly the right way. It seems
    // we need to avoid the prototypejs helper functions for modifying the
    // the DOM tree as much as possible:

    if (poll.threshold == "above") {
      $("." + form_total_p).each(function(index,dom_form_total_p) 
      {
	  var form_children = dom_form_total_p.getElementsByTagName("span");
    dom_form_total_p.removeChild(form_children[0]);
	  var span = document.createElement("span");
	  span.innerHTML = poll.total + " " + msg_metro_poll_voted;
	  dom_form_total_p.appendChild(span);
	  dom_form_total_p.style.display = "block";
	});

      $("." + results_total_p).each(function(index,dom_results_total_p) {
	  var results_children = dom_results_total_p.getElementsByTagName("span");
	  dom_results_total_p.removeChild(results_children[0]);
	  var span = document.createElement("span");
	  span.innerHTML = poll.total + " " + msg_metro_poll_voted;
	  dom_results_total_p.appendChild(span);
	  dom_results_total_p.style.display = "block";
	});
    }

    if (results_div) {
      $("." + results_div).each(function(index,dom_results_div) {
	  var result_spans = $(dom_results_div).find('span[class ~= poll-result-percent]');
	  for (var i = 0; i < result_spans.length; i++) {
      if(poll["votes-percent"][i])
      {
        //used here votes-percent instead of votes-bar-percent for correct percentage
        $($(result_spans[i]).siblings()[0]).css({ width : poll["votes-percent"][i] + "%" });
      }
      else
      {
        $($(result_spans[i]).siblings()[0]).hide();
      }
	    result_spans[i].innerHTML = poll["votes-percent"][i] + "%";	    
	  }
	  
	  $(dom_results_div).fadeIn();
	});
    }
}

function pollClientVoted(cookie) {
  if (metroCookie (cookie)) {
    return 1;
  }
  else {
    return 0;
  }
}

function getPollFromCookie(cookie) {
  var cookie_value = metroCookie(cookie);
  var tmp = cookie_value.split("[");
  if (tmp.length != 3)
    return;

  var choice = tmp[1].slice(0, tmp[1].lastIndexOf("]"));
  var total = tmp[2].slice(0, tmp[2].lastIndexOf("]"));

  return { "choice" : parseInt(choice), "total" : parseInt(total) };
}

function doDummyVote(poll, cookie) {  
  var cookie_poll = getPollFromCookie(cookie);
  if (!cookie_poll || cookie_poll.total <= poll.total) {
    return poll; // No need for dummy votes any longer
  }

  // do dummy vote

  poll.votes[cookie_poll.choice - 1]++;
  poll.total++;

  for (i = 0; i < poll["votes-percent"].length; i++) {
    poll["votes-percent"][i] = Math.floor((1.0 * poll.votes[i] / poll.total) * 100.0 + 0.5);
  }

  return poll;
}



// â END FILE:/templates/v3/javascript/metro-poll.js â
    