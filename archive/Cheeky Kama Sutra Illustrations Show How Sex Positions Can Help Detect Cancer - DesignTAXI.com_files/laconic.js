(function(h){function d(){for(var b=document.createElement(arguments[0]),d=1;d<arguments.length;d++){var a=arguments[d];if(!(null===a||void 0===a))if(1===a.nodeType)b.appendChild(a);else if(""===a||a&&a.charCodeAt&&a.substr||0===a||a&&a.toExponential&&a.toFixed)b.appendChild(document.createTextNode(a));else if(1===d&&"object"===typeof a)for(var c in a){if(a.hasOwnProperty(c)){var f=a[c];null!==f&&void 0!==f&&(c=c.toLowerCase(),c=j[c]||c,"o"===c.charAt(0)&&"n"===c.charAt(1)?(void 0===a.href&&"onclick"===
c&&b.setAttribute("href","#"),b[c]=f):"style"===c&&b.style.setAttribute?b.style.setAttribute("cssText",f):"className"===c||"htmlFor"===c?b[c]=f:b.setAttribute(c,f))}}else if("[object Array]"===Object.prototype.toString.call(a))for(f=0;f<a.length;f++){var e=a[f];1===e.nodeType&&b.appendChild(e)}}b.appendTo=function(a){1===a.nodeType&&1===this.nodeType&&a.appendChild(this);return b};return b}var j={acceptcharset:"acceptCharset",accesskey:"accessKey",allowtransparency:"allowTransparency",bgcolor:"bgColor",
cellpadding:"cellPadding",cellspacing:"cellSpacing","class":"className",classname:"className",colspan:"colSpan",csstext:"style",defaultchecked:"defaultChecked",defaultselected:"defaultSelected",defaultvalue:"defaultValue","for":"htmlFor",frameborder:"frameBorder",hspace:"hSpace",htmlfor:"htmlFor",longdesc:"longDesc",maxlength:"maxLength",marginwidth:"marginWidth",marginheight:"marginHeight",noresize:"noResize",noshade:"noShade",readonly:"readOnly",rowspan:"rowSpan",tabindex:"tabIndex",valign:"vAlign",
vspace:"vSpace"};d.registerElement=function(b,e){d[b]||(d[b]=function(){var a=d("div",{"class":b});e.apply(a,Array.prototype.slice.call(arguments));return a})};for(var e="a abbr address area article aside audio b base bdo blockquote body br button canvas caption cite code col colgroup command datalist dd del details dfn div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins keygen kbd label legend li link map mark menu meta meter nav noscript object ol optgroup option output p param pre progress q rp rt ruby s samp script section select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr ul var video wbr".split(" ").concat("acronym applet basefont big center dir font frame frameset noframes strike tt u xmp".split(" ")),
k=function(b){return function(){return d.apply(this,[b].concat(Array.prototype.slice.call(arguments)))}},g=0;g<e.length;g++)d[e[g]]=k(e[g]);"undefined"!==typeof module&&module.exports?module.exports=d:(e=h.$||{},e.el=d,h.$=e)})(this);