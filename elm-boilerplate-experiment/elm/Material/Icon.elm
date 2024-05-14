module Material.Icon exposing (..)

import Html


type Icon
    = Code
    | Menu


iconToString : Icon -> String
iconToString value =
    case value of
        Code ->
            "code"

        Menu ->
            "menu"


icon : Icon -> Html.Html msg
icon value =
    Html.node "mwc-icon" [] [ Html.text <| iconToString value ]
