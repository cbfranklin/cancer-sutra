(function() {
	$(document).ready(function() {
	  
	  var zoneId        = 11033; //Test:1957 - prod:11033
	  var trackevent    = 1;
	  var debug         = 1;
	  var lenGallery    = 5;
	    
	  var inpictureRun  = 0;
          var waitAfterReady= 1; // Si pas d'habillage; dans le cas contraire Galleria.ready s'execute 2 fois

          var attempt       =1;
          var timer         =0;
         
        
	  function init() {
     
     	
			if( $('meta[name=mediatype]').attr("content")=="Gallery" && $("#galleria").length){
				
				if (debug && window.console) window.console.debug("Inpicture: Init - Page Gallery : ");

 				//Check s'il y a un habillage sur le body
        if($('body').css('background-image')!=undefined && $('body').css('background-image')!="none"){
          waitAfterReady = 2; 
					if (debug && window.console) window.console.debug("Inpicture will start after 2nd Galleria.ready  " );
        }
				
				var counterReady  = 1; 
				
				Galleria.ready(function(e){
					if (debug && window.console) window.console.debug("Inpicture: Galleria.ready - counterReady = " + counterReady);
					if( !inpictureRun && counterReady == waitAfterReady ){
				 		
				 		var nbrSlides =  this.getDataLength();				
				 		
				   	if( nbrSlides >=  lenGallery){
				   		
							if (debug && window.console) window.console.debug("Inpicture: Init - Greater 5 pictures : ");
						
							$("body").append("<style>#picstickyads {left: 0; position: absolute;top: 0; z-index: 10000;}</style>");
							$("#galleria").css("position","relative");
							$("#galleria").prepend("<div id='picstickyads'><div id='galadsobj'></div><div id='statusgal' style='top:0;padding:5px;background-color:transparent;position: absolute; color: white;font-family: arial; font-size: 12px;'></div></div>");
							
							$("#picstickyads").click(function(){                                        
							                if (trackevent) dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'StickyAds', 'gtmAction': 'metronews - gallery', 'gtmLabel': 'CLICKED'});
							                                
							                //$.ajax({url : "EASLink="}); //Pour paragon
							});
				      
				                        inpictureRun=1;
                                                        timer=setInterval(inpicture, 1000);

				   	}
						else{
							if (debug && window.console) window.console.debug("Inpicture: Init LEAST 5 pictures - NO REQUEST ");
							if (trackevent) dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'StickyAds', 'gtmAction': 'metronews - gallery', 'gtmLabel': 'NO RUN - SHORTER THAN 5 IMG'});
						}
				   	
				   	counterReady++;
				 	}
				 	else{
				 		if(inpictureRun){
				 			if (debug && window.console) window.console.debug("Inpicture: INIT Try to run again: " + counterReady);
				 		}
				 		counterReady++;                                 
				 	}
				})
			}            
	  }
	
	  function inpicture(element, classe) {
	  
			if (debug && window.console) window.console.debug("Inpicture: ADS Running ");
			try {
				var adsComponent = new com.stickyadstv.AdsComponent({
				               ads:{
												zones:{
												    preroll: zoneId,
												    midroll:"-1",
												    postroll:"-1"
												}
				               }                                               
				}); 
                                clearInterval(timer);                        
			}catch(e){
				if (debug && window.console) window.console.debug("Inpicture: attempt:"+ attempt +" - AdsComponent Error : " + e);
				if(attempt==10){
                                    if (trackevent) dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'StickyAds', 'gtmAction': 'metronews - gallery', 'gtmLabel': 'AD_FAILED'});
                                    clearInterval(timer);
                                }
                                else{
                                    attempt++;
                                }
                                return;
			}
			
			$("#galadsobj").css("width", $("#galleria").width());
			$("#galadsobj").css("height", $("#galleria").height());
			$("#statusgal").css("width", ($("#galleria").width()-10));
			
			var adContainer = document.getElementById("galadsobj");
			var status = document.getElementById("statusgal");
			
			var playingAd = false;
			
			adsComponent.on(com.stickyadstv.AdsComponent.AD_LOADED,function(e){
			               if (debug && window.console) window.console.debug("Inpicture: AD_LOADED ");
			               playingAd = true;
			               $("#galadsobj").css("background", "#000");
			               $("#statusgal").css("background", "#000"); 
			               if (trackevent) dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'StickyAds', 'gtmAction': 'metronews - gallery', 'gtmLabel': 'AD_LOADED'});
			               
			});
			
			adsComponent.on(com.stickyadstv.AdsComponent.LOAD_SUCCEEDED,function(e){
			               if (debug && window.console) window.console.debug("Inpicture: LOAD_SUCCEEDED");
			               adsComponent.onPlayerStateChanged(com.stickyadstv.AdsComponent.PLAYER_PLAY);
			               if (trackevent) dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'StickyAds', 'gtmAction': 'metronews - gallery', 'gtmLabel': 'AD_SUCCEEDED'});
			});          
			
			adsComponent.on(com.stickyadstv.AdsComponent.AD_COMPLETE,function(e){
			               if (debug && window.console) window.console.debug("Inpicture: AD_COMPLETE ");
			               status.innerHTML = "";
			               $("#galadsobj").css("width", "auto");
			               $("#galadsobj").css("height","auto");
			               playingAd = false;
			               if (trackevent) dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'StickyAds', 'gtmAction': 'metronews - gallery', 'gtmLabel': 'AD_COMPLETE'});
			});
			
			adsComponent.on(com.stickyadstv.AdsComponent.NOTIFY_ADS_COMPLETE,function(e){
			               if (debug && window.console) window.console.debug("Inpicture: NOTIFY_ADS_COMPLETE");
			               status.innerHTML = "";
			               $("#galadsobj").css("width", "auto");
			               $("#galadsobj").css("height","auto");
			               $("#statusgal").css("background-color", ""); 
			});
			
			adsComponent.on(com.stickyadstv.AdsComponent.LOAD_FAILED,function(e){
			               if (debug && window.console) window.console.debug("Inpicture: NOTIFY_ADS_COMPLETE");
			               status.innerHTML = "";
			               $("#galadsobj").css("width", "auto");
			               $("#galadsobj").css("height","auto");
			               $("#statusgal").css("background-color", ""); 
			               if (trackevent) dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'StickyAds', 'gtmAction': 'metronews - gallery', 'gtmLabel': 'LOAD_FAILED'});
			});
			
			adsComponent.on(com.stickyadstv.AdsComponent.REQUEST_PLAY,function(e){                  
			               if (debug && window.console) window.console.debug("Inpicture: REQUEST_PLAY:");
			               adsComponent.onPlayerStateChanged(com.stickyadstv.AdsComponent.PLAYER_PLAY);
			});
			
			adsComponent.on(com.stickyadstv.AdsComponent.REQUEST_PAUSE,function(e){
			               if (debug && window.console) window.console.debug("Inpicture: REQUEST_PAUSE");
			               adsComponent.onPlayerStateChanged(com.stickyadstv.AdsComponent.PLAYER_PAUSE);
			});
				
			adsComponent.on(com.stickyadstv.AdsComponent.TIME_REMAINING_UPDATE,function(e){
										if(e.detail.remaining >= 0  ){
			               	status.innerHTML = "Publicit&eacute; - Votre galerie photo dans " +  e.detail.remaining + " secondes.";
			              }else{
			              	if(e.detail.remaining < -5  ){
			              		 status.innerHTML = "";
					               $("#galadsobj").css("width", "auto");
					               $("#galadsobj").css("height","auto");
					               $("#statusgal").css("background-color", ""); 
			              	}
			              }
			});         
			
			adsComponent.play(adContainer);      
	  }
	
		if( $('meta[name=mediatype]').attr("content")=="Gallery" && $("#galleria").length){
		  var s    = document.createElement("script");
			s.type   = "text/javascript";
			s.src    = "http://cdn.stickyadstv.com/mustang/mustang.min.js";
			s.async  = false;
			s.onload = init();
								
			document.getElementsByTagName('head')[0].appendChild(s);
		}
	});
                
})();



