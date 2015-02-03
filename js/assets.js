//SHOW POSITION USING OVERLAY

function showPosition(){
    var content = $overlayContent.html();
    Odelay.open(content);
};

//OVERLAY

var Odelay = {
    'open': function(content){
        var close = '<div id="close">&#215;</div>';
        $overlay.html(content+close).addClass('open');
        $wrapper.addClass('overlay-open');
        $body.addClass('noscroll');

        $overlay.on('click','#close',function(){
            Odelay.close()
        });

        Mousetrap.bind('esc', function() {
            Odelay.close();
        });
        $wrapper.on('click',function(){
            Nav.close();
        });
    },
    'close': function(){

        $overlay.removeClass('open');
        $wrapper.removeClass('overlay-open');
        $body.removeClass('noscroll');
        $positions.find('> div').removeClass('active');
        Mousetrap.unbind('esc');
        if(window.location.hash.indexOf('#/positions/') > -1){
            if(Modernizr.history){
                history.pushState({}, '', '#/positions');
            }
            else{
                window.location.href = '#/positions';
            }
        }
         $wrapper.off('click');
    },
    'isOpen': function(){
        if($overlay.hasClass('open')){
            return true;
        }
        else{
            return false;
        }
    }
}

//TOOGLE NAVIGATION
var Nav = {
    'toggle': function(){
        var $that = $('.menu-toggle');
        if(!$that.hasClass('active')){
            $('nav').addClass('open')
            if($(window).width() < 480){
                window.scrollTo(0, 0);
            }
        }
        else{
            $('nav').removeClass('open')
            //$('nav').hide();
        }
        setTimeout(function(){
            $that.toggleClass('active');
        },250)
    },
    'close': function(){
        var $that = $('.menu-toggle');
        $('nav').removeClass('open');
        $that.removeClass('active');
    },
    'open': function(){
        var $that = $('.menu-toggle');
        $('nav').addClass('open')
        if($(window).width() < 480){
            window.scrollTo(0, 0);
        }
        $that.addClass('active');
    }
}

//ABOUT CONTENT HEIGHT FOR SVG BGS
function setAboutHeights(){
    console.log(window.innerHeight)
    $('#about .row').css('height',window.innerHeight - 45);
}

//ANIMATION
function animateThisSVG(obj,name){
    //console.log(obj[name].topLevelSelector)
    var container = Snap.select(obj[name].topLevelSelector);
    var animatedEls = obj[name].animatedEls;

    for(i in animatedEls){
        //console.log(animatedEls[i].selector)

        var el = container.select(animatedEls[i].selector);

        for(j in animatedEls[i].states){

            var state = animatedEls[i].states[j];

            function animate(el,state){
                //console.log(el)
                el.animate({d:state.d},state.time,state.easing);
            }

            setTimeout(animate, state.delay, el,state);
        }
    }
}

//SCROLL TO ANCHOR
jQuery.fn.extend({
    scrollToAnchor: function(theOffset, theTime) {
        var theSelector = this;
        if (!theTime) {
            var theTime = 500
        }
        if (!theOffset) {
            var theOffset = 0;
        }
        $('html,body').animate({
            scrollTop: theSelector.offset().top - 45
        }, theTime);
    }
});

//FILTERS

function filters($obj){
    Odelay.close();
    if($obj.data('toggle') === 'off'){
        //only one cancer type at a time
        if($obj.data('filter-type') === 'cancer-type'){
            $('[data-filter-type="cancer-type"] a').data('toggle','off').attr('data-toggle','off');

            var cancerType = $obj.data('filter');
            $('#chapters > div,#support-the-cause > div').removeClass('open');
            $('#chapters [data-cancer-type='+cancerType+'],#support-the-cause [data-cancer-type='+cancerType+']').addClass('open');
            window.scrollTo(0, 0);
        }
        $obj.data('toggle','on').attr('data-toggle','on')
    }
    else{
        $obj.data('toggle','off').attr('data-toggle','off');
        if($obj.data('filter-type') === 'cancer-type'){
            $('#chapters > div').removeClass('open').children().removeClass('open');
            window.scrollTo(0, 0);
        }
    }

    //CANCER TYPE
    var cancerTypeArray = []
    $('[data-filter-type="cancer-type"] a').each(function(){
        if($(this).data('toggle') === 'on'){
            var filterValue = $(this).data('filter')
            cancerTypeArray.push(['[data-cancer-type="'+filterValue+'"]']);
        }
    });
    var cancerType = cancerTypeArray.join(',');
    var $cancerType = $(cancerType);

    //PARTNERSHIP
    var partnershipArray = []
    $('[data-filter-type="partnership"] a').each(function(){
        if($(this).data('toggle') === 'on'){
            var filterValue = $(this).data('filter')
            partnershipArray.push(['[data-partnership="'+filterValue+'"]']);
        }
    });
    var partnership = partnershipArray.join(',');
    var $partnership = $(partnership);

    if($cancerType.length > 0 && $partnership.length > 0){
        var $theFilter = $cancerType.filter($partnership);
    }
    else if($cancerType.length > 0 && $partnership.length == 0){
        var $theFilter = $cancerType;
    }
    else if($cancerType.length == 0 && $partnership.length > 0){
        //console.log('ITS SINGLE: PARTNERSHIP')
        var $theFilter = $partnership;
    }
    else{
        var $theFilter = '';
    }

    $positions.isotope({ filter: $theFilter });
}

//DELAY
var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();