import { useState } from "react";
import appConfig from "@app/config";
import { Client, ClientConfig } from "./client";
import { Pagination } from "./middleware/paginate";

export default function usePagination<Input, Output>({
    client,
    initialState,
    pagination = appConfig().pagination,
}: {
    client: Client<Pagination<Input>, Output>;
    initialState: Output;
    pagination?: number;
}) {
    const [state, setState] = useState({
        page: 1,
        data: initialState,
        loading: false,
        pagination,
    });

    const loadPage = async (
        page: number,
        input: Input,
        clientConfig?: ClientConfig,
    ) => {
        setState({
            ...state,
            loading: true,
        });

        const data = (
            await client(
                {
                    input,
                    take: pagination,
                    skip: (page - 1) * pagination,
                },
                clientConfig,
            )
        ).data;

        setState({
            ...state,
            page,
            data,
            loading: false,
        });
    };

    return {
        loadPage,
        ...state,
    };
}
