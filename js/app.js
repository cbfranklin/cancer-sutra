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
$overlayContent;

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
	$(window).on('resize',function(){
		setAboutHeights();
		setSectionHeights();
	});

	//menu
	$('.menu-toggle').on('click',function(e){
		Nav.toggle();
		e.preventDefault();
	});

	//COMBINE FILTERS:
	$filters.on('click',function(e){
		e.preventDefault();
		filters($(this));
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
			console.log(height)
			window.scrollTo(0, height);
		}
		$(this).toggleClass('open');
		$(this).siblings('.part2').toggleClass('open');
	});

	$('body').on('swipe','#about',function(event){
		//$('body').css('background','blue');
		var dir = event.direction
		$('.device-menu h1').text('not yet...').text(dir);
		if (dir === 'down') {
	        $('.device-menu h1').text('not yet...').text('it was down!');
	    }
	    var original = event.originalEvent,
	        touches = original.touches.length > 0 ? original.touches : original.changedTouches;
	});
}

//LOAD
function load(){
	$body.addClass('loading');
	Odelay.close();
	Nav.close();
	//enable scrolling
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
	    	console.log('positions')
	    	loadPositions();
	    },
	    '/positions/' : function(){
	    	console.log('positions')
	    	loadPositions();
	    },
	    '/positions/:position' : function(position){
	    	console.log('position #')
	    	load();
	    	loadPositions('positions', positionName);
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
	//disable scrolling
	$(window).on('touchmove', false);
	setTimeout(function(){
		$positionsContainer.hide();
		window.scrollTo(0, 0);
		$('nav').removeClass('open');
		$('.menu-toggle').removeClass('active');
	},400);

	if($('#about svg').length === 0){
		loadAboutAnimations();
	}
	setTimeout(function(){
		animateThisSVG(aboutAnimations,'one')
	},1000)
	$('#about > div').onScreen({
		direction: 'vertical',
		doIn: function() {
			var id = $(this).attr('id');
			animateThisSVG(aboutAnimations,id)
		},
		tolerance: 200,
		throttle: 1000,
		toggleClass: 'onScreen'
	});
	$('.about-navigation img').on('click',function(){
		var id = $(this).attr('id');
		if(id === 'next'){
			$(this).parents('.row').next().scrollToAnchor()
		}
		else{
			$(this).parents('.row').prev().scrollToAnchor()
		}
	});
	Mousetrap.bind(['up','left',',','['], function() {
			console.log('previous')
            $('#about .onScreen #prev').click();
            return false;
    });
    Mousetrap.bind(['down','right','.',']'], function() {
    		console.log('next')
            $('#about .onScreen #next').click();
            return false;
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
	//no position or chapter
	if(route != undefined){
		//position
		if(route === 'positions'){
			setTimeout(function(){
				$overlayContent = $positions.find('[data-position="'+name+'"]').find('.detail');
		    	showPosition(name)
			},500);
		}
		//chapter
		else if(route === 'chapters'){
			setTimeout(function(){
				var $obj = $('.filter [data-filter="'+name+'"]')
		    	filters($obj);
			},500);
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
	$positions.isotope();
	$positionsContainer.show();
	$positions.isotope('layout');
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
		window.scrollTo(0, 0);
	},400);
}