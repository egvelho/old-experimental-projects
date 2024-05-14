var startup;

startup = function(){

	verifySession();
	
	document.querySelector( "#search-bar" ).onkeyup = function(){
	
		var searchTerms, toSearch;
		
		searchTerms = document.querySelector( "#search-bar" ).value;
		toSearch = document.querySelectorAll( "#questions > label" );
	
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
		
		src = "http://alphascorpii.pythonanywhere.com/getmasterapprentices";
		json = {
		
			"login": result.alphaScorpii_token,
			"id": result.alphaScorpii_id
		
		};
		json = JSON.stringify( json );

		getJson( src, json, function( jsonObject ){
		
			for( var apprentice in jsonObject ){
			
				var wrapper;
				
				wrapper = document.createElement( "span" );
				wrapper.id = jsonObject[ apprentice ].id;
				wrapper.innerHTML = jsonObject[ apprentice ].name + " - " + jsonObject[ apprentice ].email
				wrapper.onclick = function(){
				
					apprenticeId = document.querySelector( "#apprentice-id" );
					apprenticeId.value = this.id;
				
					document.querySelector( "#questions" ).innerHTML = "";
				
					var src, json;
		
					src = "http://alphascorpii.pythonanywhere.com/getallquestions";
					json = {
						
						"login": result.alphaScorpii_token,
						"id": result.alphaScorpii_id,
						"apprentice-id": this.id
						
					};
					json = JSON.stringify( json );
						
					getJson( src, json, function( jsonObject ){
						
						for( var item in jsonObject ){
						
							var id, title, area, a, b, c, d, e, answer, li, select;
							
							select = document.createElement( "input" );
							select.type = "checkbox";
							select.checked = jsonObject[ item ].apprentice;
							select.id = jsonObject[ item ].id + "-checkbox";
							select.onchange = function(){
							
								var questions, json, src;
								
								src = "http://alphascorpii.pythonanywhere.com/setplaylist";
								questions = document.querySelectorAll( "#questions input[ type='checkbox' ]:checked" );
								json = {
								
									"login": result.alphaScorpii_token,
									"id": result.alphaScorpii_id,
									"apprentice-id": document.querySelector( "#apprentice-id" ).value,
									"questions": {}
								
								};
								
								for( var question in questions ){
								
									json[ "questions" ][ "question-" + questions[ question ].id ] = questions[ question ].id;
								
								}
								
								json = JSON.stringify( json );
								
								getJson( src, json, function( jsonObject ){
								
									if( jsonObject[ "code" ] == 10 ){ return null } else if( jsonObject[ "code" ] == 0 ){
									
										createNotification( "Definir playlist", "Não foi possível executar esta ação. Você será redirecionado para a página de login.", function(){ changeWindow( "login.html" ) } );
									
									}
								
								} );
							
							};

							title = jsonObject[ item ].title;
							switch( jsonObject[ item ].area ){
				
								case 1: area = "Matemática e suas tecnologias"; break;
								case 2: area = "Ciências e suas tecnologias"; break;
								case 3: area = "Linguagens e suas tecnologias"
				
							}
							id = jsonObject[ item ].id;
							a = jsonObject[ item ].a;
							b = jsonObject[ item ].b;
							c = jsonObject[ item ].c;
							d = jsonObject[ item ].d;
							e = jsonObject[ item ].e;
							answer = jsonObject[ item ].answer;
							li = document.createElement( "label" );
							li.htmlFor = jsonObject[ item ].id + "-checkbox";
							li.id = id;
							li.innerHTML = "<strong>Título:</strong> " + title + "<br> <strong>Área do conhecimento:</strong> " + area + "<br> <strong>A)</strong> " + a + "<br> <strong>B)</strong> " + b + "<br> <strong>C)</strong> " + c + "<br> <strong>D)</strong> " + d + "<br> <strong>E)</strong> " + e + "<br> <strong>Alternativa Correta:</strong> " + answer;
							document.querySelector( "#questions" ).appendChild( select );
							document.querySelector( "#questions" ).appendChild( li );
						
						}
						
					} );
				
				};
				
				document.querySelector( "#apprentices" ).appendChild( wrapper );
			
			}
		
		} );
	
	} );

};

window.onload = startup;
