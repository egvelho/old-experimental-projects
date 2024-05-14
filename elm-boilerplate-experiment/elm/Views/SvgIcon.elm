module Commons.SvgIcon exposing (icon, elm-boilerplateSquare)

import Html
import Svg
import Svg.Attributes as Svg


icon : String -> Html.Html msg
icon name =
    Svg.svg
        [ Svg.class "icon"
        ]
        [ Svg.use [ Svg.xlinkHref name ] []
        ]


elm-boilerplateSquare : Html.Html msg
elm-boilerplateSquare =
    icon "#elm-boilerplate-square"
