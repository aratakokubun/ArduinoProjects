var bDetect = new BrowserDetect();
var isIESeven = false && bDetect.browser == "Explorer" && (!(navigator.userAgent.indexOf("Trident/5")>-1)) && (bDetect.version == "7" && document.documentMode == "7");
	

Drupal.behaviors.thead_floats = function(){
	$(".filter-results-table").float_theads();
	$("#catalog_search_results #compact_catalog_table").float_theads();
};
	
$.fn.float_theads = function(){
		var table, oldThead, newThead, hClass, topNorm, widths, header;
	
		if( $(this).length == 0 ) return;	// no element with this selector 
		
		/* ie7 check, for fixes */
		// if(navigator.userAgent.indexOf("Trident/5")>-1)
		// if(navigator.userAgent.indexOf("Trident/4")>-1)
        // if(navigator.userAgent.indexOf("Trident/3")>-1)
		//var bDetect = new BrowserDetect();
   	    //var isIESeven = bDetect.browser == "Explorer" && (navigator.userAgent.indexOf("Trident/5")>-1) && (bDetect.version == "7" && document.documentMode == "7");
		
		table = $(this);
		table.addClass("floating-head-added");
		
		hClass = "floating-head";
		header = buildHeader( table, hClass );

		topNorm = header.offset().top;
		header.css("background-color", "white");
		header.css("position", "fixed");

  if( isIESeven )
	   ieSeven_positionHeader(header, topNorm)
  else
	   positionHeader(header, topNorm);

		$(window).scroll(function(){
  if( isIESeven )
	   ieSeven_positionHeader(header, topNorm)
  else
	   positionHeader(header, topNorm);
		});		
};

function buildHeader( table, hClass )
{
		var oldThead, header, newThead, clone, tbody, widths, trs, tr, colspan, index;

		oldThead = table.find("thead");
		header = $("<table class='floating-head'></table>");
		table.before(header);
		newThead = $("<thead></thead>");
		header.append(newThead);
		tbody = table.children("tbody");
		tr = tbody.children("tr:first");
		widths = new Array;
		tr.children("td").each(function(i){		widths[i] = $(this).width();	});
		
		
		$(oldThead).find("tr").each(function(){
			index = 0;
			clone = $(this).clone();
			clone.find("td").each(function(){
				colspan = $(this).attr("colspan");
				if( !colspan || colspan == undefined || colspan == 1 )
					$(this).css("width",widths[index++]);
				else{
					var w,i;
					w = 0;
					for( i = 0; i < colspan; i++ ){
						w += widths[index++];
					}
					$(this).css("width", w);
				}
			});
			var color = $(this).parent().parent().css("background-color");
			$(this).css("color", color);
			$(this).css("border-color", color );
			$(this).css("background-color", color );
			newThead.append(clone);
		});
		
		return header;
}

function positionHeader( header, topNorm )
{
        header.css("left", header.parent().offset().left);
		var scrollPos, hHeight, pixHiden;
		
		scrollPos = $(window).scrollTop();
		hHeight = header.innerHeight();
		if( scrollPos > topNorm )		// some of thead is hidden by scroll pos
				header.css("top", "0px");
		else
			header.css("top", topNorm - scrollPos + "px");

		//alert("topnorm = " + topNorm + " scroll = " + scrollPos );
}

function ieSeven_positionHeader(header, topNorm)
{
	var orig_left = $('.filter-results-table').offset().left;
    var par = header.parent();
	while (!par.is('body') && par.offset().left == orig_left) {
		par = par.parent();
	}
    header.css("left",orig_left - par.offset().left);
	var scrollPos, hHeight, pixHiden, bias;
    
    bias = 125;
    scrollPos = $(window).scrollTop();
    
    if( scrollPos > topNorm )   // some of thead is hidden by scroll pos
        header.css("top", scrollPos - bias + "px");
    else
      header.css("top", topNorm - bias + "px");
    
   // alert("topnorm = " + topNorm + " scroll = " + scrollPos );
}

/*function isIESeven()
{
   var bDetect = new BrowserDetect();
   return bDetect.browser == "Explorer" && bDetect.version == "7";
}
*/

