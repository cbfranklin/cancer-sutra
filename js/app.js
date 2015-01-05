var
$wrapper,
$all,
$about,
$sutra,
$filters,
$sutraPos,
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
	$sutra = $('#cancer-sutra');
	$all = $('section');
	$sutraPos = $('#cancer-sutra > div');
	$filters = $('.filter a');
	$container = $('.container');
	$loader = $('.loader');
	$overlay = $('.overlay');

	bindings();

	imagesLoaded('body',routes);
});

function load(){
	$body.addClass('loading')
}

function bindings(){

	setStickies();

	//keep 'about' sections sized to window height
	setAboutHeights();
	$(window).on('resize',function(){
		setAboutHeights();
	});

	//menu
	$('.menu-toggle').on('click',function(e){
		e.preventDefault();
		var $that = $(this)
		if(!$that.hasClass('active')){
			$('nav').addClass('open')
			//$('nav').show();
		}
		else{
			$('nav').removeClass('open')
			//$('nav').hide();
		}
		setTimeout(function(){
			$that.toggleClass('active');
		},250)
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
	$sutraPos.on('click',function(e){
		//$fancyContent = $(this).find('.detail');
		//showPosition();
		$(this).addClass('active')
		var name = $(this).data('position');
		history.pushState({}, '', '#/positions/'+name);

		$overlayContent = $(this).find('.detail');
		showPosition();

		e.preventDefault();
	});

	$('.onward a').on('click',function(e){
		//history.pushState({}, '', $(this).attr("href"));
		//e.preventDefault();
	})
}
	
function routes(){
	routie({
	    '' : function(){
	    	console.log('about')
	    	load();
	    	showAbout();
	    },
	    '#/' : function(){
	    	console.log('about')
	    	load();
	    	showAbout();
	    },
	    '#/about' : function(){
	    	console.log('about')
	    	load();
	    	showAbout();
	    },
	    '/positions' : function(){
	    	console.log('positions')
	    	showPositions();
	    },
	    '/positions/' : function(){
	    	console.log('positions')
	    	showPositions();
	    },
	    '/positions/:name' : function(name){
	    	console.log('position #')
	    	load();
	    	showPositions(name);
	    }
	});
};

function showAbout(){
	$body.removeClass('loading');
	$all.hide()
	$about.show();
};

function showPositions(name){
	console.log('name: '+name)
	load();
	$all.hide();
	if(name != undefined){
		console.log('yes position')
		setTimeout(function(){
			//$fancyContent = $sutra.find('[data-position="'+name+'"]').find('.detail');
			$overlayContent = $sutra.find('[data-position="'+name+'"]').find('.detail');
			//console.log($sutra.find('[data-position="'+name+'"]').find('.detail'))
	    	showPosition(name)
		},500);
	}
	else{
		Odelay.close();
		console.log('no position')
		//$.fancybox.close;
	}
	$body.removeClass('loading');
	$sutra.isotope();
	$sutra.show();
	$sutra.isotope('layout');
}

function filters($obj){
	//$sutra.find('> div').show();
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


	$sutra.isotope({ filter: $theFilter });
}