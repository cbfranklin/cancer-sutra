

// REFRESH PAGE EVERY 5minutes  -------------------------------------

(function(){
	
	var refreshPeriod = 300; // 300 Seconds
	
	function refresh()
	{
	   document.cookie = 'scrollTop=' + filterScrollTop();
	   document.cookie = 'scrollLeft=' + filterScrollLeft();
	   document.location.reload(true);
	}
	
	function getCookie(name)
	{
	   var start = document.cookie.indexOf(name + "=");
	   var len = start + name.length + 1;
	
	   if(((!start) && (name != document.cookie.substring(0, name.length))) || start == -1)
	      return null;
	
	   var end = document.cookie.indexOf(";", len);
	
	   if(end == -1)
	      end = document.cookie.length;
	
	   return unescape(document.cookie.substring(len, end));
	}
	
	function deleteCookie(name)
	{
	   document.cookie = name + "=" + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
	}
	
	function setupRefresh()
	{
	   var scrollTop = getCookie("scrollTop");
	   var scrollLeft = getCookie("scrollLeft");
	
	   if (!isNaN(scrollTop))
	   {
	      document.body.scrollTop = scrollTop;
	      document.documentElement.scrollTop = scrollTop;
	   }
	
	   if (!isNaN(scrollLeft))
	   {
	      document.body.scrollLeft = scrollLeft;
	      document.documentElement.scrollLeft = scrollLeft;
	   }
	
	   deleteCookie("scrollTop");
	   deleteCookie("scrollLeft");
		
		setTimeout(function(){
		  refresh();
		}, refreshPeriod * 1000);
	}
	
	function filterResults(win, docEl, body)
	{
	   var result = win ? win : 0;
	
	   if (docEl && (!result || (result > docEl)))
	      result = docEl;
	
	   return body && (!result || (result > body)) ? body : result;
	}
	
	function filterScrollTop()
	{
	   var win = window.pageYOffset ? window.pageYOffset : 0;
	   var docEl = document.documentElement ? document.documentElement.scrollTop : 0;
	   var body = document.body ? document.body.scrollTop : 0;
	   return filterResults(win, docEl, body);
	}
	
	function filterScrollLeft()
	{
	   var win = window.pageXOffset ? window.pageXOffset : 0;
	   var docEl = document.documentElement ? document.documentElement.scrollLeft : 0;
	   var body = document.body ? document.body.scrollLeft : 0;
	   return filterResults(win, docEl, body);
	}
	
	var sPath = window.location.pathname;
	var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
	
	if ((sPath=="/")){
		setupRefresh();
	}
		
})();



// --------- Custom article tools - SHARE-TOOLSBAR -----------------

var disqus_shortname = 'metrofrance';

