Drupal.behaviors.tekscan_sensors = function(){
	add_sensor_hover();
	add_sensor_table_hover();
	sensor_catalog_markup();
};

function add_sensor_hover(){
	var sensorLink = ".tekscan-sensor-link";
	var model = "";
	$(sensorLink).hover(
		function(){
			model = $(this).html();
			display_sensor_img(model);
		},
		function(){
			hide_sensor_img(model);
		}
	);
}

function display_sensor_img(model){
	
	var thumbId = "#sensor-thumb-" + model;
	
	var top = $(window).scrollTop();
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	
	//alert("top = " + top);
	//alert("height = " + windowHeight);
	$(thumbId).css("top", top + (windowHeight / 2) - 200);
	$(thumbId).css("left", (windowWidth / 2) - 300);
	$(thumbId).css("display", "block");
}

function hide_sensor_img(model){
	var thumbId = "#sensor-thumb-" + model;
	$(thumbId).css("display", "none");
}
	
function add_sensor_table_hover()
{
		//if( !pageMatch( "pressure-sensors" ))
			//return;

		$("#sensor-catalog-table table tbody tr").mouseover(function(){
			
			var zebra_class = $(this).hasClass("even-sensor") ? "even-sensor" : "odd-sensor";
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

function sensor_catalog_markup(){
	//$("#sensor-catalog-table .sort-link-active").attr("href", "#");
	var table = $("#sensor-catalog-table");
	if(table.length != 0){
		var order = getQStringVar("order");
		
		var arrow = order == "desc" ? "&uArr;" : "&dArr;";
		$("#sensor-catalog-table .sort-link-active").append("&nbsp;" + arrow);
	}
}

function getQStringVar( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}
