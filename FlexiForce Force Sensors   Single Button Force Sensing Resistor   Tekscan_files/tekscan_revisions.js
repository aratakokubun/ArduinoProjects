// js
Drupal.behaviors.tekscan_revisions = function(){
  
  tekscan_revisions_effects();
  hide_normal_revisions();
  add_trivial_hide();
}

function tekscan_revisions_effects()
{
  var activeClass = "active-meta-data";
  var inactiveClass = "inactive-meta-data";
  var controlClass = "meta-data-control";
  
  hideByClasses("revision-status-inactive", "tekscan-revision-meta");
  hideByClasses("revision-status-mothballed", "tekscan-revision-meta");
  
  $("a." + controlClass).click(function(){
    var html = $(this).html();
    var parentId = $(this).parent().parent().attr("id");
    var recordNumber = parentId.replace(/revision-row-/, "");
    
    var hidden = html.match(/show/gi) != null;   
   
    if(hidden){
      $(this).html("hide comments");
      $("#revision-meta-data-" + recordNumber).css("display", "");
    }else{
      $(this).html("show comments");
      $("#revision-meta-data-" + recordNumber).css("display", "none");
    }
    
  });
  
  
}

function add_trivial_hide()
{
  var revisions = $(".tekscan-revisions-list");
  if(revisions.length == 0 )
    return;
    
    
  $(".trivial-revision").css("display", "none");
  var control = "<a href='javascript:void(0);' id='revision-trivial-hide'>show trivial revisions</a>";
  var lastTh = revisions.find("table thead tr th[colspan*='']");
  var colspan = lastTh.attr("colspan") - 1;
  lastTh.attr("colspan", 1);
  revisions.find("table thead tr").append("<td colspan='" + colspan + "'>" + control + "</td>");
  $("a#revision-trivial-hide").click(function(){
     var text = $(this).html();
     var hidden = text.match(/show/gi) != null;
     
     if(hidden){
       $(this).html("hide trivial revisions");
       $(".trivial-revision").css("display", "");
       hideByClasses("trivial-revision", "tekscan-revision-meta");
     }else{
       $(this).html("show trivial revisions");
       $(".trivial-revision").css("display", "none");
     }
  });
}

// hide all elements that have classMain and also have hideClass
function hideByClasses(classMain, hideClass)
{
  $("." + classMain).each(function(){
      var element = $(this);
      if(element.hasClass(hideClass)){
        element.css("display", "none");
      }
    
  });
}

function is_tekscan_tab()
{
  var tabName = "tekscan_revisions";
  var pattern = "/" + tabName + "/"; 
  var url = window.location.href;
  
  if( !url.matches(pattern))
    return false;
    
  // check if in the admin section
  if( url.matches("/admin/"))
    return false;
    
  return true;
}
function hide_normal_revisions()
{
  $("#content ul.tabs li").each(function(){
    var li = $(this);
    var link = li.find("a");
    var href = link.attr("href");
    if( href.match(/\/revisions/gi))
      li.css("display", "none");
    
  })
}
