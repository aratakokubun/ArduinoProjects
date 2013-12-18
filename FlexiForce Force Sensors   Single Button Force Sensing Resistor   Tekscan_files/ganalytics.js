// google anayltics stuff

Drupal.behaviors.g_analytics = function(){
  var url = window.location.href;
  //if( url == "http://www.tekscan.com/api-1" ){
    
  //allowedTags = new Array("a", "input");
  //trackEventByClass("quote-button", allowedTags, "quote-button");
  //trackEventByClass("info-button", allowedTags, "info-button");  
 $("input.info-button").click(function(){	
 	_gaq.push(['_trackEvent', "Clicked Buttons", "info-button", url, 0]);
 });
 
 $("a.info-button").click(function(){
 	_gaq.push(['_trackEvent', "Clicked Buttons", "info-button link", url, 0]);
 });
 
 $("input.quote-button").click(function(){
 	_gaq.push(['_trackEvent', "Clicked Buttons", "quote-button", url, 0]);
 });
 
 $("a.quote-button").click(function(){
 	_gaq.push(['_trackEvent', "Clicked Buttons", "quote-button link", url, 0]);
 });
 
};


function trackEventByClass( htmlClass, allowedTagsArray, eventName )
{
  var selector = "." + htmlClass;
  //var allowedTags = Array("a", "input");
  
  $(selector).click(function(){
      var tracked = $(this);
      var allowedTag = false;
      for(var i = 0; i < allowedTagsArray.length; i++ ){
          var tag = allowedTags[i];
          if( tracked.is(tag) ){
              allowedTag = true;
              break;
          }
      }
      
      if( !allowedTag ) return;
      
      var url = window.location.href;
      
      var urchinEvent = "/event/" +url + "/" + eventName;
      //alert(urchinEvent);
      
      /*if( typeof urchinTracker == 'function')
          alert("function");
      else
          alert("failed");
      */
      urchinTracker(eventName);
      urchinTracker(urchinEvent);
  });
}
