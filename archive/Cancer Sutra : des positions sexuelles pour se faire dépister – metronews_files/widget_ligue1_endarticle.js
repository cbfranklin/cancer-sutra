(function(window, $, undefined){
 
     
  function getMetaContent(propName) {
    var metas = document.getElementsByTagName('meta');
    for (i = 0; i < metas.length; i++) {
      if (metas[i].getAttribute("name") == propName) {
        return metas[i].getAttribute("content");
      }
    }
    return "";
  } 

  function searchTeam(list){
    if(list!=null){
      for (var k in squad) {
        if( ( list.indexOf(squad[k]['name'].toLowerCase()) > -1 ||  list.indexOf(squad[k]['shortname'].toLowerCase()) > -1 ) && teamfound.indexOf(squad[k]['id'])== -1){      
          teamfound.push(squad[k]['id']);
        }
      }
    }
    
  }

  
 if ($('meta[property="article:section"]').attr("content")=="/sport/foot"  ||  $('meta[property="article:section"]').attr("content")=="/sport/mercato" ){
   
   // Article Foot 
   
   var html=""
   html+='<style>'
   html+='#modsport a:link, #modligue1 a:visited, #modligue1 a:hover,#modligue1 a:active { outline:none }'
   html+='#modsport{font-family:arial;font-size:1em;display:inline-block; clear: both; margin:33px auto 0; width: 100%;}'
   html+='#modsport H4 a{text-transform: uppercase; padding: 15px 0; color: #f47721;font-weight:normal; font-family: "metro headline";font-size: 23px;}'
   html+='#modsport a{display:block;text-decoration:none; color:#272727; font-weight:bold;}'
   html+='#modsport a:hover{color:#f47721;}'
   html+='#modsport ul {overflow:auto;margin: 0 0 10px;padding:0;list-style: none;border-radius: 5px;padding: 5px;border: 1px solid #eef1f5;	}'
   html+='#modsport ul li{float:left;padding:15px;}'
   html+='#modsport ul li  img{margin-right:10px;}'
   html+='#modsport ul.team {border:none;font-size:1em;line-height: 1.2em;}'
   html+='#modsport ul.team li{margin-top:5px;}'
   html+='#modsport ul.team li{margin-bottom:5px;}'
   html+='#modsport ul.team li:nth-child(2n+1){margin-right:10px;}'
   html+='#modsport ul.team.inline li{margin-right:0px;width:100%}'
   html+='#modsport ul.team li{ background-color: #F1F1F1;border: 1px solid #edeaea;border-radius: 5px;box-sizing: border-box;padding: 5px 8px;width: 49%;}'
   html+='#modsport .team img {float: left;margin-right: 10px;vertical-align:top;height:60px; }'
   html+='#modsport .team div {padding-top: 15px; }'
   html+='#modsport .small{color: #808080;font-size: 1em;text-decoration: underline;text-transform: none;padding: 5px 0;display: block;font-weight: normal;}'
   html+='@media only screen and (max-width: 980px) {#modsport ul li:not(:last-child){margin-right:0}  #modsport ul li {width: 174px;} #modsport ul.team li{width: 100%;} #modsport ul.team li{margin-right: 0;}}'
   html+='@media only screen and (min-width:981px) and (max-width:1199px) {}'
   html+='@media only screen and (min-width:1200px){#modsport ul.pfsport li {margin: 10px 6px 10px 0;}  '
   html+='</style>' 

   html+='<div id="modsport"></div>'
      
    // LIGUE 1 Append wrapper
   
   // Display
   $('.byline').parent().after(html)  
      
   
   // Check Article Ligue 1 in TOPIC
   if(typeof(dataLayer)!==  "undefined" && typeof(dataLayer[0]['gaSource'])!==  "undefined"){
   
     var topic =  dataLayer[0]['gaSource'].toLowerCase();
    
     if(topic.indexOf("ligue 1")>-1 || topic.indexOf("ligue-1")>-1 || topic.indexOf("ligue1")>-1){
         
       
      // ADD MENU SPORT LIGUE 1
      html='<div id="menusport">'
      html+='<h4><a target="blank" title="Toutes les donn&eacute;es sur la ligue 1" href="http://sport.metronews.fr">Toutes les donn&eacute;es sur la ligue 1</a></h4>'
      html+='<ul class="pfsport">'
      html+='<li><a onclick="dataLayer.push({\'event\': \'trackEvent\', \'gtmCategory\': \'ModuleSport\', \'gtmAction\': \'module Ligue1 - End Article\', \'gtmLabel\': \'CLICKED Lnk Accueil\'});" target="blank" href="http://sport.metronews.fr"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wIJDzITSuZKIgAAAftJREFUKM9VkktIlVEQx3/n83zdT823SEpZFvQilSISFy2iVWFUJBQ+oFWEEBQtW7Vz5aKsNhGhRQVtIqGgRUVce5IaPa7mVbpWaGh2qe6je86ZFpc+bFbD/H/8Z4YZxZLIvbotZmwINz8N6UUorMCrbkA3t+Fvb1f/uDDJXOsR920KxOHmp0Ijr3otKA+vZh1B14WQJ3PjpKT6D4iIiOSykh44Lr/ObJD0YI9ILisiIqlz+yRz/YQAaBN/LpnLnRQ07ECyv1GRYoLuS2BzUODnXf+kUH4h5u09zNRL8czTAQDs9AtcPJqHnMW8fwDO5rXJYWziNQBm+CraJkbCMVVpLW5uguyt07jZGLkVG4kc6UOV1ISMTYzg4QxeZT3L9p/FW9mInYziZmP5hrMx7GQUb1VTXq9aDc7gqcJyIp39+C0dAOimtqVXQDfuBcBv6SDScR5VVIkmUowdf4wqr0NSSbyqeoKjV5DUd1RRJaqkBreQQBWVYccfQbAcZT48lMzgMVRZHfJzDr1lD5HDfWGn7M1TmHf3UaW1SPIrQedFPL1pl9LbDiE/voA1mLG72Piz/NIfo5g3Q2ANsjiD3noQvXm38gCC9l7lt3aH7m5mFEkncZ/Hwprf2k3Q3qv+eyMAM/FEzOgdZOETkkqiiitQVWvQzW3o9TtD9i8Yf9uIFLG5vAAAAABJRU5ErkJggg=="/>Accueil</a></li>'
      html+='<li><a onclick="dataLayer.push({\'event\': \'trackEvent\', \'gtmCategory\': \'ModuleSport\', \'gtmAction\': \'module Ligue1 - End Article\', \'gtmLabel\': \'CLICKED Lnk Classement\'});" target="blank" href="http://sport.metronews.fr/football/ligue-1/classement"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wIJDzITSuZKIgAAAftJREFUKM9VkktIlVEQx3/n83zdT823SEpZFvQilSISFy2iVWFUJBQ+oFWEEBQtW7Vz5aKsNhGhRQVtIqGgRUVce5IaPa7mVbpWaGh2qe6je86ZFpc+bFbD/H/8Z4YZxZLIvbotZmwINz8N6UUorMCrbkA3t+Fvb1f/uDDJXOsR920KxOHmp0Ijr3otKA+vZh1B14WQJ3PjpKT6D4iIiOSykh44Lr/ObJD0YI9ILisiIqlz+yRz/YQAaBN/LpnLnRQ07ECyv1GRYoLuS2BzUODnXf+kUH4h5u09zNRL8czTAQDs9AtcPJqHnMW8fwDO5rXJYWziNQBm+CraJkbCMVVpLW5uguyt07jZGLkVG4kc6UOV1ISMTYzg4QxeZT3L9p/FW9mInYziZmP5hrMx7GQUb1VTXq9aDc7gqcJyIp39+C0dAOimtqVXQDfuBcBv6SDScR5VVIkmUowdf4wqr0NSSbyqeoKjV5DUd1RRJaqkBreQQBWVYccfQbAcZT48lMzgMVRZHfJzDr1lD5HDfWGn7M1TmHf3UaW1SPIrQedFPL1pl9LbDiE/voA1mLG72Piz/NIfo5g3Q2ANsjiD3noQvXm38gCC9l7lt3aH7m5mFEkncZ/Hwprf2k3Q3qv+eyMAM/FEzOgdZOETkkqiiitQVWvQzW3o9TtD9i8Yf9uIFLG5vAAAAABJRU5ErkJggg=="/>Classement</a></li>'
      html+='<li><a onclick="dataLayer.push({\'event\': \'trackEvent\', \'gtmCategory\': \'ModuleSport\', \'gtmAction\': \'module Ligue1 - End Article\', \'gtmLabel\': \'CLICKED Lnk Calendrier-Resultat\'});" target="blank" href="http://sport.metronews.fr/football/ligue-1/calendrier-et-resultats"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wIJDzITSuZKIgAAAftJREFUKM9VkktIlVEQx3/n83zdT823SEpZFvQilSISFy2iVWFUJBQ+oFWEEBQtW7Vz5aKsNhGhRQVtIqGgRUVce5IaPa7mVbpWaGh2qe6je86ZFpc+bFbD/H/8Z4YZxZLIvbotZmwINz8N6UUorMCrbkA3t+Fvb1f/uDDJXOsR920KxOHmp0Ijr3otKA+vZh1B14WQJ3PjpKT6D4iIiOSykh44Lr/ObJD0YI9ILisiIqlz+yRz/YQAaBN/LpnLnRQ07ECyv1GRYoLuS2BzUODnXf+kUH4h5u09zNRL8czTAQDs9AtcPJqHnMW8fwDO5rXJYWziNQBm+CraJkbCMVVpLW5uguyt07jZGLkVG4kc6UOV1ISMTYzg4QxeZT3L9p/FW9mInYziZmP5hrMx7GQUb1VTXq9aDc7gqcJyIp39+C0dAOimtqVXQDfuBcBv6SDScR5VVIkmUowdf4wqr0NSSbyqeoKjV5DUd1RRJaqkBreQQBWVYccfQbAcZT48lMzgMVRZHfJzDr1lD5HDfWGn7M1TmHf3UaW1SPIrQedFPL1pl9LbDiE/voA1mLG72Piz/NIfo5g3Q2ANsjiD3noQvXm38gCC9l7lt3aH7m5mFEkncZ/Hwprf2k3Q3qv+eyMAM/FEzOgdZOETkkqiiitQVWvQzW3o9TtD9i8Yf9uIFLG5vAAAAABJRU5ErkJggg=="/>Calendrier et r&eacute;sultats</a></li>'
      html+='<li><a onclick="dataLayer.push({\'event\': \'trackEvent\', \'gtmCategory\': \'ModuleSport\', \'gtmAction\': \'module Ligue1 - End Article\', \'gtmLabel\': \'CLICKED Lnk Equipe\'});" target="blank" href="http://sport.metronews.fr/football/ligue-1/equipe"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wIJDzITSuZKIgAAAftJREFUKM9VkktIlVEQx3/n83zdT823SEpZFvQilSISFy2iVWFUJBQ+oFWEEBQtW7Vz5aKsNhGhRQVtIqGgRUVce5IaPa7mVbpWaGh2qe6je86ZFpc+bFbD/H/8Z4YZxZLIvbotZmwINz8N6UUorMCrbkA3t+Fvb1f/uDDJXOsR920KxOHmp0Ijr3otKA+vZh1B14WQJ3PjpKT6D4iIiOSykh44Lr/ObJD0YI9ILisiIqlz+yRz/YQAaBN/LpnLnRQ07ECyv1GRYoLuS2BzUODnXf+kUH4h5u09zNRL8czTAQDs9AtcPJqHnMW8fwDO5rXJYWziNQBm+CraJkbCMVVpLW5uguyt07jZGLkVG4kc6UOV1ISMTYzg4QxeZT3L9p/FW9mInYziZmP5hrMx7GQUb1VTXq9aDc7gqcJyIp39+C0dAOimtqVXQDfuBcBv6SDScR5VVIkmUowdf4wqr0NSSbyqeoKjV5DUd1RRJaqkBreQQBWVYccfQbAcZT48lMzgMVRZHfJzDr1lD5HDfWGn7M1TmHf3UaW1SPIrQedFPL1pl9LbDiE/voA1mLG72Piz/NIfo5g3Q2ANsjiD3noQvXm38gCC9l7lt3aH7m5mFEkncZ/Hwprf2k3Q3qv+eyMAM/FEzOgdZOETkkqiiitQVWvQzW3o9TtD9i8Yf9uIFLG5vAAAAABJRU5ErkJggg=="/>&Eacute;quipes</a></li>'
      html+='</ul>'
      html+='</div>'
            
      $('#modsport').prepend(html)  
     	dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'ModuleSport', 'gtmAction': 'module Ligue1 - End Article', 'gtmLabel': 'DISPLAY'});

    }
    
  }
 

   
   // Check Teams related in META -----------------------------------------------------------------------------------
 
   var  squad = {};
   squad[1641] = {'id' : 1641, 'name' :'Marseille','shortname':  'OM','seoname' : 'Olympique de Marseille' };
   squad[1642] = {'id' : 1642, 'name' :'Montpellier','shortname':  'MHSC','seoname' : 'Montpellier HSC' };
   squad[1643] = {'id' : 1643, 'name' :'Lille','shortname':  'LOSC','seoname' : 'Lille OSC' };
   squad[1644] = {'id' : 1644, 'name' :'Paris','shortname':  'PSG','seoname' : 'Paris Saint-Germain' };
   squad[1645] = {'id' : 1645, 'name' :'Bordeaux','shortname':  'FCGB','seoname' : 'Girondins de Bordeaux' };
   squad[1647] = {'id' : 1647, 'name' :'Nantes','shortname':  'FCNA','seoname' : 'FC Nantes' };
   squad[1648] = {'id' : 1648, 'name' :'Lens','shortname':  'RCL','seoname' : 'RC Lens' };
   squad[1649] = {'id' : 1649, 'name' :'Lyon','shortname':  'OL','seoname' : 'Olympique Lyonnais' };
   squad[1651] = {'id' : 1651, 'name' :'Metz','shortname':  'FCM','seoname' : 'FC Metz' };
   squad[1653] = {'id' : 1653, 'name' :'Monaco','shortname':  'ASM','seoname' : 'AS Monaco' };
   squad[1654] = {'id' : 1654, 'name' :'Guingamp','shortname':  'EAG','seoname' : 'EA Guigamp' };
   squad[1655] = {'id' : 1655, 'name' :'Bastia','shortname':  'SCB','seoname' : 'SC Bastia' };
   squad[1656] = {'id' : 1656, 'name' :'Lorient','shortname':  'FCL','seoname' : 'FC Lorient' };
   squad[1658] = {'id' : 1658, 'name' :'Rennes','shortname':  'SRFC','seoname' : 'Stade Rennais' };
   squad[1661] = {'id' : 1661, 'name' :'Nice','shortname':  'OGCN','seoname' : 'OGC Nice' };
   squad[1667] = {'id' : 1667, 'name' :'Caen','shortname':  'SMC','seoname' : 'SM Caen' };
   squad[1678] = {'id' : 1678, 'name' :'Saint Etienne','shortname':  'ASSE','seoname' : 'AS Saint-Etienne' };
   squad[1679] = {'id' : 1678, 'name' :'St Etienne','shortname':  'ASSE','seoname' : 'AS Saint-Etienne' };
   squad[1680] = {'id' : 1678, 'name' :'Saint-Etienne','shortname':  'ASSE','seoname' : 'AS Saint-Etienne' };
   squad[1681] = {'id' : 1681, 'name' :'Toulouse','shortname':  'TFC','seoname' : 'Toulouse FC' };
   squad[1682] = {'id' : 1682, 'name' :'Reims','shortname':  'SDR','seoname' : 'Stade de Reims' };
   squad[21800] ={'id' : 21800, 'name' :'Evian','shortname':  'ETG','seoname' : 'Evian TG' };
 
   // --------------------------------------------------------------------------------------------------------

   // META ARTICLE 
   var title       = document.title.toLowerCase()
   var description = getMetaContent("description").toLowerCase()
   var keywords    =  getMetaContent("keywords").toLowerCase()
   var teamfound   = new Array();
   var subtitle    = $(".subtitle").html()

   // SEARCH TEAM
   l = topic.match(/\b\w+(-)*\b/g)	
   searchTeam(l)

   l = title.match(/\b\w+(-)*\w+\b/g)	
   searchTeam(l)

   l = keywords.match(/\b\w+(-)*\b/g)	
   searchTeam(l)

   l = subtitle.match(/\b\w+(-)*\b/g)	
   searchTeam(l)

   
   // APPEND TEAMS FOUND 
   
   if(teamfound.length>0){
     if(teamfound.length==1)
       addclassInline="inline"
     else
       addclassInline=""
     
     html="<ul class='team "+ addclassInline +"'>";

     for(i=0; i < teamfound.length; i++ ){       
     	 
     	 teamname = squad[teamfound[i]]['seoname'].replace(/ /g,'-').toLowerCase()+'-'+  squad[teamfound[i]]['shortname'].toLowerCase();
       clickTag = "dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'ModuleSport', 'gtmAction': 'module Badge Equipe - End Article', 'gtmLabel': 'CLICKED "+ teamname+"'});"
       
       html+='<li class="team">'
       html+='<a href="http://sport.metronews.fr/football/equipe/'+ teamname +'" onclick="'+ clickTag +'" >'
       html+='	<img src="http://sport.metronews.fr/assets/images/svg/ligue1/'+squad[teamfound[i]]['shortname'].toLowerCase()+'.svg" />'
       html+='	<div>'
       html+='		<span>'+squad[teamfound[i]]['seoname']+'</span><br/>'
       html+='		<span class="small">Fiche &eacute;quipe</span>'
       html+='	</div>'
       html+='</a>'
       html+='</li>'  
     }
     html+="</ul>";
    
     $('#modsport').append(html) 
     dataLayer.push({'event': 'trackEvent', 'gtmCategory': 'ModuleSport', 'gtmAction': 'module Badge Equipe - End Article', 'gtmLabel': 'DISPLAY'});
   }

   
   
   
 }
 
 
}(window, jQuery))
