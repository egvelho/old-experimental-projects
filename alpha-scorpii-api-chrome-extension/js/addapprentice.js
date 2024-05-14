var startup;

startup = function(){

	verifySession();
	
	document.querySelector( "#search-bar" ).onkeyup = function(){
	
		var searchTerms, toSearch;
		
		searchTerms = document.querySelector( "#search-bar" ).value;
		toSearch = document.querySelectorAll( "#apprentices label" );
	
		searchTerms = searchTerms.toLowerCase();

		for( var item = 0; item < toSearch.length; item++ ){
		
			var innerQuestion;
			
			innerQuestion = toSearch[ item ].innerHTML
			innerQuestion = innerQuestion.toLowerCase();
			
			if( innerQuestion.indexOf( searchTerms ) > -1 ){
			
				toSearch[ item ].style.display = "block";
			
			} else{
			
				toSearch[ item ].style.display = "none";
			
			}
		
		}
	
	};

	chrome.storage.local.get( null, function( result ){

		var src, json;
		
		src = "http://alphascorpii.pythonanywhere.com/getapprentices";
		json = {
		
			"login": result.alphaScorpii_token,
			"id": result.alphaScorpii_id
		
		};
		json = JSON.stringify( json );

		getJson( src, json, function( jsonObject ){
		
			for( var apprentice in jsonObject ){
			
				var name, select, wrapper;
				
				select = document.createElement( "input" );
				select.type = "checkbox";
				select.id = jsonObject[ apprentice ].id;
				select.checked = jsonObject[ apprentice ].apprentice;
				select.onchange = function(){
				
					if( this.checked ){
					
						var json, src;
						
						src = "http://alphascorpii.pythonanywhere.com/addapprentice";
						json = {
						
							"login": result.alphaScorpii_token,
							"id": result.alphaScorpii_id,
							"apprentice-id": this.id
						
						};
						json = JSON.stringify( json );
						
						getJson( src, json, function( jsonObject ){
						
							if( jsonObject[ "code" ] == 10 ){ return null; } else if( jsonObject[ "code" ] == 0 ){
							
								createNotification( "Adicionar aprendiz", "Não foi possível executar esta ação. Você será redirecionado para a página de login.", function(){ changeWindow( "login.html" ) } );
							
							}
						
						} );
					
					} else {
					
						var json, src;
						
						src = "http://alphascorpii.pythonanywhere.com/delapprentice";
						json = {
						
							"login": result.alphaScorpii_token,
							"id": result.alphaScorpii_id,
							"apprentice-id": this.id
						
						};
						json = JSON.stringify( json );
						
						getJson( src, json, function( jsonObject ){
						
							if( jsonObject[ "code" ] == 10 ){ return null; } else if( jsonObject[ "code" ] == 0 ){
							
								createNotification( "Adicionar aprendiz", "Não foi possível executar esta ação. Você será redirecionado para a página de login.", function(){ changeWindow( "login.html" ) } );
							
							}
						
						} );
					
					}
				
				};
				
				name = document.createElement( "label" )
				name.htmlFor = jsonObject[ apprentice ].id;
				name.innerHTML = jsonObject[ apprentice ].name + " - " + jsonObject[ apprentice ].email;
				
				wrapper = document.createElement( "span" );
				wrapper.id = "wrapper-" + jsonObject[ apprentice ].id;
				
				wrapper.appendChild( select );
				wrapper.appendChild( name );
				
				document.querySelector( "#apprentices" ).appendChild( wrapper );
			
			}
		
		} );

	} );

};

window.onload = startup;