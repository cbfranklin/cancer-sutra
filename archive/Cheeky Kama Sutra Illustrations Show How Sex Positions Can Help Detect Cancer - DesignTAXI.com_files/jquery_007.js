/*
 * Viewport - jQuery selectors for finding elements in viewport
 *
 * Copyright (c) 2008-2009 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *  http://www.appelsiini.net/projects/viewport
 *
 */
(function(a){a.belowthefold=function(b,c){return a(window).height()+a(window).scrollTop()<=a(b).offset().top-c.threshold};a.abovethetop=function(b,c){return a(window).scrollTop()>=a(b).offset().top+a(b).height()-c.threshold};a.rightofscreen=function(b,c){return a(window).width()+a(window).scrollLeft()<=a(b).offset().left-c.threshold};a.leftofscreen=function(b,c){return a(window).scrollLeft()>=a(b).offset().left+a(b).width()-c.threshold};a.inviewport=function(b,c){return!a.rightofscreen(b,c)&&!a.leftofscreen(b,
c)&&!a.belowthefold(b,c)&&!a.abovethetop(b,c)};a.extend(a.expr[":"],{"below-the-fold":function(b){return a.belowthefold(b,{threshold:0})},"above-the-top":function(b){return a.abovethetop(b,{threshold:0})},"left-of-screen":function(b){return a.leftofscreen(b,{threshold:0})},"right-of-screen":function(b){return a.rightofscreen(b,{threshold:0})},"in-viewport":function(b){return a.inviewport(b,{threshold:0})}})})(jQuery);