// JavaScript Document

function is_walkway(){
    var url = window.location.href;
    return url == "http://www.tekscan.net/multi-step-foot-pressure-walkway";
}

$(document).ready(function(){
  
  /* This is to fix that worthless browser called chrome */
  if(document.readyState != "complete"){
    
    setTimeout( arguments.callee, 100 );
  }

	videoSlideShow();						   
});

function videoSlideShow(selector){

/* This is to fix that worthless browser called chrome */
  if(document.readyState != "complete")
    return;
  
	var ss = new videoSs();
	
}

function videoSs()
{
	this.init();
	return this;
}

videoSs.prototype.init = function(){
	this.selectors = {};
	this.Templates = {};
	this.windowStart = 0;
	this.windowMax = 3;
	this.activeSlide = 0;
	this.lastSlide = 0;
	this.imgCache = [];

	this.getSelectors();
	this.getTemplates();
	this.getSlides();
	this.insertTemplates();
	this.setStyles();
	this.setEvents();
	this.updateWindow();	
	
};

videoSs.prototype.getSelectors = function(){
	
	this.selectors = {
		ssContainer:				".ss-wrapper",
		thumbContainer:				".ss-wrapper" + " .thumbs",
		thumbs:						".ss-wrapper" + " .thumbs ul li",
		caption:					".caption",
		url:						".url",
		stageBg:					".stage-bg",
		stageContainer:				".stage-wrapper",
		stageContainInner:			".stage-wrapper-inner",
		stage:						".stage-content",
		stageAll:					".stage-all",
		closeLink:					".stage-close",
		controls:					".controls",
		nextLink:					".window-next",
		prevLink:					".window-prev",
		slideDisplay:			".slide-display"
	};
	
};

videoSs.prototype.getTemplates = function(){

	var stageClass = selectToClass( this.selectors.stage );
	var allClass = selectToClass( this.selectors.stageAll);
	var bgClass = selectToClass( this.selectors.stageBg );
	var containClass = selectToClass( this.selectors.stageContainer );
	var closeClass = selectToClass( this.selectors.closeLink );
	var controlsClass = selectToClass( this.selectors.controls );
	var nextClass = selectToClass( this.selectors.nextLink );
	var prevClass = selectToClass( this.selectors.prevLink );
	var stageInner = selectToClass( this.selectors.stageContainInner);	

	this.templates = {
		stageBg:		"<div class='" + bgClass + " " + allClass + "'>&nbsp;</div>",
		stage:			"<div class='" + containClass + " " + allClass + "'>"
						+ "<p><a class='" + closeClass + "' href='javascript:void(0);'>Close[X]</a></p>"
						+ "<div class='" + stageInner + "'>"
						+ "<div class='" + stageClass + "'></div></div></div>",
								
		leftThumbControl:	"<a class='" + prevClass 
								+ "' href='javascript:void(0);'><img src='/sites/default/files/gray-arrow-left.gif'/></a>",
		rightThumbControl:	"<a class='" + nextClass 
								+ "' href='javascript:void(0);'><img src='/sites/default/files/gray-arrow-right.gif'></a>",
		leftStageControl:	"<a class='" + prevClass 
								+ "' href='javascript:void(0);'><img src='/sites/default/files/white-arrow-left.gif'></a>",
		rightStageControl:	"<a class='" + nextClass 
								+ "' href='javascript:void(0);'><img src='/sites/default/files/white-arrow-right.gif'></a>",

 
		clearFloat:		"<div class='clear'></div>"
	};
};

videoSs.prototype.getSlides = function(){
	//this.slides = {};
	var localSlides = new Array();
	var localSelect = this.selectors;
	var slideShow = this;
	$(localSelect.thumbs).each(function(i){
		$(this).attr("id", "thumb-" + i);
		var src = $(this).find("img").attr("src");
		var caption = $(this).find(localSelect.caption).html();
		var url = $(this).find(localSelect.url).html();
		var ws = $(this).hasClass("widescreen");
		localSlides[i] = new slide(src, caption, url, i, ws, slideShow );

		var overlay = "";
		if( localSlides[i].isVideo )
			overlay = "<img class='slideshow-type-icon' src='/sites/default/files/play-button.gif'/>";
		else
			overlay = "<img class='empty-overlay' src='/sites/default/files/blank-thumb.gif'/>";

		$(this).find("a").append(overlay);

	});
	this.slides = localSlides;
};

