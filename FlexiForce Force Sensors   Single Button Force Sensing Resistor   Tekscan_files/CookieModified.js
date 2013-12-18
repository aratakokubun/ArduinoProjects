
// alert("a");

    
function setCookie(c_name,value,exdays)
{
var exdate=new Date();
exdate.setDate(exdate.getDate() + exdays);
var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name)
{
var i,x,y,ARRcookies=document.cookie.split(";");
for (i=0;i<ARRcookies.length;i++)
  {
  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
  x=x.replace(/^\s+|\s+$/g,"");
  if (x==c_name)
    {
    return unescape(y);
    }
  }
}




   //
   //--- CHANGE THESE!!! ---
   //

    // Change this to match domains of referrers you want to ignore.
    // You'll want to ignore referrers from your own domains.
    // Use only the base domain name without subdomains (ex. "company.com")
    // Separate multiple domains with commas (leave the brackets).
  var excludedReferrers = [ "tekscan.com" ];

    // Change this to match the base domain of your company's landing pages.
    // Cookies will be created with this domain.
    // Ex. If your landing page domain is "pages.yourcompany.com" then use
    //     "yourcompany.com"
  var cookieDomain = "tekscan.com";

    // The URL parameter that has your pay-per-click info.
    // Typically "kw" or "keyword" (depends on how you set up your PPC URLs)
  var payPerClickParameter = "utm_term";
  
  //IDs for the fields to be updated.
  var utmcampaignFieldID = "#utm_campaign__c"
  var utmsourceFieldID = "#utm_source__c"
  var utmtermFieldID = "#utm_term__c"
  var utmcontentFieldID = "#utm_content__c"
  var utmmediumFieldID = "#utm_medium__c"

   //
   //-- you probably shouldn't change anything after this --
   //

  var refer = document.referrer;
  function getQueryVariableRefer(variable) {
        var query = refer.substring("?");
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (pair[0] == variable) {
                return pair[1];
break;
            }
        }
    }
	
	getQueryVariableRefer("utm_medium");
	
  //alert("referer : "+refer);
  var searchString;
  var searchEngine;

      // if there's no referrer, do nothing
  if ( (refer == undefined) || (refer == "") ) 
  { 
 //alert("1");

  ; }
  else {
	   //alert("2");

     // get the domain of the referring website -- http://[[this-thing.com]]/
    var referrerDomain =
      refer.substr(refer.indexOf("\/\/") + 2,
        refer.indexOf("\/",8) - refer.indexOf("\/\/") - 2).toLowerCase();

    var excludedDomainFound = false;
    var i = 0;

      // search the excluded domain list to see if the referrer domain is on it
    while ( (i < excludedReferrers.length) && !excludedDomainFound) {
      var thisExcludedDomain = excludedReferrers[i].toLowerCase();

        // weird semantics here -- indexOf returns "-1" if the search string isnt found.
        // thus excludedDomainFound is true only when indexOf matches an excluded domain (!= -1)
      excludedDomainFound = (referrerDomain.indexOf(thisExcludedDomain) != -1);
      i++;
    }

     // only if the referrer isn't in our excluded domain list...
    if( !excludedDomainFound ) {
        // extract the URL parameters from common search engines
        // To add your own, each engine needs:
        //  name: how the search engine will appear on your Marketo leads
        //  url: REGEX for matching the engine's referrer.  ex.  /\.google\./i
        //  query: URL parameter that contains the search query - usually "p" or "q"

      var searchEngines = [
       { name: "Yahoo", url: /\.yahoo\.co/i, query: "p" },
       { name: "Google", url: /\.google\./i, query: "q" },
       { name: "Microsoft Live", url: /\.live\.com/i, query: "q" },
       { name: "MSN Search", url: /search\.msn\./i, query: "q" },
       { name: "AOL", url: /\.aol\./i, query: "query" },
       { name: "Bing", url: /\.bing\.com/i, query: "q" },
       { name: "Ask", url: /\.ask\.com/i, query: "q" }
      ];

        // find the referring search engine (if any)
      i = 0;
      while (i < searchEngines.length) {
        if (refer.match(searchEngines[i].url)) {
          searchEngine = searchEngines[i].name;
		  /*
          searchString = $jQ.getQueryString({ ID: searchEngines[i].query,
            URL: refer, DefaultValue: "" });
		  */
		            searchString = getQueryVariableRefer(searchEngines[i].query);

          break;
        }
        i++;
      }
         // If no search engine is found, this person probably used a less
         // popular one.  Use the referring doman, then guess the query parameter
      if (i == searchEngines.length) {

         searchEngine = referrerDomain;

         var queries = ["q","p","query"];
         var i = 0;
         while ((i < queries.length) && (searchString == undefined)) {
           searchString = getQueryVariableRefer(queries[i]);
           i++;
         }

           // no search strings found -- use this text instead.
         if (searchString == undefined) {
           searchString = "None";
         }
      }
	  
	  // Store the URL parameter value in the variable "ucampaign"
	  
	  /* Old Code
    var ucampaign = $jQ.getQueryString({ID: utm_campaign, URL: refer, DefaultValue: "" });
	var usource = $jQ.getQueryString({ID: utm_source, URL: refer, DefaultValue: "" });
    var uterm = $jQ.getQueryString({ID: utm_term, URL: refer, DefaultValue: "" });
    var ucontent = $jQ.getQueryString({ID: utm_content, URL: refer, DefaultValue: "" });			
    var umedium = $jQ.getQueryString({ID: utm_medium, URL: refer, DefaultValue: "" });
	
	*/
	
	    var ucampaign = "";
	var usource = "";
    var uterm = "";
    var ucontent = "";			
    var umedium = "";
	
	if(getQueryVariable('utm_source')!=null)
{
usource=getQueryVariable('utm_source');
}
    
if(getQueryVariable('utm_medium')!=null)
{
 umedium=getQueryVariable('utm_medium');
}
    
if(getQueryVariable('utm_term')!=null)
{
 uterm =getQueryVariable('utm_term');
}
    
if(getQueryVariable('utm_content')!=null)
{
 ucontent = getQueryVariable('utm_content');
}
    
if(getQueryVariable('utm_campaign')!=null)
{
ucampaign=getQueryVariable('utm_campaign');
}

	
// alert(ucampaign);

         // Use the provided URL parameter to get the PPC keyword.
		 /*
      var payPerClickWord = $jQ.getQueryString({ID: payPerClickParameter,
        URL: refer, DefaultValue: "" });
	  */
	 var payPerClickWord="";	
	if(getQueryVariable('payPerClickParameter')!=null)
 payPerClickWord = getQueryVariable('payPerClickParameter');

         // Put the info into cookies.  These values will be extracted
         // and put into a Marketo form later.  Expires in 2 years.
		 
		 /*Old Code
      $jQ.cookie('mktoPPCKeyword', payPerClickWord,
         {expires: 730, path: '\/', domain: cookieDomain});
      $jQ.cookie('mktoSearchEngine', searchEngine,
         {expires: 730, path: '\/', domain: cookieDomain});
      $jQ.cookie('mktoSearchString', searchString,
         {expires: 730, path: '\/', domain: cookieDomain});
		 
	 // Create a cookie named "utmcampaigncookie" and store the value from the variable "ucampaign"
	$jQ.cookie('ucampaign', utmcampaigncookie,
         {expires: 730, path: '\/', domain: cookieDomain});
	$jQ.cookie('usource', utmsourcecookie,
         {expires: 730, path: '\/', domain: cookieDomain});
	$jQ.cookie('uterm', utmtermcookie,
         {expires: 730, path: '\/', domain: cookieDomain});
	$jQ.cookie('ucontent', utmcontentcookie,
         {expires: 730, path: '\/', domain: cookieDomain});
	$jQ.cookie('umedium', utmmediumcookie,
         {expires: 730, path: '\/', domain: cookieDomain});
	*/
		  setCookie("mktoPPCKeyword",payPerClickWord,730);
 		  setCookie("mktoSearchEngine",searchEngine,730);
  		  setCookie("mktoSearchString",searchString,730);
		  
  		  setCookie("utmcampaigncookie",ucampaign,730);
  		  setCookie("utmsourcecookie",usource,730);
  		  setCookie("utmtermcookie",uterm,730);
  		  setCookie("utmcontentcookie",ucontent,730);
  		  setCookie("utmmediumcookie",umedium,730);
  		 

		 
		 
		 
    }
  }
  
  	
