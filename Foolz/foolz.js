// ==UserScript==
// @name       Foolz All Image Expander
// @namespace  foolzimageexpander
// @version    0.1.1
// @description Image expander
// @match      *://archive.foolz.us/*
// @match      *://archive.moe/*
// @updateURL  https://raw.githubusercontent.com/GSam/Userscripts/master/Foolz/foolz.js
// @downloadURL https://raw.githubusercontent.com/GSam/Userscripts/master/Foolz/foolz.js
// @copyright  2013, GSam
// ==/UserScript==

window.addEventListener("DOMContentLoaded", function() {
    $('.letters').append(' [<a href="#" class="expandAll" style="text-decoration:underline;">Expand All Images</a>] ');

    $('.letters').on('click','.expandAll', function(e){
        $('.thread_image_link').each(function(){
       var $image = $(this);
        var $link = $image.attr("href");
        console.log($link);
        var $img_tag = $image.find('img');
            if ($img_tag.hasClass('thread_image')) {
                $('.thread_tools_bottom').html('<img src="' + $link + '"/>');
            } else {
                $image.html('<img src="' + $link + '"/>')
            }
        });  
    });
          
    $('.letters').append('[<a href=# >' + $('.post_wrapper').length + ' / ' +  $('.thread_image_link').length + '</a>]');
    $('.post_controls').each(function(e,i){
        if (i.children.length === 4) return;
        $(i).append('<a class="btnr parent" href="' +i.children[0].href.replace(/archive.foolz.us|archive.moe/g, "boards.4chan.org") + '">Original</a>');
    });
   
}, false);
