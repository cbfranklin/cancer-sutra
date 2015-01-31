//DELAY
var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

//SHOW POSITION CSS3
function showPosition(){
    var content = $overlayContent.html();
    Odelay.open(content);
};

//ODELAY
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
    },
    'close': function(){

        $overlay.removeClass('open');
        $wrapper.removeClass('overlay-open');
        $body.removeClass('noscroll');
        $positions.find('> div').removeClass('active');
        Mousetrap.unbind('esc');

        if(Modernizr.history){
            history.pushState({}, '', '#/positions');
        }
        else{
            window.location.href = '#/positions';
        }
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

//ABOUT CONTENT HEIGHT FOR SVG BGS
function setAboutHeights(){
    if(window.innerWidth > 767){
        /*$('#about .row').css('height',window.innerWidth/2 - 75);*/
        $('#about .row').css('height',$(window).width()/2 - 75);
    }
    else{
        /*$('#about .row').css('height',window.innerHeight - 75);*/
        $('#about .row').css('height',$(window).height() - 75);
    }
}
function openCloseNav(){
    var $that = $('.menu-toggle');
    if(!$that.hasClass('active')){
        $('nav').addClass('open')
        if($(window).width() < 480){
            window.scrollTo(0, 0);
            console.log('hi')
        }
        //$('nav').show();
    }
    else{
        $('nav').removeClass('open')
        //$('nav').hide();
    }
    setTimeout(function(){
        $that.toggleClass('active');
    },250)
}

//ANIMATION
function animateThisSVG(name){
    var container = Snap.select(animations[name].topLevelSelector);
    var animatedEls = animations[name].animatedEls;

    for(i in animatedEls){
        console.log(animatedEls[i].selector)

        var el = container.select(animatedEls[i].selector);

        for(j in animatedEls[i].states){

            var state = animatedEls[i].states[j];

            function animate(el,state){
                console.log(el)
                el.animate({d:state.d},state.time,state.easing);
            }

            setTimeout(animate, state.delay, el,state);
        }
    }
}