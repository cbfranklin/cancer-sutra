//ABOUT.JS
var aboutAnimations;

function loadAboutAnimations(){
	//Load SVG INFO FROM JSON
	$.getJSON('data/animations-about.json',function(about){
		//Load SVGs into containers
		aboutAnimations = about;
		for(var key in about){
			if(windowWidth > 479){
				var file = about[key]['file-full'];
			}
			else{
				var file = about[key]['file-mobile'];
			}
			console.log(file)
			Snap.load(file,function(key){
					return function(data){
						var container = Snap('#about .'+key);
						container.append(data);
					};
			}(key));
		}
		setTimeout(function(){
			animateThisSVG(aboutAnimations,'one')
		},800)
	});
}