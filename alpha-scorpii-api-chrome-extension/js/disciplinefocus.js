var startup, getDisciplineFocus, setDisciplineFocus;

getDisciplineFocus = function(){

	chrome.storage.local.get( null, function( result ){

		var src, json;
		
		src = "http://alphascorpii.pythonanywhere.com/getdisciplinefocus";
		json = {
		
			"id": result.alphaScorpii_id,
			"login": result.alphaScorpii_token
		
		};
		json = JSON.stringify( json );
		
		getJson( src, json, function( jsonObject ){
		
			if( jsonObject[ "code" ] == 10 ){
		
				document.querySelector( "#math" ).value = jsonObject[ "math" ];
				document.querySelector( "#science" ).value = jsonObject[ "science" ];
				document.querySelector( "#language" ).value = jsonObject[ "language" ];
				
				document.querySelector( "#math-label" ).innerHTML = "Matemática e suas tecnologias <br>(" + jsonObject[ "math" ] + " questões/request)";
				document.querySelector( "#science-label" ).innerHTML = "Ciências e suas tecnologias <br>(" + jsonObject[ "science" ] + " questões/request)";
				document.querySelector( "#language-label" ).innerHTML = "Linguagens e suas tecnologias <br>(" + jsonObject[ "language" ] + " questões/request)";
				
			} else if( jsonObject[ "code" ] == 0 ){
			
				createNotification( "Ênfase disciplinar", "Você não possui uma sessão ativa. Você será redirecionado para a página de login.", function(){ changeWindow( "login.html" ) } );
			
			}
		
		} );

	} );
	
}

setDisciplineFocus = function(){

	chrome.storage.local.get( null, function( result ){

		var src, json;

		src = "http://alphascorpii.pythonanywhere.com/setdisciplinefocus";
		json = {
		
			"id": result.alphaScorpii_id,
			"login": result.alphaScorpii_token,
			"math": parseInt( document.querySelector( "#math" ).value ),
			"science": parseInt( document.querySelector( "#science" ).value ),
			"language": parseInt( language = document.querySelector( "#language" ).value )
		
		};
		json = JSON.stringify( json );
		
		getJson( src, json, function( jsonObject ){
		
			switch( jsonObject[ "code" ] ){
			
				case 10: createNotification( "Ênfase disciplinar", "Sua ênfase disciplinar foi alterada com sucesso.", function(){} ); break;
				case 9: createNotification( "Ênfase disciplinar", "Os valores necessitam ser um número entre 0 e 10.", function(){} ); break;
				case 0: createNotification( "Ênfase disciplinar", "Você não possui uma sessão ativa. Você será redirecionado para a página de login.", function(){ changeWindow( "login.html" ) } );
			
			}
		
		} );

	} );

};

startup = function(){

	verifySession();
	getDisciplineFocus();
	
	document.querySelector( "#math" ).onchange = function(){ document.querySelector( "#math-label" ).innerHTML = "Matemática e suas tecnologias <br>(" + this.value + " questões/request)"; };
	document.querySelector( "#science" ).onchange = function(){ document.querySelector( "#science-label" ).innerHTML = "Ciências e suas tecnologias <br>(" + this.value + " questões/request)"; };
	document.querySelector( "#language" ).onchange = function(){ document.querySelector( "#language-label" ).innerHTML = "Linguagens e suas tecnologias <br>(" + this.value + " questões/request)"; };
	document.querySelector( "#submit" ).onclick = setDisciplineFocus;
	
};

window.onload = startup;
