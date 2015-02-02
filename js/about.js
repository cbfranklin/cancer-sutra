//ABOUT.JS
var aboutAnimations;
function loadAboutAnimations(){
	//Load SVG INFO FROM JSON
	$.getJSON('data/animations-about.json',function(about){
		//Load SVGs into containers
		aboutAnimations = about;
		for(var key in about){
			var file = about[key].file;
			Snap.load(file,function(key){
					return function(data){
						var container = Snap('#about .'+key);
						container.append(data);
					};
			}(key));
		}
	});
}