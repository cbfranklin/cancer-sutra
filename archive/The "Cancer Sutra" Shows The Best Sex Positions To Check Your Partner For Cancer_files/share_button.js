/*
   This JavaScript code was generated by Jemplate, the JavaScript
   Template Toolkit. Any changes made to this file will be lost the next
   time the templates are compiled.

   Copyright 2006-2014 - Ingy döt Net - All rights reserved.
*/

var Jemplate;
if (typeof(exports) == 'object') {
    Jemplate = require("jemplate").Jemplate;
}

if (typeof(Jemplate) == 'undefined')
    throw('Jemplate.js must be loaded before any Jemplate template files');

Jemplate.templateMap['_share_button.tt'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '\n\n<div id="share-btn-template" style="display: none">\n<a class="share-btn">\n	';
//line 21 "_share_button.tt"
if (0) {
output += '\n	<span class="icon">\n	<svg viewBox="0 0 512 512" class="badge__svg">\n     <use xlink:href="#';
//line 18 "_share_button.tt"
output += stash.get('service');
output += '"></use>\n  </svg>\n  </span>\n  ';
}

output += '\n</a>\n</div>';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

