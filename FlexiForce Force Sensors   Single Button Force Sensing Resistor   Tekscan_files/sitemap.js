Drupal.behaviors.sitemap = function(){
  sitemapInit();
  
};

function addShowLinks(){
  var showLink = "<a class='sitemap-show' href='javascript:void(0);'>[+]</a>";
  var hideLink = "<a class='sitemap-show' href='javascript:void(0);'>[-]</a>";
  $(".site-map-box").each(function(){
    var div = $(this);
    var h2 = div.find("h2");
    if(title_is_main_nav(h2))
      div.prepend(hideLink);
    else
      div.prepend(showLink);
  });
  addLinkStyles();
}

function addShowEffect(){
  $(".sitemap-show").click(function(){
     var showLink = $(this);
     
     var div = $(this).parent();
     var list = $(div).find("div.content");
     var display = list.css("display");
     
     if( display == "none"){
       showLink.html("[-]");
       list.css("display", "block");
     }else{
       showLink.html("[+]");
       list.css("display", "none");
     }
     
     // jump to newly opened section
     var top = showLink.offset().top;
     $(window).scrollTop(top);
  });
}

function addLinkStyles()
{
  var links = $(".sitemap-show");
  //links.css("display", "inline");
  links.css("float", "left");
}

function sitemapInit(){
  $(".site-map-box div.content").each(function(){
      var contentDiv = $(this);
    if( !is_main_nav_content(contentDiv))  
       contentDiv.css("display", "none");
  });
  
  addShowLinks();
  addShowEffect();
}

function title_is_main_nav(h2_obj)
{
    var parentDiv = h2_obj.parent();
    var contentDiv = parentDiv.find("div.content");
    return is_main_nav_content(contentDiv);
}

function is_main_nav_content(content_obj)
{
  var ul = content_obj.find("ul.site-map-menu");
  
  var productsLink = ul.find("a[href='/products']");
  return productsLink.length != 0;
}