// alert("c");
    // Get the values from the cookies and put them into the hidden fields
/*	old code
 $jQ(searchStringField).attr("value",$jQ.cookie('mktoSearchString'));
  $jQ(searchEngineField).attr("value",$jQ.cookie('mktoSearchEngine'));
  $jQ(payPerClickKeywordField).attr("value",$jQ.cookie('mktoPPCKeyword'));
  
  // Get the values from the cookies and put them into the hidden field by referencing the field ID
  $jQ(utm_campaign__c).attr("value",$jQ.cookie('utmcampaigncookie'));
  $jQ(utm_source__c).attr("value",$jQ.cookie('utmsourcecookie'));
  $jQ(utm_term__c).attr("value",$jQ.cookie('utmtermcookie'));
  $jQ(utm_content__c).attr("value",$jQ.cookie('utmcontentcookie'));
  $jQ(utm_medium__c).attr("value",$jQ.cookie('utmmediumcookie'));
  */

	
  $('#searchStringField').val(getCookie('mktoSearchString'));
  $('#searchEngineField').val(getCookie('mktoSearchEngine'));
  $('#payPerClickKeywordField').val(getCookie('mktoPPCKeyword'));
  
  $('#utm_campaign__c').val(getCookie('utmcampaigncookie'));
  $('#utm_source__c').val(getCookie('utmsourcecookie'));
  $('#utm_term__c').val(getCookie('utmtermcookie'));
   $('#utm_content__c').val(getCookie('utmcontentcookie'));
  $('#utm_medium__c').val(getCookie('utmmediumcookie'));
  
  


