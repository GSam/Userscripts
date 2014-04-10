// ==UserScript==
// @name       Foolz All Image Expander
// @namespace  foolzimageexpander
// @version    0
// @description Image expander
// @match      *://archive.foolz.us/*
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
}, false);
