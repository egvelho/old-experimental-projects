port module Navigator exposing (Model, Msg(..), init, subscriptions, update)

import Browser
import Browser.Navigation as Navigation
import Page as Page
import Url


port toggleDrawer : (Bool -> msg) -> Sub msg


type alias Model =
    { key : Navigation.Key
    , url : Url.Url
    , drawerOpen : Bool
    }


type Msg
    = LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url
    | ToggleDrawer Bool


init : Url.Url -> Navigation.Key -> Model
init url key =
    { key = key
    , url = url
    , drawerOpen = False
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LinkClicked urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( model, Navigation.pushUrl model.key (Url.toString url) )

                Browser.External href ->
                    ( model, Navigation.load href )

        UrlChanged url ->
            ( { model | url = url }, Cmd.none )

        ToggleDrawer drawerOpen ->
            ( { model | drawerOpen = drawerOpen }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    toggleDrawer ToggleDrawer
