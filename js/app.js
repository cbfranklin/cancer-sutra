var $sutra,
$filters,
$sutraPos,
$container,
$loader,
$body;

$(function(){
	$body = $('body');
	$sutra = $('.cancer-sutra');
	$sutraPos = $('.cancer-sutra > div');
	$filters = $('.filter a');
	$container = $('.container');
	$sutra.isotope();
	$loader = $('.loader');
	bindings();
	//if images are loaded, begin
	imagesLoaded('body',begin)
});




function begin(){
	if(document.body.scrollTop === 0){
		setStickies();
		var scrolledTop = true;
		setTimeout(intro,1500);
	}
	else{
		intro(); 
	}
	function intro(){
		$('body').removeClass('intro');
		$sutra.isotope('layout');
		if(scrolledTop){
			setTimeout(showSutra,1500)
		}
		else{
			showSutra();
		}
		$body.removeClass('loading')
		function showSutra(){
			$sutra.removeClass('opacity0');
			//new WOW().init();

		}
	}
}

function bindings(){

	//menu
	$('.menu-toggle').on('click',function(e){
		var $that = $(this)
		if(!$that.hasClass('active')){
			$('.filters').addClass('open')
			//$('.filters').show();
		}
		else{
			$('.filters').removeClass('open')
			//$('.filters').hide();
		}
		setTimeout(function(){
			$that.toggleClass('active');
		},250)
		e.preventDefault();
	});

	//sticky menu
	$('nav').sticky();
	$(window).on('resize',function(){
		delay(setStickies,300);
	});

	//combine filters: needs work
	$filters.on('click',function(e){
		$sutra.find('> div').show();
		if($(this).data('toggle') === 'off'){
			$(this).data('toggle','on').attr('data-toggle','on')
		}
		else{
			$(this).data('toggle','off').attr('data-toggle','off')
		}
		var filterArray = []
		$filters.each(function(){
			console.log($(this).parents('.filter').data('filter-type'))
			if($(this).data('toggle') === 'on'){
				var filterType = $(this).parents('.filter').data('filter-type');
				var filterValue = $(this).data('filter')
				filterArray.push([filterType,filterValue]);
			}
		});
		for(i in filterArray){
			filterArray[i] = '[data-'+filterArray[i][0]+'="'+filterArray[i][1]+'"]';
		}
		console.log(filterArray)
		var theFilter = filterArray.join(',');
		console.log(theFilter)
		$sutra.isotope({ filter: theFilter });
		e.preventDefault();
	});

	//bring up detail in fancybox
	$sutraPos.on('click',function(){
		var fancyWidth = $container.width();
		var $fancyContent = $(this).find('.detail');
		console.log(fancyWidth)
		$.fancybox.open({
			autoSize: false,
			width: '100%',
			height: '100%',
			//margin: [0,0,0,0],
			content: $fancyContent,
			scrolling: 'no',
			helpers: {
				overlay: {
					locked: true 
				}
			},
			afterShow: function(){
	            //document.ontouchstart = function(e){
	            //	e.preventDefault();
	            //}
	            $(document).on('scroll','body',function(e){
	            	e.preventDefault();
	            }).on('touchmove','body',function(e){
	            	e.preventDefault();
	            });
	            this.wrap.find('.fancybox-inner').css({
		            'overflow-y': 'auto',
		            'overflow-x': 'hidden'
		        });
	        },
	        afterClose: function(){
	            //document.ontouchstart = function(e){
	                //default scroll behaviour
	            //}
	            $(document).on('scroll','body',function(e){
	            	//default scroll behaviour
	            }).off('touchmove');
	        },
		})
	})
}