// js

Drupal.behaviors.system_events = function(){
	formButtonHandlers();
	softwareOptionProductHide();
	eventProductHide();
	
	// check to see if url targets a form to be open
	var formVar = getVar("formdisplay");
	if( formVar != null ){
  	if( formVar == "quote" )
  	   show_quote_form();
  	else if(formVar == "info")
  	   show_info_form();
  	 
  }
  
  // remove title attributes of fieldgroups on pages without tabs
  if( !pageHasTabs())
    removeFieldgroupTitles();
};

function softwareOptionProductHide()
{
  
  var displayLimit = 4;
  var sidebarContent = $(".node-type-software-option .sidebar-products-content");
  var hiddenClass = "additional-related-system";
  var systemsHidden = false;
  
  sidebarContent.find(".related-item").each(function(i){
    if( i >= displayLimit ){
      $(this).addClass(hiddenClass);
      systemsHidden = true;
    }
  });
  
  if( systemsHidden ){
    $("." + hiddenClass).css("display", "none");
    initSystemHider(sidebarContent, hiddenClass);
  }
}

function eventProductHide()
{
  var displayLimit = 4;
  var sidebarContent = $(".node-type-general-event .sidebar-products-content");
  var hiddenClass = "additional-related-system";
  var systemsHidden = false;
  
  sidebarContent.find(".related-item").each(function(i){
    if( i >= displayLimit ){
      $(this).addClass(hiddenClass);
      systemsHidden = true;
    }
  });
  
  if( systemsHidden ){
    $("." + hiddenClass).css("display", "none");
    initSystemHider(sidebarContent, hiddenClass);
  }
}

function initSystemHider( sidebarContent, hiddenClass )
{
  var linkClass = "hidden-system-show";
  var pClass = "hidden-system-text";
  var link = "<a href='#' class='" + linkClass + "'>Systems</a>";
  var p = "<p>See More " + link + "</p>";
  sidebarContent.append(p);
  
  $("." + linkClass).bind("click", systemHiderClick );

}

function systemHiderClick()
{
   var linkClass = "hidden-system-show";
   var hiddenClass = "additional-related-system";
   
    var p = $("." + linkClass).parent();
    var pText = p.html();
    var index = pText.indexOf("More");
    var hidden = index != -1;
    //alert(hidden);
    if(hidden){
      $("." + hiddenClass).css("display", "block");
      p.html(pText.replace("More", "Less"));
    }else{
      $("." + hiddenClass).css("display", "none");
     p.html(pText.replace("Less", "More"));
    }
    
    $("." + linkClass).bind("click", systemHiderClick );
  
}

/* add event handlers for the click of info / quote buttons on product pages
 *   -- this makes the repsective hidden contact form appear
 */
function formButtonHandlers()
{
  $(".info-button").click(function(){
    show_info_form();
    return false;
  });

  $(".contact-form-close").click(function(){
    $(".hidden-form-element").css("display", "none");
  });

  $(".hidden-bg").click(function(){
    $(".hidden-form-element").css("display", "none");
  });

  $(".quote-button").click(function(){
    show_quote_form();
    return false;
  });
}

function show_info_form()
{
  var contact = $(".hidden-contact-element");
  var contactForm = $("hidden-contact-form-content");
  contact.css("display", "block");
  var top = contactForm.offset().top;
  $(window).scrollTop(top);
}

function show_quote_form()
{
  var quote = $(".hidden-quote-element");
  var quoteForm = $(".hidden-quote-form");
  quote.css("display", "block");
  var top = quoteForm.offset().top;
  $(window).scrollTop(top);
  
}

function getVar(keyStr)
{
  var url = location.href;
  var urlAndQuery = url.split("?");
  
  if( urlAndQuery.length < 2 )
    return null;
    
  var query = urlAndQuery[1];
  var assignments = query.split("&");
  
  for( var i = 0; i < assignments.length; i++ ){
     
     keyAndVal = assignments[i].split("=");
     if( keyAndVal.length < 2 )
        continue;
        
     key = keyAndVal[0];
     
     val = keyAndVal[1];
     
     if( key.toLowerCase() == keyStr.toLowerCase() )
        return val;
  }
  
  return null;
}

function pageHasTabs()
{
  var tabHolder = $(".tabber");
  return tabHolder.length != 0;
}

function removeFieldgroupTitles()
{
  $(".fieldgroup").each(function(){
     var fg = $(this);
     fg.removeAttr("title");
  });
}
