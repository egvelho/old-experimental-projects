module Main exposing (main)

import Browser
import Browser.Navigation as Navigation
import Navigator
import Page as Page
import Page.Home as Home
import Page.NotFound as NotFound
import Page.Product as Product
import Route
import Url


type alias Model =
    { navigator : Navigator.Model
    , home : Home.Model
    , product : Product.Model
    , notFound : NotFound.Model
    }


type Msg
    = Home Home.Msg
    | Product Product.Msg
    | NotFound NotFound.Msg
    | Navigator Navigator.Msg


init : () -> Url.Url -> Navigation.Key -> ( Model, Cmd Msg )
init flags url key =
    ( { navigator = Navigator.init url key
      , product = Product.init
      , home = Home.init
      , notFound = NotFound.init
      }
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Navigator msg_ ->
            let
                ( model_, cmd_ ) =
                    Navigator.update msg_ model.navigator
            in
            ( { model | navigator = model_ }, Cmd.map Navigator cmd_ )

        Home msg_ ->
            let
                ( model_, cmd_ ) =
                    Home.update msg_ model.home
            in
            ( { model | home = model_ }, Cmd.map Home cmd_ )

        Product msg_ ->
            let
                ( model_, cmd_ ) =
                    Product.update msg_ model.product
            in
            ( { model | product = model_ }, Cmd.map Product cmd_ )

        NotFound msg_ ->
            let
                ( model_, cmd_ ) =
                    NotFound.update msg_ model.notFound
            in
            ( { model | notFound = model_ }, Cmd.map NotFound cmd_ )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Sub.map Navigator <| Navigator.subscriptions model.navigator
        , Sub.map Home <| Home.subscriptions model.home
        , Sub.map Product <| Product.subscriptions model.product
        , Sub.map NotFound <| NotFound.subscriptions model.notFound
        ]


page : Model -> Route.Route -> Page.Page Msg
page model route =
    case route of
        Route.Home ->
            Page.map Home <| Home.page model.home

        Route.Product ->
            Page.map Product <| Product.page model.product

        Route.NotFound ->
            Page.map NotFound <| NotFound.page model.notFound


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        , onUrlChange = Navigator << Navigator.UrlChanged
        , onUrlRequest = Navigator << Navigator.LinkClicked
        }


view : Model -> Browser.Document Msg
view model =
    let
        page_ =
            page model <| Route.urlToRoute model.navigator.url
    in
    { title = page_.pageTitle
    , body =
        [ Page.view model (drawerControl model) page_ ]
    }


drawerControl : Model -> Page.ControlDrawer Msg
drawerControl model =
    { toggleDrawer =
        Navigator <|
            Navigator.ToggleDrawer <|
                not model.navigator.drawerOpen
    , drawerOpen = model.navigator.drawerOpen
    }
