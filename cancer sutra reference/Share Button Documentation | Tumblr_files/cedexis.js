/*! scripts/vendor/cedexis/cedexis.radar.js */
(function(f,i){f.cedexis=f.cedexis||{};f.cedexis["radar"]=f.cedexis["radar"]||{};f.radar=f.radar||{};f.cdx=f.cdx||{};var c=["navigationStart","unloadEventStart","unloadEventEnd","redirectStart","redirectEnd","fetchStart","domainLookupStart","domainLookupEnd","connectStart","connectEnd","secureConnectionStart","requestStart","responseStart","responseEnd","domLoading","domInteractive","domContentLoadedEventStart","domContentLoadedEventEnd","domComplete","loadEventStart","loadEventEnd"];function o(p){this.__measureFun=p}o.prototype.measure=function(p){this.__measureFun(p)};o.JAVASCRIPT_TEST_OBJECT=new o(function(p){p.measureLegacyJsTestObject()});o.RESOURCE_TIMING_TEST_OBJECT=new o(function(p){p.measureImageFile()});o.CUSTOM_PAGE=new o(function(p){p.measure_custom_page()});o.CUSTOM_SCRIPT=new o(function(p){p.measureCustomJsFile()});o.DNS=new o(function(p){p.measureDns()});o.DYNAMIC=new o(function(p){p.measureDynamicPage()});o.AUTODETECT=new o(function(p){p.measureAutoDetect()});o.byDbName={CEDEXISTESTOBJECT:o.JAVASCRIPT_TEST_OBJECT,CUSTOMIMAGEFILE:o.RESOURCE_TIMING_TEST_OBJECT,CUSTOMPAGE:o.CUSTOM_PAGE,DNS:o.DNS,DSA:o.DYNAMIC,CUSTOMSCRIPT:o.CUSTOM_SCRIPT,AUTODETECT:o.AUTODETECT};o.byId={1:o.JAVASCRIPT_TEST_OBJECT,2:o.RESOURCE_TIMING_TEST_OBJECT,3:o.CUSTOM_PAGE,4:o.DYNAMIC,5:o.CUSTOM_SCRIPT,6:o.AUTODETECT,9:o.DNS};function k(p,q){this.__name=p;this.__measureFun=q}k.prototype.measure=function(p){this.__measureFun(p)};k.AJAX=new k("ajax",function(p){p.requestAjaxNodeId()});k.JSONP=new k("jsonp",function(p){p.requestJsonpNodeId()});k.byDbName={ajax:k.AJAX,jsonp:k.JSONP};k.byId={7:k.AJAX,8:k.JSONP};function b(p){this.__name=p}b.UNSTARTED=new b("unstarted");b.LOADING=new b("loading");b.LOADED=new b("loaded");b.ERROR=new b("error");b.FINISHED=new b("finished");function e(p){this.__url=p.url;this.__method=p.method;this.__status=b.UNSTARTED;this.__cancelled=false;this.__timeoutId=null;this.__timeout=4000}e.prototype.getStatus=function(){return this.__status};e.prototype.setStatus=function(p){this.__status=p};e.prototype.getUrl=function(){return this.__url};e.prototype.measure=function(p){this.__method.measure(p)};e.prototype.isCancelled=function(){return this.__cancelled};e.prototype.setIsCancelled=function(p){this.__cancelled=p};e.prototype.clearTimeout=function(){return clearTimeout(this.__timeoutId)};e.prototype.setTimeoutId=function(p){this.__timeoutId=p};e.prototype.getTimeout=function(){return this.__timeout};function h(p,r,q){this.__name=p;this.__id=r;this.__timeout=q}h.prototype.getProbeId=function(){return this.__id};h.prototype.getTimeout=function(){return this.__timeout};h.prototype.isThroughput=function(){return 14===this.__id};h.COLD=new h("cold",1,4000);h.RTT=new h("rtt",0,4000);h.THROUGHPUT=new h("throughput",14,4000);function g(p){this.__name=p}g.prototype.getStatusName=function(){return this.__name};g.QUEUED=new g("queued");g.LOADING=new g("loading");g.TIMEOUT=new g("timeout");g.LOADED=new g("loaded");g.ERROR=new g("error");function n(p){this.__url=p.url;this.__cancelled=false;this.__status=g.QUEUED;this.__timeoutId=null;this.__probeType=p.probeType;this.__objectType=p.objectType;this.__report=true;if("undefined"!==typeof p.report){this.__report=p.report}this.__probeIdSuffix=p.probeIdSuffix||""}n.prototype.getTimeout=function(){return this.__probeType.getTimeout()};n.prototype.getUrl=function(){return this.__url};n.prototype.isCancelled=function(){return this.__cancelled};n.prototype.setIsCancelled=function(p){this.__cancelled=p};n.prototype.getStatus=function(){return this.__status};n.prototype.setStatus=function(p){this.__status=p};n.prototype.clearTimeout=function(){return clearTimeout(this.__timeoutId)};n.prototype.setTimeoutId=function(p){this.__timeoutId=p};n.prototype.getProbeId=function(){return this.__probeType.getProbeId()};n.prototype.measure=function(p){this.__objectType.measure(p)};n.prototype.isThroughput=function(){return this.__probeType.isThroughput()};n.prototype.getProbeType=function(){return this.__probeType};n.prototype.getReport=function(){return this.__report};n.prototype.getProbeIdSuffix=function(){return this.__probeIdSuffix||""};function d(p){this.__zoneId=p.zoneId;this.__customerId=p.customerId;this.__providerId=p.providerId;this.__effectiveWeight=p.effectiveWeight;this.__cacheBusting=p.cacheBusting;this.__probes=[];this.__cacheNodeIdProbe=null;this.__cacheNodeId=null;this.__coldResult=null}d.prototype.isString=function(p){return"[object String]"===Object.prototype.toString.call(p)};d.prototype.getZoneId=function(){if(this.isString(this.__zoneId)){return this.__zoneId.toString()}return this.__zoneId.toString(10)};d.prototype.getCustomerId=function(){if(this.isString(this.__customerId)){return this.__customerId.toString()}return this.__customerId.toString(10)};d.prototype.getProviderId=function(){if(this.isString(this.__providerId)){return this.__providerId.toString()}return this.__providerId.toString(10)};d.prototype.getEffectiveWeight=function(){return this.__effectiveWeight};d.prototype.isCacheBusting=function(){return this.__cacheBusting};d.prototype.addProbe=function(p){this.__probes.push(p)};d.prototype.setCacheNodeIdProbe=function(p){this.__cacheNodeIdProbe=p};d.prototype.getCacheNodeIdProbe=function(){return this.__cacheNodeIdProbe};d.prototype.copyOfProbes=function(){return[].concat(this.__probes)};d.prototype.getCacheNodeId=function(){return this.__cacheNodeId||"0"};d.prototype.setCacheNodeId=function(p){this.__cacheNodeId=p};d.prototype.setColdMeasurement=function(p){this.__coldResult=p};d.prototype.getColdMeasurement=function(){return this.__coldResult};function l(p){this.__zoneId=p.zoneId;this.__customerId=p.customerId;this.__domains=p.domains;this.__sendPlt=p.sendPlt;this.__buildTimestamp=p.buildTimestamp;this.__providerCount=-1;if("number"===typeof p.providerCount){this.__providerCount=p.providerCount}}l.prototype.getZoneId=function(){return this.__zoneId.toString(10)};l.prototype.getCustomerId=function(){return this.__customerId.toString(10)};l.prototype.getReportDomain=function(){return this.__domains.report};l.prototype.getInitDomain=function(){return this.__domains.init};l.prototype.getProvidersDomain=function(){return this.__domains.providers};l.prototype.isSendPlt=function(){return this.__sendPlt};l.prototype.getBuildTimestamp=function(){return this.__buildTimestamp};function m(s,q,r,p){this.__probeId=s;this.__resultCode=q;this.__value=r;this.__extraFields=p||null}m.prototype.getProbeId=function(){return this.__probeId};m.prototype.getResultCode=function(){return this.__resultCode};m.prototype.getValue=function(){return this.__value};m.prototype.getExtraFields=function(){return this.__extraFields};function a(q,p){this.window=q;this.document=p;this.initializeSession();this.maxPublic=null;this.maxPrivate=null;this.instanceId=this.makeRandomString(24)}a.prototype.initializeSession=function(){this.requestSignature=null;this.transactionId=null;this.resolverCountry=null;this.publicProviders=[];this.privateProviders=[];this.allProviders=[];this.probes=null;this.currentProvider=null;this.currentProbe=null;this.sessionSettings=null};a.prototype.sampler={id:"j4",version:{major:"18",minor:"6"}};a.prototype.arrayContains=function(r,q){var p=r.length;while(p--){if(q===r[p]){return true}}return false};a.prototype.setSessionSettings=function(p){this.sessionSettings=p};a.prototype.setCurrentProvider=function(p){if(p){this.currentProvider=p}else{this.currentProvider=null}return this.currentProvider};a.prototype.setCurrentProbe=function(p){if(p){this.currentProbe=p}else{this.currentProbe=null}return this.currentProbe};a.prototype.setResolverCountry=function(p){this.resolverCountry=p};a.prototype.setTransactionId=function(p){this.transactionId=p};a.prototype.setRequestSignature=function(p){this.requestSignature=p};a.prototype.finishProvider=function(){this.setCurrentProbe();this.setCurrentProvider();this.startNextProvider()};a.prototype.makeProbeUrl=function(p,t,u,q){q=q||"";var s;if("uni"===t){s=[this.sessionSettings.getZoneId(),this.sessionSettings.getCustomerId(),u.getZoneId(),u.getCustomerId(),u.getProviderId(),this.makeRandomString(8),this.requestSignature]}else{if(u.isCacheBusting()){s=[t+q,this.sessionSettings.getZoneId(),this.sessionSettings.getCustomerId(),u.getZoneId(),u.getCustomerId(),u.getProviderId(),this.transactionId,this.requestSignature]}}if(s){var r=s.join("-");if(-1<p.indexOf("?",0)){return p+"&rnd="+r}return p+"?rnd="+r}return p};a.prototype.clearContainer=function(){var p=this.document.getElementById("cdx");if(p){while(p.hasChildNodes()){p.removeChild(p.lastChild)}}};a.prototype.add_to_container=function(q){var p=this.document.getElementById("cdx");if(!p){p=this.document.createElement("div");p.id="cdx";this.document.body.appendChild(p)}p.appendChild(q)};a.prototype.onGotCacheNodeId=function(){if(this.currentProvider){var p=this.currentProvider.getColdMeasurement();if(p){if(0===p.getResultCode()){this.sendSuccessReport(1,p.getValue(),p.getExtraFields())}else{this.sendErrorReport(p.getResultCode(),p.getProbeId())}}else{this.startNextProbe()}}};a.prototype.measureLegacyJsTestObject=function(){if(this.currentProvider&&this.currentProbe){var q=this.document.createElement("script");q.async=true;q.src=this.makeProbeUrl(this.currentProbe.getUrl(),this.currentProbe.getProbeId(),this.currentProvider);this.currentProbe.setIsCancelled(false);this.currentProbe.setStatus(g.LOADING);var p=(new Date()).getTime();this.setScriptOnLoadHandler(q,this.makeLegacyScriptOnLoadCallback(this.currentProbe,p));q.onerror=this.makeScriptOnErrorCallback();this.currentProbe.setTimeoutId(setTimeout(this.makeStandardTimeoutCallback(),this.currentProbe.getTimeout()));this.window.radar["stoppedAt"]=null;this.window.cedexis["radar"]["stopped_at"]=null;this.add_to_container(q)}};a.prototype.isResourceTimingSupported=function(){var p="";function q(){var r;r=/msie (\d+)/i.exec(p);if(r){return parseInt(r[1],10)<=10}return false}if(this.window.navigator&&this.window.navigator["userAgent"]){p=this.window.navigator["userAgent"]}if(this.window.performance&&"function"===typeof this.window.performance["getEntriesByType"]&&!q()){return true}return false};a.prototype.make_image=function(){return new Image()};a.prototype.measureImageFile=function(){if(this.currentProvider&&this.currentProbe){if(this.isResourceTimingSupported()){var p=this.make_image();p.onload=this.makeImageOnLoadCallback();p.onerror=this.makeImageOnErrorCallback();this.currentProbe.setIsCancelled(false);this.currentProbe.setStatus(g.LOADING);this.currentProbe.setTimeoutId(setTimeout(this.makeStandardTimeoutCallback(),this.currentProbe.getTimeout()));p.src=this.makeProbeUrl(this.currentProbe.getUrl(),this.currentProbe.getProbeId(),this.currentProvider,this.currentProbe.getProbeIdSuffix())}else{this.startNextProbe()}}};a.prototype.measureDns=function(){if(this.currentProvider&&this.currentProbe){if(this.isResourceTimingSupported()){var q=this.make_image();q.onload=this.makeImageOnLoadCallbackForDns();q.onerror=this.makeImageOnErrorCallback();this.currentProbe.setIsCancelled(false);this.currentProbe.setStatus(g.LOADING);this.currentProbe.setTimeoutId(setTimeout(this.makeStandardTimeoutCallback(),this.currentProbe.getTimeout()));var p=this.makeCacheCacheBustedUrl(this.currentProbe.getUrl());if(p){q.src=this.makeProbeUrl(p,this.currentProbe.getProbeId(),this.currentProvider)}else{this.startNextProvider()}}else{this.startNextProbe()}}};a.prototype.makeCacheCacheBustedUrl=function(q){var t=q.indexOf("//");if(-1<t){var p=q.substring(t+2);var s="//";if(0<t){s=q.substring(0,t)+"//"}var r=p.split("/");r[0]=this.makeRandomString(63,"abcdefghijklmnopqrstuvwxyz")+"."+r[0];return s+r.join("/")}return null};a.prototype.getPerformanceEntry=function(q,r){var p=this.window.performance["getEntriesByType"](q);var s=p.length;while(s--){if(p[s]["name"]===r){return p[s]}}return null};a.prototype.makeProcessResourceCallback=function(s,p,q){var r=this;return function(){if(!p.getReport()){r.startNextProbe()}else{var w=r.getPerformanceEntry("resource",q);if(w){var t;if(0<w.requestStart){if(p.isThroughput()){t=Math.round(w.responseEnd-w.requestStart)}else{t=Math.round(w.responseStart-w.requestStart)}}else{t=Math.round(w.duration)}if(0<t){var v=!!(h.COLD===p.getProbeType()&&s.getCacheNodeIdProbe());if(t<p.getTimeout()){var u=t;if(p.isThroughput()){u=r.calculateThroughput(t,p.getUrl())}if(v){s.setColdMeasurement(new m(p.getProbeId(),0,u));r.startNextProbe()}else{r.sendSuccessReport(p.getProbeId(),u)}}else{if(v){s.setColdMeasurement(new m(p.getProbeId(),1,0));r.startNextProbe()}else{r.sendErrorReport(1,p.getProbeId())}}}else{r.finishProvider()}}else{r.finishProvider()}}}};a.prototype.makeImageOnLoadCallback=function(){var q=this;var r=this.currentProvider;var p=this.currentProbe;return function(){p.clearTimeout();if(r===q.currentProvider&&p===q.currentProbe&&!p.isCancelled()){setTimeout(q.makeProcessResourceCallback(r,p,this["src"]),0)}}};a.prototype.makeImageOnLoadCallbackForDns=function(){var q=this;var r=this.currentProvider;var p=this.currentProbe;return function(){p.clearTimeout();if(r===q.currentProvider&&p===q.currentProbe&&!p.isCancelled()){var t=q.getPerformanceEntry("resource",this["src"]);if(t){var s;if(0<t.requestStart){s=Math.round(t.domainLookupEnd-t.domainLookupStart)}else{s=Math.round(t.duration)}if(0<s){if(s<=p.getTimeout()){q.sendSuccessReport(p.getProbeId(),s)}else{q.sendErrorReport(1,p.getProbeId())}}else{q.finishProvider()}}else{q.finishProvider()}}else{}}};a.prototype.makeImageOnErrorCallback=function(){var q=this;var r=this.currentProvider;var p=this.currentProbe;return function(){if(r===q.currentProvider&&p===q.currentProbe&&!p.isCancelled()){p.setIsCancelled(true);p.setStatus(g.ERROR);var s=!!(h.COLD===p.getProbeType()&&r.getCacheNodeIdProbe());if(s){r.setColdMeasurement(new m(p.getProbeId(),4,0));q.startNextProbe()}else{q.sendErrorReport(4,p.getProbeId())}}}};a.prototype.requestAjaxNodeId=function(){if(this.currentProvider){var p=this.currentProvider.getCacheNodeIdProbe();if(p){if(this.windowHasPostMessageFun()){var q=this.document.createElement("iframe");q.style.display="none";q.src=this.makeProbeUrl(p.getUrl(),"uni",this.currentProvider);p.setStatus(b.LOADING);p.setTimeoutId(setTimeout(this.makeCacheNodeIdTimeoutCallback(),p.getTimeout()));this.add_to_container(q)}else{this.currentProvider.setCacheNodeId("1");p.setStatus(b.FINISHED);this.onGotCacheNodeId()}}}};a.prototype.makeCacheNodeIdTimeoutCallback=function(){var p=this;var q=this.currentProvider;return function(){if(q===p.currentProvider){var r=q.getCacheNodeIdProbe();if(r){q.setCacheNodeId("2");r.setStatus(b.FINISHED);r.setIsCancelled(true);p.onGotCacheNodeId()}}}};a.prototype.requestJsonpNodeId=function(){if(this.currentProvider){var q=this.currentProvider.getCacheNodeIdProbe();if(q){var r=this.document.createElement("script");var p=this.makeProbeUrl(q.getUrl(),"uni",this.currentProvider);this.window.cdx["s"]=this.window.cdx["s"]||{};this.window.cdx["s"]["b"]=this.makeJsonpNodeIdCallback();r.onerror=this.makeJsonpNodeIdOnErrorCallback();q.setStatus(b.LOADING);q.setTimeoutId(setTimeout(this.makeCacheNodeIdTimeoutCallback(),q.getTimeout()));r.type="text/javascript";r.async=true;r.src=p;this.add_to_container(r)}}};a.prototype.makeJsonpNodeIdCallback=function(){var p=this;var q=this.currentProvider;return function(s){function r(){var t=q.getCacheNodeIdProbe();if(t&&!t.isCancelled()){q.setCacheNodeId(s.node);t.setStatus(b.FINISHED);p.onGotCacheNodeId()}}if(q===p.currentProvider){if(q.getProviderId()==s.id){r()}}}};a.prototype.makeJsonpNodeIdOnErrorCallback=function(){var p=this;var q=this.currentProvider;return function(){if(q===p.currentProvider){var r=q.getCacheNodeIdProbe();if(r){q.setCacheNodeId("2");r.setStatus(b.FINISHED);r.setIsCancelled(true);p.onGotCacheNodeId()}}}};a.prototype.measure_custom_page=function(){if(this.currentProvider&&this.currentProbe){var q=this.document.createElement("iframe");var p=(new Date()).getTime();q.src=this.makeProbeUrl(this.currentProbe.getUrl(),this.currentProbe.getProbeId(),this.currentProvider);q.style.display="none";q.onload=this.makeSimpleOnLoakCallback(p);this.currentProbe.setIsCancelled(false);this.currentProbe.setStatus(g.LOADING);this.currentProbe.setTimeoutId(setTimeout(this.makeStandardTimeoutCallback(),this.currentProbe.getTimeout()));this.add_to_container(q)}};a.prototype.measureCustomJsFile=function(){if(this.currentProvider&&this.currentProbe){var q=this.document.createElement("script");q.async=true;q.src=this.makeProbeUrl(this.currentProbe.getUrl(),this.currentProbe.getProbeId(),this.currentProvider);this.currentProbe.setIsCancelled(false);this.currentProbe.setStatus(g.LOADING);var p=(new Date()).getTime();this.setScriptOnLoadHandler(q,this.makeLegacyScriptOnLoadCallback(this.currentProbe,p));q.onerror=this.makeScriptOnErrorCallback();this.currentProbe.setTimeoutId(setTimeout(this.makeStandardTimeoutCallback(),this.currentProbe.getTimeout()));this.add_to_container(q)}};a.prototype.makeDynamicPageOnLoadHandler=function(){var q=this;var p=this.currentProbe;return function(){if(p===q.currentProbe&&g.LOADING===p.getStatus()){p.setStatus(g.LOADED)}}};a.prototype.measureDynamicPage=function(){if(this.currentProvider&&this.currentProbe){var p=this.document.createElement("iframe");p.onload=this.makeDynamicPageOnLoadHandler();p.src=this.makeProbeUrl(this.currentProbe.getUrl(),this.currentProbe.getProbeId(),this.currentProvider);p.style["display"]="none";this.currentProbe.setStatus(g.LOADING);this.currentProbe.setIsCancelled(false);this.currentProbe.setTimeoutId(setTimeout(this.makeStandardTimeoutCallback(),this.currentProbe.getTimeout()));this.add_to_container(p)}};a.prototype.measureAutoDetect=function(){var p=(function(s){return s.slice(s.lastIndexOf("/")+1)}(this.currentProbe.getUrl()));var r=[/cdx10b/,/rdr12/,/radar\.js/,/r\d+(-\d+kb)?\.js/i,/r\d+\w+(-\d+kb)?\.js/i];if("d17.html"===p){this.measureDynamicPage();return}var q;for(q=0;q<r.length;q+=1){if(r[q].test(p)){this.measureLegacyJsTestObject();return}}if(/\.js(\?)?/i.test(p)){this.measureCustomJsFile()}else{if(/\.(ico|png|bmp|gif|jpg|jpeg)(\?)?/i.test(p)){this.measureImageFile()}else{if(/\.(htm(l)?)(\?)?/i.test(p)){this.measure_custom_page()}else{this.finishProvider()}}}};a.prototype.doLegacyJsTimedMeasurement=function(q,t){if(q===this.currentProbe){var u=this.window.cedexis["radar"]["stopped_at"]||this.window.radar["stoppedAt"]||null;var s=!!(h.COLD===q.getProbeType()&&this.currentProvider.getCacheNodeIdProbe());if(u){var p=u-t;if(0<p){if(p<=q.getTimeout()){var r=p;if(q.isThroughput()){r=this.calculateThroughput(p,q.getUrl())}if(s){this.currentProvider.setColdMeasurement(new m(q.getProbeId(),0,r));this.startNextProbe()}else{this.sendSuccessReport(q.getProbeId(),r)}}else{if(s){this.currentProvider.setColdMeasurement(new m(q.getProbeId(),1,0));this.startNextProbe()}else{this.sendErrorReport(1,q.getProbeId())}}}else{this.finishProvider()}}else{if(s){this.currentProvider.setColdMeasurement(new m(q.getProbeId(),1,0));this.startNextProbe()}else{this.sendErrorReport(1,q.getProbeId())}}}};a.prototype.sendSuccessReport=function(t,s,p){if(this.currentProvider){var r=[this.sessionSettings.getReportDomain(),"f1",this.requestSignature,this.currentProvider.getZoneId(),this.currentProvider.getCustomerId(),this.currentProvider.getProviderId(),t,0,s,this.currentProvider.getCacheNodeId(),this.getImpactValue()],q;if(p){for(q=0;q<p.length;q+=1){r.push(p[q])}}var u="//";if("file:"===this.window.location["protocol"]){u="http://"}this.sendReport(u+r.join("/"));this.startNextProbe()}};a.prototype.calculateThroughput=function(q,r){var t=/(\d+)kb\./i,s=t.exec(r),p;if(!s||(2>s.length)){return 0}p=parseInt(s[1],10);return Math.floor(8*1000*p/q)};a.prototype.makeSimpleOnLoakCallback=function(q){var r=this;var p=this.currentProbe;return function(){p.clearTimeout();if(p===r.currentProbe){var u=(new Date()).getTime();var s=u-q;if(0<s){if(s<=p.getTimeout()){var t=s;if(p.isThroughput()){t=r.calculateThroughput(s,p.getUrl())}r.sendSuccessReport(p.getProbeId(),t)}else{r.sendErrorReport(1,p.getProbeId())}}else{r.finishProvider()}}}};a.prototype.makeLegacyScriptOnLoadCallback=function(p,q){var r=this;return function(){p.clearTimeout();r.doLegacyJsTimedMeasurement(p,q)}};a.prototype.makeStandardTimeoutCallback=function(){var q=this;var r=this.currentProvider;var p=this.currentProbe;return function(){if(r===q.currentProvider&&p===q.currentProbe){var s=1;if(g.LOADED===p.getStatus()){s=4;p.setStatus(g.ERROR)}else{p.setStatus(g.TIMEOUT)}p.setIsCancelled(true);var t=!!(h.COLD===p.getProbeType()&&r.getCacheNodeIdProbe());if(t){r.setColdMeasurement(new m(p.getProbeId(),s,0));q.startNextProbe()}else{q.sendErrorReport(s,p.getProbeId())}}}};a.prototype.makeScriptOnErrorCallback=function(){var q=this;var r=this.currentProvider;var p=this.currentProbe;return function(){p.clearTimeout();if(r===q.currentProvider&&p===q.currentProbe&&!p.isCancelled()){var s=!!(h.COLD===p.getProbeType()&&r.getCacheNodeIdProbe());if(s){r.setColdMeasurement(new m(p.getProbeId(),4,0));q.startNextProbe()}else{q.sendErrorReport(4,p.getProbeId())}}}};a.prototype.setScriptOnLoadHandler=function(p,q){if("undefined"===typeof p.addEventListener&&"undefined"!==typeof p.readyState){p.onreadystatechange=(function(r){return function(){if(!r&&("loaded"===this["readyState"]||"complete"===this["readyState"])){r=true;q()}}}(false))}else{p.onload=q}};a.prototype.sendReport=function(q){var p=this.document.createElement("script");p.type="text/javascript";p.async=true;p.src=q;this.add_to_container(p)};a.prototype.sendErrorReport=function(p,r){if(this.currentProvider){var q=[this.sessionSettings.getReportDomain(),"f1",this.requestSignature,this.currentProvider.getZoneId(),this.currentProvider.getCustomerId(),this.currentProvider.getProviderId(),r,p,0,this.currentProvider.getCacheNodeId(),this.getImpactValue()];var s="//";if("file:"===this.window.location["protocol"]){s="http://"}this.sendReport(s+q.join("/"));this.finishProvider()}};a.prototype.getImpactValue=function(){var r,q,p=[];if(!this.window.JSON||!this.window.JSON["stringify"]){return"1"}for(r in this.window){q=null;if(undefined!==this.window.hasOwnProperty){if(this.window.hasOwnProperty(r)){q=this.get_customer_impact_value(r)}}else{if(undefined!==this.window[r]){q=this.get_customer_impact_value(r)}}if(q){p.push(q)}}if(1>p.length){return"0"}return p.join("@")};a.prototype.get_customer_impact_value=function(s){var r=/radar_(tags|impact)_(\w{3,})/i,q,p;if(("radar_tags_"===s.slice(0,11))||("radar_impact_"===s.slice(0,13))){q=r.exec(s);if(q&&3===q.length){p=JSON.stringify(this.window[s]);if(64>=p.length){return q[2]+":"+this.y64_encode(p)}}}return null};a.prototype.getStartRenderValue=function(){if(this.window.performance&&this.window.performance["timing"]&&this.window.performance["timing"]["msFirstPaint"]){return Math.round(this.window.performance["timing"]["msFirstPaint"])}if(this.window.chrome&&this.window.chrome["loadTimes"]){var p=this.window.chrome["loadTimes"]();return Math.round(1000*p.firstPaintTime)}return 0};a.prototype.sendPltReport=function(){function u(x){if(undefined===x){return 0}return x}function q(x){if(x.connectEnd<x.connectStart){return false}if(x.domainLookupEnd<x.domainLookupStart){return false}if(x.domComplete<x.domLoading){return false}if(x.fetchStart<x.navigationStart){return false}if(x.loadEventEnd<x.loadEventStart){return false}if(x.loadEventEnd<x.navigationStart){return false}if(x.responseEnd<x.responseStart){return false}if(x.responseStart<x.requestStart){return false}return true}var w,p,t,s,r;w=this.window.performance||{};p=w.navigation||{};t=w.timing;if(t){s=[this.sessionSettings.getReportDomain(),"n1",0];for(r=0;r<c.length;r+=1){s.push(u(t[c[r]]))}s.push(this.requestSignature);s.push(this.getImpactValue());s.push(this.getStartRenderValue());if(q(t)){var v="//";if("file:"===this.window.location["protocol"]){v="http://"}this.sendReport(v+s.join("/"))}}this.startProviderMeasurements()};a.prototype.y64_encode=(function(){var p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._-";function q(s){s=s.replace(/\r\n/g,"\n");var r="",u,t;for(u=0;u<s.length;u+=1){t=s.charCodeAt(u);if(t<128){r+=String.fromCharCode(t)}else{if((t>127)&&(t<2048)){r+=String.fromCharCode((t>>6)|192);r+=String.fromCharCode((t&63)|128)}else{r+=String.fromCharCode((t>>12)|224);r+=String.fromCharCode(((t>>6)&63)|128);r+=String.fromCharCode((t&63)|128)}}}return r}return function(t){var r="",A,y,w,z,x,v,u,s=0;t=q(t);while(s<t.length){A=t.charCodeAt(s);s+=1;y=t.charCodeAt(s);s+=1;w=t.charCodeAt(s);s+=1;z=A>>2;x=((A&3)<<4)|(y>>4);v=((y&15)<<2)|(w>>6);u=w&63;if(isNaN(y)){v=u=64}else{if(isNaN(w)){u=64}}r=r+p.charAt(z)+p.charAt(x)+p.charAt(v)+p.charAt(u)}return r}}());a.prototype.makeStartNextProbeCallback=function(){var p=this;return function(){if(p.currentProvider){if(0<p.probes.length){var q=p.currentProvider.getCacheNodeIdProbe();p.setCurrentProbe();if(h.COLD===p.probes[0].getProbeType()){p.setCurrentProbe(p.probes.shift()).measure(p)}else{if(q&&b.UNSTARTED===q.getStatus()){q.measure(p)}else{p.setCurrentProbe(p.probes.shift()).measure(p)}}}else{p.finishProvider()}}}};a.prototype.startNextProbe=function(){setTimeout(this.makeStartNextProbeCallback(),100)};a.prototype.startNextProvider=function(){if(!this.currentProvider&&0<this.allProviders.length){var p=this.allProviders.shift();this.setCurrentProvider(p);this.probes=p.copyOfProbes();this.startNextProbe()}else{if(1>this.allProviders.length){this.initializeSession()}}};a.prototype.startProviderMeasurements=function(){if(0<this.publicProviders.length||0<this.privateProviders.length){this.allProviders=this.allProviders.concat(this.selectProviders(this.publicProviders,this.maxPublic,"0","0"));this.allProviders=this.allProviders.concat(this.selectProviders(this.privateProviders,this.maxPrivate,this.sessionSettings.getZoneId(),this.sessionSettings.getCustomerId()));this.startNextProvider()}else{this.requestProviders()}};a.prototype.makeInitCallback=function(){var p=this;return function(q){if(q&&q.a){p.requestSignature=q.a;p.resolverCountry=q.e;if(p.sessionSettings.isSendPlt()){p.sendPltReport()}else{p.startProviderMeasurements()}}}};a.prototype.startInit=function(){var q=this.makeInitUrl();if(q){this.window.cdx["f"]=this.makeInitCallback();var p=this.document.createElement("script");p.type="text/javascript";p.async=true;p.src=q;this.add_to_container(p)}};a.prototype.makeInitUrl=function(){var q=[],s=[],r,p=null;if(this.window.location&&this.window.location["protocol"]){r=(this.window.location["protocol"]==="https:")?"s":"i";q.push("i1");q.push(this.sampler.id);q.push(this.sampler.version.major);q.push(this.sampler.version.minor);q.push(this.sessionSettings.getZoneId());q.push(this.sessionSettings.getCustomerId());q.push(this.transactionId.toString(10));q.push(r);q=q.join("-");s.push(q+"."+this.sessionSettings.getInitDomain());s.push("i1");s.push(Math.floor((new Date()).getTime()/1000));s.push(this.transactionId.toString(10));s.push("jsonp");var t="//";if("file:"===this.window.location["protocol"]){t="http://"}s=t+s.join("/");p=s+"?seed="+q}return p};a.prototype.processAjaxCacheNodeIdMessage=function(q){if(this.currentProvider){if(q.p&&q.p["z"]===this.currentProvider.getZoneId()&&q.p["c"]===this.currentProvider.getCustomerId()&&q.p["i"]===this.currentProvider.getProviderId()){var p=this.currentProvider.getCacheNodeIdProbe();if(p&&!p.isCancelled()){p.clearTimeout();if("l"===q.s){p.setStatus(b.LOADED)}else{if("e"===q.s){this.currentProvider.setCacheNodeId("2");p.setStatus(b.ERROR);this.onGotCacheNodeId()}else{if("s"===q.s){this.currentProvider.setCacheNodeId(q.node_id);p.setStatus(b.FINISHED);this.onGotCacheNodeId()}}}}}}};a.prototype.processDynamicTestObjectMessage=function(r){if(this.currentProvider&&this.currentProbe&&r.request_signature==this.transactionId&&r.p&&r.p["z"]===this.currentProvider.getZoneId()&&r.p["c"]===this.currentProvider.getCustomerId()&&r.p["i"]===this.currentProvider.getProviderId()){this.currentProbe.clearTimeout();if("l"===r.s){this.currentProbe.setStatus(g.LOADED);return}if("s"!==r.s){return}if(this.currentProbe.isCancelled()){return}var p=r.m["responseEnd"]-r.m["domainLookupStart"];if(0<p){var q=!!(h.COLD===this.currentProbe.getProbeType()&&this.currentProvider.getCacheNodeIdProbe());if(p<this.currentProbe.getTimeout()){if(q){this.currentProvider.setColdMeasurement(new m(this.currentProbe.getProbeId(),0,p,[r.m["ciphertext"]]));this.startNextProbe()}else{this.sendSuccessReport(this.currentProbe.getProbeId(),p,[r.m["ciphertext"]])}}else{if(q){this.currentProvider.setColdMeasurement(new m(this.currentProbe.getProbeId(),1,0));this.startNextProbe()}else{this.sendErrorReport(1,this.currentProbe.getProbeId())}}}else{this.finishProvider()}}};a.prototype.handleMessage=function(q){if(this.currentProvider){var p;try{p=JSON.parse(q.data)}catch(r){}if(p){if("dsa"===p.source){this.processDynamicTestObjectMessage(p)}else{if("uni"===p.source){this.processAjaxCacheNodeIdMessage(p)}}}}};a.prototype.makePostMessageHandler=function(){var p=this;return function(q){p.handleMessage(q)}};a.prototype.get_secure_random_uint_32=function(){var q=this.window.crypto||this.window.msCrypto;if(q&&q.getRandomValues){var p=new Uint32Array(1);q.getRandomValues(p);return p[0]}return 0};a.prototype.makeRandomString=function(r,s){var p="";s=s||"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";var q=r;while(q--){p+=s.charAt(Math.floor(Math.random()*s.length))}return p};a.prototype.windowHasPostMessageFun=function(){return"function"===typeof this.window.postMessage};a.prototype.detectNavigationTimingSupport=function(){if("undefined"===typeof this.window.performance||"undefined"===typeof this.window.performance["timing"]){return false}if(/msie/i.test(this.window.navigator["userAgent"])){if("undefined"!==typeof this.document.documentMode){if(9>this.document.documentMode){return false}}else{if("BackCompat"===this.document.compatMode){return false}}}return true};a.prototype.detectResourceTimingSupport=function(){function p(q){var r;r=/msie (\d+)/i.exec(q.navigator.userAgent);if(r){return parseInt(r[1],10)<=10}return false}if(this.window.performance&&"function"===typeof this.window.performance["getEntriesByType"]&&!p(this.window)){return true}return false};a.prototype.makeProvidersRequestUrl=function(){var s=[this.sessionSettings.getProvidersDomain(),this.sessionSettings.getZoneId(),this.sessionSettings.getCustomerId(),"radar",this.sessionSettings.getBuildTimestamp(),this.makeRandomString(20),"providers.json"];var r="//";if("file:"===this.window.location["protocol"]){r="http://"}var p=r+s.join("/")+"?callback=cedexis.gotProviders&p="+(this.windowHasPostMessageFun()?"1":"0")+"&n="+(this.detectNavigationTimingSupport()?"1":"0")+"&r="+(this.detectResourceTimingSupport()?"1":"0");if(-1<this.sessionSettings.__providerCount){p+="&providerCount="+this.sessionSettings.__providerCount}var q=/radar-geo=([A-Z]{2})-(\d+)/.exec(this.window.location["search"]);if(q&&q[1]&&q[2]){p+="&country="+q[1];p+="&asn="+q[2]}return p};a.prototype.processProvidersJson=function(r){function u(y){if(0===y){return""}return String.fromCharCode(97+y)}var s,w,v,p,x;for(s=0;s<r.providers.length;s+=1){w=r.providers[s];v=new d({cacheBusting:w.a,zoneId:w.p["z"],customerId:w.p["c"],providerId:w.p["i"]});if(w.p["p"]){p=w.p["p"]["d"];if(p){v.setCacheNodeIdProbe(new e({url:p.u,method:k.byId[p.t]}))}p=w.p["p"]["a"]||w.p["p"]["b"];if(p){if(p.a){x=true;v.addProbe(new n({url:p.a["u"],probeType:h.COLD,objectType:o.byId[p.a["t"]]}))}if(p.b){x=true;v.addProbe(new n({url:p.b["u"],probeType:h.RTT,objectType:o.byId[p.b["t"]]}))}if(p.c){x=true;var t=w.b||1;for(var q=0;q<t;q++){v.addProbe(new n({url:p.c["u"],probeType:h.THROUGHPUT,objectType:o.byId[p.c["t"]],report:((t-1)===q),probeIdSuffix:u(q)}))}}}}if(x){this.allProviders.push(v)}}};a.prototype.requestProviders=function(){this.window.cedexis["gotProviders"]=(function(q){return function(r){q.processProvidersJson(r);q.startNextProvider()}}(this));var p=this.document.createElement("script");p.type="text/javascript";p.async=true;p.src=this.makeProvidersRequestUrl();this.add_to_container(p)};a.prototype.selectProviders=function(t,z,r,D){var w=[];var C={"http:":true,"https:":true,"":true};if("https:"===this.window.location["protocol"]){C={"https:":true,"":true}}var u=t.length;var y;var B;var x;var p;var v;while(u--){y=t[u];x=y.cold||y.rtt||y.xl;v=y.weight;if(y.iso_weight_list){if(this.arrayContains(y.iso_weight_list,this.resolverCountry)){v=y.iso_weight}}if(v){p=x.url.split("//");if(C[p[0]]){B=new d({zoneId:r,customerId:D,providerId:y.provider_id,cacheBusting:!!y.cache_busting,effectiveWeight:v});if(y.cold&&o.byDbName[y.cold["type"]]){B.addProbe(new n({url:y.cold["url"],probeType:h.COLD,objectType:o.byDbName[y.cold["type"]]}))}if(y.rtt&&o.byDbName[y.rtt["type"]]){B.addProbe(new n({url:y.rtt["url"],probeType:h.RTT,objectType:o.byDbName[y.rtt["type"]]}))}if(y.xl&&o.byDbName[y.xl["type"]]){B.addProbe(new n({url:y.xl["url"],probeType:h.THROUGHPUT,objectType:o.byDbName[y.xl["type"]]}))}if(y.uni&&k.byDbName[y.uni["type"]]){B.setCacheNodeIdProbe(new e({url:y.uni["url"],method:k.byDbName[y.uni["type"]]}))}w.push(B)}}}var E=[];var s=z||w.length;var q;var A;while(0<w.length&&s--){q=0;u=w.length;while(u--){q+=w[u].getEffectiveWeight()}A=Math.floor(Math.random()*q);q=0;u=w.length;while(u--){q+=w[u].getEffectiveWeight();if(q>A){E=E.concat(w.splice(u,1));break}}}return E};a.prototype.setResourceTimingBufferSize=function(r){var q=this.window.performance;if(q){var p=q.setResourceTimingBufferSize||q.webkitSetResourceTimingBufferSize;if(p){p.call(q,r)}}};a.prototype.run=function(p){this.setResourceTimingBufferSize(500);this.transactionId=this.get_secure_random_uint_32()||Math.floor(1000000000*Math.random());this.sessionSettings=p;this.startInit()};a.prototype.addProvider=function(p,r){var q=this.privateProviders;if("0"===p){q=this.publicProviders}q.push(r)};a.prototype.setMaxProviders=function(q,p){this.maxPublic=q;this.maxPrivate=p};a.prototype.isProblemUserAgent=function(){var q=[/opera mini/i,/skyfire/i,/teashark/i,/uzard/i,/puffin/i,/yabrowser/i];var p=q.length;while(p--){if(q[p].test(this.window.navigator["userAgent"])){return true}}return false};a.prototype.isMonitoringAgent=function(){var r={keynote:/keynote/i,gomez:/gomez/i,catchpoint:/catchpoint/i,pingdom:/pingdom/i,ip_label:/ip-label/,witbe:/witbe-/i};var s=this.window.cedexis["radar"]["allowed_monitoring_agents"]||[];var p=function(v){var t,u;for(t=0;t<s.length;t+=1){u=s[t].toLowerCase();if(u===v){return true}}return false};var q;for(q in r){if(r.hasOwnProperty(q)){if(r[q].test(this.window.navigator["userAgent"])){if(!p(q)){return true}}}}return false};var j;if(f.cedexis["instance"]){j=f.cedexis["instance"]}else{j=f.cedexis["instance"]=new a(f,i);if(f.addEventListener){f.addEventListener("message",j.makePostMessageHandler(),false)}j.setMaxProviders(null,null)}if(!j.transactionId&&!j.isProblemUserAgent()&&!j.isMonitoringAgent()){setTimeout(function(){var p=null;var q=/radar-provider-count=(\d+)/i.exec(f.location.search);if(q&&q[1]&&!isNaN(q[1])){p=parseInt(q[1],10)}j.clearContainer();j.run(new l({zoneId:1,customerId:13960,domains:{providers:"radartumblr.cedexis.com",init:"init.cedexis-radar.net",report:"tumblrreports.cedexis.com"},sendPlt:true,providerCount:p,buildTimestamp:1427408588}))},0)}}(window,document));