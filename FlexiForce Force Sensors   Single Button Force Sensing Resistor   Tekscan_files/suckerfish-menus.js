
/* Emulates Suckerfish-style functionality with JQuery */

/* Adds animation effect for drop-down and fadeups */
$(document).ready(function() {

	$("#nav-menu>div>div>ul>li").each(function() {
		$(this).find('>a').each(function(){
			if ($(this).parents('li.expanded ul').length) {
			} else {
				$(this).css('width', ($(this).width()+5)+'px');
				//$(this).parent().css('width', ($(this).parent().width()+5)+'px');
				$(this).parent().find('ul.menu').css('width', ($(this).parent().find('ul.menu').width()*1.1)+'px');
			}
		});
	});
});
 

Drupal.behaviors.suckerfish = function(){
 
    $("#nav-menu li").hover(

        function(){

			 $("ul", this).css("display", "block");  $(this).addClass("sfHover");
		},

        function(){ $("ul", this).css("display", "none"); $(this).removeClass("sfHover"); }

    );

    if (document.all) {

        $("#nav-menu li").hoverClass("sfHover");

    }

    /* if you are on a page that is in the top level of the nav menu,
     * that page's menu link looks 'active' (highlighted, etc).
     */
    var url = location.href;
    $("#nav-menu > div > div > ul > li").each(function(){
        var href = $(this).find("a").attr("href");
        var end = url.substring(url.length - href.length, url.length);
        //alert("href = " + href + " .. end = " + end);
        if( href == end )
          $(this).addClass("sfActive");
       
        
    });

};

 

$.fn.hoverClass = function(c) {


        $(this).hover(

            function() { $(this).addClass(c);  },

            function() { $(this).removeClass(c); }

        );


};    
