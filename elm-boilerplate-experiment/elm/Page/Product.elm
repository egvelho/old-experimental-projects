module Page.Product exposing (Model, Msg, init, page, subscriptions, update)

import Page as Page
import Html


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
    Html.text "product"


page : Model -> Page.Page Msg
page model =
    Page.simplePage
        { pageTitle = "Product"
        , body = body model
        }
