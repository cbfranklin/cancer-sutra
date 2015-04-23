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
            console.log('close stuff')
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
                    console.log($(this))
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

/*
 Sticky-kit v1.1.1 | WTFPL | Leaf Corcoran 2014 | http://leafo.net
*/
(function(){var k,e;k=this.jQuery||window.jQuery;e=k(window);k.fn.stick_in_parent=function(d){var v,y,n,p,h,C,s,G,q,H;null==d&&(d={});s=d.sticky_class;y=d.inner_scrolling;C=d.recalc_every;h=d.parent;p=d.offset_top;n=d.spacer;v=d.bottoming;null==p&&(p=0);null==h&&(h=void 0);null==y&&(y=!0);null==s&&(s="is_stuck");null==v&&(v=!0);G=function(a,d,q,z,D,t,r,E){var u,F,m,A,c,f,B,w,x,g,b;if(!a.data("sticky_kit")){a.data("sticky_kit",!0);f=a.parent();null!=h&&(f=f.closest(h));if(!f.length)throw"failed to find stick parent";
u=m=!1;(g=null!=n?n&&a.closest(n):k("<div />"))&&g.css("position",a.css("position"));B=function(){var c,e,l;if(!E&&(c=parseInt(f.css("border-top-width"),10),e=parseInt(f.css("padding-top"),10),d=parseInt(f.css("padding-bottom"),10),q=f.offset().top+c+e,z=f.height(),m&&(u=m=!1,null==n&&(a.insertAfter(g),g.detach()),a.css({position:"",top:"",width:"",bottom:""}).removeClass(s),l=!0),D=a.offset().top-parseInt(a.css("margin-top"),10)-p,t=a.outerHeight(!0),r=a.css("float"),g&&g.css({width:a.outerWidth(!0),
height:t,display:a.css("display"),"vertical-align":a.css("vertical-align"),"float":r}),l))return b()};B();if(t!==z)return A=void 0,c=p,x=C,b=function(){var b,k,l,h;if(!E&&(null!=x&&(--x,0>=x&&(x=C,B())),l=e.scrollTop(),null!=A&&(k=l-A),A=l,m?(v&&(h=l+t+c>z+q,u&&!h&&(u=!1,a.css({position:"fixed",bottom:"",top:c}).trigger("sticky_kit:unbottom"))),l<D&&(m=!1,c=p,null==n&&("left"!==r&&"right"!==r||a.insertAfter(g),g.detach()),b={position:"",width:"",top:""},a.css(b).removeClass(s).trigger("sticky_kit:unstick")),
y&&(b=e.height(),t+p>b&&!u&&(c-=k,c=Math.max(b-t,c),c=Math.min(p,c),m&&a.css({top:c+"px"})))):l>D&&(m=!0,b={position:"fixed",top:c},b.width="border-box"===a.css("box-sizing")?a.outerWidth()+"px":a.width()+"px",a.css(b).addClass(s),null==n&&(a.after(g),"left"!==r&&"right"!==r||g.append(a)),a.trigger("sticky_kit:stick")),m&&v&&(null==h&&(h=l+t+c>z+q),!u&&h)))return u=!0,"static"===f.css("position")&&f.css({position:"relative"}),a.css({position:"absolute",bottom:d,top:"auto"}).trigger("sticky_kit:bottom")},
w=function(){B();return b()},F=function(){E=!0;e.off("touchmove",b);e.off("scroll",b);e.off("resize",w);k(document.body).off("sticky_kit:recalc",w);a.off("sticky_kit:detach",F);a.removeData("sticky_kit");a.css({position:"",bottom:"",top:"",width:""});f.position("position","");if(m)return null==n&&("left"!==r&&"right"!==r||a.insertAfter(g),g.remove()),a.removeClass(s)},e.on("touchmove",b),e.on("scroll",b),e.on("resize",w),k(document.body).on("sticky_kit:recalc",w),a.on("sticky_kit:detach",F),setTimeout(b,
0)}};q=0;for(H=this.length;q<H;q++)d=this[q],G(k(d));return this}}).call(this);


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