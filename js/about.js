//ABOUT.JS
function loadAboutAnimations(){
	//Load SVG INFO FROM JSON
	$.getJSON('data/animations-about.json',function(about){
		//Load SVGs into containers
		var about1Container = Snap('#about .one')
		var about1 = Snap.load(about.one.file)
	});
}