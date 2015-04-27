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
}

//ROUTES
function routes(){
	routie({
	    '' : function(){
	    	console.log('about')
	    	load();
	    	loadAbout();
	    },
	    '!' : function(){
	    	console.log('about')
	    	load();
	    	loadAbout();
	    },
	    '!/' : function(){
	    	console.log('about')
	    	load();
	    	loadAbout();
	    },
	    '!/about' : function(){
	    	console.log('about')
	    	load();
	    	loadAbout();
	    },
	    '!/positions' : function(){
	    	console.log('/positions')
	    	loadPositions();
	    },
	    '!/positions/' : function(){
	    	console.log('/positions/')
	    	load();
	    	loadPositions();
	    },
	    '!/positions/:position' : function(position){
	    	console.log('/positions/:position')
	    	console.log(position)
	    	load();
	    	loadPositions('positions', position);
	    },
	     '!/chapters/' : function(cancerType){
	     	load();
	     	loadPositions();
	    },
	     '!/chapters/:cancerType' : function(cancerType){
	     	console.log('chapter #')
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
			console.log(status)
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
			console.log(status)
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
    Mousetrap.bind(['down','right','.',']'],function(){
    		if($('#about').attr('data-is-scrolling') == 'false'){
    			$('#about .onScreen #next').click();
    		}
            return false;
    });
    Mousetrap.bind(['up','left',',','['],function(){
    		if($('#about').attr('data-is-scrolling') == 'false'){
            	$('#about .onScreen #prev').click();
            }
            return false;
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
	var mousewheelScroll = _.debounce(function(e) {
		console.log(e.deltaY)
		if(e.deltaY < 0){
			$('#about .onScreen #next').click();
		}
		if(e.deltaY > 0){
			$('#about .onScreen #prev').click();
		}
	}, 100, true);

	$('#about').on('mousewheel',mousewheelScroll);
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
	var wow = new WOW();
	wow.init();

	//position or chapter
	if(route != undefined){
		//position
		if(route === 'positions'){
			console.log('position',name)
			setTimeout(function(){
				$overlayContent = $positions.find('[data-position="'+name+'"]').find('.detail');
		    	showPosition();
			},500);
		}
		//chapter
		else if(route === 'chapters'){
			console.log('chapter',name)
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
	console.log('support')
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
		routie('#!/support/posters')
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