var $sutra;

$(function(){
	$sutra = $('.cancer-sutra');
	$sutra.isotope();
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
		if(scrolledTop){
			setTimeout(showSutra,1500)
		}
		else{
			showSutra();
		}
		function showSutra(){
			$sutra.show();
			new WOW().init();
		}
	}
}