import page from "@app/page";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

export default page(__filename, {
    render() {
        return (
            <div>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" href="/">
                        Material-UI
                    </Link>
                    <Link color="inherit" href="/getting-started/installation/">
                        Core
                    </Link>
                    <Typography color="textPrimary">Breadcrumb</Typography>
                </Breadcrumbs>
            </div>
        );
    },
});
