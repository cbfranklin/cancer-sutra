var
$wrapper,
$all,
$about,
$positions,
$positionsContainer,
$support,
$ebook,
$filters,
$container,
$loader,
$body,
$overlay,
$overlayContent,
$posters,
containerWidth,
windowWidth;

//READY
$(function(){
	$body = $('body');
	$wrapper = $('.wrapper');
	$about = $('#about');
	$positions = $('#positions');
	$support = $('#support')
	$positionsContainer = $('#positions-container');
	$ebook = $('#ebook');
	$posters = $('#posters');
	$all = $('section');
	$filters = $('.filter a');
	$container = $('.container');
	$loader = $('.loader');
	$overlay = $('.overlay');

	bindings();

	imagesLoaded('body',routes);

});

//BINDINGS
function bindings(){

	//keep 'about' sections sized to window height
	//and section min-height appropriate
	setAboutHeights();
	setSectionHeights();
	logWindowWidth();
	$(window).on('resize',function(){
		setAboutHeights();
		setSectionHeights();
		logWindowWidth();
	});

	$('.nav-closer').on('click',function(){
		Nav.toggle();
	});
	//menu
	$('.menu-toggle').on('click',function(e){
		Nav.toggle();
		e.preventDefault();
	});

	//bring up detail
	$positions.on('click','> div',function(e){
		$(this).addClass('active')
		var name = $(this).data('position');
		if(Modernizr.history){
			history.pushState({}, '', '#!/positions/'+name);
		}
		else{
			window.location.hash = '#!/positions/'+name;
		}
		ga('send', 'pageview', '/' + window.location.hash);
		$overlayContent = $(this).find('.detail');
		showPosition();

		e.preventDefault();
	});

	//CHAPTERS
	$('.expand').on('click',function(){
		if($(this).hasClass('open')){
			var height = $('#chapters .part1').height()  - $('.expand').height() + 20;
		}
		$(this).toggleClass('open');
		$(this).siblings('.part2').toggleClass('open');
	});

	//MENU SWIPE
	$('body').on('swipe','.wrapper',function(event){
		var dir = event.direction;
		if($(window).innerWidth() > 480){
			if(dir === 'right'){
	            Nav.open();
	            return false;
		    }
			if (dir === 'left') {
				Nav.close();
	            return false;
		    }
		}
	});
	//LEGAL
	$('body').on('click','#legal',function(e){
		Odelay.open($('.legal').html())
		e.preventDefault();
	});
}

//LOAD
function load(){
	$body.addClass('loading');
	Odelay.close(true);
	Nav.close();
	//enable scrolling mobile
	$(window).off('touchmove');
	if(window.location.hash.indexOf('#!/') > -1){
		ga('send', 'pageview', '/' + window.location.hash);
	}
	else{
		ga('send', 'pageview', '/');
	}
}

//ROUTES
function routes(){
	routie({
	    '' : function(){
	    	load();
	    	loadAbout();
	    },
	    '!' : function(){
	    	load();
	    	loadAbout();
	    },
	    '!/' : function(){
	    	load();
	    	loadAbout();
	    },
	    '!/about' : function(){
	    	load();
	    	loadAbout();
	    },
	    '!/positions' : function(){
	    	loadPositions();
	    },
	    '!/positions/' : function(){
	    	load();
	    	loadPositions();
	    },
	    '!/positions/:position' : function(position){
	    	load();
	    	loadPositions('positions', position);
	    },
	     '!/chapters/' : function(cancerType){
	     	load();
	     	loadPositions();
	    },
	     '!/chapters/:cancerType' : function(cancerType){
	     	load();
	     	loadPositions('chapters', cancerType);
	    },
	     '!/support' : function(){
	     	load();
	     	loadSupport();
	    },
	     '!/support/ebook' : function(){
	     	load();
	     	loadEBook();
	    },
	    '!/support/posters' : function(){
	     	load();
	     	loadPosters();
	    }
	});
};

//ABOUT
function loadAbout(){
	load();
	$about.show();
	$body.removeClass('loading positions support').addClass('about');

	//disable scrolling mobile
	$(window).on('touchmove', false);

	setTimeout(function(){
		$('section').not('#about').hide()
		window.scrollTo(0, 0);
		$('nav').removeClass('open');
		$('.menu-toggle').removeClass('active');
		clearFilters();
	},400);

	if($('#about svg').length === 0){
		loadAboutAnimations();
	}
	$('#about > div').onScreen({
		direction: 'vertical',
		doIn: function() {
			var id = $(this).attr('id');
			animateThisSVG(aboutAnimations,id)
			var index = $(this).index();
			//$('#about').attr('data-scroll-status',index);
		},
		tolerance: 200,
		throttle: 500,
		toggleClass: 'onScreen'
	});
	$('#about').on('click','.about-navigation img',function(){
		var id = $(this).attr('id');
		if(id === 'next'){
			//$(this).parents('.row').next().scrollToAnchor()
			var status = parseFloat($('#about').attr('data-scroll-status')) + 1;
			if($('#about > div').eq(status)){
				$('#about > div').eq(status).scrollToAnchor();
			}
			$('#about').attr('data-is-scrolling',true);
			setTimeout(function(){
				$('#about').attr('data-is-scrolling',false);
				$('#about').attr('data-scroll-status',status);
			},600)
		}
		if(id === 'prev'){
			//$(this).parents('.row').prev().scrollToAnchor()
			var status = parseFloat($('#about').attr('data-scroll-status')) - 1;
			if($('#about > div').eq(status)){
				$('#about > div').eq(status).scrollToAnchor();
			}
			$('#about').attr('data-is-scrolling',true);
			setTimeout(function(){
				$('#about').attr('data-is-scrolling',false);
				$('#about').attr('data-scroll-status',status);
			},600)
		}
	});
    $('body').on('swipe','#about[data-is-scrolling=false]',function(event){
		var dir = event.direction;
		if (dir === 'down') {
			$('#about .onScreen #prev').click();
            return false;
	    }
	    if(dir === 'up'){
            $('#about .onScreen #next').click();
            return false;
	    }
	});
	/*var mousewheelScroll = _.debounce(function(e) {
		if(e.deltaY < 0){
			$('#about .onScreen #next').click();
		}
		if(e.deltaY > 0){
			$('#about .onScreen #prev').click();
		}
	}, 100, true);

	$('#about').on('mousewheel',mousewheelScroll);*/
};

//POSITIONS
function loadPositions(route,name){
	load();
	if($positions.hasClass('empty')){
		loadPositionsJSON(route,name)
	}
	else{
		loadPositionsState(route,name);
	}

	$positionsContainer.show();
	var containerWidth = $('#positions').width()
	setPositionSize();

	$(window).on('resize',function(){
		setPositionSize();
	})

	setTimeout(function(){
			$('section').not('#positions-container').hide()
			window.scrollTo(0, 0);
		},400);

	$body.removeClass('loading about support').addClass('positions');
}

function loadPositionsState(route,name){
	//$positionsContainer.show();

	//position or chapter
	if(route != undefined){
		//position
		if(route === 'positions'){
			setTimeout(function(){
				$overlayContent = $positions.find('[data-position="'+name+'"]').find('.detail');
		    	showPosition();
			},500);
		}
		//chapter
		else if(route === 'chapters'){
			if(name){
				setTimeout(function(){
			    	filters(name);
				},500);
			}
		}
		else{
			clearFilters();
			Odelay.close();
		}
	}
	else{
		clearFilters();
		Odelay.close();
	}
}
function setPositionSize(){

	containerWidth = $('#positions').width()

	$('#positions > div').css({
		width: containerWidth/2-10,
		height: containerWidth/2-10
	})

	$('#positions > div.position-full-size.position-vertical').css('height',containerWidth)

	$('#positions > div.position-full-size.position-horizontal').css('width',containerWidth)

}

