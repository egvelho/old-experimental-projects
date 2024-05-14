module Material.Drawer exposing (..)

import Html
import Html.Attributes as Attributes
import Utils as Utils


type Type
    = Dismissible
    | Modal


type Slot
    = Title
    | Subtitle
    | AppContent


typeToString : Type -> String
typeToString value =
    case value of
        Dismissible ->
            "dismissible"

        Modal ->
            "modal"


slotToString : Slot -> String
slotToString value =
    case value of
        Title ->
            "title"

        Subtitle ->
            "subtitle"

        AppContent ->
            "appContent"


hasHeader : Bool -> Html.Attribute msg
hasHeader =
    Utils.attributeIf <| Attributes.attribute "hasHeader" "true"


open : Bool -> Html.Attribute msg
open =
    Utils.attributeIf <| Attributes.attribute "open" "true"


type_ : Type -> Html.Attribute msg
type_ =
    Attributes.attribute "type" << typeToString


slot : Slot -> Html.Attribute msg
slot =
    Attributes.attribute "slot" << slotToString


drawer : List (Html.Attribute msg) -> List (Html.Html msg) -> Html.Html msg
drawer =
    Html.node "mwc-drawer"
