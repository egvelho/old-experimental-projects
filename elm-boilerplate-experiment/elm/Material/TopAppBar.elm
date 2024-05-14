module Material.TopAppBar exposing (..)

import Html
import Html.Attributes as Attributes
import Utils as Utils


type Slot
    = ActionItems
    | NavigationIcon
    | Title


slotToString : Slot -> String
slotToString value =
    case value of
        ActionItems ->
            "actionItems"

        NavigationIcon ->
            "navigationIcon"

        Title ->
            "title"


centerTitle : Bool -> Html.Attribute msg
centerTitle =
    Utils.attributeIf <| Attributes.attribute "centerTitle" "true"


dense : Bool -> Html.Attribute msg
dense =
    Utils.attributeIf <| Attributes.attribute "dense" "true"


prominent : Bool -> Html.Attribute msg
prominent =
    Utils.attributeIf <| Attributes.attribute "prominent" "true"


slot : Slot -> Html.Attribute msg
slot =
    Attributes.attribute "slot" << slotToString


topAppBarFixed : List (Html.Attribute msg) -> List (Html.Html msg) -> Html.Html msg
topAppBarFixed =
    Html.node "mwc-top-app-bar-fixed"