//SUPPORT
function loadSupport(){
	load();
	$support.show();
	$body.removeClass('loading about positions').addClass('support');
	if($(window).height() > 768){
		$('.store-item-wrapper').matchHeight();
	}
	$(window).on('resize',function(){
		if($(window).height() > 768){
			$('.store-item-wrapper').matchHeight();
		}
		else{
			$('.store-item-wrapper').attr('style','');
		}
	})
	$('body').on('click','.store-item-ebook',function(){
		routie('#!/support/ebook')
	})

	$('body').on('click','.store-item-posters',function(){
		window.open('http://stupidcancerstore.org/brands/The-Cancer-Sutra.html','_blank');
	})

	setTimeout(function(){
		$('section').not('#support').hide()
		clearFilters();
		window.scrollTo(0, 0);
	},400);
}

//EBOOK
function loadEBook(){
	load();
	$ebook.show();
	$body.removeClass('loading about positions support posters').addClass('ebook');

	if($(window).height() > 768){
		$('.ebook .row > div').matchHeight();
	}
	$(window).on('resize',function(){
		if($(window).height() > 768){
			$('.ebook .row > div').matchHeight();
		}
		else{
			$('.ebook .row > div').attr('style','')
		}
	})

	//NEED STICKINESS!

	setTimeout(function(){
		$('section').not('#ebook').hide()
		clearFilters();
		window.scrollTo(0, 0);
	},400);
}

//posters
function loadPosters(){
	load();
	$posters.show();
	$body.removeClass('loading about positions support ebook').addClass('posters');

	setTimeout(function(){
		$('section').not('#posters').hide()
		clearFilters();
		window.scrollTo(0, 0);
	},400);

	$('.return-to-cancer-sutra').on('click',function(){
		$(this).closest('form').find("input[type=text], textarea").val("");
		$('.form-thank-you').hide()
	});
}

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

