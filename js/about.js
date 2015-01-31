//ABOUT.JS
function loadAboutAnimations(){
	//Load SVG INFO FROM JSON
	$.getJSON('data/animations-about.json',function(about){
		//Load SVGs into containers
		var about1Container = Snap('#about .one')
		console.log(about.one.file)
		var about1 = Snap.load(about.one.file, onSVGLoaded);
	});
}

function onSVGLoaded(svg){
	console.log('onSVGLoaded')
	console.log(svg)
}