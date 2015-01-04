var $all,
$about,
$sutra,
$filters,
$sutraPos,
$container,
$loader,
$body,
$fancyContent;

$(function(){
	$body = $('body');
	$about = $('#about')
	$sutra = $('#cancer-sutra');
	$all = $('section');
	$sutraPos = $('#cancer-sutra > div');
	$filters = $('.filter a');
	$container = $('.container');
	$loader = $('.loader');
	bindings();
	//if images are loaded, begin
	imagesLoaded('body',begin)
});


function begin(){
	setStickies();

	routie({
	    '' : function(){
	    	//about
	    	console.log('about')
	    	showAbout();
	    },
	    '/positions' : function(){
	    	console.log('positions')
	    	showPositions();
	    },
	    '/positions/:name' : function(name){
	    	console.log('position')
	    	showPositions(name);
	    }
	});

	function showAbout(){
		$body.removeClass('loading');
		$all.hide()
		$about.show();
	};

	//intro();

	function showPositions(name){
		console.log(name)
		$body.addClass('loading');
		$all.hide();
		$sutra.isotope();
		$sutra.show();
		setTimeout(function(){
			$body.removeClass('loading');
			$sutra.isotope('layout');
		},500)
		if(name != undefined){
			console.log('yes position')
			setTimeout(function(){
				$fancyContent = $sutra.find('[data-position="'+name+'"]').find('.detail');
		    	showPosition(name)
			},500);
		}
		else{
			console.log('no position')
			$.fancybox.close;
		}
	}
}

function bindings(){

	//menu
	$('.menu-toggle').on('click',function(e){
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
		//$sutra.find('> div').show();
		if($(this).data('toggle') === 'off'){
			//only one cancer type at a time
			$('[data-filter-type="cancer-type"] a').data('toggle','off').attr('data-toggle','off');
			$(this).data('toggle','on').attr('data-toggle','on')
		}
		else{
			$(this).data('toggle','off').attr('data-toggle','off')
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
	});

	//bring up detail in fancybox
	$sutraPos.on('click',function(){
		$fancyContent = $(this).find('.detail');
		showPosition();
	})
}