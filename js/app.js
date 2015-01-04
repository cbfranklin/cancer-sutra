var $sutra,
$filters,
$sutraPos,
$container,
$loader,
$body;

$(function(){
	$body = $('body');
	$sutra = $('#cancer-sutra');
	$sutraPos = $('#cancer-sutra > div');
	$filters = $('.filter a');
	$container = $('.container');
	$loader = $('.loader');
	bindings();
	//if images are loaded, begin
	imagesLoaded('body',begin)
	$sutra.isotope();
});


function begin(){
		setStickies();

	intro();

	function intro(){
		setTimeout(showSutra,500)

		function showSutra(){
			$body.removeClass('loading');
			//$sutra.removeClass('opacity0');
			//new WOW().init();
			$sutra.isotope('layout');

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
		var fancyWidth = $container.width();
		var $fancyContent = $(this).find('.detail');
		$.fancybox.open({
			autoSize: false,
			width: '100%',
			height: '100%',
			margin: [0,0,0,0],
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
	        /*v3 beta only
	        openEffect  : 'drop',
			closeEffect : 'fade',
			*/
		})
	})
}