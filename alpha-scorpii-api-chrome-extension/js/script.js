var getJson, parseFormToJson, createNotification, verifySession, logout, changeWindow;

getJson = function( src, json, callback ){
	
	var request;
	
	request = new XMLHttpRequest();
	
	request.onreadystatechange = function(){ if( request.readyState == 4 && request.status == 200 ) callback( JSON.parse( request.responseText ) ) };
	request.open( "POST", src, true );
	request.setRequestHeader( "Content-type", "application/json" );
	request.send( json );
	
};

parseFormToJson = function( query ){

	var form, input, json;
	
	json = "{";
	form = document.querySelector( query );
	input = form.querySelectorAll( "input[type='text'], input[type='password'], input[type='hidden'], input[type='range'], select" );
	
	for( var element = 0; element < ( input.length - 1 ); element++ ) json += '"' + input[ element ].id + '": ' + '"' + input[ element ].value + '",'
	
	json += '"' + input[ input.length - 1 ].id + '": ' + '"' + input[ input.length - 1 ].value + '"}';
	
	return JSON.parse( json );
	
};

createNotification = function( titleContent, textContent, callback ){

	var element, title, content, closeButton, backScreen;
	
	backScreen = document.createElement( "div" );
	backScreen.className = "back-screen";
	backScreen.id = "back-screen-div";
	
	title = document.createElement( "h1" );
	title.innerHTML = titleContent;
	
	content = document.createElement( "p" );
	content.innerHTML = textContent;
	
	closeButton = document.createElement( "input" );
	closeButton.type = "button";
	closeButton.value = "Confirmar";
	closeButton.onclick = function(){
	
		document.querySelector( "body" ).removeChild( document.querySelector( "#notification-div" ) );
		document.querySelector( "body" ).removeChild( document.querySelector( "#back-screen-div" ) );
		callback();
		
	};
	
	element = document.createElement( "div" );
	element.id = "notification-div";
	element.className = "notification";
	
	element.appendChild( title );
	element.appendChild( content );
	element.appendChild( closeButton );
	
	document.querySelector( "body" ).appendChild( element );
	document.querySelector( "body" ).appendChild( backScreen );
	

};

verifySession = function(){

	chrome.storage.local.get( null, function( result ){

		var verifySession, sessionJson;

		verifySession = "http://alphascorpii.pythonanywhere.com/verifysession";
		
		sessionJson = {
		
			"login": result.alphaScorpii_token
		
		};
		
		sessionJson = JSON.stringify( sessionJson );

		getJson( verifySession, sessionJson, function( jsonObject ){
		
			if( jsonObject[ "session" ] ){
			
			
			
			} else{
			
				createNotification( "Sessão não inicializada", "É necessário inicializar uma sessão para utilizar o aplicativo. Você será redirecionado para a página de login.", function(){ changeWindow( "login.html" ); } );
			
			}
		
		} );

	} );

};

logout = function(){

	chrome.storage.local.get( null, function( result ){

		var logoutJson, doLogout;

		doLogout = "http://alphascorpii.pythonanywhere.com/logout";
		
		logoutJson = {
		
			"login": result.alphaScorpii_token
		
		};
		
		logoutJson = JSON.stringify( logoutJson );

		getJson( doLogout, logoutJson, function( jsonObject ){
		
			if( !jsonObject[ "session" ] ){
			
				createNotification( "Sessão encerrada com sucesso", "Você será redirecionado para a página de login.", function(){ changeWindow( "login.html" ) } )
			
			} else{
			
				createNotification( "Sessão não inicializada", "Você não possui sessão para ser encerrada. Você será redirecionado para a página de login.", function(){ changeWindow( "login.html" ); } );
			
			}
		
		} );

	} );

};

changeWindow = function( window ){

	chrome.app.window.current().close();
	chrome.app.window.create( window, { 'outerBounds': { 'width': 800, 'height': 600 }, "resizable": false } );

};