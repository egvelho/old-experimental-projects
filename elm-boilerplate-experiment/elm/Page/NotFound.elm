module Page.NotFound exposing (Model, Msg, init, page, subscriptions, update)

import Html
import Page as Page


type Msg
    = NoMsg


type alias Model =
    {}


init : Model
init =
    {}


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


body : Model -> Html.Html Msg
body model =
    Html.text "notFound"


page : Model -> Page.Page Msg
page model =
    Page.simplePage
        { pageTitle = "NotFound"
        , body = body model
        }
