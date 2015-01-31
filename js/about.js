//ABOUT.JS
function loadAboutAnimations(){
	//Load SVG INFO FROM JSON
	$.getJSON('data/animations-about.json',function(about){
		//Load SVGs into containers
		for(key in about){
			var anim = about[key];
			//console.log(key,anim);
			//console.log(container)
			var container = Snap('#about .'+key);
			var svg = Snap.load(anim.file,function(data,j){
				return function(){
					//onSVGLoaded(data,container)
					console.log(key,j)
				}()
				
				//console.log(data,container)
				
			},key);
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