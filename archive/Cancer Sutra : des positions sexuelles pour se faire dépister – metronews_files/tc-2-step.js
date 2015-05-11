var smartbox = {

	 wrappCtn:'ligatus_metrofrance_metrofrance_smartbox',
	 ctn :"metrofrance_metrofrance_smartbox",

	 desk_src :"http://a.ligatus.com/timeout.php?ids=44431#bl="+encodeURIComponent(window.location.href),
	 desk_width :"100%",
	 desk_height :"505" ,
	 
	 mobile_src :"http://a.ligatus.com/?ids=42341",
	 mobile_width :"100%",
	 mobile_height :"480",

	 breakpoint : 980
};


function createTagAds(ad, ctn, src, width, height) 
{
	var adTag   = document.createElement('iframe'); 
	adTag.id = ad;
	adTag.name = ad; 
	adTag.src   = src;
	adTag.width = width;
	adTag.height= height;
	adTag.scrolling= "no";
	adTag.frameBorder= "no";
	adTag.allowTransparency= "true";
	var container = document.getElementById(ctn);
	container.appendChild(adTag);
}

function tag_inject(format) 
{
	if (document.getElementById(format.ctn) != null) 
	{
		var element = document.getElementById(format.ctn);
	} 


		if(window.innerWidth < format.breakpoint) 
		{			

			if (document.getElementById(format.ctn) == null) 
			{				
	 	 		createTagAds(format.ctn, format.wrappCtn, format.mobile_src, format.mobile_width, format.mobile_height);
			}
			else
			{
				if (element.src != format.mobile_src)
				{						
					element.src = format.mobile_src;
					element.width = format.mobile_width;
					element.height = format.mobile_height;						 	
				}	
			}								
		} 

		else 
		{
			if (document.getElementById(format.ctn) == null) 
			{				
	 	 		createTagAds(format.ctn, format.wrappCtn, format.desk_src,  format.desk_width, format.desk_height);	
			}
			else
			{
				if (element.src != format.desk_src)					
				{
					element.src = format.desk_src;
					element.width = format.desk_width;
					element.height = format.desk_height;			
						
				}	
			}
		}
	
}

if (typeof(smartbox)!='undefined')
{
	if(document.getElementById(smartbox.wrappCtn) != null && document.getElementById(smartbox.ctn) == null )
	{
		tag_inject(smartbox);
		if (typeof(smartbox.breakpoint)!='undefined') {
			window.addEventListener('resize', function(){ tag_inject(smartbox);}, false);
		};
	}
}