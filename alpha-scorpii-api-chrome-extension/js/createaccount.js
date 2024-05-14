var startup, createApprenticeAccount, createMasterAccount;

createApprenticeAccount = function(){

	var createApprentice, apprenticeJson;
	
	createApprentice = "http://alphascorpii.pythonanywhere.com/createapprentice";
	apprenticeJson   = JSON.stringify( parseFormToJson( "#create-apprentice-account" ) );
		
	getJson( createApprentice, apprenticeJson, function( jsonObject ){
	
		switch( jsonObject[ "code" ] ){
		
			case 10: createNotification( "Criar conta", "A sua conta de aprendiz foi criada com sucesso.", function(){} ); break;
			case 9: createNotification( "Criar conta", "Existem campos vazios. Preencha-os e tente novamente.", function(){} ); break;
			case 8: createNotification( "Criar conta", "As senhas não são iguais. Corrija-as e tente novamente.", function(){} ); break;
			case 7: createNotification( "Criar conta", "O email não está no formato correto. Corrija-o e tente novamente.", function(){} ); break;
			case 0: createNotification( "Criar conta", "Este email já está cadastrado. Insira um novo email", function(){} );
		
		}

	} );

};

createMasterAccount = function(){

	var createMaster, masterJson;
	
	createMaster = "http://alphascorpii.pythonanywhere.com/createmaster";
	masterJson   = JSON.stringify( parseFormToJson( "#create-master-account" ) );
	
	getJson( createMaster, masterJson, function( jsonObject ){
	
		switch( jsonObject[ "code" ] ){
		
			case 10: createNotification( "Criar conta", "Sua solicitação de criação de conta de mestre foi enviada com sucesso. Você será informado por email assim que sua solicitação for aceita.", function(){} ); break;
			case 9: createNotification( "Criar conta", "Existem campos vazios. Preencha-os e tente novamente.", function(){} ); break;
			case 8: createNotification( "Criar conta", "As senhas não são iguais. Corrija-as e tente novamente.", function(){} ); break;
			case 7: createNotification( "Criar conta", "O email não está no formato correto. Corrija-o e tente novamente.", function(){} ); break;
			case 0: createNotification( "Criar conta", "Este email já está cadastrado. Insira um novo email", function(){} );
		
		}
	
	} );

};

startup = function(){

	var src;
	
	src = "http://alphascorpii.pythonanywhere.com/getinstitutions";

	getJson( src, "", function( jsonObject ){
	
		var masterInstitution;
		
		masterInstitution = document.querySelector( "#master-institution" );
		
		for( var institution in jsonObject ){
		
			var innerInstitution;
			
			innerInstitution = document.createElement( "option" );
			innerInstitution.value = jsonObject[ institution ].name;
			innerInstitution.innerHTML = jsonObject[ institution ].name;
			
			masterInstitution.appendChild( innerInstitution );
		
		}
	
	} );
	
	document.querySelector( "#apprentice-submit" ).onclick = createApprenticeAccount;
	document.querySelector( "#master-submit" ).onclick = createMasterAccount;
	document.querySelector( "#back-button" ).onclick = function(){ changeWindow( "login.html" ); };

};

window.onload = startup;