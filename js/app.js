var
$wrapper,
$all,
$about,
$positions,
$positionsContainer,
$filters,
$container,
$loader,
$body,
//$fancyContent,
$overlay,
$overlayContent;

$(function(){
	$body = $('body');
	$wrapper = $('.wrapper');
	$about = $('#about')
	$positions = $('#positions');
	$positionsContainer = $('#positions-container');
	$all = $('section');
	$filters = $('.filter a');
	$container = $('.container');
	$loader = $('.loader');
	$overlay = $('.overlay');

	bindings();

	imagesLoaded('body',routes);
});

function routes(){
	routie({
	    '' : function(){
	    	console.log('about')
	    	load();
	    	loadAbout();
	    },
	    '#/' : function(){
	    	console.log('about')
	    	load();
	    	loadAbout();
	    },
	    '#/about' : function(){
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
	    '/positions/:name' : function(name){
	    	console.log('position #')
	    	load();
	    	loadPositions(name);
	    }
	});
};

function load(){
	$body.addClass('loading')
	//openCloseNav();
}

function bindings(){

	setStickies();

	$('body').swipe({
		swipe:function(event, direction, distance, duration, fingerCount){
			if(direction === 'right' && !$('nav').hasClass('open')){
				openCloseNav();
			}
			if(direction === 'left' && $('nav').hasClass('open')){
				openCloseNav();
			}
		},
		fingers:'2',
		allowPageScroll: "vertical"
	});

	//keep 'about' sections sized to window height
	setAboutHeights();
	$(window).on('resize',function(){
		setAboutHeights();
	});

	//menu
	$('.menu-toggle').on('click',function(e){
		openCloseNav();
		e.preventDefault();
	});

	//sticky menu
	$('.nav-bar').sticky();
	$(window).on('resize',function(){
		delay(setStickies,300);
	});

	//COMBINE FILTERS:
	$filters.on('click',function(e){
		e.preventDefault();
		filters($(this));
	});

	//bring up detail
	$positions.find('> div').on('click',function(e){
		//$fancyContent = $(this).find('.detail');
		//showPosition();
		$(this).addClass('active')
		var name = $(this).data('position');
		history.pushState({}, '', '#/positions/'+name);

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
}

//ROUTES

function loadAbout(){
	load();
	$about.show();
	$body.removeClass('loading positions').addClass('about');
	setTimeout(function(){
		$positionsContainer.hide();
		window.scrollTo(0, 0);
		$('nav').removeClass('open');
		$('.menu-toggle').removeClass('active');
	},400);
};

function loadPositions(name){
	load();
	$positionsContainer.show();
	$body.removeClass('loading about').addClass('positions');

	setTimeout(function(){
		$about.hide();
		window.scrollTo(0, 0);
	},400);
	if(name != undefined){
		setTimeout(function(){
			//$fancyContent = $positions.find('[data-position="'+name+'"]').find('.detail');
			$overlayContent = $positions.find('[data-position="'+name+'"]').find('.detail');

	    	showPosition(name)
		},500);
	}
	else{
		Odelay.close();
		console.log('no position')
		//$.fancybox.close;
	}
	$body.removeClass('loading');
	$positions.isotope();
	$positionsContainer.show();
	$positions.isotope('layout');
}

function filters($obj){

	if($obj.data('toggle') === 'off'){
		//only one cancer type at a time
		if($obj.data('filter-type') === 'cancer-type'){
			$('[data-filter-type="cancer-type"] a').data('toggle','off').attr('data-toggle','off');

			var cancerType = $obj.data('filter');
			$('#chapters > div').removeClass('open');
			$('#chapters [data-cancer-type='+cancerType+']').addClass('open');
			window.scrollTo(0, 0);
		}
		$obj.data('toggle','on').attr('data-toggle','on')
	}
	else{
		$obj.data('toggle','off').attr('data-toggle','off');
		if($obj.data('filter-type') === 'cancer-type'){
			$('#chapters > div').removeClass('open').children().removeClass('open');
			window.scrollTo(0, 0);
		}
	}

	//CANCER TYPE
	var cancerTypeArray = []
	$('[data-filter-type="cancer-type"] a').each(function(){
		if($(this).data('toggle') === 'on'){
			var filterValue = $(this).data('filter')
			cancerTypeArray.push(['[data-cancer-type="'+filterValue+'"]']);
		}
	});
	var cancerType = cancerTypeArray.join(',');
	var $cancerType = $(cancerType);

	//PARTNERSHIP
	var partnershipArray = []
	$('[data-filter-type="partnership"] a').each(function(){
		if($(this).data('toggle') === 'on'){
			var filterValue = $(this).data('filter')
			partnershipArray.push(['[data-partnership="'+filterValue+'"]']);
		}
	});
	var partnership = partnershipArray.join(',');
	var $partnership = $(partnership);

	if($cancerType.length > 0 && $partnership.length > 0){
		var $theFilter = $cancerType.filter($partnership);
	}
	else if($cancerType.length > 0 && $partnership.length == 0){
		//console.log('ITS SINGLE: CANCER-TYPE')
		var $theFilter = $cancerType;
	}
	else if($cancerType.length == 0 && $partnership.length > 0){
		//console.log('ITS SINGLE: PARTNERSHIP')
		var $theFilter = $partnership;
	}
	else{
		var $theFilter = '';
	}

	$positions.isotope({ filter: $theFilter });
}