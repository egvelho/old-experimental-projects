var startup;

startup = function(){

	document.querySelector( "#back-to-login" ).onclick = function(){ changeWindow( "login.html" ) }
	document.querySelector( "#submit" ).onclick = function(){

		var src, json;

		src = "http://alphascorpii.pythonanywhere.com/forgetpassword";
		json = JSON.stringify( parseFormToJson( "#login" ) );

		getJson( src, json, function( jsonObject ){

			if( jsonObject[ "code" ] == 10 ){

				createNotification( "Esqueci minha senha", "Sua nova senha foi enviada para o seu email.", function(){} );

			} else if( jsonObject[ "code" ] == 0 ){

				createNotification( "Esqueci minha senha", "Este usuário parece não existir.", function(){} );

			}

		} );

	};

};

window.onload = startup;