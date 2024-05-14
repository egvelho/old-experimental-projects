var startup, getQuestion, questionTimeout;

questionTimeout = function(){ setTimeout( function(){

		getRandomQuestion();
		chrome.app.window.current().focus();
		questionTimeout();

}, ( parseInt( document.querySelector( "#timeout-range" ).value ) * 1000 * 60 ) ) }

getQuestion = function( id ){

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
			
			insertAlternative( "a", jsonObject[ "a" ], questionBox );
			insertAlternative( "b", jsonObject[ "b" ], questionBox );
			insertAlternative( "c", jsonObject[ "c" ], questionBox );
			insertAlternative( "d", jsonObject[ "d" ], questionBox );
			insertAlternative( "e", jsonObject[ "e" ], questionBox );
			
			document.querySelector( "body" ).appendChild( questionBox );
		
		} );

	} );

};

startup = function(){

	verifySession();

	chrome.storage.local.get( null, function( result ){
	
		var src, json;
		
		src = "http://alphascorpii.pythonanywhere.com/getquestions";
		json = {
		
			"login": result.alphaScorpii_token,
			"id": result.alphaScorpii_id
		
		};
		json = JSON.stringify( json );
		getJson( src, json, function( jsonObject ){
		
			var questions;
			
			questions = document.querySelector( "#questions" );
			questions.innerHTML = "";
			
			for( var question in jsonObject ){
			
				var innerQuestion, title, area;
				
				innerQuestion = document.createElement( "div" );
				innerQuestion.id = jsonObject[ question ].id;
				innerQuestion.className = "question";
				innerQuestion.onclick = function(){ getQuestion( this.id ); };
				
				title = document.createElement( "h1" );
				title.innerHTML = jsonObject[ question ].title;
			
				area = document.createElement( "h2" );
				
				switch( jsonObject[ question ].area ){
				
					case 1: area.innerHTML = "Matemática e suas tecnologias"; break;
					case 2: area.innerHTML = "Ciências e suas tecnologias"; break;
					case 3: area.innerHTML = "Linguagens e suas tecnologias"
				
				}
				
				innerQuestion.appendChild( area );
				innerQuestion.appendChild( title );
				questions.appendChild( innerQuestion );
			
			}
		
		} );
		
		var src, json;
		
		src = "http://alphascorpii.pythonanywhere.com/gettimeout";
		json = {
			
				"login": result.alphaScorpii_token,
				"id": result.alphaScorpii_id
			
			};
		json = JSON.stringify( json );
		
		getJson( src, json, function( jsonObject ){
		
			if( jsonObject[ "code" ] == 10 ){
				
				document.querySelector( "#timeout-range" ).value = parseInt( jsonObject[ "timeout" ] );
				document.querySelector( "#timeout label" ).innerHTML = "Timeout de questões (" + document.querySelector( "#timeout-range" ).value + " minutos)";

				if( parseInt( document.querySelector( "#timeout-range" ).value ) > 0 ){ questionTimeout(); }

			} else if( jsonObject[ "code" ] == 0 ){
				
				createNotification( "Alterar timeout", "Houve um erro. Você não possui uma sessão ativa e será redirecionado para a página de login.", function(){ changeWindow( "login.html" ) } );
				
			}
		
		} );
		
		document.querySelector( "#timeout-range" ).onchange = function(){
		
			var src, json;
			
			src = "http://alphascorpii.pythonanywhere.com/settimeout";
			
			json = {
			
				"login": result.alphaScorpii_token,
				"id": result.alphaScorpii_id,
				"timeout": parseInt( this.value )
			
			};
			json = JSON.stringify( json );
		
			getJson( src, json, function( jsonObject ){
			
				if( jsonObject[ "code" ] == 10 ){
				
					document.querySelector( "#timeout label" ).innerHTML = "Timeout de questões (" + document.querySelector( "#timeout-range" ).value + " minutos)";
				
				} else if( jsonObject[ "code" ] == 0 ){
				
					createNotification( "Alterar timeout", "Houve um erro. Você não possui uma sessão ativa e será redirecionado para a página de login.", function(){ changeWindow( "login.html" ) } );
				
				}
			
			} );
		
		};

	} );

};

window.onload = startup;