// js file for validating forms client side

String.prototype.trim = function() { return this.replace(/^\s+|\s+/g,""); }

Drupal.behaviors.form_validations = function(){
    $("form").each(function(){
      mark_required_fields($(this)); 
      mark_required_state($(this));
    });
        
    $("form").submit(function(){
      return validate_form($(this));
    });   
};

function validate_form(form)
{
      var errors = "";
      var emailTest = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
      var emailEmpty = false;
      var url = window.location.href;
      var formName = getFormName(form);
      
      form.find("input").each(function(){
        var input = $(this);
        if(input.hasClass("required")){
          var value = input.attr("value");
          var name = uscore_to_space( input.attr("name") );
          if( value.trim() == "" ){
            errors += "You must enter a value for the field " + name + ".\n";
            if( input.hasClass("email"))
              emailEmpty = true;
          }
         
        }
        
        if( input.hasClass("email") && !emailEmpty ){
          if(!emailTest.test(value) )
            errors += "You did not enter a valid email address.\n";
            
        }
      });
      
      form.find("textarea").each(function(){
        var tarea = $(this);
        if( tarea.hasClass("required")){
          var value = tarea.val();
          var name = uscore_to_space( tarea.attr("name") );
          if( value.trim() == "" )
            errors += "You must enter a value for the field " + name + ".\n";
        }
      });
      
      form.find("select").each(function(){
        var sarea = $(this);
        if( sarea.hasClass("required")){
          var value = sarea.val();
          var name = uscore_to_space( sarea.attr("name") );
          if( value.trim() == "" )
            errors += "You must enter a value for the field " + name + ".\n";
        }
      });
      
      if( errors != "" ){
        errors = "The following errors occured:\n\n" + errors;
        alert(errors);
        return false;
      }
      
      // track submission with google analytics
      if(formName){
      	_gaq.push(['_trackEvent', "Form Submissions", formName, url, 0]);
      }
      
      return true;
}

function mark_required_fields(form)
{
  form.find("span.required").each(function(){
    var parent = $(this).parent();
    parent.prepend("<span class='required-marker'>&nbsp;*&nbsp;</span>");   
  });   
}

function mark_required_state(form)
{
  form.find("span.requiredstate").each(function(){
    var parent = $(this).parent();
    parent.prepend("<span class='required-marker-state'>&nbsp;*&nbsp;</span>");   
  });  
}

function uscore_to_space(str){  return str.replace(/_/g, " "); }

function getFormName(form){
	var formNameField = form.find("input[name=form_name]");
	if(formNameField)
		return formNameField.attr("value");
	else
		return false;
}

// NOT form stuff application.js
$(document).ready(function(){
	$('iframe').each(function(i,el) {
		var $el = $(el);
		var src = $el.attr('src');
		if (src.match("youtube\.com")) {
			var indexOfQ = src.indexOf('?');
			if (indexOfQ == -1) {
				src = src + "?";
				indexOfQ = src.length - 1;
			}
			var new_src = src.substr(0,indexOfQ) + '?wmode=opaque&' + src.substr(indexOfQ+1,src.length-1);
			$el.attr('src',new_src);
		}
	});
	$('embed').each(function(i,el) {
		var $el = $(el);
		var type = $el.attr('type');
		var $object = $el.parents('object');
		//$el.remove
		
		//alert(type);
		if (true || type == "application/x-shockwave-flash") {
			$el.attr('wmode', 'transparent');
			if ($object.length > 0) {
				$object.prepend('<param name="wmode" value="transparent" />');
				$object.append($el);
				var new_object = $object.clone();
				$object.replaceWith(new_object);
			} else {
				//alert('...');
				var height = $el.height();
				var width = $el.width();
				var new_el = $el.clone();
				var el_attrs = '';
				var a = $el[0].attributes;
				var attrs = ['wmode="transparent"']; 
				for (i=0; i < a.length; i++) { 
					var nn = a[i].nodeName;
					var nv = $el.attr(nn);
					if (nn != 'wmode' && nv && nv.length)
						attrs.push(nn+ '="' +nv+'"'); 
				}
				el_attrs = attrs.join(' ');
				$el.replaceWith('<object width="'+width+'" height="'+height+'"><param name="wmode" value="transparent" /><embed '+el_attrs+' /></object>');
			}
		}
	});

	if ($('#sidebar-right').length) {
		var $container = $('#container');
		var $header = $('#header');
		var $content = $('#content');
		var $sidebar_right = $('#sidebar-right');
		$container.append('<div id="inner-user-container"><div id="inner-user-container-page"></div></div>');
		var $inner_user_container = $('#inner-user-container');
		var $inner_user_container_page = $('#inner-user-container-page');
		$inner_user_container_page.append($header);
		$inner_user_container_page.append($content);
		$inner_user_container.append($sidebar_right);
	
      	$('.floating-head').css("left", $('.floating-head').parent().offset().left);
		$('.sticky-header').css('margin-left','0px');
	}

});