videoSs.prototype.insertSlides = function(){
	
	var i;


	for( i = 0; i < this.slides.length; i++ ){
		$(this.selectors.stage).append(this.slides[i].getDisplay());
		$(this.selectors.slideDisplay + "-" + i).css("display", "none");
    
    var width = this.slides[i].displayWidth;
    $(this.selectors.slideDisplay + "-" + i + " img").css("width", width);
	}
};

videoSs.prototype.setStyles = function(){
	$(this.selectors.stageAll).css("display", "none");
	$(this.selectors.caption).css("display", "none");
	$(this.selectors.url).css("display", "none");
}

videoSs.prototype.insertTemplates = function(){
	var ss = this.selectors.ssContainer;
	var thumbDiv = this.selectors.thumbContainer;
	
	if(this.isExpandable()){
		$(thumbDiv).prepend(this.templates.leftThumbControl);
		$(thumbDiv).append(this.templates.rightThumbControl);
		$(thumbDiv + " ul").css("float", "left");
		$(thumbDiv).append(this.templates.clearFloat);
	}else{
		$(thumbDiv).append(this.templates.clearFloat);

	}
	
	$(ss).append(this.templates.stageBg + this.templates.stage );
	$(this.selectors.stageContainInner).prepend(this.templates.leftStageControl);
	$(this.selectors.stageContainInner).append(this.templates.rightStageControl);
	$(this.selectors.stageContainInner).append(this.templates.clearFloat);
	
	this.insertSlides();
};

videoSs.prototype.setEvents = function(){
	var localSelect = this.selectors;
	var localSlides = this.slides;
	var localTemplates = this.templates;
	var slideshow = this;

	/* Clicking thumbnails */
	$(this.selectors.thumbs + " a").click(function(){
		slideshow.lastSlide = slideshow.activeSlide;
		slideshow.activeSlide = $(this).parent().attr("id").replace("thumb-", "");
		slideshow.openStage();
	});

	
	/* exiting slideshow display: clicking background or close link */
	$(this.selectors.stageBg).click(function(){
		$(localSelect.stageAll).css("display", "none");
	});
	
	$(this.selectors.closeLink).click(function(){
		$(localSelect.stageAll).css("display", "none");										   
	});

	/* thumbnail window controls (next or prev ) */
	$(this.selectors.nextLink).click(function(){
		slideshow.slideWindow( true );
		slideshow.updateStage();		
	});

	$(this.selectors.prevLink).click(function(){
		slideshow.slideWindow( false );
		slideshow.updateStage();
	});
	
}

videoSs.prototype.displaySlide = function(){
	var prefix = this.selectors.slideDisplay + "-";
	/*
	var width = this.slides[this.activeSlide].img.width;
	var height = this.slides[this.activeSlide].img.height;
  */
  
	$(prefix + this.lastSlide).css("display", "none");
	//$(prefix + this.activeSlide + " img").css("width", width);
	//$(prefix + this.activeSlide + " img").css("height", height);
	$(prefix + this.activeSlide).css("display", "block");	
};

videoSs.prototype.updateStage = function(){
	this.displaySlide();
	//var html = this.slides[this.activeSlide].getDisplay();
	//$(this.selectors.stage).html(html);
	
	var newWidth = this.slides[this.activeSlide].displayWidth;
	var hMargin = (600 - newWidth) / 2;
	var marginStr = "0px " + hMargin + "px";
	$(this.selectors.stage + " p").css("width", newWidth );
	$(this.selectors.stage).css("margin", marginStr);
	
	this.adjustStage();
};

videoSs.prototype.displayStage = function(){
	var scrollPos = $(window).scrollTop();
	this.displaySlide();	
	$(this.selectors.stageAll).css("display", "block");
	$(this.selectors.stageContainer).css("top", scrollPos);
	
};

videoSs.prototype.adjustStage = function(){	
	var stageImg = $(this.selectors.stage).find("img");
	if( stageImg.width() > 600 )
		stageImg.width(600);



	if( stageImg.height() > 600 )
		stageImg.height(600);
	//$(this.selectors.stageContainInner).css("width", newWidth + 140 );
};