//POSITIONS data
var positionsData=[{"element-name":"inspect-a-pec","display-name":"Inspect-a-Pec","svg-name":"InspectAPec.svg",orientation:"horizontal","cancer-type":"breast","display-cancer-type":"Breast Cancer","detail-html":"<p>Ladies, lead your lover to a bed or other flat surface and lie on your back. Coax him (as if it required any effort at all) into the familiar missionary position, but then, arch your back upwards to meet him &mdash; and continue making his acquaintance over and over again. As you thrust to the beat of his drum, take note of his pectorals*, and remember that when it comes to this position, there's no do-not-touch rule to be found.</p>","just-the-tip":"Once you've seen all that his hovering pectorals have to show you, try this trick: Using one hand, grip the back of his hair firmly and give a firm tug. He'll arch his back and pull his chest into a more open position. All the better for you to see his chest in a more pronounced light.","full-size":!0,"overview-index":1,"chapter-index":1,"og:description":"The #CancerSutra Presents: INSPECT-A-PEC. Put the squeeze on cancer with this position.","banner-name":"CS_Social_InspectAPec.png",bitly:"http://bit.ly/1GsLcMh","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/inspect-a-pec'>INSPECT-A-PEC.</a><br><br>Put this squeeze on cancer with this position. Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer.  <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23CancerSutra%20Presents:%20INSPECT-A-PEC.%20Put%20the%20squeeze%20on%20cancer%20with%20this%20position.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/inspect-a-pec'%3EINSPECT-A-PEC.%3C/a%3E%3Cbr%3E%3Cbr%3EPut%20this%20squeeze%20on%20cancer%20with%20this%20position.%20Or%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"INSPECT-A-PEC.%20Put%20the%20squeeze%20on%20cancer%20with%20this%20position."},{"element-name":"handy-scan","display-name":"Handy Scan","svg-name":"HandyScan.svg",orientation:"square","cancer-type":"breast","display-cancer-type":"Breast Cancer","detail-html":"<p>Things come to a grinding start in this position, as you wedge your hips firmly between your partner's legs.* Once things really start to shake and rattle, let one of your hands find a familiar squeeze or two. Massage,  pinch, and of course, TWEAK her breasts to ensure you get her gears really moving.</p>","just-the-tip":"Try this position upright, try it laying down, try it on your side, or even upside down. For full effect, the Handy Scan is best enjoyed from multiple angles.","full-size":!1,"overview-index":2,"chapter-index":3,"og:description":"The #CancerSutra Presents: HANDY SCAN. Let your lover fall into your capable hands (and other capable areas, as well).","banner-name":"CS_Social_HandyScan.png",bitly:"http://bit.ly/1DHxHHY","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/handy-scan'>HANDY SCAN.</a> Let your lover fall into your capable hands (and other capable areas, as well). <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20HANDY%20SCAN.%20Let%20your%20lover%20fall%20into%20your%20capable%20hands%20(and%20other%20capable%20areas,%20as%20well).","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/handy-scan'%3EHANDY%20SCAN.%3C/a%3E%20Let%20your%20lover%20fall%20into%20your%20capable%20hands%20(and%20other%20capable%20areas,%20as%20well).%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"HANDY%20SCAN.%20Let%20your%20lover%20fall%20into%20your%20capable%20hands%20(and%20other%20capable%20areas,%20as%20well)."},{"element-name":"amorous-anal-yst","display-name":"Amorous Anal-yst","svg-name":"AmorousAnalyst.svg",orientation:"vertical","cancer-type":"prostate","display-cancer-type":"Prostate Cancer","detail-html":"<p>Seat your partner on the edge of the bed or table, and find a comfortable spot between his open legs. While your mouth may instinctively do what mouths do best when faced with a cylindrical object, don't let that be the only job you get done. Gently allow your finger to make its way up, up, and away, to find the Promised Gland.*</p>","just-the-tip":"If the seated position is causing your fingers to fumble, give yourself an all-access pass, by simply lying your lover on his back.","full-size":!1,"overview-index":3,"chapter-index":3,"og:description":"The #CancerSutra Presents: AMOROUS ANAL-YST. Here's a pointer (at the very least) on how to check your partner tonight.","banner-name":"CS_Social_AmorousAnalyst.png",bitly:"http://bit.ly/1PSxIAs","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/amorous-anal-yst'>AMOROUS ANAL-YST.</a> Here's a pointer (at the very least) on how to check your partner tonight. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20AMOROUS%20ANAL-YST.%20Here's%20a%20pointer%20(at%20the%20very%20least)%20on%20how%20to%20check%20your%20partner%20tonight.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/amorous-anal-yst'%3EAMOROUS%20ANAL-YST.%3C/a%3E%20Here's%20a%20pointer%20(at%20the%20very%20least)%20on%20how%20to%20check%20your%20partner%20tonight.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"AMOROUS%20ANAL-YST.%20Here's%20a%20pointer%20(at%20the%20very%20least)%20on%20how%20to%20check%20your%20partner%20tonight."},{"element-name":"legs-up-checkup","display-name":"Legs Up Checkup","svg-name":"LegsUpCheckup.svg",orientation:"vertical","cancer-type":"skin","display-cancer-type":"Skin Cancer","detail-html":"<p>Raise your partner's legs into the air for maximum pleasure and visibility. As you begin playing your favorite tune on her lady harmonica*, take note of the recital space you've found between her legs, dividing your attention equally between either of her thighs. Once you've given her thighs the once over with your eyes, remember to give it the twice-under with your hands to make the most of your debut performance.</p>","just-the-tip":'You know the one: It sounds something like, "Yes, yes, oh yes!"',"full-size":!0,"overview-index":4,"chapter-index":1,"og:description":"The #CancerSutra Presents: LEGS UP Checkup. Open yourself up to a new kind of checkup.","banner-name":"CS_Social_LegsUpCheckup.png",bitly:"http://bit.ly/1P2IlhV","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/legs-up-checkup'>LEGS UP Checkup.</a> More than a mouthful, it's the quickest of any at-home cancer check. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer.  <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20LEGS%20UP%20Checkup.%20Open%20yourself%20up%20to%20a%20new%20kind%20of%20checkup.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/legs-up-checkup'%3ELEGS%20UP%20Checkup.%3C/a%3E%20More%20than%20a%20mouthful,%20it's%20the%20quickest%20of%20any%20at-home%20cancer%20check.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"LEGS%20UP%20Checkup.%20Open%20yourself%20up%20to%20a%20new%20kind%20of%20checkup."},{"element-name":"manogram","display-name":"Manogram","svg-name":"Manogram.svg",orientation:"square","cancer-type":"breast","display-cancer-type":"Breast Cancer","detail-html":"<p>Come to rest beside your partner. Then, stop resting. As you inject a little more than fun into your routine, raise your lover's arm over your head and bring your hand to his chest. While your hips do the rocking, let your hands do the checking, making their way from tip top of the teat to the base of the bosom.*</p>","just-the-tip":"Once you've explored this Everest, make your way to other climes by switching sides.","full-size":!1,"overview-index":5,"chapter-index":2,"og:description":"The #CancerSutra Presents: MANOGRAM. A checkup with a couple of quality perks.","banner-name":"CS_Social_Manogram.png",bitly:"http://bit.ly/1J6ptg8","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/manogram'>MANOGRAM.</a> A checkup with a couple of quality perks. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20MANOGRAM.%20A%20checkup%20with%20a%20couple%20of%20quality%20perks.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/manogram'%3EMANOGRAM.%3C/a%3E%20A%20checkup%20with%20a%20couple%20of%20quality%20perks.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"MANOGRAM.%20A%20checkup%20with%20a%20couple%20of%20quality%20perks."},{"element-name":"cat-or-matt-scan","display-name":"Cat (or Matt) Scan","svg-name":"CatOrMattScan.svg",orientation:"horizontal","cancer-type":"skin","display-cancer-type":"Skin Cancer","detail-html":"<p>Lie your partner on her back and raise her legs so that they find a comfortable place on your shoulders. Now, bring your partner's arms above her head and hold them there with one hand. As Junior finds his place in one of two members-only* clubs, you can study the magnificence of your lover, from the chest up.</p>","just-the-tip":"Though we've heard they make exceptions for very nice toys.","full-size":!1,"overview-index":6,"chapter-index":3,"og:description":"The #CancerSutra Presents: CAT (OR MATT) SCAN. Stick it to cancer, hard, with this position.","banner-name":"CS_Social_CatOrMattScan.png",bitly:"http://bit.ly/1J6ptge","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/cat-or-matt-scan'>CAT (OR MATT) SCAN.</a> Stick it to cancer, hard, with this position. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer.  <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20CAT%20(OR%20MATT)%20SCAN.%20Stick%20it%20to%20cancer,%20hard,%20with%20this%20position.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/cat-or-matt-scan'%3ECAT%20(OR%20MATT)%20SCAN.%3C/a%3E%20Stick%20it%20to%20cancer,%20hard,%20with%20this%20position.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"CAT%20(OR%20MATT)%20SCAN.%20Stick%20it%20to%20cancer,%20hard,%20with%20this%20position."},{"element-name":"enter-the-proctologist","display-name":"Enter the Proctologist","svg-name":"EnterTheProctologist.svg",orientation:"horizontal","cancer-type":"prostate","display-cancer-type":"Prostate Cancer","detail-html":"<p>Begin by lying your partner down on a flat surface,* and gently mounting one of his thighs so that your knees are on either side of this leg. Now, take a finger and enter into his most concealed of caverns, arching the finger upwards to reach the prostate. (Enjoy that moan; you've earned it.) Run your finger along the length of the upwards interior of his rectum, and get as much of a feeling for things... as you're giving him.</p>","just-the-tip":"Of course, flat can fall flat sometimes &mdash; and as we all know, gravity doesn't (and shouldn't) always pertain to the behavior of legs. Try placing a pillow under the small of his back for a more open kind of access.","full-size":!0,"overview-index":7,"chapter-index":1,"og:description":"The #CancerSutra Presents: ENTER THE PROCTOLOGIST. Take this checkup to bed to put your finger on this most sensitive issue.","banner-name":"CS_Social_EnterTheProctologist.png",bitly:"http://bit.ly/1JxTGbh","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/enter-the-proctologist'>ENTER THE PROCTOLOGIST.</a> Take this checkup to bed to put your finger on this most sensitive issue. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20ENTER%20THE%20PROCTOLOGIST.%20Take%20this%20checkup%20to%20bed%20to%20put%20your%20finger%20on%20this%20most%20sensitive%20issue.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/enter-the-proctologist'%3EENTER%20THE%20PROCTOLOGIST.%3C/a%3E%20Take%20this%20checkup%20to%20bed%20to%20put%20your%20finger%20on%20this%20most%20sensitive%20issue.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"ENTER%20THE%20PROCTOLOGIST.%20Take%20this%20checkup%20to%20bed%20to%20put%20your%20finger%20on%20this%20most%20sensitive%20issue."},{"element-name":"dr-ben-dover","display-name":"Dr. Ben Dover","svg-name":"DrBenDover.svg",orientation:"horizontal","cancer-type":"prostate","display-cancer-type":"Prostate Cancer","detail-html":"<p>With this hand, you do him bed. And with the other, you'll do something quite a bit more daring.</p> <p>Start this position by lying your partner on his back. Evoking the exhibitionist in yourself, find a place seated comfortably on his chest.* While you'll undoubtedly want to tend to his most forthcoming of desires, free a hand to discover a more secretive one. For while you fill a void he never dreamed he needed filling, you'll be winding down this checkup &mdash; but only winding up the fun.</p>","just-the-tip":"Now just because he's reaching completion, doesn't mean he should sit idly by. While you attend to  his business, make sure he attends to your pleasure.","full-size":!1,"overview-index":8,"chapter-index":4,"og:description":"The #CancerSutra Presents: DR. BEN DOVER. Let's get to the bottom of this checkup!","banner-name":"CS_Social_DrBenDover.png",bitly:"http://bit.ly/1HU1G62","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/dr-ben-dover'>DR. BEN DOVER.</a> Let's get to the bottom of this checkup! <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","chapter-full-size":!0,"og:description-encoded":"The%20%23#CancerSutra%20Presents:%20DR.%20BEN%20DOVER.%20Let's%20get%20to%20the%20bottom%20of%20this%20checkup!","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/dr-ben-dover'%3EDR.%20BEN%20DOVER.%3C/a%3E%20Let's%20get%20to%20the%20bottom%20of%20this%20checkup!%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"DR.%20BEN%20DOVER.%20Let's%20get%20to%20the%20bottom%20of%20this%20checkup!"},{"element-name":"teste-teste-1-2","display-name":"Teste, Teste, 1, 2","svg-name":"TesteTeste12.svg",orientation:"vertical","cancer-type":"testicular","display-cancer-type":"Testicular Cancer","detail-html":"<p>Bring your lover to a wall,* and have him brace himself against it. Then assert (or is it, <em>insert?</em>) yourself. Pump away while you bring your hands down in front of him. With your hips and hands combined, this checkup may not be the only thing you bring to completion.</p>","just-the-tip":"Windows and mirrors are especially handy, for the extra cheeky among you.","full-size":!1,"overview-index":9,"chapter-index":6,"og:description":"The #CancerSutra Presents: TEST, TESTE, 1, 2. Tickle your lover's fancy (among other things) with this position.","banner-name":"CS_Social_TesteTeste12.png",bitly:"http://bit.ly/1FuzUew","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/teste-teste-1-2'>TEST, TESTE, 1, 2.</a> Tickle your lover's fancy (among other things) with this position. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20TEST,%20TESTE,%201,%202.%20Tickle%20your%20lover's%20fancy%20(among%20other%20things)%20with%20this%20position.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/teste-teste-1-2'%3ETEST,%20TESTE,%201,%202.%3C/a%3E%20Tickle%20your%20lover's%20fancy%20(among%20other%20things)%20with%20this%20position.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"TEST,%20TESTE,%201,%202.%20Tickle%20your%20lover's%20fancy%20(among%20other%20things)%20with%20this%20position."},{"element-name":"guy-ropractor","display-name":"Guy-ropractor","svg-name":"Guyropractor.svg",orientation:"vertical","cancer-type":"testicular","display-cancer-type":"Testicular Cancer","detail-html":"<p>Lie your partner to the floor, then turn away from him. Now just when he thinks you're giving him the cold shoulder, let him enjoy a much warmer part of your body. As you give his penetrating gaze a penetrating act to gaze upon, lean forward and take his testicles into your hand to put this checkup fully under your belt.</p>","just-the-tip":"If he's far too excitable, a little warmth from the palms of your hand should loosen things up enough for you to complete this little exam.","full-size":!0,"overview-index":10,"chapter-index":5,"og:description":"The #CancerSutra Presents: GUY-ROPRACTOR. This checkup will never leave your lover hanging.","banner-name":"CS_Social_GuyRopractor.png",bitly:"http://bit.ly/1HU1MKP","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/guy-ropractor'>GUY-ROPRACTOR.</a> This checkup will never leave your lover hanging. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20GUY-ROPRACTOR.%20This%20checkup%20will%20never%20leave%20your%20lover%20hanging.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/guy-ropractor'%3EGUY-ROPRACTOR.%3C/a%3E%20This%20checkup%20will%20never%20leave%20your%20lover%20hanging.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"GUY-ROPRACTOR.%20This%20checkup%20will%20never%20leave%20your%20lover%20hanging."},{"element-name":"sack-and-save","display-name":"Sack & Save","svg-name":"SackAndSave.svg",orientation:"vertical","cancer-type":"testicular","display-cancer-type":"Testicular Cancer","detail-html":"<p>Try your hand at this position to warm things up before the main event.</p><p>Slide in behind your lover and bring one arm across his chest.* While you nibble at his neck and whisper sweet, unmentionable things in his ear, bring your other hand around to his trunks. Resist the temptation to stop on the way to the family jewels; you can attend to his more forthright urges later.</p>","just-the-tip":"While you're there, try teasing this beefy bosom of his. With stimulation coming from all directions, it won't be long until he's pining to discover your other talents.","full-size":!1,"overview-index":11,"chapter-index":2,"og:description":"The #CancerSutra Presents: SACK & SAVE. Add some heat to the sack...by fondling his.","banner-name":"CS_Social_SackAndSave.png",bitly:"http://bit.ly/1JOvSfZ","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/sack-and-save'>SACK & SAVE.</a> Add some heat to the sack…by fondling his. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20SACK%20&%20SAVE.%20Add%20some%20heat%20to%20the%20sack...by%20fondling%20his.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/sack-and-save'%3ESACK%20&%20SAVE.%3C/a%3E%20Add%20some%20heat%20to%20the%20sack%E2%80%A6by%20fondling%20his.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"SACK%20&%20SAVE.%20Add%20some%20heat%20to%20the%20sack...by%20fondling%20his."},{"element-name":"insider-information","display-name":"Insider Information","svg-name":"InsiderInformation.svg",orientation:"vertical","cancer-type":"skin","display-cancer-type":"Skin Cancer","detail-html":"<p>Find yourself behind your partner and position him on his knees. Now, find yourself in rather a more intimate proximity to your partner. As you get in (and out of) the groove of things, take the palms of your hands and lead them from the nape of the neck to the outside of the cheeks, employing a gentle touch* to feel for any abnormalities that may yet escape the eye.</p>","just-the-tip":"Do not always go gentle into that good pie. Once you've felt for all there is to feel, add a slap to signify the end &mdash; then, offer yourself up for a check.","full-size":!1,"overview-index":12,"chapter-index":2,"og:description":"The #CancerSutra Presents: INSIDER INFORMATION. Give cancer the pounding of a lifetime tonight.","banner-name":"CS_Social_InsiderInformation.png",bitly:"http://bit.ly/1bPHTrd","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/insider-information'>INSIDER INFORMATION.</a> Give cancer the pounding of a lifetime tonight. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer.  <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20INSIDER%20INFORMATION.%20Give%20cancer%20the%20pounding%20of%20a%20lifetime%20tonight.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/insider-information'%3EINSIDER%20INFORMATION.%3C/a%3E%20Give%20cancer%20the%20pounding%20of%20a%20lifetime%20tonight.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"INSIDER%20INFORMATION.%20Give%20cancer%20the%20pounding%20of%20a%20lifetime%20tonight."},{"element-name":"triple-x-ray","display-name":"Triple X-Ray","svg-name":"TripleXRay.svg",orientation:"horizontal","cancer-type":"skin","display-cancer-type":"Skin Cancer","detail-html":"<p>Make your way to a flat surface, like a bed, floor, or countertop, and sit facing your lover. Ladies, place your legs on your man's shoulders, to give him unobstructed access to your most guarded secret. Bracing yourself with your hands behind you, guide your thrusts at your own pace. Your partner should be giving you quite the look-over* by this point &mdash; but don't forget to return the favor. Eye his chest and neck, and remember to stare penetratingly into his gaze. After all, it's always nice to reciprocate.</p>","just-the-tip":"Men: As you row your way to completion, observe the inside of your lover's ankles and feet. A kiss and nibble on either will go a long way to making this position worth both your whiles.","full-size":!0,"overview-index":13,"chapter-index":10,"og:description":"The #CancerSutra Presents: TRIPLE X-RAY. Give your partner a leg-up (or two): Enjoy this checkup tonight.","banner-name":"CS_Social_TripleXRay.png",bitly:"http://bit.ly/1PSy6z3","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/triple-x-ray'>TRIPLE X-RAY.</a> Give your partner a leg-up (or two): Enjoy this checkup tonight. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20TRIPLE%20X-RAY.%20Give%20your%20partner%20a%20leg-up%20(or%20two):%20Enjoy%20this%20checkup%20tonight.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/triple-x-ray'%3ETRIPLE%20X-RAY.%3C/a%3E%20Give%20your%20partner%20a%20leg-up%20(or%20two):%20Enjoy%20this%20checkup%20tonight.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"TRIPLE%20X-RAY.%20Give%20your%20partner%20a%20leg-up%20(or%20two):%20Enjoy%20this%20checkup%20tonight."},{"element-name":"rearsearch-method","display-name":"Rearsearch Method","svg-name":"RearsearchMethod.svg",orientation:"square","cancer-type":"prostate","display-cancer-type":"Prostate Cancer","detail-html":"<p>Make your way between your partner's legs, then throw one over your shoulder. As you enter into this erotic position, take a finger (or two) and enter into his welcoming opening.* Should you require, raise both legs to your shoulders for even greater access to his lovely asset.</p>","just-the-tip":"This is a one-handed operation, so feel free to practice your ambidexterity on his more prominent urges while you perform this checkup.","full-size":!1,"overview-index":14,"chapter-index":2,"og:description":"The #CancerSutra Presents: REARSEARCH METHOD. Pop in and enjoy this checkup tonight.","banner-name":"CS_Social_RearsearchMethod.png",bitly:"http://bit.ly/1GsO3oB","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/rearsearch-method'>REARSEARCH METHOD.</a> Pop in and enjoy this checkup tonight. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20REARSEARCH%20METHOD.%20Pop%20in%20and%20enjoy%20this%20checkup%20tonight.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/rearsearch-method'%3EREARSEARCH%20METHOD.%3C/a%3E%20Pop%20in%20and%20enjoy%20this%20checkup%20tonight.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"REARSEARCH%20METHOD.%20Pop%20in%20and%20enjoy%20this%20checkup%20tonight."},{"element-name":"wham-bam-mamogram","display-name":"Wham Bam, Mammogram","svg-name":"WhamBamMammogram.svg",orientation:"horizontal","cancer-type":"breast","display-cancer-type":"Breast Cancer","detail-html":"<p>Find your way to the floor and kneel in front of one another, face-to-blushing face. Raise opposing legs and place them on either side of your lover, allowing your unmentionables to venture into the irresistible. As you lock yourselves in one another's ecstatic embrace, take a hand each and bring them to your lover's chest, cupping and squeezing solid pec or supple breast. Follow the aforementioned TWEAK technique to bring this position to completion.*</p>","just-the-tip":"It is widely regarded as a criminal act to neglect a free nipple.<br><br>Do not act criminally.&#10013;<br><br>&#10013;Unless you both know the safe word.","full-size":!1,"overview-index":15,"chapter-index":7,"og:description":"The #CancerSutra Presents: WHAM BAM, MAMMOGRAM. A checkup with just the right amount of wiggle room.","banner-name":"CS_Social_WhamBamMammogram.png",bitly:"http://bit.ly/1Ejjeo3","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/wham-bam-mamogram'>WHAM BAM, MAMMOGRAM.</a> A checkup with just the right amount of wiggle room. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20WHAM%20BAM,%20MAMMOGRAM.%20A%20checkup%20with%20just%20the%20right%20amount%20of%20wiggle%20room.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/wham-bam-mamogram'%3EWHAM%20BAM,%20MAMMOGRAM.%3C/a%3E%20A%20checkup%20with%20just%20the%20right%20amount%20of%20wiggle%20room.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"WHAM%20BAM,%20MAMMOGRAM.%20A%20checkup%20with%20just%20the%20right%20amount%20of%20wiggle%20room."},{"element-name":"split-screening","display-name":"Split Screening","svg-name":"SplitScreening.svg",orientation:"vertical","cancer-type":"skin","display-cancer-type":"Skin Cancer","detail-html":"<p>Position yourself in a seated, half-upright position on a bed or deep chair, and bend your knee so that it can be kept effortlessly raised.</p><p>Now, let your partner straddle this raised knee, facing away, so that your world and hers collide (part, collide, part, and collide again). While she's free to gyrate and thrust to her heart's (and other parts') content,* take this rare opportunity to admire the view of an oft-hidden sight: her back.</p><p>Your gaze should take you from shoulder blades to the small of her back, all while allowing your fingertips to venture where vision cannot.</p>","just-the-tip":"While your partner's back is to you, you may find your view obstructed by her hair. For those of you so inclined and reclined, take matters into your own hands — literally. A firm grasp of her luscious locks won't just clear the path for your intimately watchful gaze, but can also let you steer the course in the sack. ","full-size":!0,"overview-index":16,"chapter-index":4,"float":"right","og:description":"The #CancerSutra Presents: SPLIT-SCREENING. Fit a little check up (among other things) in between you and your lover.","banner-name":"CS_Social_SplitScreening.png",bitly:"http://bit.ly/1FuA3yB","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/split-screening'>SPLIT-SCREENING.</a> Fit a little check up (among other things) in between you and your lover. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20SPLIT-SCREENING.%20Fit%20a%20little%20check%20up%20(among%20other%20things)%20in%20between%20you%20and%20your%20lover.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/split-screening'%3ESPLIT-SCREENING.%3C/a%3E%20Fit%20a%20little%20check%20up%20(among%20other%20things)%20in%20between%20you%20and%20your%20lover.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"SPLIT-SCREENING.%20Fit%20a%20little%20check%20up%20(among%20other%20things)%20in%20between%20you%20and%20your%20lover."},{"element-name":"chest-xxxam","display-name":"Chest XXXam","svg-name":"ChestXXXam.svg",orientation:"horizontal","cancer-type":"breast","display-cancer-type":"Breast Cancer","detail-html":"<p>Lay your partner down to peep this most erotic position. Now find your way on top of him, and allow him to fill your heart's &mdash; and other body parts' &mdash; desires. While his hips in and out do slip, let your hands slide &mdash; down, down,* to feel out his pecs. Hold on for life, liberty, and the pursuit of orgasm, as you come to finish this exam.</p>","just-the-tip":"What goes down, must come up (and down, and up ...), so don't forget to raise his arms and take in the whole of his tantalizing torso.","full-size":!1,"overview-index":17,"chapter-index":6,"og:description":"The #CancerSutra Presents: CHEST XXXAM. Checking for cancer has never been more tit-for-tat.","banner-name":"CS_Social_ChestXXXam.png",bitly:"http://bit.ly/1zk6j6E","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/chest-xxxam'>CHEST XXXAM.</a> Checking for cancer has never been more tit-for-tat. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20CHEST%20XXXAM.%20Checking%20for%20cancer%20has%20never%20been%20more%20tit-for-tat.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/chest-xxxam'%3ECHEST%20XXXAM.%3C/a%3E%20Checking%20for%20cancer%20has%20never%20been%20more%20tit-for-tat.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"CHEST%20XXXAM.%20Checking%20for%20cancer%20has%20never%20been%20more%20tit-for-tat."},{"element-name":"closer-examination","display-name":"Closer Examination","svg-name":"CloserExamination.svg",orientation:"square","cancer-type":"breast","display-cancer-type":"Breast Cancer","detail-html":"<p>This position is good for the pair &mdash; ahem &mdash of you.</p><p>Find your way to the floor and kneel in front of one another, face-to-blushing face. Raise opposing legs and place them on either side of your lover, allowing your unmentionables to venture into the irresistible. As you lock yourselves in one another's ecstatic embrace, take a hand each and bring them to your lover's chest, cupping and squeezing solid pec or supple breast. Follow the aforementioned TWEAK technique to bring this position to completion.*</p>","just-the-tip":"There's nothing like a lopsided checkup. Don't forget to switch hands (and for that matter, what they're holding) after you've sated your initial curiosity.","full-size":!1,"overview-index":18,"chapter-index":11,"og:description":"The #CancerSutra Presents: CLOSER EXAMINATION. Find yourself with a familiar squeeze. Or two.","banner-name":"CS_Social_CloserExamination.png",bitly:"http://bit.ly/1DxjmfW","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/closer-examination'>CLOSER EXAMINATION.</a><br><br>Find yourself with a familiar squeeze. Or two. Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20CLOSER%20EXAMINATION.%20Find%20yourself%20with%20a%20familiar%20squeeze.%20Or%20two.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/closer-examination'%3ECLOSER%20EXAMINATION.%3C/a%3E%3Cbr%3E%3Cbr%3EFind%20yourself%20with%20a%20familiar%20squeeze.%20Or%20two.%20Or%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"CLOSER%20EXAMINATION.%20Find%20yourself%20with%20a%20familiar%20squeeze.%20Or%20two."},{"element-name":"check-please-please-please","display-name":"Check, Please, Please, Please!","svg-name":"CheckPleasePleasePlease.svg",orientation:"horizontal","cancer-type":"testicular","display-cancer-type":"Testicular Cancer","detail-html":"<p>Lying down beside or on top* of your lover, take this time to lock eyes with him. Then, promptly swivel around, so you both might lock eyes on something rather more interesting. While you two practice your lower-level linguistic skills, take his testicles into your capable hands.</p>","just-the-tip":"Or, perhaps, try both. Seeing the angle of his dangle from as many vantage points as possible is always advisable (and always fun).","full-size":!0,"overview-index":19,"chapter-index":4,"og:description":"The #CancerSutra Presents: CHECK, PLEASE, PLEASE, PLEASE! Learn your way around a sack in the sack.","banner-name":"CS_Social_CheckPleasePleasePlease.png",bitly:"http://bit.ly/1JxU3Tl","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/check-please-please-please'>CHECK, PLEASE, PLEASE, PLEASE!</a> Learn your way around a sack in the sack. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20CHECK,%20PLEASE,%20PLEASE,%20PLEASE!%20Learn%20your%20way%20around%20a%20sack%20in%20the%20sack.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/check-please-please-please'%3ECHECK,%20PLEASE,%20PLEASE,%20PLEASE!%3C/a%3E%20Learn%20your%20way%20around%20a%20sack%20in%20the%20sack.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"CHECK,%20PLEASE,%20PLEASE,%20PLEASE!%20Learn%20your%20way%20around%20a%20sack%20in%20the%20sack."},{"element-name":"pair-scope","display-name":"Pair-scope","svg-name":"PairScope.svg",orientation:"vertical","cancer-type":"breast","display-cancer-type":"Breast Cancer","detail-html":"<p>If there's one thing you should always get behind, it's your partner. So begin there. Then, gently bring one hand around and down, and tap out in Morse code, the words \"I L-O-V-E Y-O-U.\"* While your heart and fingers go pitter patter, bring your other hand around to meet her breasts. A firm grip and a gentle pinch will round out the completion of this checkup.</p>","just-the-tip":"Tap-tap, swipe, tap-rub-tap-tap, rub-a-dub-dub, tappity-tap, rub. Repeat.","full-size":!1,"overview-index":20,"chapter-index":5,"og:description":"The #CancerSutra Presents: PAIR-SCOPE. Because true love has always been about the perfect pair.","banner-name":"CS_Social_PairScope.png",bitly:"http://bit.ly/1GBYLvI","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/pair-scope'>PAIR-SCOPE.</a> Because true love has always been about the perfect pair. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20PAIR-SCOPE.%20Because%20true%20love%20has%20always%20been%20about%20the%20perfect%20pair.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/pair-scope'%3EPAIR-SCOPE.%3C/a%3E%20Because%20true%20love%20has%20always%20been%20about%20the%20perfect%20pair.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"PAIR-SCOPE.%20Because%20true%20love%20has%20always%20been%20about%20the%20perfect%20pair."},{"element-name":"derm-oh-oh-oh-tology","display-name":"Derm-oh-oh-oh-tology","svg-name":"DermOhOhOhTology.svg",orientation:"vertoca;","cancer-type":"skin","display-cancer-type":"Skin Cancer","detail-html":"<p>Lie your partner flat on her stomach, and mount her from behind. Start from the top, using your fingers as guides and your thumbs to massage in slow, circular patterns* down the shoulder blades and lower, lower, ever lower &mdash; to those less frequented territories of your partner's desires.</p>","just-the-tip":"Deep and hard is all well and good, but never underestimate the power of a gentle touch. Try stroking your partner's back lightly with just the tips of your fingers, as this may reveal to you textures in your partner's skin a firmer grasp may cause you to miss.","full-size":!1,"overview-index":21,"chapter-index":8,"og:description":"The #CancerSutra Presents: DERM-OH-OH-OH-TOLOGY. Checkups are like anything else between the sheets: It pays to go deeper.","banner-name":"CS_Social_DermOhOhOhTology.png",bitly:"http://bit.ly/1HNW3Vi","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/derm-oh-oh-oh-tology'>DERM-OH-OH-OH-TOLOGY.</a> Checkups are like anything else between the sheets: It pays to go deeper. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20DERM-OH-OH-OH-TOLOGY.%20Checkups%20are%20like%20anything%20else%20between%20the%20sheets:%20It%20pays%20to%20go%20deeper.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/derm-oh-oh-oh-tology'%3EDERM-OH-OH-OH-TOLOGY.%3C/a%3E%20Checkups%20are%20like%20anything%20else%20between%20the%20sheets:%20It%20pays%20to%20go%20deeper.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"DERM-OH-OH-OH-TOLOGY.%20Checkups%20are%20like%20anything%20else%20between%20the%20sheets:%20It%20pays%20to%20go%20deeper."},{"element-name":"open-book-teste","display-name":"Open-Book Teste","svg-name":"OpenBookTeste.svg",orientation:"vertical","cancer-type":"testicular","display-cancer-type":"Testicular Cancer","detail-html":"<p>While your lover is seated, position yourself in front of him, face-to-genitals. While you stimulate him orally, place a testicle between the pads of your thumb and index finger, lightly rolling it so you get a feel for the whole surface.*</p>","just-the-tip":"With all of this stimulation, you may find that his testicles are starting to tighten into his body, restricting access to that second succulent egg. No matter. A little warm teasing from your tongue and mouth should coax this bashful little ball out of hiding.","full-size":!1,"overview-index":22,"chapter-index":3,"og:description":"The #CancerSutra Presents: OPEN-BOOK TESTE. May your actions be a teste-ment to your love tonight.","banner-name":"CS_Social_OpenBookTeste.png",bitly:"http://bit.ly/1DTcVnO","long-description":"The #CancerSutra Presents: <a href='http://cancersutra.com/positions/open-book-teste'>OPEN-BOOK TESTE.</a> May your actions be a teste-ment to your love tonight. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20OPEN-BOOK%20TESTE.%20May%20your%20actions%20be%20a%20teste-ment%20to%20your%20love%20tonight.","long-description-encoded":"The%20%23#CancerSutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/open-book-teste'%3EOPEN-BOOK%20TESTE.%3C/a%3E%20May%20your%20actions%20be%20a%20teste-ment%20to%20your%20love%20tonight.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"OPEN-BOOK%20TESTE.%20May%20your%20actions%20be%20a%20teste-ment%20to%20your%20love%20tonight."},{"element-name":"deep-ass-essment","display-name":"Deep Ass-essment","svg-name":"DeepAssessment.svg",orientation:"vertical","cancer-type":"skin","display-cancer-type":"Skin Cancer","detail-html":"<p>Begin by raising your partner's legs straight into the air, holding them aloft by the ankles. As you fill a niche only you can fill, get to the real thrust of the matter by beholding a view that is too infrequently beheld: the back of his legs. Let your gaze fall from toe to bum, not just for a deep inspection, but for inspiration for your penetration.*</p>","just-the-tip":"Once you've given this area your undivided attention &mdash; try dividing it. Bring your partner's legs round for a different side to your carnal wanderings and watchful meanderings. When you've had your fill, take it in (or rather, have him take it in) from the opposite side. Remember to employ your hands as vigorously as you do your eyes in this deep ass-essment.","full-size":!1,"overview-index":23,"chapter-index":9,"og:description":"The #CancerSutra Presents: DEEP ASS-ESSMENT. A position to help fill your curiosity—among other things—tonight.","banner-name":"CS_Social_DeepAssessment.png",bitly:"http://bit.ly/1DTcVnO","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/deep-ass-essment'>DEEP ASS-ESSMENT.</a> A position to help fill your curiosity—among other things—tonight. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20DEEP%20ASS-ESSMENT.%20A%20position%20to%20help%20fill%20your%20curiosity%E2%80%94among%20other%20things%E2%80%94tonight.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/deep-ass-essment'%3EDEEP%20ASS-ESSMENT.%3C/a%3E%20A%20position%20to%20help%20fill%20your%20curiosity%E2%80%94among%20other%20things%E2%80%94tonight.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"DEEP%20ASS-ESSMENT.%20A%20position%20to%20help%20fill%20your%20curiosity%E2%80%94among%20other%20things%E2%80%94tonight."},{"element-name":"whats-cupped-doc","display-name":"What's Cupped, Doc?","svg-name":"WhatsCuppedDoc.svg",orientation:"horizontal","cancer-type":"breast","display-cancer-type":"Breast Cancer","detail-html":"<p>If you're going to bend over backwards for everyone else, make sure that every now and then, your partner bends over forwards for you.* As your one hand makes its way around her hips to play its very important part, cup your other hand around her breast &mdash; and enjoy the feeling as it runneth over.</p>","just-the-tip":"Forwards is fun, but upwards is unparalleled. Try bringing your partner to her full, upright position, and checking her chest from this upstanding position.","full-size":!0,"overview-index":24,"chapter-index":8,"og:description":"The #CancerSutra Presents: WHAT'S CUPPED, DOC? When it comes to screening, this position is a handful.","banner-name":"CS_Social_WhatsCuppedDoc.png",bitly:"http://bit.ly/1DHCDN4","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/whats-cupped-doc'>WHAT'S CUPPED, DOC?</a> When it comes to screening, this position is a handful. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20WHAT'S%20CUPPED,%20DOC?%20When%20it%20comes%20to%20screening,%20this%20position%20is%20a%20handful.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/whats-cupped-doc'%3EWHAT'S%20CUPPED,%20DOC?%3C/a%3E%20When%20it%20comes%20to%20screening,%20this%20position%20is%20a%20handful.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"WHAT'S%20CUPPED,%20DOC?%20When%20it%20comes%20to%20screening,%20this%20position%20is%20a%20handful."},{"element-name":"private-screening","display-name":"Private Screening","svg-name":"PrivateScreening.svg",orientation:"vertical","cancer-type":"breast","display-cancer-type":"Breast Cancer","detail-html":"<p>Fall into your lover's arms, interlocking legs so that your thighs assume the role of two makeshift saddles. Now: commence the sideways gallop. As the pair of you buck and rear against one another, bring one hand up to find her breast. TWEAK away into the wee hours of the night, pausing only* to switch sides.</p>","just-the-tip":"That is, until it's time for your partner to give you your own private screening.","full-size":!1,"overview-index":25,"chapter-index":10,"og:description":"The #CancerSutra Presents: PRIVATE SCREENING. Proving cancer screening can be a handful—at least, when done correctly.","banner-name":"CS_Social_PrivateScreening.png",bitly:"http://bit.ly/1baeXZB","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/private-screening'>PRIVATE SCREENING.</a> Proving cancer screening can be a handful—at least, when done correctly. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20PRIVATE%20SCREENING.%20Proving%20cancer%20screening%20can%20be%20a%20handful%E2%80%94at%20least,%20when%20done%20correctly.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/private-screening'%3EPRIVATE%20SCREENING.%3C/a%3E%20Proving%20cancer%20screening%20can%20be%20a%20handful%E2%80%94at%20least,%20when%20done%20correctly.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"PRIVATE%20SCREENING.%20Proving%20cancer%20screening%20can%20be%20a%20handful%E2%80%94at%20least,%20when%20done%20correctly."},{"element-name":"inspector-grab-it","display-name":"Inspector Grab-It","svg-name":"InspectorGrabIt.svg",orientation:"vertical","cancer-type":"breast","display-cancer-type":"Breast Cancer","detail-html":"<p>Sit back and enjoy the scenery, as your partner mounts you, facing away. While he brings your soldier into line (and crevice), rise to the occasion once more and wrap you arms around him. Your hands should find their way to both of his masculine mounds* &mdash; but don't let them be your only stop on your merry way to completion.</p>","just-the-tip":"Checking with his arms down is always a good start. But don't forget to raise each arm to let your digits dig into more delectable domains.","full-size":!1,"overview-index":26,"chapter-index":6,"og:description":"The #CancerSutra Presents: INSPECTOR GRAB-IT. Take this sensual checkup into your own hands tonight.","banner-name":"CS_Social_InspectorGrabIt.png",bitly:"http://bit.ly/1OzH5rH","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/inspector-grab-it'>INSPECTOR GRAB-IT.</a> Take this sensual checkup into your own hands tonight. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20INSPECTOR%20GRAB-IT.%20Take%20this%20sensual%20checkup%20into%20your%20own%20hands%20tonight.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/inspector-grab-it'%3EINSPECTOR%20GRAB-IT.%3C/a%3E%20Take%20this%20sensual%20checkup%20into%20your%20own%20hands%20tonight.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"INSPECTOR%20GRAB-IT.%20Take%20this%20sensual%20checkup%20into%20your%20own%20hands%20tonight."},{"element-name":"nutty-professor","display-name":"Nutty Professor","svg-name":"NuttyProfessor.svg",orientation:"vertical","cancer-type":"testicular","display-cancer-type":"Testicular Cancer","detail-html":"<p>Service, please! While your partner is standing, let your knees find their way to the floor in front of him.* As your lips find something to occupy themselves with, let your hand make its way to his testicles. But gentle, gentle; lest you turn his ecstatic moans into woeful groans.</p>","just-the-tip":"Remember that when it comes to relationships, privates should never be kept private. Be sure to offer yourself up for a little examination &mdash; and a lot of stimulation.","full-size":!0,"overview-index":27,"chapter-index":1,"og:description":"The #CancerSutra Presents: NUTTY PROFESSOR. He'll go nuts for this checkup tonight.","banner-name":"CS_Social_NuttyProfessor.png",bitly:"http://bit.ly/1AbkuFO","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/nutty-professor'>NUTTY PROFESSOR.</a> He'll go nuts for this checkup tonight. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20%3ENUTTY%20PROFESSOR.%20He'll%20go%20nuts%20for%20this%20checkup%20tonight.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/nutty-professor'%3ENUTTY%20PROFESSOR.%3C/a%3E%20He'll%20go%20nuts%20for%20this%20checkup%20tonight.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"NUTTY%20PROFESSOR.%20He'll%20go%20nuts%20for%20this%20checkup%20tonight."},{"element-name":"study-buddy","display-name":"Study Buddy","svg-name":"StudyBuddy.svg",orientation:"square","cancer-type":"breast","display-cancer-type":"Breast Cancer","detail-html":"<p>Now to make sure you make the most of this guide, have your Study Buddy lend you a hand.* Sit face-to-face, and bring your legs criss-cross across one another. Tightening your hold against one another, guide your hands down to your lover's breast, and fill your head as easily as you do your hand.</p>","just-the-tip":"A good Study Buddy always reciprocates. While you're giving your partner a handful, make sure she does the same.","full-size":!1,"overview-index":28,"chapter-index":12,"og:description":"The #CancerSutra Presents: STUDY BUDDY. You'll have your hands full with this checkup tonight.","banner-name":"CS_Social_StudyBuddy.png",bitly:"http://bit.ly/1JOxdnc","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/study-buddy'>STUDY BUDDY.</a> You'll have your hands full with this checkup tonight. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer.  <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20STUDY%20BUDDY.%20You'll%20have%20your%20hands%20full%20with%20this%20checkup%20tonight.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/study-buddy'%3ESTUDY%20BUDDY.%3C/a%3E%20You'll%20have%20your%20hands%20full%20with%20this%20checkup%20tonight.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"STUDY%20BUDDY.%20You'll%20have%20your%20hands%20full%20with%20this%20checkup%20tonight."},{"element-name":"oral-exam","display-name":"Oral Exam","svg-name":"OralExam.svg",orientation:"horizontal","cancer-type":"skin","display-cancer-type":"Skin Cancer","detail-html":'<p>Lie by or on top of your partner, facing them but in opposite directions. Now, forget you ever heard the phrase, "Business before pleasure," and rigorously attend to both. As you let your mouth do wonders, let your eyes* do wander across the navel, pelvis, and beyond, to complete this doubly pleasurable &mdash; and doubly effective &mdash; exam.</p>',"just-the-tip":"And those ravenous hands of yours, of course.","full-size":!1,"overview-index":29,"chapter-index":5,"og:description":"The #CancerSutra Presents: ORAL EXAM. Here's one test you'll love taking (and receiving).","banner-name":"CS_Social_OralExam.png",bitly:"http://bit.ly/1JOxeHx","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/oral-exam'>ORAL EXAM.</a> Here's one test you'll love taking (and receiving). <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20ORAL%20EXAM.%20Here's%20one%20test%20you'll%20love%20taking%20(and%20receiving).","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/oral-exam'%3EORAL%20EXAM.%3C/a%3E%20Here's%20one%20test%20you'll%20love%20taking%20(and%20receiving).%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"ORAL%20EXAM.%20Here's%20one%20test%20you'll%20love%20taking%20(and%20receiving)."},{"element-name":"ultrabound-test","display-name":"Ultrabound Test","svg-name":"UltraboundTest.svg",orientation:"vertical","cancer-type":"skin","display-cancer-type":"Skin Cancer","detail-html":"<p>Have a seat in a chair, and bring your partner round to sit in your lap, face-to-face. As she gyrates and grinds against the warmth of your thighs*, you may note, with no amount of difficulty, that her breasts are directly in front of your face. (You can thank us later.) While we're sure you rarely miss an opportunity to give her bosoms more than a fleeting glance, now's your chance for a closer inspection. Raise and separate each breast to inspect those places you rarely glimpse, to ensure you make the most of this Ultrabound Test.</p>","just-the-tip":"There's a time and a place for toys. This time is now, and that place is &mdash; well, we're sure you can think of <em>somewhere.</em>","full-size":!0,"overview-index":30,"chapter-index":7,"float":"right","chapter-float":"left","og:description":"The #CancerSutra Presents: ULTRABOUND TEST. Sit on someone else's laurels for a change, and receive this checkup.","banner-name":"CS_Social_UltraboundTest.png",bitly:"http://bit.ly/1GsOUpm","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/ultrabound-test'>ULTRABOUND TEST.</a> Sit on someone else's laurels for a change, and receive this checkup. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20ULTRABOUND%20TEST.%20Sit%20on%20someone%20else's%20laurels%20for%20a%20change,%20and%20receive%20this%20checkup.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/ultrabound-test'%3EULTRABOUND%20TEST.%3C/a%3E%20Sit%20on%20someone%20else's%20laurels%20for%20a%20change,%20and%20receive%20this%20checkup.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"ULTRABOUND%20TEST.%20Sit%20on%20someone%20else's%20laurels%20for%20a%20change,%20and%20receive%20this%20checkup."},{"element-name":"areola-51","display-name":"Areola 51","svg-name":"Areola51.svg",orientation:"vertical","cancer-type":"breast","display-cancer-type":"Breast Cancer","detail-html":"<p>Uncross your legs, hope to sigh. For this position, wind your legs about your lover and bring your hips as close as possible to one another. As you thunder away at her thighs, reach forward and find something &mdash; or a pair of things &mdash; to hold on to. Be thorough, now. A missed nipple is a missed opportunity.*</p>","just-the-tip":"Speaking of opportunities, nothing says love (or lust) like letting your partner take the reins. Once you've given each breast your all, swap positions and let your partner get some hands-on time.","full-size":!1,"overview-index":31,"chapter-index":9,"og:description":"The #CancerSutra Presents: AREOLA 51. For learning what to do with a boob, and how to avoid being one.","banner-name":"CS_Social_Areola51.png",bitly:"http://bit.ly/1OzHfzk","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/areola-51'>AREOLA 51.</a> For learning what to do with a boob, and how to avoid being one. <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer. <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23CancerSutra%20Presents:%20AREOLA%2051.%20For%20learning%20what%20to%20do%20with%20a%20boob,%20and%20how%20to%20avoid%20being%20one.","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/areola-51'%3EAREOLA%2051.%3C/a%3E%20For%20learning%20what%20to%20do%20with%20a%20boob,%20and%20how%20to%20avoid%20being%20one.%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"AREOLA%2051.%20For%20learning%20what%20to%20do%20with%20a%20boob,%20and%20how%20to%20avoid%20being%20one."},{"element-name":"doctors-orders","display-name":"Doctor's Orders","svg-name":"DoctorsOrders.svg",orientation:"vertical","cancer-type":"skin","display-cancer-type":"Skin Cancer","detail-html":"<p>For a position with a multitude of ups and downs, nothing beats the Doctor's Orders.</p><p>Men, begin by positioning yourself behind your lover as she lays facing away from you on all fours. Take her by the hips, and hoist her so that she is raised to meet your member. As you shake and shimmy like a sweating, sighing wheelbarrow, you'll note that this angle gives you a delightfully unique perspective on things.* And while your hands may be occupied, there's never been a better opportunity to take in all the sights your partner has to offer &mdash; then switch positions for a closer inspection.</p>","just-the-tip":"Namely, her buttocks, the backs of her thighs, and calves.","full-size":!1,"overview-index":32,"chapter-index":6,"og:description":"The #CancerSutra Presents: DOCTOR'S ORDERS. Turn cancer's world upside down. (It's worth it for the view.)","banner-name":"CS_Social_DoctorsOrders.png",bitly:"http://bit.ly/1HU2Tu0","long-description":"The Cancer Sutra Presents: <a href='http://cancersutra.com/positions/doctors-orders'>DOCTOR'S ORDERS.</a> Turn cancer's world upside down. (It's worth it for the view.) <br><br>Or <a href='http://cancersutra.com'>explore the rest of The Cancer Sutra</a>. The world's first Kama Sutra designed to help you check your partner for cancer.  <br><br>After all, it is a fact that the earlier you detect cancer, the greater the chance of successfully treating it. It is also a fact that you probably do not check yourself as often as you should. <br><br>Well, perhaps we can't convince you to check yourself as regularly as you ought to. But then, maybe we can convince you to get your eyes (and other body parts) on someone else instead.","og:description-encoded":"The%20%23#CancerSutra%20Presents:%20DOCTOR'S%20ORDERS.%20Turn%20cancer's%20world%20upside%20down.%20(It's%20worth%20it%20for%20the%20view.)","long-description-encoded":"The%20Cancer%20Sutra%20Presents:%20%3Ca%20href='http://cancersutra.com/positions/doctors-orders'%3EDOCTOR'S%20ORDERS.%3C/a%3E%20Turn%20cancer's%20world%20upside%20down.%20(It's%20worth%20it%20for%20the%20view.)%20%3Cbr%3E%3Cbr%3EOr%20%3Ca%20href='http://cancersutra.com'%3Eexplore%20the%20rest%20of%20The%20Cancer%20Sutra%3C/a%3E.%20The%20world's%20first%20Kama%20Sutra%20designed%20to%20help%20you%20check%20your%20partner%20for%20cancer.%20%20%3Cbr%3E%3Cbr%3EAfter%20all,%20it%20is%20a%20fact%20that%20the%20earlier%20you%20detect%20cancer,%20the%20greater%20the%20chance%20of%20successfully%20treating%20it.%20It%20is%20also%20a%20fact%20that%20you%20probably%20do%20not%20check%20yourself%20as%20often%20as%20you%20should.%20%3Cbr%3E%3Cbr%3EWell,%20perhaps%20we%20can't%20convince%20you%20to%20check%20yourself%20as%20regularly%20as%20you%20ought%20to.%20But%20then,%20maybe%20we%20can%20convince%20you%20to%20get%20your%20eyes%20(and%20other%20body%20parts)%20on%20someone%20else%20instead.","twitter:description":"DOCTOR'S%20ORDERS.%20Turn%20cancer's%20world%20upside%20down.%20(It's%20worth%20it%20for%20the%20view.)"}];
