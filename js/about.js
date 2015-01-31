//ABOUT.JS
function loadAboutAnimations(){
	//Load SVG INFO FROM JSON
	$.getJSON('data/animations-about.json',function(about){
		//Load SVGs into containers
		for(key in about){
			var anim = about[key];
			//console.log(key,anim);
			//console.log(container)
			var svg = Snap.load(anim.file,function(data){
				console.log(key)
				var container = Snap('#about .'+key);
				//console.log(data,container)
				onSVGLoaded(data,container)
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
	//console.log('onSVGLoaded')
	//console.log(data,container)
	console.log(container)
	container.append(data);
}