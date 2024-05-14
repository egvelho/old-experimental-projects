import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import usePagination from "@app/http/use-pagination";
import page from "@app/page";
import users from "@api/users";
import HomePage from "@pages/index";
import Base from "@app/view/base";

interface Props {
    users: ExtractPromise<ReturnType<typeof users.get>>["data"];
}

export default page<Props>(__filename, {
    render(props) {
        const paginationProps = usePagination({
            client: users.get,
            initialState: props.users,
        });

        const [users_, count] = paginationProps.data?.output ?? [[], 0];

        return (
            <Base
                title="Usuários"
                description="Listagem de usuários do sistema"
                breadcrumbs={[
                    <HomePage.Link query={{}} key="home">
                        <Link color="inherit">Home</Link>
                    </HomePage.Link>,
                    <Typography key="users">
                        <Link color="inherit">Usuários</Link>
                    </Typography>,
                ]}
            >
                <div>
                    {users_.map(({ name }, index) => (
                        <div key={index}>{name}</div>
                    ))}
                </div>
                <Pagination
                    size="large"
                    color="primary"
                    disabled={paginationProps.loading}
                    count={Math.ceil(count / paginationProps.pagination)}
                    page={paginationProps.page}
                    onChange={(_, page) => paginationProps.loadPage(page, {})}
                />
            </Base>
        );
    },
    async init() {
        return {
            users: (await users.get({ input: {} })).data,
        };
    },
});
