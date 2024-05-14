module Page exposing (ControlDrawer, Page, SimplePage, map, simplePage, view)

import Html
import Html.Events as Events
import Material.Drawer as Drawer
import Material.Icon as Icon
import Material.IconButton as IconButton
import Material.TopAppBar as TopAppBar


type alias Page msg =
    { drawerHeader : Maybe (Html.Html msg)
    , drawerContent : Maybe (Html.Html msg)
    , body : Html.Html msg
    , pageTitle : String
    , barTitle : Maybe (Html.Html msg)
    , actionItems : Maybe (Html.Html msg)
    , navigationIcon : Maybe (Html.Html msg)
    }


type alias SimplePage msg =
    { body : Html.Html msg
    , pageTitle : String
    }


type alias ControlDrawer msg =
    { drawerOpen : Bool
    , toggleDrawer : msg
    }


map : (msg -> mainMsg) -> Page msg -> Page mainMsg
map msg page =
    { drawerHeader = Maybe.map (Html.map msg) page.drawerHeader
    , drawerContent = Maybe.map (Html.map msg) page.drawerContent
    , body = Html.map msg page.body
    , pageTitle = page.pageTitle
    , barTitle = Maybe.map (Html.map msg) page.barTitle
    , actionItems = Maybe.map (Html.map msg) page.actionItems
    , navigationIcon = Maybe.map (Html.map msg) page.navigationIcon
    }


simplePage : SimplePage msg -> Page msg
simplePage { body, pageTitle } =
    { drawerHeader = Nothing
    , drawerContent = Nothing
    , body = body
    , pageTitle = pageTitle
    , barTitle = Nothing
    , actionItems = Nothing
    , navigationIcon = Nothing
    }


defaultDrawerHeader : model -> Html.Html msg
defaultDrawerHeader _ =
    Html.text "defaultDrawerHeader"


defaultDrawerContent : model -> Html.Html msg
defaultDrawerContent _ =
    Html.text "defaultDrawerContent"


defaultBarTitle : model -> Html.Html msg
defaultBarTitle _ =
    Html.text "defaultBarTitle"


defaultActionItems : model -> Html.Html msg
defaultActionItems _ =
    Html.text "defaultActionItems"


defaultNavigationIcon : msg -> Html.Html msg
defaultNavigationIcon onClick =
    IconButton.iconButton
        [ TopAppBar.slot TopAppBar.NavigationIcon
        , IconButton.icon Icon.Menu
        , Events.onClick onClick
        ]
        []


view : model -> ControlDrawer msg -> Page msg -> Html.Html msg
view model { drawerOpen, toggleDrawer } page =
    Drawer.drawer
        [ Drawer.hasHeader True, Drawer.type_ Drawer.Modal, Drawer.open drawerOpen ]
        [ Html.span
            [ Drawer.slot Drawer.Title ]
            [ Maybe.withDefault (defaultDrawerHeader model) page.drawerHeader ]
        , Html.span
            [ Drawer.slot Drawer.Subtitle ]
            [ Maybe.withDefault (defaultDrawerContent model) page.drawerContent ]
        , Html.div
            [ Drawer.slot Drawer.AppContent ]
            [ TopAppBar.topAppBarFixed []
                [ Html.div
                    [ TopAppBar.slot TopAppBar.NavigationIcon ]
                    [ Maybe.withDefault (defaultNavigationIcon toggleDrawer) page.navigationIcon ]
                , Html.div
                    [ TopAppBar.slot TopAppBar.ActionItems ]
                    [ Maybe.withDefault (defaultActionItems model) page.actionItems ]
                , Html.div
                    [ TopAppBar.slot TopAppBar.Title ]
                    [ Maybe.withDefault (defaultBarTitle model) page.barTitle ]
                ]
            , page.body
            ]
        ]
