// ==UserScript==
// @name          Wikipedia headings back to sans-serif.
// @namespace     http://userstyles.org
// @description	  Changes Wikipedia headings back to sans-serif.
// @author        eduardog3000
// @homepage      http://userstyles.org/styles/99928
// @include       http://wikipedia.org/*
// @include       https://wikipedia.org/*
// @include       http://*.wikipedia.org/*
// @include       https://*.wikipedia.org/*
// @run-at        document-start
// ==/UserScript==
(function() {
var css = "/* Overriding the typography refresh - see https://www.mediawiki.org/wiki/Typography_refresh To use it, copy the following code to [[Special:Mypage/vector.css]]. Works ok for me with Firefox 27.0.1 and Ubuntu 12.04 LTS, but has not been tested in different environments. There may also still be glitches of one sort or another. Let me know if you have any suggestions for improving it. */ /* Fonts and colours */ * { font-family: sans-serif; } h2#mw-previewheader, div#mw-usercsspreview strong { font-family: sans-serif !important; color: #c00 !important; } div#content #toc h2, div#content .toc h2, h2.diff-currentversion-title { font-family: sans-serif !important; } div.mw-geshi div, div.mw-geshi div span, div.mw-geshi div pre, span.mw-geshi, span.mw-geshi span, pre.source-css, pre.source-css span, pre.source-javascript, pre.source-javascript span, pre.source-lua, pre.source-lua span { font-family: monospace !important; -moz-tab-size: 4; } div#content { font-size: 93%; } h1#firstHeading { font-size: 1.6em !important; } div#content.mw-body { margin-left: 11.8em; color: #000; } textarea#wpTextbox1, pre { font-family: monospace; } /* Font size */ code a { font-family: monospace; font-size: 130%; } pre { font-size: 130%; } div#content h3 { font-size: 132%; } div#content h4 { font-sizeː 116%; } div#content h5 { font-size: 100%; } div#content h6 { font-size: 80%; } td.diff-deletedline, td.diff-addedline, td.diff-context { font-size: 85%; }";
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node); 
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();
