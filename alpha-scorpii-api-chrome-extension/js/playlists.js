var startup, getQuestion, insertPlaylistAlternative, actualQuestion;

actualQuestion = 0;

insertPlaylistAlternative = function( alternative, text, questionBox, callback ){

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
				
					if( jsonObject[ "answer" ] ) createNotification( "Responder questão", "Sua resposta está correta!", callback );
					else createNotification( "Responder questão", "Sua resposta está errada!", callback );
				
				}
			
				document.querySelector( ".question-box" ).parentNode.removeChild( document.querySelector( ".question-box" ) );
				document.querySelector( "body" ).style.overflow = "auto";
			
			} );
		
		};
			
		questionBox.appendChild( alternativeRadio );
		questionBox.appendChild( alternativeLabel );

	} );

}

getPlaylistQuestion = function( id, callback ){

	chrome.storage.local.get( null, function( result ){

		var src, json;
		
		document.querySelector( "body" ).style.overflow = "hidden";
		
		src = "http://alphascorpii.pythonanywhere.com/getquestion";
		json = {
		
			"login": result.alphaScorpii_token,
			"id": result.alphaScorpii_id,
			"question-id": id
		
		};
		json = JSON.stringify( json );
		
		getJson( src, json, function( jsonObject ){
		
			var questionBox, title, area;
			
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
			
			questionBox.appendChild( area );
			questionBox.appendChild( title );
			
			insertPlaylistAlternative( "a", jsonObject[ "a" ], questionBox, callback );
			insertPlaylistAlternative( "b", jsonObject[ "b" ], questionBox, callback );
			insertPlaylistAlternative( "c", jsonObject[ "c" ], questionBox, callback );
			insertPlaylistAlternative( "d", jsonObject[ "d" ], questionBox, callback );
			insertPlaylistAlternative( "e", jsonObject[ "e" ], questionBox, callback );
			
			document.querySelector( "body" ).appendChild( questionBox );
		
		} );

	} );

};

startup = function(){

	verifySession();

	chrome.storage.local.get( null, function( result ){

		var src, json;
		
		src = "http://alphascorpii.pythonanywhere.com/getapprenticeplaylists";
		json = {
		
			"login": result.alphaScorpii_token,
			"id": result.alphaScorpii_id
		
		};
		json = JSON.stringify( json );

		getJson( src, json, function( jsonObject ){

			if( jsonObject[ "code" ] == 10 ){

				var playlists;

				playlists = document.querySelector( "#apprentice-playlists" );
				
				for( var item in jsonObject[ "playlists" ] ){

					var playlist;

					playlist = document.createElement( "span" );
					playlist.id = jsonObject[ "playlists" ][ item ].id;
					playlist.innerHTML = "Playlist de " + jsonObject[ "playlists" ][ item ].name;
					playlist.onclick = function(){

						actualQuestion = 0;

						if( jsonObject[ "code" ] == 10 ){

							var src, json;
				
							src = "http://alphascorpii.pythonanywhere.com/getplaylist";
							json = {
							
								"login": result.alphaScorpii_token,
								"id": result.alphaScorpii_id,
								"master-id": this.id
							
							};
							json = JSON.stringify( json );

							getJson( src, json, function( jsonObject ){

								var playlistQuestions;

								playlistQuestions = function(){

									getPlaylistQuestion( parseInt( jsonObject[ "questions" ][ actualQuestion ] ), function(){

										actualQuestion++;

										if( actualQuestion < Object.keys( jsonObject[ "questions" ] ).length ){

											playlistQuestions()

										}

									} );

								};

								playlistQuestions();

							} );

						} else if( jsonObject[ "code" ] == 0 ){

							createNotification( "Playlists", "Não foi possível recuperar a sua playlist. Você será redirecionado a página de login", function(){ changeWindow( "login.html" ) } );

						}

					}
					playlists.appendChild( playlist );

				}

			} else if( jsonObject[ "code" ] == 0 ){

				createNotification( "Playlists", "Não foi possível recuperar as suas playlists. Você será redirecionado a página de login", function(){ changeWindow( "login.html" ) } );

			}

		} );

	} );

};

window.onload = startup;