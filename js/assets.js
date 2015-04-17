//SHOW POSITION USING OVERLAY

function showPosition(){
    //var content = $overlayContent.html();
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

    //
    if($obj.attr('data-toggle') === 'off'){

        //only one cancer type at a time
        if($obj.data('filter-type') === 'cancer-type'){
            $('[data-filter-type="cancer-type"] a').data('toggle','off').attr('data-toggle','off');

            var cancerType = $obj.data('filter');
            //close all chapters and STCs
            $('#chapters > div,#support-the-cause > div').removeClass('open').children('part2,expand').removeClass('open');
            //show appropriate chapters and STGs
            $('#chapters [data-cancer-type='+cancerType+'],#support-the-cause [data-cancer-type='+cancerType+']').addClass('open');
            var $allPositions = $('#positions > div');
            //hide all positions
            $allPositions.hide();
            $allPositions.sort(function(a,b){
                var an = a.getAttribute('data-chapter-index'),
                    bn = b.getAttribute('data-chapter-index');

                if(an > bn) {
                    return 1;
                }
                if(an < bn) {
                    return -1;
                }
                return 0;
            });
            //show appropriate positions
            console.log($allPositions)
            $allPositions.detach().appendTo($positions)
            $('#positions > [data-cancer-type='+cancerType+']').show();
            //scroll to top
            window.scrollTo(0, 0);
        }
        //what dis do?
        $obj.data('toggle','on').attr('data-toggle','on')
    }
    else{
        $obj.data('toggle','off').attr('data-toggle','off');
        if($obj.data('filter-type') === 'cancer-type'){
            var $allPositions = $('#positions > div');
            //hide all positions
            $allPositions.hide();
            $allPositions.sort(function(a,b){
                var an = a.getAttribute('data-chapter-index'),
                    bn = b.getAttribute('data-chapter-index');

                if(an > bn) {
                    return 1;
                }
                if(an < bn) {
                    return -1;
                }
                return 0;
            });
            $allPositions.detach().appendTo($positions)
            $('#chapters > div,#support-the-cause > div').removeClass('open').children('part2,expand').removeClass('open');
            window.scrollTo(0, 0);
        }
    }
}
function clearFilters(){
        console.log('clearFilters()')
        $('.filters [data-toggle=on]').attr('data-toggle','off')
        $('#chapters > div,#support-the-cause > div').removeClass('open').children('part2,expand').removeClass('open');
        var $allPositions = $('#positions > div');
            //hide all positions
            $allPositions.hide();
            $allPositions.sort(function(a,b){
                var an = a.getAttribute('data-index'),
                    bn = b.getAttribute('data-index');

                if(an > bn) {
                    return 1;
                }
                if(an < bn) {
                    return -1;
                }
                return 0;
            });
            console.log($allPositions)
        $allPositions.detach().appendTo($positions).show();
        window.scrollTo(0, 0);
}

function loadPositionsJSON(route,name){
    //$.getJSON('data/positions.json',function(positions){
        console.log('loadPositionsJSON')
        var rendered_html = Mustache.to_html($('#templates .positions').html(),{
           positions: positionsData
        });
        $('#positions').html(rendered_html).removeClass('empty');
        /*$positions.isotope({
            masonry: {
                //columnWidth: '.position-test'
                columnWidth: '#positions > div:not(.position-full-size)'
            },
            getSortData: {
                index: '[data-index] parseInt',
            },
            //layoutMode: 'masonry',
            //sortBy: 'index'
        });*/
        $positionsContainer.show();
        //$positions.isotope('layout');
    loadPositionsState(route,name);
    //});
}

/**
* jquery.matchHeight-min.js master
* http://brm.io/jquery-match-height/
* License: MIT
*/
(function(c){var n=-1,f=-1,g=function(a){return parseFloat(a)||0},r=function(a){var b=null,d=[];c(a).each(function(){var a=c(this),k=a.offset().top-g(a.css("margin-top")),l=0<d.length?d[d.length-1]:null;null===l?d.push(a):1>=Math.floor(Math.abs(b-k))?d[d.length-1]=l.add(a):d.push(a);b=k});return d},p=function(a){var b={byRow:!0,property:"height",target:null,remove:!1};if("object"===typeof a)return c.extend(b,a);"boolean"===typeof a?b.byRow=a:"remove"===a&&(b.remove=!0);return b},b=c.fn.matchHeight=
function(a){a=p(a);if(a.remove){var e=this;this.css(a.property,"");c.each(b._groups,function(a,b){b.elements=b.elements.not(e)});return this}if(1>=this.length&&!a.target)return this;b._groups.push({elements:this,options:a});b._apply(this,a);return this};b._groups=[];b._throttle=80;b._maintainScroll=!1;b._beforeUpdate=null;b._afterUpdate=null;b._apply=function(a,e){var d=p(e),h=c(a),k=[h],l=c(window).scrollTop(),f=c("html").outerHeight(!0),m=h.parents().filter(":hidden");m.each(function(){var a=c(this);
a.data("style-cache",a.attr("style"))});m.css("display","block");d.byRow&&!d.target&&(h.each(function(){var a=c(this),b="inline-block"===a.css("display")?"inline-block":"block";a.data("style-cache",a.attr("style"));a.css({display:b,"padding-top":"0","padding-bottom":"0","margin-top":"0","margin-bottom":"0","border-top-width":"0","border-bottom-width":"0",height:"100px"})}),k=r(h),h.each(function(){var a=c(this);a.attr("style",a.data("style-cache")||"")}));c.each(k,function(a,b){var e=c(b),f=0;if(d.target)f=
d.target.outerHeight(!1);else{if(d.byRow&&1>=e.length){e.css(d.property,"");return}e.each(function(){var a=c(this),b={display:"inline-block"===a.css("display")?"inline-block":"block"};b[d.property]="";a.css(b);a.outerHeight(!1)>f&&(f=a.outerHeight(!1));a.css("display","")})}e.each(function(){var a=c(this),b=0;d.target&&a.is(d.target)||("border-box"!==a.css("box-sizing")&&(b+=g(a.css("border-top-width"))+g(a.css("border-bottom-width")),b+=g(a.css("padding-top"))+g(a.css("padding-bottom"))),a.css(d.property,
f-b))})});m.each(function(){var a=c(this);a.attr("style",a.data("style-cache")||null)});b._maintainScroll&&c(window).scrollTop(l/f*c("html").outerHeight(!0));return this};b._applyDataApi=function(){var a={};c("[data-match-height], [data-mh]").each(function(){var b=c(this),d=b.attr("data-mh")||b.attr("data-match-height");a[d]=d in a?a[d].add(b):b});c.each(a,function(){this.matchHeight(!0)})};var q=function(a){b._beforeUpdate&&b._beforeUpdate(a,b._groups);c.each(b._groups,function(){b._apply(this.elements,
this.options)});b._afterUpdate&&b._afterUpdate(a,b._groups)};b._update=function(a,e){if(e&&"resize"===e.type){var d=c(window).width();if(d===n)return;n=d}a?-1===f&&(f=setTimeout(function(){q(e);f=-1},b._throttle)):q(e)};c(b._applyDataApi);c(window).bind("load",function(a){b._update(!1,a)});c(window).bind("resize orientationchange",function(a){b._update(!0,a)})})(jQuery);