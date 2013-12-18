/* events and functions for the sensor search form and results */

/* trims leading/trailing whitespace from a string.  Usage Stringname.trim() */
String.prototype.trim = function() { return this.replace(/^\s+|\s+/g,""); }
String.prototype.tokenize = function( delim ){
	var i, j, k, tokens, current;
	
	tokens = new Array();
	current = new Array();

	for( i = 0, j = 0, k = 0; i < this.length; i++ ){
		if( this[i] == delim ){
			tokens[j++] = current;
			current = new Array();
			k = 0;
		}else{
			current[k++] = this[i];
		}
	}

	if( k != 0 )
		tokens[j] = current;	

	return tokens;
}

/* Get the basename of a filename.  /rootdir/dir/subdir/file.ext  ==> file.ext */
function baseName( path )
{
	return path.replace( /^.*[\/\\]/g, "" );
}

/* Strip the query string off a url 
 * http://www.example.com?var1=stuff&var2=otherstuff   => http://www.example.com
 */
function strip_qstring( fname )
{
	return fname.replace( /\?.*/g, "");
}

function get_qstring( url )
{
	return url.replace( /[^?]*/g, "");
}

function getUrlVar( key )
{
	var qstring, val, i, j;

	qstring = get_qstring(location.href);
	tokens = qstring.tokenize('&');

	for( i = 0; i < tokens.length; i++){
		continue;
	}

	return;
}

/* Determine if the current page has the name in the parameter name;
 * domains not checked; query strings not checked.
 */
function pageMatch( name )
{
	var url = location.href;

	var fname = strip_qstring(baseName(url));
	return fname == name;
	
}

function psi2kpa( psi ){ return psi * 6.895; }
	
function kpa2psi( kpa ){ return kpa / 6.895; }

function in2mm( inches ){ return inches * 25.4; }
	
function mm2in( mm ){ return mm / 25.4; }
	
function sqcm2sqin( sqcm ){ return sqcm * 6.4516; }
	
function sqin2sqcm( sqin ){ return sqin / 6.4516; }
	
function convert_units( selector, isMetric, isDensity, isPressure )
{
	var val, convert,
		precision = 1;

	$( selector ).each(function(){
		val = $(this).attr("value");
		if( !isNaN(val) && val.trim() != "" ){
			
			if( isDensity )
				convert = isMetric ? sqin2sqcm(val) : sqcm2sqin(val);
			else if( isPressure )
				convert = isMetric ? psi2kpa(val) : kpa2psi(val);
			else
				convert = isMetric ? in2mm(val) : mm2in(val);

			convert = convert.toFixed( precision );

			$(this).attr("value", convert);
		}	
	});
}

function selectModel( selected )
{
	var selectedClass = "selected-model",
		index, id;

	if( typeof selectModel.stored == 'undefined' )
		selectModel.stored = new Array();

	index = selectModel.stored.length;
	id = selectedClass + "-" + index;
	
	if( selected.hasClass(selectedClass)){
		removeIndex( selected, selectModel.stored );
		selected.attr("id", "" );
		selected.removeClass(selectedClass);	
	}else{
		selected.addClass(selectedClass);
		selected.attr("id", id );
		selectModel.stored[index] = selected
	}

	updateExportControls();
}

function removeIndex( ref, arr )
{
	var i, j;

	for( i = 0; i < arr.length; i++ ){
		if(arr[i].attr("id") == ref.attr("id")){
			for( j = i+1; j < arr.length; j++ ){
				arr[j - 1] = arr[j];
			}
			arr.pop();
			return true;
		}
	}

	return false;		/* not found */
}

function addExportControls()
{
	var controlsClass = ".export-controls",
		linkClass = "selected-export",
		linkTxt = "Export Selected Results",
		radioClass = ".unit-selector",
		errorMsg = "You haven't selected any sensor models yet.  To select a model, click on its row in the results table."
				 + "  To unselect a model, click it again.";

	$(controlsClass).append("<a href='#' class='" + linkClass + "'>" + linkTxt + "</a>");

	$("a." + linkClass).click(function(){
		if( $(this).attr("href") == "#" ){
			alert( errorMsg);
			return false;
		}
	});

	$(radioClass).click(function(){ updateExportControls(); });

}

