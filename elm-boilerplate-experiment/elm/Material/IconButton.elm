module Material.IconButton exposing (..)

import Html
import Html.Attributes as Attributes
import Material.Icon as Icon
import Utils as Utils


type Slot
    = Icon


slotToString : Slot -> String
slotToString value =
    case value of
        Icon ->
            "icon"


icon : Icon.Icon -> Html.Attribute msg
icon =
    Attributes.attribute "icon" << Icon.iconToString


label : String -> Html.Attribute msg
label =
    Attributes.attribute "label"


disabled : Bool -> Html.Attribute msg
disabled =
    Utils.attributeIf <| Attributes.attribute "disabled" "true"


slot : Slot -> Html.Attribute msg
slot =
    Attributes.attribute "slot" << slotToString


iconButton : List (Html.Attribute msg) -> List (Html.Html msg) -> Html.Html msg
iconButton =
    Html.node "mwc-icon-button"
