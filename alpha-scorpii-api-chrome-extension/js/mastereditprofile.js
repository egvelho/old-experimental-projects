var startup, sendProfile;

sendProfile = function(){

	chrome.storage.local.get( null, function( result ){

		var profileSrc, profileJson, institutionsSrc, institutionsJson;

		profileSrc = "http://alphascorpii.pythonanywhere.com/setmasterprofile";
		profileJson = {
		
			"login": result.alphaScorpii_token,
			"id": result.alphaScorpii_id,
			"name": document.querySelector( "#name" ).value,
			"password": document.querySelector( "#password" ).value,
			"degree": document.querySelector( "#degree" ).value,
			"institution": document.querySelector( "#institution" ).value,
			"confirm-password": document.querySelector( "#confirm-password" ).value
		
		};
		
		profileJson = JSON.stringify( profileJson );

		getJson( profileSrc, profileJson, function( jsonObject ){
		
			switch( jsonObject[ "code" ] ){
		
				case 10: createNotification( "Alterar cadastro", "Cadastro alterado com sucesso.", function(){} ); break;
				case 9: createNotification( "Alterar cadastro", "Existem campos vazios. Preencha-os e tente novamente.", function(){} ); break;
				case 8: createNotification( "Criar conta", "As senhas não são iguais. Corrija-as e tente novamente.", function(){} );
		
			}
		
		} );

	} );
	
};

startup = function(){

	verifySession();

	chrome.storage.local.get( null, function( result ){
	
		var src, json;
		
		src = "http://alphascorpii.pythonanywhere.com/getmasterprofile";
		json = {
		
			"login": result.alphaScorpii_token,
			"id": result.alphaScorpii_id
		
		};
		
		json = JSON.stringify( json );
		
		getJson( src, json, function( jsonObject ){
		
			if( jsonObject[ "code" ] == 0 ){
			
				createNotification( "Alterar cadastro", "Houve um erro ao carregar seu cadastro. Você está sendo redirecionado para a página de login.", logout );
			
			} else if( jsonObject[ "code" ] == 1 ){
		
				var masterInstitution;
				
				masterInstitution = document.createElement( "option" );
				masterInstitution.default = true;
				masterInstitution.disabled = true;
				masterInstitution.innerHTML = jsonObject[ "institution" ];
				masterInstitution.value = jsonObject[ "institution" ];

				document.querySelector( "#name" ).value = jsonObject[ "name" ];
				document.querySelector( "#email" ).value = jsonObject[ "email" ];
				document.querySelector( "#degree" ).value = jsonObject[ "degree" ];
				document.querySelector( "#institution" ).appendChild( masterInstitution );
			
			}
		
		} );

		institutionsSrc = "http://alphascorpii.pythonanywhere.com/getinstitutions";

		getJson( institutionsSrc, "", function( jsonObject ){
		
			var institutions;
			
			institutions = document.querySelector( "#institution" );
			
			for( var institution in jsonObject ){
			
				var innerInstitution;
				
				innerInstitution = document.createElement( "option" );
				innerInstitution.value = jsonObject[ institution ].name;
				innerInstitution.innerHTML = jsonObject[ institution ].name;
				
				institutions.appendChild( innerInstitution );
			
			}
		
		} );
		
		document.querySelector( "#submit" ).onclick = sendProfile;

	} );

};

window.onload = startup;
