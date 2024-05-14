var startup;

startup = function(){

	document.querySelector( "#main" ).onclick = function(){ changeWindow( "masterindex.html" ) };
	document.querySelector( "#edit-profile" ).onclick = function(){ changeWindow( "mastereditprofile.html" ) };
	document.querySelector( "#add-apprentice" ).onclick = function(){ changeWindow( "addapprentice.html" ) };
	document.querySelector( "#add-question" ).onclick = function(){ changeWindow( "addquestion.html" ) };
	document.querySelector( "#logout" ).onclick = logout;

};

window.addEventListener( "load", startup, false );
