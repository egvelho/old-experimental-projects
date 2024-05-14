import MuiDrawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { useContext } from "@app/context";
import Users from "@pages/admin/users";

export interface DrawerProps {
    open: boolean;
    onClose: () => void;
}

export default function Drawer({ open, onClose }: DrawerProps) {
    const [context, setContext] = useContext();

    return (
        <MuiDrawer open={open} onClose={onClose}>
            <List style={{ width: 256 }} onClick={onClose}>
                <ListItem
                    button
                    onClick={() => setContext({ accountView: "login" })}
                >
                    <ListItemIcon>
                        <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Fazer login" />
                </ListItem>
                {context.user?.role === "admin" && (
                    <ListItem button onClick={() => Users.pushUrl({})}>
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Usuários" />
                    </ListItem>
                )}
            </List>
        </MuiDrawer>
    );
}
