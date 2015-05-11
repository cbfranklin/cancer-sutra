(function() {
	
	/* ----------------------------------------
		Paco Info: Only apply on mediatype:Article 
		Ignore article with twitter/video embedded iframe
		
		var debug   	 = 1;  Debug info console
		var trackevent   = 1;  Send Track event on Google analytic
		var zoneID 	 = 11255; //1957 - 11255 Prod
		var lenBody 	 = 700; Len min body text to set IntextRoll
		----------------------------------------
	*/

	$(document).ready(function() {
		if ((window.location.pathname !=="/") && ($('meta[name=mediatype]').attr("content") !=undefined ) && ($('meta[name=mediatype]').attr("content").search(/Article/i) > -1 ) && $(".article-body").length ){
			
			var debug   	 = 1;
			var trackevent   = 1;
			var zoneID 	 = 11255;
			var lenBody 	 = 700;
	
			// Ignore article with iframe embedded (twitter youtube...)
			if($('.body-area iframe').length==0){
				
				var len = $(".article-body p").length; 	
				var height_bodytxt =  $(".body-area").height();

				// Article length checking
				if(height_bodytxt>= lenBody) {
				
					if (debug && window.console) window.console.debug("IntextRoll - INIT ");
					
					// Init aera ads display
					var posads = Math.floor(len/2);
					$('.article-body p:eq('+posads+')').before('<div id="stickytxtmetroad"><p></p></div>');
					
					
					$("#stickytxtmetroad").click(function(){
						if (debug && window.console) window.console.debug("IntextRoll - AD_CLICKED");
						//Ignore paragon track, replace by google trackevent
						//$.ajax({url : "EASLink="});
					 	if (trackevent){
					 		dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'StickyAds', 'gtmAction': 'metronews - inTextroll', 'gtmLabel': 'AD_CLICKED'});
					 	}
					});

						
					// Load PrimeTime - IntextRoll
					var s   = document.createElement("script");
					s.type  = "text/javascript";
					s.async = false; 
					s.src   = "http://cdn.stickyadstv.com/prime-time/intext-roll.min.js?zone="+zoneID+"&lang=fr&logo=false&content-id=stickytxtmetroad&auto=true";   
					s.onload = callbackCheck();
					document.getElementsByTagName('head')[0].appendChild(s);        
						

				}
				else{
					if (debug && window.console) window.console.debug("IntextRoll - SHORT_ARTICLE");
					
					if (trackevent){						
						dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'StickyAds', 'gtmAction': 'metronews - inTextroll', 'gtmLabel': 'SHORT_ARTICLE'});
					}
				}
			}
			else{
				if (debug && window.console) window.console.debug("IntextRoll - AD_PASS_BY");
				if (trackevent){
					dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'StickyAds', 'gtmAction': 'metronews - inTextroll', 'gtmLabel': 'AD_PASS_BY'});
				}
			}
		}
		
		
		function callbackCheck () {
			
			if (debug && window.console) window.console.debug("IntextRoll - AD_REQUEST_SEND" );
			if (trackevent){
				dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'StickyAds', 'gtmAction': 'metronews - inTextroll', 'gtmLabel': 'AD_REQUEST_SEND'});
			}
		
			// Au scroll on declenche le check du player
			var inTextPageScrollEvent = function() {

				if (debug && window.console) window.console.debug("IntextRoll - AD_REQUEST_AFTER_SCROLL" );
				if (trackevent){
					dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'StickyAds', 'gtmAction': 'metronews - inTextroll', 'gtmLabel': 'AD_REQUEST_AFTER_SCROLL'});
				}
			
				adsloaded		 = false;
				adsCrossed   = false;
				i=0;
				detected=0;
				
				var timer = setInterval(function(){
			
					
					//if (debug && window.console) window.console.debug("IntextRoll -  AD_LOAD checking:"+i);
					var objSwf = $("#stickytxtmetroad").find('object');
					if(objSwf.length > 0){
						detected++;
						if(detected==3){
							adsloaded = true;
							if (debug && window.console) window.console.debug("IntextRoll - AD_LOADED");
							if (trackevent){
								dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'StickyAds', 'gtmAction': 'metronews - inTextroll', 'gtmLabel': 'AD_LOADED - Ready to play'});
							}							
							clearInterval(timer);
						}
					}
					i++;
				},1000);
				
				$(window).on('beforeunload', function() {
					if(!adsloaded && adsCrossed){
						if (debug && window.console) window.console.debug("IntextRoll - AD_EMPTY");
						if (trackevent){
							dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'StickyAds', 'gtmAction': 'metronews - inTextroll', 'gtmLabel': 'AD_EMPTY'});
						}	 
					}	
					else if(!adsloaded && !adsCrossed){
						if (debug && window.console) window.console.debug("IntextRoll - NOSCROLL_ENOUGHT");
						if (trackevent){
							dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'StickyAds', 'gtmAction': 'metronews - inTextroll', 'gtmLabel': 'NOSCROLL_ENOUGHT'});
						}
					}
				});
			
				$(document).unbind('scroll',inTextPageScrollEvent);
				
				d = document.getElementById("stickytxtmetroad");
				topPos = d.offsetTop;
				
				$(window).bind('scroll',function(){
					if($(window).height() + window.pageYOffset  >=  topPos){
						adsCrossed = true;
						$(document).unbind('scroll',inTextPageScrollEvent);
					}
				})				
			}
			$(document).bind('scroll',inTextPageScrollEvent);
		}
	});
	
})();
