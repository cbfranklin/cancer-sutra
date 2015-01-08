var
$wrapper,
$all,
$about,
$positions,
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

	//bring up detail in fancybox
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

	/*$('.onward a').on('click',function(e){
		history.pushState({}, '', $(this).attr("href"));
		e.preventDefault();
	})*/
	$('.foreplay').on('click',function(){

	});
}

//ROUTES

function loadAbout(){
	load();
	$about.show();
	$body.removeClass('loading positions').addClass('about');
	setTimeout(function(){
		$positions.hide();
	},400);
	$("html, body").animate({ scrollTop: '0px' });
	/*$all.hide();
	$about.show();*/
};

function loadPositions(name){
	load();
	$positions.show();
	$body.removeClass('loading about').addClass('positions');
	setTimeout(function(){
		$about.hide();
	},400);
	$("html, body").animate({ scrollTop: '0px' });
	/*$positions.show();
	$all.hide();*/
	if(name != undefined){
		setTimeout(function(){
			//$fancyContent = $positions.find('[data-position="'+name+'"]').find('.detail');
			$overlayContent = $positions.find('[data-position="'+name+'"]').find('.detail');
			//console.log($positions.find('[data-position="'+name+'"]').find('.detail'))
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
	$positions.show();
	$positions.isotope('layout');
}

function filters($obj){
	//$positions.find('> div').show();
	if($obj.data('toggle') === 'off'){
		//only one cancer type at a time
		$('[data-filter-type="cancer-type"] a').data('toggle','off').attr('data-toggle','off');
		$obj.data('toggle','on').attr('data-toggle','on')
	}
	else{
		$obj.data('toggle','off').attr('data-toggle','off')
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
	//console.log($cancerType,$cancerType.length);

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
	//console.log($partnership,$partnership.length);

	if($cancerType.length > 0 && $partnership.length > 0){
		//console.log('ITS A MERGE')
		//console.log($cancerType)
		//console.log(partnership)
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

	//console.log($theFilter)


	$positions.isotope({ filter: $theFilter });
}