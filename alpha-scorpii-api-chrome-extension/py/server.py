#!/usr/bin/python
# -*- encoding: utf-8 -*-

import sys
import atexit
import cherrypy
import simplejson
import mysql.connector
import hashlib
import re
import random
import smtplib

sys.stdout = sys.stderr
cherrypy.config.update( { "environment": "embedded" } )

if cherrypy.__version__.startswith( "3.0" ) and cherrypy.engine.state == 0:
    cherrypy.engine.start( blocking = False )
    atexit.register( cherrypy.engine.stop )

class ExecuteQuery:

    connection = None
    cursor = None

    def __init__( self, query, input ):
        self.connection = mysql.connector.connect( user = "alphascorpii", password = "INSERT_PASSWORD", host = "alphascorpii.mysql.pythonanywhere-services.com", database = "alphascorpii$default" )
        self.cursor = self.connection.cursor()
        self.cursor.execute( query, input )

    def getData( self ):
        return self.cursor.fetchall()

    def closeConnection( self ):
        self.cursor.close()
        self.connection.commit()
        self.connection.close()

class Root( object ):

    session = {}

    @cherrypy.expose
    def index( self ):
        return """

            <!DOCTYPE html>
            <html lang="pt-br">
                <head>
                    <meta charset="utf-8">
                    <style>

                        ul{

                            list-style: none;
                            cursor: pointer;

                        }

                        li{

                            margin-bottom: 16px;

                        }

                    </style>
                    <script>

                        var startup, getJson;

                        getJson = function( src, json, callback ){

                            var request;

                            request = new XMLHttpRequest();

                            request.onreadystatechange = function(){ if( request.readyState == 4 && request.status == 200 ) callback( JSON.parse( request.responseText ) ) };
                            request.open( "POST", src, true );
                            request.setRequestHeader( "Content-type", "application/json" );
                            request.send( json );

                        };

                        startup = function(){

                            getJson( "newmasters", "", function( jsonObject ){

                                for( item in jsonObject ){

                                    var id, name, email, degree, institution, li;

                                    id = jsonObject[ item ].id;
                                    name = jsonObject[ item ].name;
                                    email = jsonObject[ item ].email;
                                    degree = jsonObject[ item ].degree;
                                    institution = jsonObject[ item ].institution;

                                    li = document.createElement( "li" );
                                    li.id = id;
                                    li.onclick = function(){ getJson( "acceptmaster", JSON.stringify( { id: parseInt( this.id ) } ), function( jsonObject ){

                                        alert( "Aprovado!" );
                                        location.reload();

                                    } ) };
                                    li.innerHTML = "<strong>Nome:</strong> " + name + "<br> <strong>Email:</strong> " + email + "<br> <strong>Título:</strong> " + degree + "<br> <strong>Instituição a qual pertence:</strong> " + institution;
                                    document.querySelector( "#masters ul" ).appendChild( li );

                                }

                            } );

                            getJson( "newquestions", "", function( jsonObject ){

                                for( var item in jsonObject ){

                                    var id, title, area, a, b, c, d, e, answer, li;

                                    title = jsonObject[ item ].title;
                                    area = jsonObject[ item ].area;
                                    id = jsonObject[ item ].id;
                                    a = jsonObject[ item ].a;
                                    b = jsonObject[ item ].b;
                                    c = jsonObject[ item ].c;
                                    d = jsonObject[ item ].d;
                                    e = jsonObject[ item ].e;
                                    answer = jsonObject[ item ].answer;
                                    li = document.createElement( "li" );
                                    li.id = id;
                                    li.onclick = function(){ getJson( "acceptquestion", JSON.stringify( { id: parseInt( this.id ) } ), function( jsonObject ){

                                        alert( "Aprovado!" );
                                        location.reload();

                                    } ) };
                                    li.innerHTML = "<strong>Título:</strong> " + title + "<br> <strong>Área do conhecimento:</strong> " + area + "<br> <strong>A)</strong> " + a + "<br> <strong>B)</strong> " + b + "<br> <strong>C)</strong> " + c + "<br> <strong>D)</strong> " + d + "<br> <strong>E)</strong> " + e + "<br> <strong>Alternativa Correta:</strong> " + answer;
                                    document.querySelector( "#questions ul" ).appendChild( li );

                                }

                            } );

                        };

                        window.onload = startup;

                    </script>
                </head>
                <body>
                    <header>
                        <h1>Página do administrador AlphaScorpii</h1>
                    </header>
                    <section id="masters">
                        <h2>Mestres a serem aprovados</h2>
                        <ul></ul>
                    </section>
                    <section id="questions">
                        <h2>Questões a serem aprovadas</h2>
                        <ul></ul>
                    </section>
                </body>
            </html>

        """;

    @cherrypy.tools.accept( media = "application/json" )
    def newmasters( self ):
        connection = ExecuteQuery( "SELECT ID, NAME, EMAIL, DEGREE, INSTITUTION FROM USER_MASTER WHERE ACCEPTED = false", () )
        data = connection.getData()
        connection.closeConnection()
        json = []
        for item in data:
            inner = {}
            inner[ "id" ] = item[ 0 ]
            inner[ "name" ] = item[ 1 ]
            inner[ "email" ] = item[ 2 ]
            inner[ "degree" ] = item[ 3 ]
            inner[ "institution" ] = item[ 4 ]
            json.append( inner )
        return simplejson.dumps( json )

    @cherrypy.tools.accept( media = "application/json" )
    def newquestions( self ):
        connection = ExecuteQuery( "SELECT ID, A, B, C, D, E, CORRECT_ANSWER, TITLE, AREA FROM QUESTION WHERE ACCEPTED = false", () )
        data = connection.getData()
        connection.closeConnection()
        json = []
        for item in data:
            inner = {}
            inner[ "id" ] = item[ 0 ]
            inner[ "a" ] = item[ 1 ]
            inner[ "b" ] = item[ 2 ]
            inner[ "c" ] = item[ 3 ]
            inner[ "d" ] = item[ 4 ]
            inner[ "e" ] = item[ 5 ]
            inner[ "answer" ] = item[ 6 ]
            inner[ "title" ] = item[ 7 ]
            switcher = {
                1: "Matemática e suas tecnologias",
                2: "Ciências e suas tecnologias",
                3: "Linguagens e suas tecnologias"
            }
            inner[ "area" ] = switcher.get( item[ 8 ], "error" )
            json.append( inner )
        return simplejson.dumps( json )

    @cherrypy.tools.accept( media = "application/json" )
    def acceptmaster( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        connection = ExecuteQuery( "UPDATE USER_MASTER SET ACCEPTED = true WHERE ID = %s AND ID = %s", ( json[ "id" ], json[ "id" ] ) )
        connection.closeConnection()
        return simplejson.dumps( { "ok": "ok" } )

    @cherrypy.tools.accept( media = "application/json" )
    def acceptquestion( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        connection = ExecuteQuery( "UPDATE QUESTION SET ACCEPTED = true WHERE ID = %s AND ID = %s", ( json[ "id" ], json[ "id" ] ) )
        connection.closeConnection()
        return simplejson.dumps( { "ok": "ok" } )

    @cherrypy.tools.accept( media = "application/json" )
    def verifysession( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        if json[ "login" ] in Root.session:
            if Root.session[ json[ "login" ] ]:
                return simplejson.dumps( { "session": True } )
        else:
            return simplejson.dumps( { "session": False } )

    def innerverifysession( self, json ):
        if json[ "login" ] in Root.session:
            if Root.session[ json[ "login" ] ]:
                return True
        else:
            return False

    @cherrypy.tools.accept( media = "application/json" )
    def login( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        email = json[ "email" ]
        password = json[ "password" ]
        connection = ExecuteQuery( "SELECT ID FROM USER_APPRENTICE WHERE EMAIL=%s AND PASSWORD=MD5( %s )", ( email, password ) )
        data = connection.getData()
        connection.closeConnection()
        if len( data ) == 1:
            id = data[ 0 ][ 0 ]
            hashObject = hashlib.md5( ( email + password ).encode( "utf-8" ) ).hexdigest()
            Root.session[ hashObject ] = True
            return simplejson.dumps( { "login": hashObject, "user": "apprentice", "id": id } )
        else:
            connection = ExecuteQuery( "SELECT ID FROM USER_MASTER WHERE EMAIL=%s AND PASSWORD=MD5( %s ) AND ACCEPTED=true", ( email, password ) )
            data = connection.getData()
            connection.closeConnection()
            if len( data ) == 1:
                hashObject = hashlib.md5( ( email + password ).encode( "utf-8" ) ).hexdigest()
                Root.session[ hashObject ] = True
                return simplejson.dumps( { "login": hashObject, "user": "master", "id": data[ 0 ][ 0 ] } )
            else:
                return simplejson.dumps( { "login": False } )

    @cherrypy.tools.accept( media = "application/json" )
    def logout( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        if json[ "login" ] in Root.session:
            if Root.session[ json[ "login" ] ]:
                Root.session[ json[ "login" ] ] = False
                return simplejson.dumps( { "session": False } )
            else:
                return simplejson.dumps( { "session": True } )
        else:
            return simplejson.dumps( { "session": True } )

    @cherrypy.tools.accept( media = "application/json" )
    def createapprentice( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        email = json[ "apprentice-email" ];
        connection = ExecuteQuery( "SELECT EMAIL FROM USER_APPRENTICE WHERE EMAIL=%s AND EMAIL=%s", ( email, email ) )
        data = connection.getData()
        connection.closeConnection()
        if len( data ) > 0:
            return simplejson.dumps( { "code": 0 } )
        else:
            connection = ExecuteQuery( "SELECT EMAIL FROM USER_MASTER WHERE EMAIL=%s AND EMAIL=%s", ( email, email ) )
            data = connection.getData()
            connection.closeConnection()
            if len( data ) > 0:
                return simplejson.dumps( { "code": 0 } )
            else:
                code = 10
                for item in json:
                    if json[ item ] == "": code = 9
                if json[ "apprentice-password" ] != json[ "apprentice-confirm-password" ]: code = 8
                if not re.match( "[^@]+@[^@]+\.[^@]+", email ): code = 7
                if code == 10:
                    name = json[ "apprentice-name" ]
                    password = json[ "apprentice-password" ]
                    email = json[ "apprentice-email" ]
                    connection = ExecuteQuery( "INSERT INTO USER_APPRENTICE( NAME, PASSWORD, EMAIL, TIMEOUT ) VALUES( %s, MD5( %s ), %s, 10 )", ( name, password, email ) )
                    connection.closeConnection()
                    connection = ExecuteQuery( "INSERT INTO DISCIPLINE( APPRENTICE_ID, MATH_FOCUS, SCIENCE_FOCUS, LANGUAGE_FOCUS ) VALUES( ( SELECT ID FROM USER_APPRENTICE WHERE EMAIL = %s AND EMAIL = %s ),10 ,10 , 10 )", ( email, email ) )
                    connection.closeConnection()
                    connection = ExecuteQuery( "INSERT INTO STATUS( APPRENTICE_ID, MATH_CORRECT, SCIENCE_CORRECT, LANGUAGE_CORRECT, MATH_WRONG, SCIENCE_WRONG, LANGUAGE_WRONG ) VALUES( ( SELECT ID FROM USER_APPRENTICE WHERE EMAIL = %s AND EMAIL = %s ), 0, 0, 0, 0, 0, 0 )", ( email, email ) )
                    connection.closeConnection()
                return simplejson.dumps( { "code": code } )

    @cherrypy.tools.accept( media = "application/json" )
    def createmaster( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        email = json[ "master-email" ];
        connection = ExecuteQuery( "SELECT EMAIL FROM USER_APPRENTICE WHERE EMAIL=%s AND EMAIL=%s", ( email, email ) )
        data = connection.getData()
        connection.closeConnection()
        if len( data ) > 0:
            return simplejson.dumps( { "code": 0 } )
        else:
            connection = ExecuteQuery( "SELECT EMAIL FROM USER_MASTER WHERE EMAIL=%s AND EMAIL=%s", ( email, email ) )
            data = connection.getData()
            connection.closeConnection()
            if len( data ) > 0:
                return simplejson.dumps( { "code": 0 } )
            else:
                code = 10
                for item in json:
                    if json[ item ] == "": code = 9
                if json[ "master-password" ] != json[ "master-confirm-password" ]: code = 8
                if not re.match( "[^@]+@[^@]+\.[^@]+", email ): code = 7
                if code == 10:
                    name = json[ "master-name" ]
                    password = json[ "master-password" ]
                    email = json[ "master-email" ]
                    degree = json[ "master-degree" ]
                    institution = json[ "master-institution" ]
                    connection = ExecuteQuery( "INSERT INTO USER_MASTER( NAME, PASSWORD, EMAIL, DEGREE, INSTITUTION, ACCEPTED ) VALUES( %s, MD5( %s ), %s, %s, %s, false )", ( name, password, email, degree, institution ) )
                    connection.closeConnection()
                return simplejson.dumps( { "code": code } )

    @cherrypy.tools.accept( media = "application/json" )
    def getinstitutions( self ):
        connection = ExecuteQuery( "SELECT ID, NAME FROM INSTITUTIONS", () )
        data = connection.getData()
        json = []
        connection.closeConnection()
        for item in data:
            inner = {}
            inner[ "id" ] = item[ 0 ]
            inner[ "name" ] = item[ 1 ]
            json.append( inner )
        return simplejson.dumps( json )

    @cherrypy.tools.accept( media = "application/json" )
    def getapprenticeprofile( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        if self.innerverifysession( json ):
            connection = ExecuteQuery( "SELECT ID, NAME, EMAIL FROM USER_APPRENTICE WHERE ID = %s AND ID = %s", ( json[ "id" ], json[ "id" ] ) )
            data = connection.getData()
            connection.closeConnection()
            if len( data ) > 0:
                json = {}
                json[ "id" ] = data[ 0 ][ 0 ]
                json[ "name" ] = data[ 0 ][ 1 ]
                json[ "email" ] = data[ 0 ][ 2 ]
                json[ "code" ] = 1
                return simplejson.dumps( json )
            else:
                return simplejson.dumps( { "code": 0 } )
        else:
            return simplejson.dumps( { "code": 0 } )

    @cherrypy.tools.accept( media = "application/json" )
    def setapprenticeprofile( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        if self.innerverifysession( json ):
            code = 10
            for item in json:
                if json[ item ] == "": code = 9
            if json[ "password" ] != json[ "confirm-password" ]: code = 8
            if code == 10:
                name = json[ "name" ]
                password = json[ "password" ]
                id = json[ "id" ]
                connection = ExecuteQuery( "UPDATE USER_APPRENTICE SET NAME = %s, PASSWORD = MD5( %s ) WHERE ID = %s", ( name, password, id ) )
                connection.closeConnection()
            return simplejson.dumps( { "code": code } )
        else:
            return simplejson.dumps( { "code": 0 } )

    @cherrypy.tools.accept( media = "application/json" )
    def getmasterprofile( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        if self.innerverifysession( json ):
            connection = ExecuteQuery( "SELECT ID, NAME, EMAIL, DEGREE, INSTITUTION FROM USER_MASTER WHERE ID = %s AND ID = %s", ( json[ "id" ], json[ "id" ] ) )
            data = connection.getData()
            connection.closeConnection()
            if len( data ) > 0:
                json = {}
                json[ "id" ] = data[ 0 ][ 0 ]
                json[ "name" ] = data[ 0 ][ 1 ]
                json[ "email" ] = data[ 0 ][ 2 ]
                json[ "degree" ] = data[ 0 ][ 3 ]
                json[ "institution" ] = data[ 0 ][ 4 ]
                json[ "code" ] = 1
                return simplejson.dumps( json )
            else:
                return simplejson.dumps( { "code": 2 } )
        else:
            return simplejson.dumps( { "code": 0 } )

    @cherrypy.tools.accept( media = "application/json" )
    def setmasterprofile( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        if self.innerverifysession( json ):
            code = 10
            for item in json:
                if json[ item ] == "": code = 9
            if json[ "password" ] != json[ "confirm-password" ]: code = 8
            if code == 10:
                name = json[ "name" ]
                password = json[ "password" ]
                degree = json[ "degree" ]
                institution = json[ "institution" ]
                id = json[ "id" ]
                connection = ExecuteQuery( "UPDATE USER_MASTER SET NAME = %s, PASSWORD = MD5( %s ), DEGREE = %s, INSTITUTION = %s WHERE ID = %s", ( name, password, degree, institution, id ) )
                connection.closeConnection()
            return simplejson.dumps( { "code": code } )
        else:
            return simplejson.dumps( { "code": 0 } )

    @cherrypy.tools.accept( media = "application/json" )
    def addquestion( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        if self.innerverifysession( json ):
            code = 10
            for item in json:
                if json[ item ] == "": code = 9
            switcher = {
                "A": "ok",
                "B": "ok",
                "C": "ok",
                "D": "ok",
                "E": "ok"
            }
            if switcher.get( json[ "answer" ], "error" ) != "ok":
                code = 8
            switcher = {
                "1": "ok",
                "2": "ok",
                "3": "ok"
            }
            if switcher.get( json[ "area" ], "error" ) != "ok":
                code = 7
            if code == 10:
                title = json[ "title" ]
                a = json[ "a" ]
                b = json[ "b" ]
                c = json[ "c" ]
                d = json[ "d" ]
                e = json[ "e" ]
                answer = json[ "answer" ]
                area = json[ "area" ]
                connection = ExecuteQuery( "INSERT INTO QUESTION( TITLE, A, B, C, D, E, CORRECT_ANSWER, AREA, ACCEPTED )VALUES( %s, %s, %s, %s, %s, %s, %s, %s, false )", ( title, a, b, c, d, e, answer, area ) )
                connection.closeConnection()
            return simplejson.dumps( { "code": code } )

        else:
            return simplejson.dumps( { "code": 0 } )

    @cherrypy.tools.accept( media = "application/json" )
    def getdisciplinefocus( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        if self.innerverifysession( json ):
            connection = ExecuteQuery( "SELECT MATH_FOCUS, SCIENCE_FOCUS, LANGUAGE_FOCUS FROM DISCIPLINE WHERE APPRENTICE_ID = %s AND APPRENTICE_ID = %s", ( json[ "id" ], json[ "id" ] ) );
            data = connection.getData()
            connection.closeConnection()
            json = {}
            json[ "code" ] = 10
            json[ "math" ] = data[ 0 ][ 0 ]
            json[ "science" ] = data[ 0 ][ 1 ]
            json[ "language" ] = data[ 0 ][ 2 ]
            return simplejson.dumps( json )
        else:
            return simplejson.dumps( { "code": 0 } )

    @cherrypy.tools.accept( media = "application/json" )
    def setdisciplinefocus( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        if self.innerverifysession( json ):
            code = 10
            switcher = {

                0: "ok",
                1: "ok",
                2: "ok",
                3: "ok",
                4: "ok",
                5: "ok",
                6: "ok",
                7: "ok",
                8: "ok",
                9: "ok",
                10: "ok"

            }
            if switcher.get( json[ "math" ], "error" ) != "ok":
                code = 9
            if switcher.get( json[ "science" ], "error" ) != "ok":
                code = 9
            if switcher.get( json[ "language" ], "error" ) != "ok":
                code = 9
            if code == 10:
                math = json[ "math" ]
                science = json[ "science" ]
                language = json[ "language" ]
                id = json[ "id" ]
                connection = ExecuteQuery( "UPDATE DISCIPLINE SET MATH_FOCUS = %s, SCIENCE_FOCUS = %s, LANGUAGE_FOCUS = %s WHERE APPRENTICE_ID = %s", ( math, science, language, id ) )
                connection.closeConnection()
            return simplejson.dumps( { "code": code } )
        else:
            return simplejson.dumps( { "code": 0 } )

    @cherrypy.tools.accept( media = "application/json" )
    def getquestions( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        if self.innerverifysession( json ):
            connection = ExecuteQuery( "SELECT ID, TITLE, AREA FROM QUESTION WHERE ACCEPTED = true AND ID NOT IN ( SELECT QUESTION_ID FROM ANSWERED_QUESTION WHERE APPRENTICE_ID = %s AND APPRENTICE_ID = %s ) ORDER BY ID DESC LIMIT 10", ( json[ "id" ], json[ "id" ] ) )
            data = connection.getData()
            connection.closeConnection()
            json = []
            for item in data:
                inner = {}
                inner[ "id" ] = item[ 0 ]
                inner[ "title" ] = item[ 1 ]
                inner[ "area" ] = item[ 2 ]
                json.append( inner )
            return simplejson.dumps( json )

    @cherrypy.tools.accept( media = "application/json" )
    def getquestion( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        if self.innerverifysession( json ):
            questionId = json[ "question-id" ]
            connection = ExecuteQuery( "SELECT ID, TITLE, AREA, A, B, C, D, E FROM QUESTION WHERE ID = %s AND ID = %s AND ACCEPTED = true", ( questionId, questionId ) )
            data = connection.getData()
            connection.closeConnection()
            json = {}
            json[ "code" ] = 10
            json[ "id" ] = data[ 0 ][ 0 ]
            json[ "title" ] = data[ 0 ][ 1 ]
            json[ "area" ] = data[ 0 ][ 2 ]
            json[ "a" ] = data[ 0 ][ 3 ]
            json[ "b" ] = data[ 0 ][ 4 ]
            json[ "c" ] = data[ 0 ][ 5 ]
            json[ "d" ] = data[ 0 ][ 6 ]
            json[ "e" ] = data[ 0 ][ 7 ]
            return simplejson.dumps( json )
        else:
            return simplejson.dumps( { "code": 0 } )

    @cherrypy.tools.accept( media = "application/json" )
    def getanswer( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        if self.innerverifysession( json ):
            connection = ExecuteQuery( "SELECT CORRECT_ANSWER FROM QUESTION WHERE ID = %s AND ID = %s", ( json[ "question-id" ], json[ "question-id" ] ) )
            data = connection.getData()
            connection.closeConnection()
            sentAnswer = json[ "answer" ]
            correctAnswer = data[ 0 ][ 0 ]
            correct = False
            code = 10
            if sentAnswer == correctAnswer:
                correct = True
                switcher = {

                    1: "MATH_CORRECT",
                    2: "SCIENCE_CORRECT",
                    3: "LANGUAGE_CORRECT"

                }
                area = switcher.get( json[ "area" ], "error" )
                id = json[ "id" ]
                if area != "error":
                    connection = ExecuteQuery( "UPDATE STATUS SET " + area + " = " + area + "+1 WHERE APPRENTICE_ID = %s AND APPRENTICE_ID = %s", ( id, id ) )
                    connection.closeConnection()
                    connection = ExecuteQuery( "INSERT INTO ANSWERED_QUESTION( APPRENTICE_ID, QUESTION_ID ) VALUES( %s, %s )", ( json[ "id" ], json[ "question-id" ] ) )
                    connection.closeConnection()
                else:
                    code = 9
            else:
                switcher = {

                    1: "MATH_WRONG",
                    2: "SCIENCE_WRONG",
                    3: "LANGUAGE_WRONG"

                }
                area = switcher.get( json[ "area" ], "error" )
                id = json[ "id" ]
                if area != "error":
                    connection = ExecuteQuery( "UPDATE STATUS SET " + area + " = " + area + "+1 WHERE APPRENTICE_ID = %s AND APPRENTICE_ID = %s", ( id, id ) )
                    connection.closeConnection()
                else:
                    code = 9
            return simplejson.dumps( { "code": code, "answer": correct } )
        else:
            return simplejson.dumps( { "code": 0 } )

    @cherrypy.tools.accept( media = "application/json" )
    def getstatus( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        if self.innerverifysession( json ):
            connection = ExecuteQuery( "SELECT MATH_CORRECT, SCIENCE_CORRECT, LANGUAGE_CORRECT, MATH_WRONG, SCIENCE_WRONG, LANGUAGE_WRONG FROM STATUS WHERE APPRENTICE_ID = %s AND APPRENTICE_ID = %s", ( json[ "id" ], json[ "id" ] ) )
            data = connection.getData()
            connection.closeConnection()
            json = {}
            json[ "code" ] = 10
            json[ "math-correct" ] = data[ 0 ][ 0 ]
            json[ "science-correct" ] = data[ 0 ][ 1 ]
            json[ "language-correct" ] = data[ 0 ][ 2 ]
            json[ "math-wrong" ] = data[ 0 ][ 3 ]
            json[ "science-wrong" ] = data[ 0 ][ 4 ]
            json[ "language-wrong" ] = data[ 0 ][ 5 ]
            return simplejson.dumps( json )
        else:
            return simplejson.dumps( { "code": 0 } )

    @cherrypy.tools.accept( media = "application/json" )
    def getrandomquestion( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        if self.innerverifysession( json ):
            connection = ExecuteQuery( "SELECT MATH_FOCUS, SCIENCE_FOCUS, LANGUAGE_FOCUS FROM DISCIPLINE WHERE APPRENTICE_ID = %s AND APPRENTICE_ID = %s", ( json[ "id" ], json[ "id" ] ) )
            data = connection.getData()
            connection.closeConnection()
            mathFocus = data[ 0 ][ 0 ] * random.random()
            scienceFocus = data[ 0 ][ 1 ] * random.random()
            languageFocus = data[ 0 ][ 2 ] * random.random()
            focus =  {
                1: mathFocus,
                2: scienceFocus,
                3: languageFocus
            }
            focus = max( focus, key = focus.get )
            connection = ExecuteQuery( "SELECT ID, TITLE, AREA, A, B, C, D, E FROM QUESTION WHERE AREA = %s AND AREA = %s AND ACCEPTED = true ORDER BY RAND() LIMIT 1", ( focus, focus ) )
            data = connection.getData()
            connection.closeConnection()
            json = {}
            json[ "code" ] = 10
            json[ "id" ] = data[ 0 ][ 0 ]
            json[ "title" ] = data[ 0 ][ 1 ]
            json[ "area" ] = data[ 0 ][ 2 ]
            json[ "a" ] = data[ 0 ][ 3 ]
            json[ "b" ] = data[ 0 ][ 4 ]
            json[ "c" ] = data[ 0 ][ 5 ]
            json[ "d" ] = data[ 0 ][ 6 ]
            json[ "e" ] = data[ 0 ][ 7 ]
            return simplejson.dumps( json );
        else:
            return simplejson.dumps( { "code": 0 } )

    @cherrypy.tools.accept( media = "application/json" )
    def gettimeout( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        if self.innerverifysession( json ):
            connection = ExecuteQuery( "SELECT TIMEOUT FROM USER_APPRENTICE WHERE ID = %s AND ID = %s", ( json[ "id" ], json[ "id" ] ) )
            data = connection.getData()
            connection.closeConnection()
            json = {}
            json[ "code" ] = 10
            json[ "timeout" ] = data[ 0 ][ 0 ]
            return simplejson.dumps( json )
        else:
            return simplejson.dumps( { "code": 0 } )

    @cherrypy.tools.accept( media = "application/json" )
    def settimeout( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        if self.innerverifysession( json ):
            connection = ExecuteQuery( "UPDATE USER_APPRENTICE SET TIMEOUT = %s WHERE ID = %s", ( json[ "timeout" ], json[ "id" ] ) )
            connection.closeConnection()
            return simplejson.dumps( { "code": 10 } )
        else:
            return simplejson.dumps( { "code": 0 } )

    @cherrypy.tools.accept( media = "application/json" )
    def forgetpassword( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        connection = ExecuteQuery( "SELECT ID FROM USER_APPRENTICE WHERE NAME = %s AND EMAIL = %s", ( json[ "name" ], json[ "email" ] ) )
        data = connection.getData()
        connection.closeConnection()
        if len( data ) > 0:
            newPassword = hashlib.md5( ( ( json[ "name" ] + json[ "email" ] ) + str( random.random() * 1000 ) ).encode( "utf-8" ) ).hexdigest()
            newPassword = str( newPassword.encode( 'utf-8' ) )
            newPassword = newPassword.partition( "'" )[ -1 ].rpartition( "'" )[ 0 ]
            server = smtplib.SMTP( 'smtp.gmail.com', 587 )
            server.starttls()
            server.login( "alphascorpiipythonanywhere@gmail.com", "INSERT_PASSWORD" )
            SUBJECT = "AlphaScorpii - Nova senha"
            TEXT = "Nova senha: " + newPassword
            message = 'Subject: %s\n\n%s' % ( SUBJECT, TEXT )
            message = message.encode( "utf-8" )
            server.sendmail( "alphascorpiipythonanywhere@gmail.com", json[ "email" ], message )
            server.quit()
            connection = ExecuteQuery( "UPDATE USER_APPRENTICE SET PASSWORD = MD5( %s ) WHERE EMAIL = %s", ( newPassword, json[ "email" ] ) )
            connection.closeConnection()
            return simplejson.dumps( { "code": 10 } )
        else:
            connection = ExecuteQuery( "SELECT ID FROM USER_MASTER WHERE NAME = %s AND EMAIL = %s", ( json[ "name" ], json[ "email" ] ) )
            data = connection.getData()
            connection.closeConnection()
            if len( data ) > 0:
                newPassword = hashlib.md5( ( ( json[ "name" ] + json[ "email" ] ) + str( random.random() * 1000 ) ).encode( "utf-8" ) ).hexdigest()
                newPassword = str( newPassword.encode( 'utf-8' ) )
                newPassword = newPassword.partition( "'" )[ -1 ].rpartition( "'" )[ 0 ]
                server = smtplib.SMTP( 'smtp.gmail.com', 587 )
                server.starttls()
                server.login( "alphascorpiipythonanywhere@gmail.com", "INSERT_PASSWORD" )
                SUBJECT = "AlphaScorpii - Nova senha"
                TEXT = "Nova senha: " + newPassword
                message = 'Subject: %s\n\n%s' % ( SUBJECT, TEXT )
                message = message.encode( "utf-8" )
                server.sendmail( "alphascorpiipythonanywhere@gmail.com", json[ "email" ], message )
                server.quit()
                connection = ExecuteQuery( "UPDATE USER_MASTER SET PASSWORD = MD5( %s ) WHERE EMAIL = %s", ( newPassword, json[ "email" ] ) )
                connection.closeConnection()
                return simplejson.dumps( { "code": 10 } )
            else:
                return simplejson.dumps( { "code": 0 } )

    @cherrypy.tools.accept( media = "application/json" )
    def getapprentices( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        if self.innerverifysession( json ):
            connection = ExecuteQuery( "SELECT ID, NAME, EMAIL FROM USER_APPRENTICE", () )
            data = connection.getData()
            connection.closeConnection()
            id = json[ "id" ]
            json = []
            for item in data:
                inner = {}
                inner[ "id" ] = item[ 0 ]
                inner[ "name" ] = item[ 1 ]
                inner[ "email" ] = item[ 2 ]
                innerConnection = ExecuteQuery( "SELECT ID FROM MASTER_APPRENTICE WHERE APPRENTICE_ID = %s AND MASTER_ID = %s", ( item[ 0 ], id ) )
                innerData = innerConnection.getData()
                innerConnection.closeConnection()
                if len( innerData ) > 0:
                    inner[ "apprentice" ] = True
                else:
                    inner[ "apprentice" ] = False
                json.append( inner )
            print( json )
            return simplejson.dumps( json )

    @cherrypy.tools.accept( media = "application/json" )
    def addapprentice( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        if self.innerverifysession( json ):
            connection = ExecuteQuery( "INSERT INTO MASTER_APPRENTICE( APPRENTICE_ID, MASTER_ID ) VALUES( %s, %s )", ( json[ "apprentice-id" ], json[ "id" ] ) )
            connection.closeConnection()
            return simplejson.dumps( { "code": 10 } )
        else:
            return simplejson.dumps( { "code": 0 } )

    @cherrypy.tools.accept( media = "application/json" )
    def delapprentice( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        if self.innerverifysession( json ):
            connection = ExecuteQuery( "DELETE FROM MASTER_APPRENTICE WHERE APPRENTICE_ID = %s AND MASTER_ID = %s", ( json[ "apprentice-id" ], json[ "id" ] ) )
            connection.closeConnection()
            return simplejson.dumps( { "code": 10 } )
        else:
            return simplejson.dumps( { "code": 0 } )

    @cherrypy.tools.accept( media = "application/json" )
    def setplaylist( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        if self.innerverifysession( json ):
            connection = ExecuteQuery( "DELETE FROM APPRENTICE_PLAYLIST WHERE MASTER_ID = %s AND APPRENTICE_ID = %s", ( json[ "id" ], json[ "apprentice-id" ] ) )
            connection.closeConnection()
            questions = json[ "questions" ]
            for question in questions:
                innerConnection = ExecuteQuery( "INSERT INTO APPRENTICE_PLAYLIST( APPRENTICE_ID, MASTER_ID, QUESTION_ID ) VALUES( %s, %s, %s )", ( json[ "apprentice-id" ], json[ "id" ], questions[ question ] ) )
                innerConnection.closeConnection()
            return simplejson.dumps( { "code": 10 } )
        else:
            return simplejson.dumps( { "code": 0 } )

    @cherrypy.tools.accept( media = "application/json" )
    def getmasterapprentices( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        if self.innerverifysession( json ):
            connection = ExecuteQuery( "SELECT ID, NAME, EMAIL FROM USER_APPRENTICE WHERE USER_APPRENTICE.ID IN ( SELECT APPRENTICE_ID FROM MASTER_APPRENTICE WHERE MASTER_ID = %s AND MASTER_ID = %s )", ( json[ "id" ], json[ "id" ] ) )
            data = connection.getData()
            connection.closeConnection()
            json = []
            for item in data:
                inner = {}
                inner[ "id" ] = item[ 0 ]
                inner[ "name" ] = item[ 1 ]
                inner[ "email" ] = item[ 2 ]
                json.append( inner )
            return simplejson.dumps( json )

    @cherrypy.tools.accept( media = "application/json" )
    def getallquestions( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        if self.innerverifysession( json ):
            connection = ExecuteQuery( "SELECT ID, TITLE, AREA, A, B, C, D, E, CORRECT_ANSWER FROM QUESTION WHERE ACCEPTED = true", () )
            data = connection.getData()
            connection.closeConnection()
            apprentice = json[ "apprentice-id" ]
            id = json[ "id" ]
            json = []
            for item in data:
                inner = {}
                inner[ "id" ] = item[ 0 ]
                inner[ "title" ] = item[ 1 ]
                inner[ "area" ] = item[ 2 ]
                inner[ "a" ] = item[ 3 ]
                inner[ "b" ] = item[ 4 ]
                inner[ "c" ] = item[ 5 ]
                inner[ "d" ] = item[ 6 ]
                inner[ "e" ] = item[ 7 ]
                inner[ "answer" ] = item[ 8 ]
                innerConnection = ExecuteQuery( "SELECT ID FROM APPRENTICE_PLAYLIST WHERE MASTER_ID = %s AND APPRENTICE_ID = %s AND QUESTION_ID = %s", ( id, apprentice, item[ 0 ] ) )
                innerData = innerConnection.getData()
                innerConnection.closeConnection()
                if len( innerData ) > 0:
                    inner[ "apprentice" ] = True
                else:
                    inner[ "apprentice" ] = False
                json.append( inner )
            return simplejson.dumps( json )

    @cherrypy.tools.accept( media = "application/json" )
    def getplaylist( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        if self.innerverifysession( json ):
            connection = ExecuteQuery( "SELECT QUESTION_ID FROM APPRENTICE_PLAYLIST WHERE MASTER_ID = %s AND APPRENTICE_ID = %s", ( json[ "master-id" ], json[ "id" ] ) )
            data = connection.getData()
            connection.closeConnection()
            json = {}
            json[ "code" ] = 10
            json[ "questions" ] = {}
            i = 0
            for item in data:
                json[ "questions" ][ i ] = item[ 0 ]
                i = i + 1
            return simplejson.dumps( json )
        else:
            return simplejson.dumps( { "code": 0 } )

    @cherrypy.tools.accept( media = "application/json" )
    def getapprenticeplaylists( self ):
        json = simplejson.loads( cherrypy.request.body.read( int( cherrypy.request.headers[ "Content-Length" ] ) ) )
        if self.innerverifysession( json ):
            connection = ExecuteQuery( "SELECT MASTER_ID FROM APPRENTICE_PLAYLIST WHERE APPRENTICE_ID = %s AND APPRENTICE_ID = %s GROUP BY MASTER_ID", ( json[ "id" ], json[ "id" ] ) )
            data = connection.getData()
            connection.closeConnection()
            json = {}
            json[ "code" ] = 10
            json[ "playlists" ] = []
            for item in data:
                innerConnection = ExecuteQuery( "SELECT NAME FROM USER_MASTER WHERE ID = %s AND ID = %s", ( item[ 0 ], item[ 0 ] ) )
                innerData = innerConnection.getData()
                innerConnection.closeConnection()
                inner = {}
                inner[ "id" ] = item[ 0 ]
                inner[ "name" ] = innerData[ 0 ][ 0 ]
                json[ "playlists" ].append( inner )
            return simplejson.dumps( json )

    newmasters.exposed = True
    newquestions.exposed = True
    acceptmaster.exposed = True
    acceptquestion.exposed = True

    verifysession.exposed = True
    login.exposed = True
    logout.exposed = True
    createapprentice.exposed = True
    createmaster.exposed = True
    getinstitutions.exposed = True
    getapprenticeprofile.exposed = True
    setapprenticeprofile.exposed = True
    getmasterprofile.exposed = True
    setmasterprofile.exposed = True
    addquestion.exposed = True
    getdisciplinefocus.exposed = True
    setdisciplinefocus.exposed = True
    getquestions.exposed = True
    getquestion.exposed = True
    getanswer.exposed = True
    getstatus.exposed = True
    getrandomquestion.exposed = True
    gettimeout.exposed = True
    settimeout.exposed = True
    forgetpassword.exposed = True
    getapprentices.exposed = True
    addapprentice.exposed = True
    delapprentice.exposed = True
    setplaylist.exposed = True
    getmasterapprentices.exposed = True
    getallquestions.exposed = True
    getplaylist.exposed = True
    getapprenticeplaylists.exposed = True

cherrypy.config.update( { "tools.sessions.on": True } )
application = cherrypy.Application( Root(), script_name = "", config = None )
