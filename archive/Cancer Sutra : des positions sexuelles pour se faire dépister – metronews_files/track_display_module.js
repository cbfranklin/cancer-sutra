(function(){
    
    function checkModule(el) {

       if(el.length==0){
           return "empty"
        } 
        
       var debug = false
       var $elem = el
       var $window = $(window)

       var $wrapperWidth = $('#wrapper').width() 

       var docViewTop = $window.scrollTop()
       var docViewBottom = docViewTop + $window.height()    

       var elemTop = $elem.offset().top
       var elemBottom = elemTop + $elem.height()

        if (elemTop < docViewTop && elemBottom > docViewBottom){
            
            return "displayed"             
        }
        else if(  (elemTop < docViewTop && elemBottom > docViewTop && elemBottom <docViewBottom)  ){
            
            return "completed"
        }
        else if (elemTop > docViewTop && elemTop < docViewBottom && elemBottom > docViewBottom){
            
            return "displayed"
        }
        else if (elemTop > docViewTop && elemBottom < docViewBottom){
           
            return "completed"
        }
        else{
            return "not visible"
        }
    }

    
    function watchModule(modulename, el){
        
       var ref =   'scroll.'+ modulename
       var trackevent_moreinfo_displayed = false
       var trackevent_moreinfo_completed = false
       var isdisplayed = false
       
       var $wrapperWidth = $('#wrapper').width()
       var screen
       switch( $wrapperWidth ){
           case 1200: screen="large";  break;
           case 981:  screen="medium"; break;
           case 762:  screen="small";  break;     
       }
        
       $(document).bind( ref , function(event){
            var debug         = false
            var rep           = checkModule(el)     
            var $wrapperWidth = $('#wrapper').width() 
            
            if(rep=="displayed" && isdisplayed==false){
                isdisplayed = true
                dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'Affichage module', 'gtmAction': modulename, 'gtmLabel': screen +"_"+modulename+"_displayed"});
                if(debug) console.log("SEND : AFFICHAGE    -   " + modulename + '  -  ' + screen +"_"+modulename+"_displayed" )            
            }
            if(rep=="completed" && trackevent_moreinfo_completed==false){
                dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'Affichage module', 'gtmAction': modulename, 'gtmLabel': screen +"_"+modulename+"_completed"});
                if(debug) console.log("SEND : AFFICHAGE    -   " + modulename + '  -  ' + screen +"_"+modulename+"_completed" )
                $(this).unbind(ref)
            }
            if(rep=="empty"){
                if(debug) console.log("remove bind not exist " + modulename)
                $(this).unbind(ref)
            }
        })
 
    }
   
    
    
   watchModule( "plusdinfo", $(".fact-related-box"))          // PLUS D'INFO
   
   if($('#outbrain-areamet').is(':visible'))
      watchModule( "outbrain", $('#outbrain-areamet'))          // OUTBRAIN Outbrain AR_1 AR_2 AR_3
   
      watchModule( "widget-ligue1-page", $('#dashboard'))       // Widget Sport Ligue 1 Page
   
   if(window.location.pathname.indexOf('/sport/')==0 && window.location.pathname!='/sport/') 
     watchModule( "widget-ligue1-menu", $('#modligue1'))       // Module Menu ligue 1 
 
   if ( !$('#mb_container').is(':empty') )  
      watchModule( "mediabong", $('#mb_container') )            // Vidéos à voir sur le web
  
   if($('#ligatus-ad').is(':visible'))
       watchModule( "ligatus", $('#ligatus-ad') )                // Ligatus
       
    watchModule( "disqus", $('#comments') )                   // Disqus


   
                                      
})()