(function(){

	if ((window.location.pathname !=="/" && $('meta[name=mediatype]').attr("content")!="undefined" )){
	
		// --------- article-box-fact  ---------------------------------------
		if ($('.article-box-fact').length) {
			var artbox = $('.article-box-fact').html();
			$('.article-box-fact').remove();
			$('.article-body').append(artbox);
		}
	
		// --------- Switch Title and date created position -------------------
		
		var datetext =  $("#date-fullwidth");
		datetext.before($("#date-fullwidth + h1.title"));
		$('#date-fullwidth').show();
			
	
		// --------- Add Share tools on signature ------------------------------
		
		shareContent='<span class="text" style="display: block;">Partagez l\'article</span><div class="addthis_toolbox"><div class="custom_images"><a class="addthis_button_facebook"><span id="header-facebook-unam" class="ir"></span></a><a class="addthis_button_twitter"><span id="header-twitter-unam" class="ir"></span></a><a class="addthis_button_google_plusone_share"><span id="header-google-plus-unam" class="ir"></span></a><a class="addthis_button_email"><img id="header-mail-unam" src="http://www.addthis.com/cms-content/images/gallery/social_email_32.png"></a></div></div>';
		
		$(".article-full-width .share-tools").html(shareContent);	
		$(".article-full-width .share-tools").css('display', 'block');
		
	
		
		// --------- On click comment button - Scroll to disqus area ------------------------
		
		$('body').on('click', '#comment_button', function() {
		     $("body, html").animate({ scrollTop: $("#disqus_thread").offset().top },2000);
	             return false;
	  });
	  
		
		
		
		// --------- Create ShareTools + count on left article --------------------------
		
		var htmltxt =	'<div id="metro_sharetools">'
		
									+	'<div class="sharebutton">'
								  + 	'<a href="https://www.facebook.com/sharer/sharer.php?u='+window.location +'" onclick="javascript:window.open(this.href, \'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600\');return false;">'
									+			'<div id="facebook_like_button_holder">'
									+   		'<div id="facebook_button"></div>'
									+			'</div>'	
									+ 	'</a>'
									+		'<div id="facebook_count"></div>'	
									+	'</div>'
								
									+	'<div class="sharebutton">'		
									+		'<a target="_blank" href="https://twitter.com/intent/tweet?url='+encodeURIComponent(window.location) +'&amp;text='+ encodeURIComponent( $('title').text() ) + '&amp;via=metronews">'
									+			'<div id="tweeter_button"></div>'
									+			'<div id="tweeter_count"></div>'	
									+ 	'</a>'
									+	'</div>'
									
									+	'<div class="sharebutton">'		
									+		'<div id="comment_button"></div>'
									+		'<div id="comment_count">0</div>'	
									+	'</div>'
									
									+	'<div class="sharebutton">'		
								        +		'<a target="_blank" href="https://plus.google.com/share?url='+window.location +'" onclick="javascript:window.open(this.href, \'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600\');return false;">'
									+			'<div id="ggplus_button"></div>'
									+			'<div id="google_count"></div>'	
									+		'</a>'
									+	'</div>'
									+	'<div class="sharebutton">'		
								        +		'<a href="mailto:?subject=' + document.title + '&body='+window.location+'">'
									+     '<div id="mail_button"><div id="mail_button"><img src="http://www.addthis.com/cms-content/images/gallery/social_email_32.png" style="width: 34px; height: 25px"></div></div>'
									+		'</a>'
									+	'</div>'
								+'</div>';
	
		$(".share-tools-top").html("");
		$(".share-tools-top").html(htmltxt);
		
	
	  var f_page = window.location.protocol +"//"+ window.location.host+ window.location.pathname;
	  
	  // Count like
		jQuery.getJSON('https://graph.facebook.com/'+f_page+'?callback=?', function(data) {
		    if (typeof data.shares === "undefined") {
		        $('#facebook_count').html('0'); 
		    }
		    else
		       $('#facebook_count').html(data.shares); 
		});
		
		
		// Count tweet
		jQuery.getJSON("http://urls.api.twitter.com/1/urls/count.json?url="+f_page+"&callback=?", function(data) {
			$('#tweeter_count').html(data.count);
		});
	
		// Count comment
		var disqus_shortname = 'metrofrance';
			
		var published_time = $("meta[property='article:published_time']").attr("content");
		var reg=new RegExp("[T,Z]", "g");
		published_time=published_time.split(reg)[0].replace(/-/g,"/");
		
		url = window.location.pathname;
		
		url = url.split( '/' );
		url = url[url.length-2]
		url = url.split('!');
		var identifier = "/x/metro/" + published_time + "/" + url[1]+"/index.xml";
		
		
		/* * * DON'T EDIT BELOW THIS LINE * * */
		(function () {
		  var s = document.createElement('script'); s.async = true;
		  s.type = 'text/javascript';
		  s.src = '//' + disqus_shortname + '.disqus.com/count.js';
		  (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
		}());
		
		$("#comment_count").html("<a data-disqus-identifier=" + identifier + "></a>");
	         
	  // END COMMENT
	
		// count gplus
		var po = document.createElement('script'); po.type = 'text/javascript'; 
		po.async = true;
		po.src = 'https://apis.google.com/js/client.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
		po.onload = function () {
		  var f_page = window.location.href;
		  var params = {
		      nolog: true,
		      id: f_page,
		      source: "widget",
		      userId: "@viewer",
		      groupId: "@self"
		    };
		  window.setTimeout(function () {
		    try {
		      gapi.client.rpcRequest('pos.plusones.get', 'v1', params).execute(function(resp) {
		        $('#google_count').html(resp.metadata.globalCounts.count)
		      });
		    } 
		    catch (e){}
		  }, 1000)
		}
		
		$('.share-tools-top').show(); 
		
		
		
		// --------- Fix ShareTools when window scroll ---------------------------------------
		
		var limit =  $( ".article-top" ).offset().top;
	  var bottomlimit = $( ".article-1-col-left" ).offset().top - 230 ;
	
		var shareScrollEvent = function() {
			var height = $(window).scrollTop();
		  if( height > limit &&  height < bottomlimit  ){
		      $('#metro_sharetools').addClass( "fixedsharetools" );
		  }
		  else{
		      $('#metro_sharetools').removeClass( "fixedsharetools" );
		  }
		}
		
		$(document).bind('scroll',shareScrollEvent);
	
		
	}
	
})();	
	
	
	
// Track Event Click Top Menu  ----------------------------------------



$(document).ready(function(){
	if (window.location.pathname !=="/" && $('meta[name=mediatype]').attr("content")!="undefined" && $(".byline .name > a").length ){
	    if ( ($(".byline .name > a").attr("href")).indexOf("http") == -1  ){
	    
	        $(".byline .name > a").attr("href","")
	
	    }
	}
});
 
	
	
// --------- OUTBRAIN --------------------------------------------------
document.write("<scr" + "ipt type='text/javascript' language='JavaScript' src='http://widgets.outbrain.com/outbrain.js'>&nbsp;</scr" + "ipt>\n");                         

//(function(){

  //if ($("#outbrain-areamet").length)
  //		return false;
		
	if (window.location.pathname !=="/" && $('.aside').length){
		// Remove middle col content
		//$(".aside").html("");
		$(".aside").show();
	
	  // Insert outbrain on top
		var pagelink = document.URL;
		var widgetId = "AR_1";	
		
		if (window.matchMedia("(min-width: 1200px)").matches ){
	    if (window.console) window.console.debug("Outbrain: AR_1 - aside");
	    widgetId = "AR_1";
		}	

		if ( $('body.takeover-netbook').length ) {
			if (window.console) window.console.debug("Outbrain: takeover AR_2 - hoz 2 line");
    	widgetId = "AR_2";
		}
		
		if (window.matchMedia("(max-width: 1199px)").matches ){
			if (window.console) window.console.debug("Outbrain: AR_2 - hoz 2 line");
    	widgetId = "AR_2";
		}

		if ( window.matchMedia("(max-width: 980px)").matches ){
    	if (window.console) window.console.debug("Outbrain: AR_3 - vert 2 col");
    	widgetId = "AR_3";
          $("body").after("<style>#outbrain-areamet .ob-blkmet{width:100%} #outbrain-areamet a.obrecmet{padding:15px 5px}</style>");
		}


		
		var request_data = {permalink: pagelink, widgetId: widgetId };
		
		var outbrain_callback = function(json){
			
			var html='<div id="outbrain-areamet">'
							+' <div><h4 class="keyline">nous vous recommandons</h4></div>'
							+' <div class="ob-blkmet">'
							+'    <div class="onmetro sourceTitle" style="display:none">SUR METRONEWS</div>'
							+' </div>'
							+' <div class="ob-blkmet">'
							+'    <div class="onweb sourceTitle" style="display:none">AILLEURS SUR LE WEB</div>'
							+' </div>'
							+'<div class="ob_what">'
							+'	<a href="#" onmousedown="" onclick="OBR.extern.callWhatIs(\'http://www.outbrain.com/what-is/default/fr\',\'\',-1,-1,true ,null);return false">'
							+'		Recommand&eacute; par<span class="ob_amelia" title="Outbrain"></span>'
							+'	</a>'
							+'</div>'
							+'</div>';
			
		
			
			
			$('.aside').prepend(html);
			
	    // Execute au chargement de la page
		  responsiveOutbrain(); 
					
			$.each(json.doc,function(index,value){
				
				var pictextlnk="";
				var source_name="";
				var wtarget ="_self";
				
				if(value.same_source=="false"){
					pictextlnk = '<img style="margin-bottom: 0px; padding-left: 10px;" valign="bottom" src="/templates/v3/img/global/extlnk-met.png" />';
					source_name = "("+value.source_name+")";
					wtarget = "_blank";
				}
					
				rec = '<a rel="" target="'+wtarget+'" onmousedown="outbrain.recClicked(event,this);" data-redirect="'+value.url+'" href="'+value.orig_url+'" class="obrecmet samesrc_'+value.same_source+'">'
					    +	'<div>'
					    +    '<div>'
					    +			'<img width="'+value.thumbnail.width+'" height="'+value.thumbnail.height+'" onerror="outbrain.imageError(this)" src="'+value.thumbnail.url+'" alt="'+value.content+'" class="strip-img" title="'+value.content +'" onload="this.style.visibility=\'\'" style="">'
					   	+		'</div>'
						 	+		'<div class="ob-text-content">'
					    +  		'<div class="link-title">'+value.content+'</div>'
					    +  		'<div class="info-src">'+source_name+""+ pictextlnk +'</div>'
					    +  	'</div>'
					    +	'</div>'
							+'</a>';
				
				if(value.same_source=="true"){
					$('#outbrain-areamet .onmetro').css("display","");
		 			$('#outbrain-areamet .onmetro').after(rec);	
		 		}
		 		else{
		 			$('#outbrain-areamet .onweb').css("display","");
		 			$('#outbrain-areamet .onweb').after(rec);	
		 		}
			});
		};

		OBR.extern.callRecs(request_data, outbrain_callback);

		// --------- Switch outbrain on responsive near signature ---------------------------------------
		
		function responsiveOutbrain() {
		    if (window.matchMedia("(max-width: 1199px)").matches || window.matchMedia("(max-width: 980px)").matches || $('body.takeover-netbook').length )   {		      
					if( $("#mb_container").length ){					
					   if( $("#outbrain-areamet").prev().attr("id") != "mb_container" )
					        $("#mb_container").after( $("#outbrain-areamet"));	    					
					}
					else if( $("#ultimedia_wrapper").length ){					
					    if ( $("#outbrain-areamet").prev().attr("id") != "ultimedia_wrapper" )   
						   $("#ultimedia_wrapper").after( $("#outbrain-areamet"));						
					}					  
					else  if( ( $("#outbrain-areamet").prev().attr("class") != "fact-related-box" )  ) {					
					    $(".fact-related-box").after( $("#outbrain-areamet"));						
					}      		    			    	
		    } else {
		         $(".aside").prepend($("#outbrain-areamet"));
		    }
		}
	
		// Windows add listener
		window.addEventListener('resize', responsiveOutbrain, false);
	
	}	


//})()


// --------- MEDIABONG --------------------------------------------------	
(function(){
	
	if (window.location.pathname !=="/" && $('meta[name=mediatype]').attr("content")!="undefined" ){
	  	
	    
		$(".fact-related-box").after("<div id='mb_container' style='margin:20px 0 40px 0px;clear: both;'></div>");

		var ad_src = 'http://player.mediabong.com/se/457.js?url='+encodeURIComponent(document.URL)+'&cat='+ $('meta[property="article:section"]').attr("content")  +'&date='+ $('meta[property="article:modified_time"]').attr("content").substr(0,10).replace(/-/g,"") + '&page=549';
		document.write("<scr" + "ipt type='text/javascript' language='JavaScript' src='" + ad_src + "'>&nbsp;</scr" + "ipt>\n");                         
	
	}
	
})()


// --------- Google Analytics event tracking  --------------------------------------------------	

$(document).ready(function() {
	$('#header-links a').click(function() {
		dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'HeaderLink', 'gtmAction': 'Header Link Click', 'gtmLabel': $(this).attr('href')});
	}); 
	$('#social-links a').click(function() {
		dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'SocialLink', 'gtmAction': 'Social Link Click', 'gtmLabel': $(this).attr('href')});
	}); 
	$('#footer-extra a').click(function() {
		dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'FooterNavLink', 'gtmAction': 'Footer NavLink Click', 'gtmLabel': $(this).attr('href')});
	}); 
	$('#footer a').click(function() {
		dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'FooterLink', 'gtmAction': 'Footer Link Click', 'gtmLabel': $(this).attr('href')});
	}); 
	$('#promos a').click(function() {
		dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'PromoLink', 'gtmAction': 'Promo Link Click', 'gtmLabel': $(this).attr('href')});
	}); 
	$('#topicmfp a').click(function() {
		dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'TopicBarLink', 'gtmAction': 'TopicBarLink Click', 'gtmLabel': $(this).attr('href')});
	});
	$('#menu-navigation a').click(function() {
		dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'SuperNav', 'gtmAction': 'SuperNavLink Click', 'gtmLabel': $(this).attr('href')});
	});
	$('#menu-button').click(function() {
		dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'SuperNav', 'gtmAction': 'SuperNav Button ', 'gtmLabel': 'Open SuperMenu'});
	});
	$('#close-button').click(function() {
		dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'SuperNav', 'gtmAction': 'SuperNav Button ', 'gtmLabel': 'Close SuperMenu'});
	});      
});



