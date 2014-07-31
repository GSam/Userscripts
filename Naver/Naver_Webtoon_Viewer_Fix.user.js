// ==UserScript==
// @name        Naver Webtoon Viewer Fix 
// @namespace   Naver
// @description Prevents the absurd resizing of images and loads the 90% quality images
// @include     http://m.webtoons.com/viewer*
// @version     1.0
// @run-at      document-start
// @grant       GM_addStyle
// ==/UserScript==


var countdown = 6;

var loadScript = function(scriptName) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = scriptName.replace(/\.jpg\?type=q70/g, ".jpg?type=q90");
        script.async = false;
        head.appendChild(script);

};

document.addEventListener('beforescriptexecute', function(e) {
  console.log(e.target.innerHTML);
      if(!--countdown) {
        e.preventDefault();
        e.stopPropagation();       
        loadScript(e.target.innerHTML);
      }

}, true);

GM_addStyle("img._checkVisible { width:auto !important; height:auto !important;  display: block !important; margin-left: auto !important; margin-right: auto !important;}");