videoSs.prototype.openStage = function(){
	this.updateStage();
	this.displayStage();
	this.adjustStage();
}

videoSs.prototype.slideWindow = function( isIncreasing ){

	var startMax = this.slides.length - this.windowMax;
	if( isIncreasing ){
		if(this.windowStart < startMax )
			this.windowStart++;
		
		if( this.activeSlide < this.slides.length - 1 ){
			this.lastSlide = this.activeSlide;
			this.activeSlide++;

		}
	}else{
		if(this.windowStart > 0)
			this.windowStart--;

		if( this.activeSlide > 0 ){
			this.lastSlide = this.activeSlide;
			this.activeSlide--;
		}
	}

	this.updateWindow();

};

videoSs.prototype.updateWindow = function(){
	var min = this.windowStart;
	var max = min + this.windowMax - 1;
	$(this.selectors.thumbs).each(function(i){
		if( i > max || i < min ){
			$(this).css("display", "none");
		}else{
			$(this).css("display", "inline");
		}
	});
};

videoSs.prototype.isExpandable = function(){ return (this.slides.length > this.windowMax); };

// go through all of the slides, and back to the beginning again.
// a fix for safari, chrome
videoSs.prototype.traverseSlides = function(){
  var i, totalSlides;
  
  totalSlides = this.slides.length;
  
  for( i = 0; i < totalSlides; i++ ){
    slideshow.slideWindow( true );
    slideshow.updateStage();
  }
  
  for( ; i >= 0; i-- ){
    slideshow.slideWindow( false );
    slideshow.updateStage();
  }
};

/* 	---------------------- slides ----------------------------- */

function slide( src, caption, url, index, ws, slideShow )
{
	this.src = src;
	this.caption = caption;
	this.url = url;
	this.index = index;
	this.isVideo = !url || url.length == 0 ? false : true;
	this.isWs = true;
	this.slideShow = slideShow;
	
	this.img = new Image();//document.createElement("img"); //$('img');
	//this.img.removeAttr("height");
	//this.img.removeAttr("width");
	this.img.src = "";
	this.img.src = src;
	
	//if( is_walkway()){
	 //alert("width: " + this.img.width + "\nheight: " + this.img.height);
	//}
	
	
	if( this.img.width == 0 ) this.img.width = 600;
	if( this.img.width > 600 ){
		var percent = 600 / this.img.width;
		
		this.img.width = 600;
		this.img.height *= percent;
	}	
	this.displayWidth = this.isVideo ? 480 : this.img.width;
	slideShow.imgCache.push(this.img);
}

slide.prototype.getDisplay = function(){
	var closeClass = selectToClass(this.slideShow.selectors.closeLink);
	var displayClass = "slide-display";
	var html = "<div class='" + displayClass + "-" + this.index + "'>";	
	if( this.isVideo ){
		var width = this.isWs ? 480 : 385;
		var height = 385;
	    var url = "";
        if (vimeo_id = this.url.match(/vimeo\.com\/([0-9]+)/)) {
		  url = "http://vimeo.com/moogaloop.swf?clip_id="+vimeo_id[1];
		} else if (dm_id = this.url.match(/dailymotion.com\/video\/([a-z0-9]+)_/)) {
          url = "http://dailymotion.com/swf/video/"+dm_id[1];
		} else {
		  url = this.url.replace("watch?v=", "v/") + "&amp;hl=en_US&amp;fs=1&";
		}
		html +=	"<object width='" + width + "' height='" + height + "'><param name='movie'"
				+ "value='" + url + "'></param><param name='allowFullScreen' value='true'>"
				+ "</param><param name='allowscriptaccess' value='always'></param>"
				+ "<embed src='" + url + "' type='application/x-shockwave-flash' "
				+ "allowscriptaccess='always' allowfullscreen='true' width='" + width + "' height='" + height 
				+ "'></embed></object>";
	}else{
		html += "<img src='" + this.img.src + "'/>";	
	}

	if( this.caption && this.caption.length > 0 )
		html += "<p class='slideshow-caption'>" + this.caption + "</p>";
	
	html += "</div>";

	return html;
};

/* ---------------------- static ------------------------------- */

function selectToClass( selector ){  return selector.replace(".", "" ); }

