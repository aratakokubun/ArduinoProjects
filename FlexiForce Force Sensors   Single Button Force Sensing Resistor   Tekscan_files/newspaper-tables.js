	Drupal.behaviors.newspaper_tables = function(){
		$(".filter-results").newspaper();
	};

	$.fn.newspaper = function(){
		var caller, trs;

		caller = $(this);
		tbody = $(caller).find("table tbody");

		$(tbody).find("tr").each(function(){
			$(this).addClass("news_row");
			$(this).hover(
				function(){	$(this).addClass( "news_hover_row" );	},
				function(){ $(this).removeClass( "news_hover_row" );  }
			);	
		});
	

	};
