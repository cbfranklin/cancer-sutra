//ABOUT.JS
function loadAboutAnimations(){
	//Load SVG INFO FROM JSON
	$.getJSON('data/animations-about.json',function(about){
		//Load SVGs into containers
		for(key in about){
			var anim = about[key];
			console.log(key,anim);
			var cont = Snap('#about .'+key);
			console.log(cont)
			var svg = Snap.load(anim.file,function(data){
				console.log(data,cont)
				onSVGLoaded(data,cont)
			});
			/*var svg = Snap.load(anim.file,onSVGLoaded,container);*/

		}

		/*var about1Container = Snap('#about .one')
		console.log(about.one.file)
		var about1 = Snap.load(about.one.file, function(data){
			onSVGLoaded(data,container)
		});*/
	});
}

function onSVGLoaded(data,container){
	console.log('onSVGLoaded')
	console.log(data,container)
}