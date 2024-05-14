var startup;

startup = function(){

	verifySession();

	chrome.storage.local.get( null, function( result ){

		var src, json;
		
		src = "http://alphascorpii.pythonanywhere.com/getstatus";
		json = {
		
			"login": result.alphaScorpii_token,
			"id": result.alphaScorpii_id
		
		};
		json = JSON.stringify( json );

		getJson( src, json, function( jsonObject ){
		
			if( jsonObject[ "code" ] == 10 ){
		
				var i, mathStatus, scienceStatus, languageStatus;
				
				mathStatus = parseInt( jsonObject[ "math-correct" ] ) + parseInt( jsonObject[ "math-wrong" ] );
				mathStatus = ( parseInt( jsonObject[ "math-correct" ] ) * 5 ) / mathStatus;
				mathStatus = parseInt( mathStatus );
				
				scienceStatus = parseInt( jsonObject[ "science-correct" ] ) + parseInt( jsonObject[ "science-wrong" ] );
				scienceStatus = ( parseInt( jsonObject[ "science-correct" ] ) * 5 ) / scienceStatus;
				scienceStatus = parseInt( scienceStatus );
				
				languageStatus = parseInt( jsonObject[ "language-correct" ] ) + parseInt( jsonObject[ "language-wrong" ] );
				languageStatus = ( parseInt( jsonObject[ "language-correct" ] ) * 5 ) / languageStatus;
				languageStatus = parseInt( languageStatus );
			
				for( i = 0; i < mathStatus; i++ ){
				
					var star = document.createElement( "img" );
					star.className = "star";
					star.src = "img/staron.png";
					document.querySelector( "#math" ).appendChild( star );
				
				} for( var j = 0; j < ( 5 - i ); j++  ){
				
					var star = document.createElement( "img" );
					star.className = "star";
					star.src = "img/staroff.png";
					document.querySelector( "#math" ).appendChild( star );
				
				} for( i = 0; i < scienceStatus; i++ ){
				
					var star = document.createElement( "img" );
					star.className = "star";
					star.src = "img/staron.png";
					document.querySelector( "#science" ).appendChild( star );
				
				} for( var j = 0; j < ( 5 - i ); j++  ){
				
					var star = document.createElement( "img" );
					star.className = "star";
					star.src = "img/staroff.png";
					document.querySelector( "#science" ).appendChild( star );
				
				} for( i = 0; i < languageStatus; i++ ){
				
					var star = document.createElement( "img" );
					star.className = "star";
					star.src = "img/staron.png";
					document.querySelector( "#language" ).appendChild( star );
				
				} for( var j = 0; j < ( 5 - i ); j++  ){
				
					var star = document.createElement( "img" );
					star.className = "star";
					star.src = "img/staroff.png";
					document.querySelector( "#language" ).appendChild( star );
				
				}
				
			} else if( jsonObject[ "code" ] == 0 ){
			
				createNotification( "Carregar Status", "Você não possui sessão ativa. Você será redirecionado para a página de login", function(){ changeWindow( "login.html" ) } );
			
			}
		
		} );

	} );

};

window.onload = startup;