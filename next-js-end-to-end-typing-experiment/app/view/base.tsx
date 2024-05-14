import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import theme from "@app/view/theme";

interface BaseProps {
    children: React.ReactNode;
    title: JSX.Element | string;
    description?: JSX.Element | string;
    breadcrumbs?: JSX.Element[];
}

export default function Base({
    children,
    title,
    description,
    breadcrumbs,
}: BaseProps) {
    return (
        <>
            <Box
                paddingTop={4}
                paddingBottom={36}
                paddingX={{ xs: 2, sm: 2, md: 6 }}
                bgcolor={theme.palette.secondary.main}
                color={theme.palette.secondary.contrastText}
            >
                <Typography variant="h3">{title}</Typography>
                {description && (
                    <Typography variant="subtitle1">{description}</Typography>
                )}
            </Box>
            <Box
                marginX={{ xs: 2, sm: 2, md: 6 }}
                marginTop={-20}
                marginBottom={6}
                maxWidth="960px"
            >
                <Box
                    color={theme.palette.secondary.contrastText}
                    marginBottom={1}
                >
                    {breadcrumbs && (
                        <Breadcrumbs
                            color="inherit"
                            separator={<NavigateNextIcon fontSize="small" />}
                        >
                            {breadcrumbs}
                        </Breadcrumbs>
                    )}
                </Box>
                <Paper elevation={6}>
                    <Box padding={{ xs: 2, sm: 2, md: 3 }}>{children}</Box>
                </Paper>
            </Box>
        </>
    );
}
