module Route exposing (..)

import Html
import Html.Attributes as Attributes
import Url


type Route
    = Home
    | Product
    | NotFound


urlToRoute : Url.Url -> Route
urlToRoute { path } =
    case path of
        "/home" ->
            Home

        "/product" ->
            Product

        _ ->
            NotFound


routeToPath : Route -> String
routeToPath route =
    case route of
        Home ->
            "/home"

        Product ->
            "/product"

        NotFound ->
            "/404"


href : Route -> Html.Attribute msg
href =
    Attributes.href << routeToPath
