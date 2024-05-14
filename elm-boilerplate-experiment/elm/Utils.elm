module Utils exposing (..)

import Html
import Html.Attributes as Attributes


attributeIf : Html.Attribute msg -> Bool -> Html.Attribute msg
attributeIf attribute condition =
    if condition then
        attribute

    else
        Attributes.class ""


booleanToString : Bool -> String
booleanToString value =
    if value == True then
        "true"

    else
        "false"


stringToBoolean : String -> Bool
stringToBoolean value =
    value == "true"
