//ABOUT.JS
function loadAboutAnimations(){
	//Load SVG INFO FROM JSON
	$.getJSON('data/animations-about.json',function(about){
		//Load SVGs into containers
		var about1Container = Snap('#about .one')
		var about1 = Snap.load(about.one.file, onSVGLoaded(about1Container,about1))
	});
}

function onSVGLoaded(container,svg){
	console.log(container,svg)
	container.append(svg);
}