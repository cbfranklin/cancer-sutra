var $sutra;
var $filters;
var $sutraPos;
var $container;

$(function(){
	$sutra = $('.cancer-sutra');
	$sutraPos = $('.cancer-sutra > div');
	$filters = $('.filter a');
	$container = $('.container');
	$sutra.isotope();
	bindings();
	imagesLoaded('body',begin)
});




function begin(){
	if(document.body.scrollTop === 0){
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
		function showSutra(){
			$sutra.removeClass('opacity0');
			//new WOW().init();
		}
	}
}

function bindings(){
	//menu
	$('.menu-toggle').on('click',function(){
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
		},500)
	});
	//filters
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
	//detail
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
			/*afterLoad: function() { 
		        this.wrap.find('.fancybox-inner').css({
		            'overflow-y': 'auto',
		            'overflow-x': 'hidden'
		        });
		    },*/
			afterShow: function(){
	            //document.ontouchstart = function(e){
	            //	e.preventDefault();
	            //}
	            $(document).on('scroll','body',function(e){
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
	            });
	        },
		})
	})
}