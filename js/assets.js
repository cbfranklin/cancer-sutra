//SHOW POSITION USING OVERLAY

function showPosition(){
    var content = $overlayContent[0].outerHTML;
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
    'close': function(refresh){

        $overlay.removeClass('open');
        $wrapper.removeClass('overlay-open');
        $body.removeClass('noscroll');
        $positions.find('> div').removeClass('active');
        Mousetrap.unbind('esc');
        if(window.location.hash.indexOf('#!/positions/') > -1 && !refresh){
            if(Modernizr.history){
                history.pushState({}, '', '#!/positions');
            }
            else{
                window.location.href = '#!/positions';
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

        $('body').toggleClass('nav-open')

        setTimeout(function(){
            $that.toggleClass('active');
        },250)
    },
    'close': function(){
        var $that = $('.menu-toggle');
        $('nav').removeClass('open');
        $that.removeClass('active');
        $('body').removeClass('nav-open')
    },
    'open': function(){
        var $that = $('.menu-toggle');
        $('nav').addClass('open')
        if($(window).width() < 480){
            window.scrollTo(0, 0);
        }
        $that.addClass('active');
        $('body').addClass('nav-open')
    }
}

//ABOUT CONTENT HEIGHT FOR SVG BGS
function setAboutHeights(){
    $('#about .row').css('height',window.innerHeight - 45);
}
function setSectionHeights(){
    $('section').css('minHeight',window.innerHeight - 195);
}
function logWindowWidth(){
    windowWidth = window.innerWidth;
}

//ANIMATION
function animateThisSVG(obj,name){
    if(obj){
        var container = Snap.select(obj[name].topLevelSelector);
        if(windowWidth > 479){
            var animatedEls = obj[name]['animatedEls-full'];
        }
        else{
            var animatedEls = obj[name]['animatedEls-mobile'];
        }
        for(i in animatedEls){

            var el = container.select(animatedEls[i].selector);

            for(j in animatedEls[i].states){

                var state = animatedEls[i].states[j];

                function animate(el,state){
                    el.animate({d:state.d},state.time,eval(state.easing));
                }
                setTimeout(animate, state.delay, el,state);
            }
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
function filters(type){

    //kinda backwards now but whatever
    var $obj = $('.filter [data-filter="'+type+'"]');
    //close any open positions

    Odelay.close();

    if($obj.attr('data-toggle') === 'off'){

        //only one cancer type at a time
        if($obj.data('filter-type') === 'cancer-type'){
            $('[data-filter-type="cancer-type"] a').data('toggle','off').attr('data-toggle','off');

            var cancerType = $obj.data('filter');
            //close all chapters and STCs
            $('#chapters > div,#support-the-cause > div').removeClass('open')
        $('#chapters').find('.part2,.expand').removeClass('open');
            //show appropriate chapters and STGs
            $('#chapters [data-cancer-type='+cancerType+'],#support-the-cause [data-cancer-type='+cancerType+']').addClass('open');
            $('#support-blurb').hide();
            $('#positions').addClass('chapter')
            var $allPositions = $('#positions > div');
            //hide all positions
            $allPositions.hide();
            $allPositions = $allPositions.sort(function(a,b){
                var an = parseFloat(a.getAttribute('data-chapter-index')),
                    bn = parseFloat(b.getAttribute('data-chapter-index'));

                if(an > bn) {
                    return 1;
                }
                if(an < bn) {
                    return -1;
                }
                return 0;
            });
            $allPositions
                .filter('[data-chapter-float]')
                .each(function(){
                    if($(this).attr('data-cancer-type') === cancerType){
                        var chapterFloat = $(this).attr('data-chapter-float');
                        $(this).css('float',chapterFloat);
                    }
            });
            $allPositions
                .filter('[data-chapter-full-size]')
                .each(function(){
                    /*if($(this).hasClass('position-horizontal') === cancerType){
                        console.log('its horz!')
                        $(this).css({
                            width: containerWidth,
                            height: containerWidth/2-10
                        })
                    }*/
                    /*if($(this).hasClass('position-vertical') === cancerType){
                        console.log('its vert!')
                        $(this).css({
                            width: containerWidth/2-10,
                            height: containerWidth
                        })
                    }*/
                    $(this).css({
                            width: containerWidth,
                            height: containerWidth/2-10
                        })
                });
            //show appropriate positions
            $allPositions.detach().appendTo($positions)
            $('#positions > [data-cancer-type='+cancerType+']').show()
            //scroll to top
            window.scrollTo(0, 0);
        }
        $obj.data('toggle','on').attr('data-toggle','on')
    }
    else{
        $obj.data('toggle','off').attr('data-toggle','off');
        if($obj.data('filter-type') === 'cancer-type'){
            var $allPositions = $('#positions > div');
            //hide all positions
            $allPositions.hide();
            $allPositions.sort(function(a,b){
                var an = parseFloat(a.getAttribute('data-index')),
                    bn = parseFloat(b.getAttribute('data-index'));

                if(an > bn) {
                    return 1;
                }
                if(an < bn) {
                    return -1;
                }
                return 0;
            });
            $allPositions.filter('[data-chapter-float]').css('float','');
            setPositionSize();
            $allPositions.detach().appendTo($positions)
            $('#chapters > div,#support-the-cause > div').removeClass('open')
        $('#chapters').find('.part2,.expand').removeClass('open');
            $('#support-blurb').show();
            $('#positions').removeClass('chapter')
            window.scrollTo(0, 0);
        }
    }
}
function clearFilters(){
var $allPositions = $('#positions > div');
        $('.filters [data-toggle=on]').attr('data-toggle','off')
        $('#chapters > div,#support-the-cause > div').removeClass('open')
        $('#chapters').find('.part2,.expand').removeClass('open');
        $('#support-blurb').show();
        $('#positions').removeClass('chapter');
        $allPositions.filter('[data-chapter-float]').css('float','');
        setPositionSize();
        
            //hide all positions
            $allPositions.hide();
            $allPositions.sort(function(a,b){
                var an = parseFloat(a.getAttribute('data-index')),
                    bn = parseFloat(b.getAttribute('data-index'));

                if(an > bn) {
                    return 1;
                }
                if(an < bn) {
                    return -1;
                }
                return 0;
            });
        $allPositions.detach().appendTo($positions).show();
        window.scrollTo(0, 0);
}

function loadPositionsJSON(route,name){
    var rendered_html = Mustache.to_html($('#templates .positions').html(),{
       positions: positionsData
    });
    $('#positions').html(rendered_html).removeClass('empty');
    $positionsContainer.show();
    loadPositionsState(route,name);
}

//STICKY NAV THAT DOESN'T SUCK
jQuery.fn.extend({
    sticky: function() {
        var offsetTop = $(this).offset().top;
        var offsetLeft = $(this).offset().left;
        var width = $(this).width();
        var position = $(window).scrollTop();
        var $el = $(this);
        $el.clone().appendTo('body').attr('id','fixed-item').attr('style', 'position:fixed;top:'+offsetTop+';left:' + offsetLeft + 'px;width:' + width + 'px');
        $(window).on('scroll', function() {
            if ($(window).scrollTop() > offsetTop) {
                $el.attr('style', 'position:fixed;top:'+offsetTop+';left:' + offsetLeft + 'px;width:' + width + 'px');
            } else {
                $el.attr('style', '');
            }
        });
    }
});

//GOOGLE FORM
$("body").on("click", ".google-form input[type=submit]", function() {
    $(".form-thank-you").show();
});
$("body").on("click", "button.form-dismiss", function() {
    $(".form-thank-you").hide();
});