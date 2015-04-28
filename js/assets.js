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



//ABOUT.JS
var aboutAnimations;

function loadAboutAnimations(){
    //Load SVG INFO FROM JSON
    $.getJSON('data/animations-about.json',function(about){
        //Load SVGs into containers
        aboutAnimations = about;
        for(var key in about){
            if(windowWidth > 479){
                var file = about[key]['file-full'];
            }
            else{
                var file = about[key]['file-mobile'];
            }
            console.log(file)
            Snap.load(file,function(key){
                    return function(data){
                        var container = Snap('#about .'+key);
                        container.append(data);
                    };
            }(key));
        }
        setTimeout(function(){
            animateThisSVG(aboutAnimations,'one')
        },800)
    });
}

/* mousetrap v1.5.2 craig.is/killing/mice */
(function(C,r,g){function t(a,b,h){a.addEventListener?a.addEventListener(b,h,!1):a.attachEvent("on"+b,h)}function x(a){if("keypress"==a.type){var b=String.fromCharCode(a.which);a.shiftKey||(b=b.toLowerCase());return b}return l[a.which]?l[a.which]:p[a.which]?p[a.which]:String.fromCharCode(a.which).toLowerCase()}function D(a){var b=[];a.shiftKey&&b.push("shift");a.altKey&&b.push("alt");a.ctrlKey&&b.push("ctrl");a.metaKey&&b.push("meta");return b}function u(a){return"shift"==a||"ctrl"==a||"alt"==a||
"meta"==a}function y(a,b){var h,c,e,g=[];h=a;"+"===h?h=["+"]:(h=h.replace(/\+{2}/g,"+plus"),h=h.split("+"));for(e=0;e<h.length;++e)c=h[e],z[c]&&(c=z[c]),b&&"keypress"!=b&&A[c]&&(c=A[c],g.push("shift")),u(c)&&g.push(c);h=c;e=b;if(!e){if(!k){k={};for(var m in l)95<m&&112>m||l.hasOwnProperty(m)&&(k[l[m]]=m)}e=k[h]?"keydown":"keypress"}"keypress"==e&&g.length&&(e="keydown");return{key:c,modifiers:g,action:e}}function B(a,b){return a===r?!1:a===b?!0:B(a.parentNode,b)}function c(a){function b(a){a=a||{};
var b=!1,n;for(n in q)a[n]?b=!0:q[n]=0;b||(v=!1)}function h(a,b,n,f,c,h){var g,e,l=[],m=n.type;if(!d._callbacks[a])return[];"keyup"==m&&u(a)&&(b=[a]);for(g=0;g<d._callbacks[a].length;++g)if(e=d._callbacks[a][g],(f||!e.seq||q[e.seq]==e.level)&&m==e.action){var k;(k="keypress"==m&&!n.metaKey&&!n.ctrlKey)||(k=e.modifiers,k=b.sort().join(",")===k.sort().join(","));k&&(k=f&&e.seq==f&&e.level==h,(!f&&e.combo==c||k)&&d._callbacks[a].splice(g,1),l.push(e))}return l}function g(a,b,n,f){d.stopCallback(b,b.target||
b.srcElement,n,f)||!1!==a(b,n)||(b.preventDefault?b.preventDefault():b.returnValue=!1,b.stopPropagation?b.stopPropagation():b.cancelBubble=!0)}function e(a){"number"!==typeof a.which&&(a.which=a.keyCode);var b=x(a);b&&("keyup"==a.type&&w===b?w=!1:d.handleKey(b,D(a),a))}function l(a,c,n,f){function e(c){return function(){v=c;++q[a];clearTimeout(k);k=setTimeout(b,1E3)}}function h(c){g(n,c,a);"keyup"!==f&&(w=x(c));setTimeout(b,10)}for(var d=q[a]=0;d<c.length;++d){var p=d+1===c.length?h:e(f||y(c[d+1]).action);
m(c[d],p,f,a,d)}}function m(a,b,c,f,e){d._directMap[a+":"+c]=b;a=a.replace(/\s+/g," ");var g=a.split(" ");1<g.length?l(a,g,b,c):(c=y(a,c),d._callbacks[c.key]=d._callbacks[c.key]||[],h(c.key,c.modifiers,{type:c.action},f,a,e),d._callbacks[c.key][f?"unshift":"push"]({callback:b,modifiers:c.modifiers,action:c.action,seq:f,level:e,combo:a}))}var d=this;a=a||r;if(!(d instanceof c))return new c(a);d.target=a;d._callbacks={};d._directMap={};var q={},k,w=!1,p=!1,v=!1;d._handleKey=function(a,c,e){var f=h(a,
c,e),d;c={};var k=0,l=!1;for(d=0;d<f.length;++d)f[d].seq&&(k=Math.max(k,f[d].level));for(d=0;d<f.length;++d)f[d].seq?f[d].level==k&&(l=!0,c[f[d].seq]=1,g(f[d].callback,e,f[d].combo,f[d].seq)):l||g(f[d].callback,e,f[d].combo);f="keypress"==e.type&&p;e.type!=v||u(a)||f||b(c);p=l&&"keydown"==e.type};d._bindMultiple=function(a,b,c){for(var d=0;d<a.length;++d)m(a[d],b,c)};t(a,"keypress",e);t(a,"keydown",e);t(a,"keyup",e)}var l={8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",18:"alt",20:"capslock",
27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"ins",46:"del",91:"meta",93:"meta",224:"meta"},p={106:"*",107:"+",109:"-",110:".",111:"/",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},A={"~":"`","!":"1","@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",_:"-","+":"=",":":";",'"':"'","<":",",">":".","?":"/","|":"\\"},z={option:"alt",command:"meta","return":"enter",escape:"esc",
plus:"+",mod:/Mac|iPod|iPhone|iPad/.test(navigator.platform)?"meta":"ctrl"},k;for(g=1;20>g;++g)l[111+g]="f"+g;for(g=0;9>=g;++g)l[g+96]=g;c.prototype.bind=function(a,b,c){a=a instanceof Array?a:[a];this._bindMultiple.call(this,a,b,c);return this};c.prototype.unbind=function(a,b){return this.bind.call(this,a,function(){},b)};c.prototype.trigger=function(a,b){if(this._directMap[a+":"+b])this._directMap[a+":"+b]({},a);return this};c.prototype.reset=function(){this._callbacks={};this._directMap={};return this};
c.prototype.stopCallback=function(a,b){return-1<(" "+b.className+" ").indexOf(" mousetrap ")||B(b,this.target)?!1:"INPUT"==b.tagName||"SELECT"==b.tagName||"TEXTAREA"==b.tagName||b.isContentEditable};c.prototype.handleKey=function(){return this._handleKey.apply(this,arguments)};c.init=function(){var a=c(r),b;for(b in a)"_"!==b.charAt(0)&&(c[b]=function(b){return function(){return a[b].apply(a,arguments)}}(b))};c.init();C.Mousetrap=c;"undefined"!==typeof module&&module.exports&&(module.exports=c);"function"===
typeof define&&define.amd&&define(function(){return c})})(window,document);

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