Drupal.behaviors.safari_css = function(){
  
  var browserDetect = new BrowserDetect();
 
    
  if( browserDetect.browser == "Safari"){
    
    $(".floating-head").css("left", "28px");
    
  }

};

function is_walkway(){
    var url = window.location.href;
    return url == "http://www.tekscan.com/multi-step-foot-pressure-walkway";
}

function isEvents(){
   var url = window.location.href;
    return url == "http://www.tekscan.com/events";
}
