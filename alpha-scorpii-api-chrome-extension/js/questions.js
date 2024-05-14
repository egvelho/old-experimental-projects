var insertAlternative, getRandomQuestion, rush;

rush = false;

insertAlternative = function( alternative, text, questionBox ){

	chrome.storage.local.get( null, function( result ){

		var alternativeLabel, alternativeRadio;
		
		alternativeRadio = document.createElement( "input" );
		alternativeRadio.type = "radio";
		alternativeRadio.name = "answer";
		alternativeRadio.value = alternative.toUpperCase();
		alternativeRadio.id = alternative;
			
		alternativeLabel = document.createElement( "label" );
		alternativeLabel.htmlFor = alternative
		alternativeLabel.innerHTML = alternative.toUpperCase() + ") " + text;
		alternativeLabel.onclick = function(){
		
			src = "http://alphascorpii.pythonanywhere.com/getanswer";
			json = {
			
				"login": result.alphaScorpii_token,
				"id": result.alphaScorpii_id,
				"question-id": parseInt( document.querySelector( ".question-box" ).id ),
				"answer": this.htmlFor.toUpperCase(),
				"area": parseInt( document.querySelector( ".question-box h1" ).id )
			
			};
			json = JSON.stringify( json );
			
			getJson( src, json, function( jsonObject ){
			
				if( jsonObject[ "code" ] == 0 ){
				
					createNotification( "Responder questão", "Você não possui uma sessão ativa. Você será redirecionado para a página de login.", function(){ changeWindow( "login.html" ) } );
				
				} else if( jsonObject[ "code" ] == 10 ){
				
					if( jsonObject[ "answer" ] ) createNotification( "Responder questão", "Sua resposta está correta!", function(){ if( rush ) getRandomQuestion() } );
					else createNotification( "Responder questão", "Sua resposta está errada!", function(){ if( rush ) getRandomQuestion() } );
				
				}
			
				document.querySelector( ".question-box" ).parentNode.removeChild( document.querySelector( ".question-box" ) );
				document.querySelector( "body" ).style.overflow = "auto";
			
			} );
		
		};
			
		questionBox.appendChild( alternativeRadio );
		questionBox.appendChild( alternativeLabel );

	} );

}

getRandomQuestion = function(){

	rush = true;

	chrome.storage.local.get( null, function( result ){

		var src, json;
		
		document.querySelector( "body" ).style.overflow = "hidden";
		
		src = "http://alphascorpii.pythonanywhere.com/getrandomquestion";
		json = {
		
			"login": result.alphaScorpii_token,
			"id": result.alphaScorpii_id
		
		};
		json = JSON.stringify( json );
		
		getJson( src, json, function( jsonObject ){
		
			var questionBox, title, area, closeButton;
			
			questionBox = document.createElement( "div" );
			questionBox.className = "question-box";
			questionBox.id = jsonObject[ "id" ];

			title = document.createElement( "h2" );
			title.innerHTML = jsonObject[ "title" ];
			
			area = document.createElement( "h1" );
			area.id = jsonObject[ "area" ];
			
			switch( jsonObject[ "area" ] ){
				
					case 1: area.innerHTML = "Matemática e suas tecnologias"; break;
					case 2: area.innerHTML = "Ciências e suas tecnologias"; break;
					case 3: area.innerHTML = "Linguagens e suas tecnologias"
				
				}
				
			closeButton = document.createElement( "input" );
			closeButton.type = "button";
			closeButton.id = "question-close-button";
			closeButton.value = "Fechar";
			closeButton.onclick = function(){
			
				document.querySelector( ".question-box" ).parentNode.removeChild( document.querySelector( ".question-box" ) );
				document.querySelector( "body" ).style.overflow = "auto";
				rush = false;
			
			};
			
			questionBox.appendChild( area );
			questionBox.appendChild( title );
			questionBox.appendChild( closeButton );
			
			insertAlternative( "a", jsonObject[ "a" ], questionBox );
			insertAlternative( "b", jsonObject[ "b" ], questionBox );
			insertAlternative( "c", jsonObject[ "c" ], questionBox );
			insertAlternative( "d", jsonObject[ "d" ], questionBox );
			insertAlternative( "e", jsonObject[ "e" ], questionBox );
			
			document.querySelector( "body" ).appendChild( questionBox );
		
		} );

	} );

};