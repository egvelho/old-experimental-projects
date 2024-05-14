var startup, addQuestion;

addQuestion = function(){

	var src, json;
	
	src = "http://alphascorpii.pythonanywhere.com/addquestion";
	json = JSON.stringify( parseFormToJson( "form" ) );
		
	getJson( src, json, function( jsonObject ){
	
		switch( jsonObject[ "code" ] ){
		
			case 10: createNotification( "Adicionar questão", "Sua questão foi enviada com sucesso. Aguarde o aceite da administração.", function(){} ); break;
			case 9: createNotification( "Adicionar questão", "Existem campos vazios. Preencha-os e tente novamente.", function(){} ); break;
			case 8: createNotification( "Adicionar questão", "A alternativa correta precisa ser uma letra entre A e E.", function(){} ); break;
			case 7: createNotification( "Adicionar questão", "A área precisa ser um número entre 1 e 3.", function(){} ); break;
			case 0: createNotification( "Adicionar questão", "Houve um erro. Você não possui uma sessão ativa e será redirecionado para a página de login.", function(){ changeWindow( "login.html" ) } );
		
		}

	} );

};

startup = function(){

	verifySession();

	chrome.storage.local.get( null, function( result ){

		var hiddenLogin, hiddenId;

		hiddenLogin = document.createElement( "input" );
		hiddenId = document.createElement( "input" );
		hiddenLogin.type = "hidden";
		hiddenId.type = "hidden";
		hiddenLogin.value = result.alphaScorpii_token;
		hiddenId.value = result.alphaScorpii_id;
		hiddenLogin.id = "login";
		hiddenId.id = "id";
		document.querySelector( "form" ).appendChild( hiddenLogin );
		document.querySelector( "form" ).appendChild( hiddenId );

		document.querySelector( "#submit" ).onclick = addQuestion;

	} );

};

window.onload = startup;