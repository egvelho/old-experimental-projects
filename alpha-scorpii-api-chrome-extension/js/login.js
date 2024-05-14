var startup, login;

login = function(){

	var loginJson, doLogin;

	doLogin   = "http://alphascorpii.pythonanywhere.com/login";
	loginJson = JSON.stringify( parseFormToJson( "#login" ) );
	
	getJson( doLogin, loginJson, function( jsonObject ){
	
		if( jsonObject[ "login" ] ){

			chrome.storage.local.set( { "alphaScorpii_token": jsonObject[ "login" ] } );
			chrome.storage.local.set( { "alphaScorpii_id": jsonObject[ "id" ] } );

			if( jsonObject[ "user" ] == "master" ) changeWindow( "masterindex.html" );
			else if( jsonObject[ "user" ] == "apprentice" ) changeWindow( "apprenticeindex.html" );
		
		} else{
		
			createNotification( "Login", "Usuário ou senha inválidos.", function(){} );
		
		}
	
	} );

};

startup = function(){

	document.querySelector( "#submit" ).onclick = login;
	document.querySelector( "#create-account" ).onclick = function(){ changeWindow( "createaccount.html" ) };
	document.querySelector( "#forget-password" ).onclick = function(){ changeWindow( "forgetpassword.html" ) };

};

window.onload = startup;