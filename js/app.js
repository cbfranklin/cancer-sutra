var
$wrapper,
$all,
$about,
$positions,
$positionsContainer,
$support,
$filters,
$container,
$loader,
$body,
$overlay,
$overlayContent,
windowWidth;

//READY
$(function(){
	$body = $('body');
	$wrapper = $('.wrapper');
	$about = $('#about')
	$positions = $('#positions');
	$support = $('#support')
	$positionsContainer = $('#positions-container');
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
	$positions.find('> div').on('click',function(e){
		$(this).addClass('active')
		var name = $(this).data('position');
		if(Modernizr.history){
			history.pushState({}, '', '#/positions/'+name);
		}
		else{
			window.location.hash = '#/positions/'+name;
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
}

//LOAD
function load(){
	$body.addClass('loading');
	Odelay.close();
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
	    '/' : function(){
	    	console.log('about')
	    	load();
	    	loadAbout();
	    },
	    '/about' : function(){
	    	console.log('about')
	    	load();
	    	loadAbout();
	    },
	    '/positions' : function(){
	    	console.log('/positions')
	    	loadPositions();
	    },
	    '/positions/' : function(){
	    	console.log('/positions/')
	    	loadPositions();
	    },
	    '/positions/:position' : function(position){
	    	console.log('/positions/:position')
	    	console.log('position #')
	    	load();
	    	loadPositions('positions', position);
	    },
	     '/chapters/' : function(cancerType){
	     	loadPositions();
	    },
	     '/chapters/:cancerType' : function(cancerType){
	     	console.log('chapter #')
	     	loadPositions('chapters', cancerType);
	    },
	     '/support' : function(){
	     	loadSupport();
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
		$positionsContainer.hide();
		window.scrollTo(0, 0);
		$('nav').removeClass('open');
		$('.menu-toggle').removeClass('active');
		clearFilters();
	},400);

	if($('#about svg').length === 0){
		loadAboutAnimations();
	}
	setTimeout(function(){
		animateThisSVG(aboutAnimations,'one')
	},800)
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
};

//POSITIONS
function loadPositions(route,name){
	load();
	$positionsContainer.show();
	$body.removeClass('loading about support').addClass('positions');

	setTimeout(function(){
		$about.hide();
		$support.hide();
		window.scrollTo(0, 0);
	},400);

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
	$positions.isotope({
		layoutMode: 'masonry',
		masonry: {
			//columnWidth: '.position-test'
			columnWidth: '#positions > div:not(.position-full-width)'
		}
	});
	$positionsContainer.show();
	//$positions.isotope('layout');
}

//SUPPORT
function loadSupport(){
	console.log('support')
	load();
	$support.show();
	$body.removeClass('loading about positions').addClass('support');

	setTimeout(function(){
		$about.hide();
		$positionsContainer.hide()
		clearFilters();
		window.scrollTo(0, 0);
	},400);
}