function getSelectedModels( stored )
{
	var i, model,
		sensorClass = "sensor_link",
		selectedModels = new Array();

	for( i = 0; i < stored.length; i++ ){
		model = stored[i].find("td").find("a." + sensorClass).html();
		selectedModels[i] = model;
	}

	return selectedModels;

}

function getExportDest( selectedModels )
{
	var i, lengthUnit, pressureUnit,
		metricLengthId = "#metric_selector",
		impPressureId = "#psi_selector",
		href = "sensor-results?";

	if( selectedModels.length == 0 )
		return "#";

	for( i = 0; i < selectedModels.length; i++ ){
		if( i > 0 )
			href += "&";
		href += "model[]=" + selectedModels[i]
	}

	lengthUnit = $(metricLengthId).attr("checked") ? "metric" : "imp";
	pressureUnit = $(impPressureId).attr("checked") ? "psi" : "kpa";

	href += "&length_unit=" + lengthUnit;
	href += "&pressure_unit=" + pressureUnit;
	href += "&search=Search";

	return href;
}

function updateExportControls()
{
	var controlsClass = ".export-controls",
		linkClass = "selected-export",
		linkTxt = "Export Selected Results",
		href, link;	


	selectedModels = getSelectedModels( selectModel.stored );

	href = getExportDest( selectedModels );
	link = $( controlsClass + " " + "." + linkClass );

	if( link.length == 0 )
		$(controlsClass).append("<a href='" + href + "' class='" + linkClass + "'>" + linkTxt + "</a>");
	else
		link.attr("href", href );

}


	/* onloads */
