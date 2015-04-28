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


//JQUERY BROWSER SHIM
// jQuery 1.9 has removed the `$.browser` property, fancybox relies on
// it, so we patch it here if it's missing.
// This has been copied from jQuery migrate 1.1.1.
if ( !jQuery.browser ) {
  var uaMatch = function( ua ) {
    ua = ua.toLowerCase();

    var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
      /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
      /(msie) ([\w.]+)/.exec( ua ) ||
      ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
      [];

    return {
      browser: match[ 1 ] || "",
      version: match[ 2 ] || "0"
    };
  };

  matched = uaMatch( navigator.userAgent );
  browser = {};

  if ( matched.browser ) {
    browser[ matched.browser ] = true;
    browser.version = matched.version;
  }

  // Chrome is Webkit, but Webkit is also Safari.
  if ( browser.chrome ) {
    browser.webkit = true;
  } else if ( browser.webkit ) {
    browser.safari = true;
  }

  jQuery.browser = browser;
}

/*
 * jQuery hashchange event - v1.3 - 7/21/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,e,b){var c="hashchange",h=document,f,g=$.event.special,i=h.documentMode,d="on"+c in e&&(i===b||i>7);function a(j){j=j||location.href;return"#"+j.replace(/^[^#]*#?(.*)$/,"$1")}$.fn[c]=function(j){return j?this.bind(c,j):this.trigger(c)};$.fn[c].delay=50;g[c]=$.extend(g[c],{setup:function(){if(d){return false}$(f.start)},teardown:function(){if(d){return false}$(f.stop)}});f=(function(){var j={},p,m=a(),k=function(q){return q},l=k,o=k;j.start=function(){p||n()};j.stop=function(){p&&clearTimeout(p);p=b};function n(){var r=a(),q=o(m);if(r!==m){l(m=r,q);$(e).trigger(c)}else{if(q!==m){location.href=location.href.replace(/#.*/,"")+q}}p=setTimeout(n,$.fn[c].delay)}$.browser.msie&&!d&&(function(){var q,r;j.start=function(){if(!q){r=$.fn[c].src;r=r&&r+a();q=$('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){r||l(a());n()}).attr("src",r||"javascript:0").insertAfter("body")[0].contentWindow;h.onpropertychange=function(){try{if(event.propertyName==="title"){q.document.title=h.title}}catch(s){}}}};j.stop=k;o=function(){return a(q.location.href)};l=function(v,s){var u=q.document,t=$.fn[c].domain;if(v!==s){u.title=h.title;u.open();t&&u.write('<script>document.domain="'+t+'"<\/script>');u.close();q.location.hash=v}}})();return j})()})(jQuery,this);