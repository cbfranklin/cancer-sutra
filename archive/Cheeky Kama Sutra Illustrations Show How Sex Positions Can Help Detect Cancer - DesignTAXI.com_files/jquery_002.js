// Sticky Plugin
// =============
// Author: Anthony Garand
// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)
// Improvements by Leonardo C. Daronco (daronco)
// Created: 2/14/2011
// Date: 2/12/2012
// Website: http://labs.anthonygarand.com/sticky
// Description: Makes an element on the page stick on the screen as you scroll
//       It will only set the 'top' and 'position' of your element, you
//       might need to adjust the width in some cases.

(function(d){var p={topSpacing:0,bottomSpacing:0,className:"is-sticky",wrapperClassName:"sticky-wrapper",center:!1,getWidthFrom:""},h=d(window),q=d(document),j=[],m=h.height(),g=function(){for(var b=h.scrollTop(),e=q.height(),c=e-m,c=b>c?c-b:0,k=0;k<j.length;k++){var a=j[k],f=a.stickyWrapper.offset().top-a.topSpacing-c;b<=f?null!==a.currentTop&&(a.stickyElement.css("position","").css("top",""),a.stickyElement.parent().removeClass(a.className),a.currentTop=null):(f=e-a.stickyElement.outerHeight()-
a.topSpacing-a.bottomSpacing-b-c,f=0>f?f+a.topSpacing:a.topSpacing,a.currentTop!=f&&(a.stickyElement.css("position","fixed").css("top",f),"undefined"!==typeof a.getWidthFrom&&a.stickyElement.css("width",d(a.getWidthFrom).width()),a.stickyElement.parent().addClass(a.className),a.currentTop=f))}},n=function(){m=h.height()},l={init:function(b){var e=d.extend(p,b);return this.each(function(){var c=d(this);stickyId=c.attr("id");wrapper=d("<div></div>").attr("id",stickyId+"-sticky-wrapper").addClass(e.wrapperClassName);
c.wrapAll(wrapper);e.center&&c.parent().css({width:c.outerWidth(),marginLeft:"auto",marginRight:"auto"});"right"==c.css("float")&&c.css({"float":"none"}).parent().css({"float":"right"});var b=c.parent();b.css("height",c.outerHeight());j.push({topSpacing:e.topSpacing,bottomSpacing:e.bottomSpacing,stickyElement:c,currentTop:null,stickyWrapper:b,className:e.className,getWidthFrom:e.getWidthFrom})})},update:g};window.addEventListener?(window.addEventListener("scroll",g,!1),window.addEventListener("resize",
n,!1)):window.attachEvent&&(window.attachEvent("onscroll",g),window.attachEvent("onresize",n));d.fn.sticky=function(b){if(l[b])return l[b].apply(this,Array.prototype.slice.call(arguments,1));if("object"===typeof b||!b)return l.init.apply(this,arguments);d.error("Method "+b+" does not exist on jQuery.sticky")};d(function(){setTimeout(g,0)})})(jQuery);