Drupal.behaviors.catalog_events = function(){

		if( !pageMatch("pressure-sensors") && !pageMatch("sensor-search") && !pageMatch("sensor-results"))
				return;

		add_listeners();
		addExportControls();
		add_box();
		var bgImg = new Image();
		bgImg.src = "/sites/default/files/sensordb-images/windowBG3.gif";
		//add_newspaper();
		//update_search_form();
	};
		
	/* events */
	function add_listeners(){
		var pressure = ".pressure-val",
		length = ".length-val",
		density = ".density-val";		


		/* radio button for kpa */
		$("#kpa_selector").click(function(){
			convert_units( pressure, true, false, true );
		});
		
		/* .. psi */
		$("#psi_selector").click(function(){
			convert_units( pressure, false, false, true );
		});	
		
		/* .. metric lengths */
		$("#metric_selector").click(function(){
			$(".length_unit_label").html("mm");
			$(".area_unit_label").html("cm&sup2;");

			convert_units( length, true, false, false );
			convert_units( density, true, true, false );
		});
	
		/* .. imperial */
		$("#imp_selector").click(function(){
			$(".length_unit_label").html("in");
			$(".area_unit_label").html("in&sup2;");

			convert_units( length, false, false, false );
			convert_units( density, false, true, false );
		});
		
		/* change the cursor to the '?' when hovering over form labels */
		$(".form_label").mouseover(function(){
			$(this).css("cursor", "help");
		}).mouseout(function(){
			$(this).css("cursor", "default");
		});
	
		$("#catalog_search_results tr.sensor_row").click(function(){
			selectModel($(this));
		});

		/* when form label clicked, pop up the appropriate help window,
		 * or if any help window is already open, close it.
		 */
		$(".form_label").click(function(){
			
			var category = $(this).html();
			var offset = $(this).offset();
			var top = offset.top;
			var left = offset.left;
		
			category = category.toLowerCase();
			category = category.replace(/:|( )?\([a-z]+\)/g, "");
			//category = category.replace(/\s+/, "" );
			category = category.replace(/[ ]+/g, "_");
			
			//category = category.replace(/:|(\(mw\))|(\(mh\))/, "");
			//category = category.replace(/[()]/g, "");
			category = category.trim();
			//category = category.replace(/ /g, "_");
			//alert(category);
			var helpId =  "#" + category + "_help_txt";
			var display = $(helpId).css("display");
	
			$(".search_help").each(function(){
				otherId = "#" + $(this).attr("id");
				if( otherId != helpId ){
					$(this).css("display", "none");	
				}
			});
			
			if( display == "none" ){
				$(helpId).css("top", top - 245);
				$(helpId).css("left", left - 10 );
				$(helpId).css("display", "block");
			}else{
				$(helpId).css("display", "none");
			}
			   
		});
	
		$(".close_help").click(function(){
			$(this).parent().css("display", "none");
		});
		
		$(".sensor_link").mouseover(function(){
		  
			var sTop = $(window).scrollTop();
			var offset = $(this).offset();
			var link_top = offset.top;
			var img_top = link_top - 90;
			var model = $(this).html();
			var imgId = "#" + "sensor_thumb_" + model;
			var img_left = $(window).width() - $(imgId).width() - 135;
			
			//var img_top = sTop + $(window).height() / 2 - $(imgId).height();
		
			$(imgId).css("top", img_top );
			$(imgId).css("left", img_left);	
			$(imgId).css("display", "block");
			
		}).mouseout(function(){
			var model = $(this).html();
			var imgId = "#" + "sensor_thumb_" + model;
			$(imgId).css("display", "none");
		});
		/*	
		(".sensor_row").mouseover(function(){
			var link_top = (this).offset.top;
			var img_top = link_top - 220;
			var model = (this).find("a").first().html();
			var imgId = "#" + "sensor_thumb_" + model;
			(imgId).css("top", img_top );
			(imgId).css("display", "block");
		}).mouseout(function(){
			var model = (this).find("a").first().html();
			var imgId = "#" + "sensor_thumb_" + model;
			(imgId).css("display", "none");
		});*/
		
		
		$("#reset_button").click(function(){
			
			var url = location.href.replace(/\?.+/g, "");
			window.location = url;
			
			$("#sensor_search_form input[type=text]").each(function(){
				
				$(this).val("");
				
			});
	
			$("#sensor_search_form select option").each(function(){
				$(this).attr("selected", "");
			});
	
			$("input[type=radio]").each(function(){
				var value = $(this).attr("value");
				
				if( value == "metric" || value == "gt" 
							|| value == "full" || value == "kpa ")
					$(this).attr("checked", "checked");
				else
					$(this).attr("checked", "");
			});
	
			$("input[type=radio]").each(function(){
				var value = $(this).attr("value");
	
				if( value == "lt" )
					$(this).attr("checked", "checked");
			});
	
			$("#kpa_selector").attr("disabled", "");
			$("#psi_selector").attr("disabled", "");
	
			$(".length_unit_label").html("mm");
			(".area_unit_label").html("cm&sup2;");
			//("input[name=width_operator]").each(function(){
			//	if( (this).attr("value") == "lt" )
			//		(this).attr("checked", "");
			//});
	
			
			//return false;
		});
		
		add_table_hover();
	}

	function add_table_hover()
	{
		if( !pageMatch( "pressure-sensors" ))
			return;

		$(".data-row").mouseover(function(){
			var zebra_class = $(this).hasClass("even-row") ? "even-row" : "odd-row";
			hover_rows = new Array();
			var hover = $(this);
			var i = 0;
			while( hover.hasClass(zebra_class) ){
				hover_rows[i++] = hover;
				hover = hover.next();
			}
			
			hover = $(this).prev();
			while( hover.hasClass(zebra_class)){
				hover_rows[i++] = hover;
				hover = hover.prev();
			}
		
			for( var i = 0; i < hover_rows.length; i++ )
				hover_rows[i].addClass("hover-row");
		}).mouseout(function(){
			for( var i = 0; i < hover_rows.length; i++ )
				hover_rows[i].removeClass("hover-row");
		});
	}
	
	function add_box()
	{
		//$(".even_row").addClass("box_even_row box_row");
		//$(".odd_row").addClass("box_odd_row box_row");
		//$(".header_row").addClass("box_header_row");
		var hover_rows;
		$(".box_row").mouseover(function(){
			var zebra_class = $(this).hasClass("box_even_row") ? "box_even_row" : "box_odd_row";
			hover_rows = new Array();
			hover_rows[0] = $(this);
			if( $(this).next().hasClass(zebra_class) )
				hover_rows[1] = $(this).next();
	
			if( $(this).prev().hasClass(zebra_class) )
				hover_rows[1] = $(this).prev();
	
			for( var i = 0; i < hover_rows.length; i++ )
				hover_rows[i].addClass("box_hover_row");
		}).mouseout(function(){
			for( var i = 0; i < hover_rows.length; i++ )
				hover_rows[i].removeClass("box_hover_row");
		});
	}
