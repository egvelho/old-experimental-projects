var startup;

startup = function(){

	document.querySelector( "#edit-profile" ).onclick = function(){ changeWindow( "apprenticeeditprofile.html" ) };
	document.querySelector( "#main" ).onclick = function(){ changeWindow( "apprenticeindex.html" ) };
	document.querySelector( "#discipline-focus" ).onclick = function(){ changeWindow( "disciplinefocus.html" ) };
	document.querySelector( "#status" ).onclick = function(){ changeWindow( "status.html" ) };
	document.querySelector( "#playlists" ).onclick = function(){ changeWindow( "playlists.html" ) };
	document.querySelector( "#rush" ).onclick = getRandomQuestion;
	document.querySelector( "#logout" ).onclick = logout;

};

window.addEventListener( "load", startup, false );