// --------- make facebook comment box to fit  --------------------------------------------------	

$( document ).ready(function() {
	// ON PAGE LOAD
	setTimeout(function(){
	  resizeFacebookComments();
	}, 1000);
	
	// ON PAGE RESIZE
	$(window).on('resize', function(){
	  resizeFacebookComments();
	});
	
	function resizeFacebookComments(){
	      if( $('.fb-comments iframe').length){
	      var src = $('.fb-comments iframe').attr('src').split('width='),
	      width = $('#comments').width();
	       $('.fb-comments iframe').attr('src', src[0] + 'width=' + width);
	     }
	}

});

// ----------- bug #38 --------------------------------------------------	

try {
$(document).on('load', setTimeout(responsiveOutbrain, 1000));
$(document).on('load', setTimeout(responsiveOutbrain, 2000));
$(document).on('load', setTimeout(responsiveOutbrain, 3000));
} catch (e) {
}


// ----------- cookie-acceptation-popup --------------------------------------------------	

(function(){

	var divhtml = '<div id="cookie-acceptation-popup" style="box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2) ; background-color:  #F7F6DE; position: fixed; width: 100%; border-bottom: 1px solid #eee; top: 0px;left: 0px;color: #4F4F4F ;padding: 2px 15px 3px;text-align: center;z-index: 15; visibility:hidden;">En naviguant sur notre site, vous acceptez que des cookies soient utilisés pour vous proposer des contenus et services adaptés à vos centres d?intérêts. <a href="http://www.metronews.fr/mentions-legales/politique-relative-aux-cookies-sur-les-services-edites-par-metronews/mnet!Jvg5ITVcy9jV/" style="color:#00853f; background-color:white; border:1px solid #00853f; border-radius: 5px; padding: 2px 5px 2px 5px;">En savoir plus</a><button id="confirm-cookie-policy" style="margin-left: 3px;color:white; background-color: #00853f; border-radius: 5px; padding: 2px 5px 2px 5px; border:1px solid #00853f;">j\'ai compris</button></div>'

  $('body').append(divhtml);
  	    
	$(document).on('ready', function () {
	  if (getCookie('cookie-acceptation-policy') != 'accepted') {
	  	$('#wrapper').css('margin', '53px auto 0');
	  	$('#cookie-acceptation-popup').css('visibility', 'visible').fadeIn();
	  	$(document).on('click', 'a', function () {setCookie('cookie-acceptation-policy', 'accepted', 365);});
	  	$('#confirm-cookie-policy').on('click', function () {
	  		if ($('#cookie-acceptation-popup').length) {
					$('#cookie-acceptation-popup').fadeOut().remove();
		    	$('#wrapper').css('margin', '0px auto 0');
				}
	  		setCookie('cookie-acceptation-policy', 'accepted', 365);
	  	})
	  }
	})

})()


// ----------- ADBLOCK DETECTION  --------------------------------------------------	

$(document).on('ready', function () {
	if (!($('#ad12_expander *:not(script)').length > 1) && !($('#adadcomp-2_expander *:not(script)').length > 1)) {
		 dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'Adblocks', 'gtmAction': 'true', 'gtmLabel': ''}) 
	} else {
		dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'Adblocks', 'gtmAction': 'false', 'gtmLabel': ''}) 
	} 
})



// ----------- COOKIE..??  --------------------------------------------------	

// Cette fonction doit etre accessible au ready car elle est utilisee pour le capping
// par les jeux
$(document).ready(function(){

  window.setCookie = function(c_name,value,exdays){
	  var exdate=new Date();
	  exdate.setDate(exdate.getDate() + exdays);
	  var c_value=escape(value) + ((exdays==null) ? "" : ("; expires="+exdate.toUTCString()));
	  document.cookie=c_name + "=" + c_value;
	}

  window.getCookie = function(c_name){
	 var i,x,y,ARRcookies=document.cookie.split(";");
	 for (i=0;i<ARRcookies.length;i++)
	 {
	  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
	  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
	  x=x.replace(/^\s+|\s+$/g,"");
	  if (x==c_name)
	     return unescape(y);
	 }
	}
	
})