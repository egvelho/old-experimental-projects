import { NextApiRequest, NextApiResponse } from "next";
import { ClassType } from "class-transformer/ClassTransformer";
import typeson from "./typeson";
import { Method, MaybeOutput } from "./types";
import client, { ClientConfig } from "./client";
import stream, { StreamMessage } from "./stream";

type Request = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

type UrlParams =
    | {
          [key: string]: string | (string | undefined);
      }
    | void
    | unknown;

export type Stream<Input, Output> = (
    input: Input,
) => Promise<() => Promise<Output>>;

export interface Controller<
    GetInput,
    GetOutput,
    PostInput,
    PostOutput,
    PutInput,
    PutOutput,
    PatchInput,
    PatchOutput,
    DeleteInput,
    DeleteOutput,
    StreamInput,
    StreamOutput
> {
    get?: Method<GetInput, GetOutput>;
    post?: Method<PostInput, PostOutput>;
    put?: Method<PutInput, PutOutput>;
    patch?: Method<PatchInput, PatchOutput>;
    delete?: Method<DeleteInput, DeleteOutput>;
    stream?: Stream<StreamInput, [StreamOutput, boolean]>;
}

async function streamResponse<Input, Output>(
    input: Input,
    req: NextApiRequest,
    res: NextApiResponse,
    method?: Stream<Input, [Output, boolean]>,
) {
    if (method === undefined) {
        res.status(405).json([
            {
                error: "METHOD_NOT_ALLOWED",
            },
            false,
        ]);
    } else {
        const input_: Input = typeson.revive(input);
        const method_ = await method(input_);

        let messageId = 0;
        let run = true;

        res.setHeader("Content-Type", "text/event-stream;charset=utf-8");
        res.setHeader("Cache-Control", "no-cache, no-transform");
        res.setHeader("X-Accel-Buffering", "no");

        req.on("close", () => {
            run = false;
        });

        while (run) {
            const [data, run_] = await method_();
            run = run && run_;
            const data_ = typeson.encapsulate([data, run]);

            res.write(`id: ${++messageId}\n`);

            if (run) {
                res.write(`data: ${JSON.stringify(data_)}\n\n`);
            } else {
                res.end(`data: ${JSON.stringify(data_)}\n\n`);
            }
        }
    }
}

async function response<Input, Output>(
    input: Input,
    req: NextApiRequest,
    res: NextApiResponse,
    method: Method<Input, Output> | undefined,
) {
    if (method) {
        const input_: Input = typeson.revive(input);
        const response = await method(input_, req, res);

        if (res.headersSent) {
        } else {
            const response_ = typeson.encapsulate(response);
            res.status(200).json(response_);
        }
    } else {
        res.status(405).json({
            error: "METHOD_NOT_ALLOWED",
        });
    }
}

function endpointHOC<
    GetInput,
    GetOutput,
    PostInput,
    PostOutput,
    PutInput,
    PutOutput,
    PatchInput,
    PatchOutput,
    DeleteInput,
    DeleteOutput,
    StreamInput,
    StreamOutput
>(
    controller: Controller<
        GetInput,
        GetOutput,
        PostInput,
        PostOutput,
        PutInput,
        PutOutput,
        PatchInput,
        PatchOutput,
        DeleteInput,
        DeleteOutput,
        StreamInput,
        StreamOutput
    >,
): Request {
    return async (req, res) => {
        const data = { ...req.query, ...req.body };

        if (req.headers.accept?.includes("text/event-stream")) {
            return streamResponse(data, req, res, controller.stream);
        }

        switch (req.method) {
            case "GET":
                return response(data, req, res, controller.get);
            case "POST":
                return response(data, req, res, controller.post);
            case "PUT":
                return response(data, req, res, controller.put);
            case "PATCH":
                return response(data, req, res, controller.patch);
            case "DELETE":
                return response(data, req, res, controller.delete);
            default:
                return undefined;
        }
    };
}

export default function endpoint<
    GetInput extends UrlParams = void,
    GetOutput = void,
    PostInput = void,
    PostOutput = void,
    PutInput = void,
    PutOutput = void,
    PatchInput = void,
    PatchOutput = void,
    DeleteInput extends UrlParams = void,
    DeleteOutput = void,
    StreamInput extends UrlParams = void,
    StreamOutput = void
>(
    filename: string,
    controller: Controller<
        GetInput,
        GetOutput,
        PostInput,
        PostOutput,
        PutInput,
        PutOutput,
        PatchInput,
        PatchOutput,
        DeleteInput,
        DeleteOutput,
        StreamInput,
        StreamOutput
    >,
) {
    const filename_ = filename.replace(/\\/g, "/");
    const url = filename_.match(/pages(.*)\.ts/)?.pop();
    const endpoint_ = (req: NextApiRequest, res: NextApiResponse) =>
        endpointHOC(controller)(req, res);

    endpoint_.get = (input: GetInput, config?: ClientConfig) =>
        client<GetInput, GetOutput>(input, { url, method: "GET", ...config });

    endpoint_.post = (input: PostInput, config?: ClientConfig) =>
        client<PostInput, PostOutput>(input, {
            url,
            method: "POST",
            ...config,
        });

    endpoint_.put = (input: PutInput, config?: ClientConfig) =>
        client<PutInput, PutOutput>(input, { url, method: "PUT", ...config });

    endpoint_.patch = (input: PatchInput, config?: ClientConfig) =>
        client<PatchInput, PatchOutput>(input, {
            url,
            method: "PATCH",
            ...config,
        });

    endpoint_.delete = (input: DeleteInput, config?: ClientConfig) =>
        client<DeleteInput, DeleteOutput>(input, {
            url,
            method: "DELETE",
            ...config,
        });

    endpoint_.stream = (
        input: StreamInput,
        onMessage: StreamMessage<StreamInput, StreamOutput>,
        url_?: string,
    ) => stream<StreamInput, StreamOutput>(input, onMessage, url_ ?? url);

    endpoint_.enforceInput = {
        post: (classInput: ClassType<PostInput>) => (
            input: PostInput,
            config?: ClientConfig,
        ) =>
            client.enforceInput<PostInput, PostOutput>(input, classInput, {
                url,
                method: "POST",
                ...config,
            }),
        put: (classInput: ClassType<PutInput>) => (
            input: PutInput,
            config?: ClientConfig,
        ) =>
            client.enforceInput<PutInput, PutOutput>(input, classInput, {
                url,
                method: "PUT",
                ...config,
            }),
        patch: (classInput: ClassType<PatchInput>) => (
            input: PatchInput,
            config?: ClientConfig,
        ) =>
            client.enforceInput<PatchInput, PatchOutput>(input, classInput, {
                url,
                method: "PATCH",
                ...config,
            }),
    };

    endpoint_.enforceOutput = {
        get: (classOutput: ClassType<GetOutput>) => (
            input: GetInput,
            config?: ClientConfig,
        ) =>
            client.enforceOutput<GetInput, GetOutput>(input, classOutput, {
                url,
                method: "GET",
                ...config,
            }),
        post: (classOutput: ClassType<PostOutput>) => (
            input: PostInput,
            config?: ClientConfig,
        ) =>
            client.enforceOutput<PostInput, PostOutput>(input, classOutput, {
                url,
                method: "POST",
                ...config,
            }),
        put: (classOutput: ClassType<PutOutput>) => (
            input: PutInput,
            config?: ClientConfig,
        ) =>
            client.enforceOutput<PutInput, PutOutput>(input, classOutput, {
                url,
                method: "PUT",
                ...config,
            }),
        patch: (classOutput: ClassType<PatchOutput>) => (
            input: PatchInput,
            config?: ClientConfig,
        ) =>
            client.enforceOutput<PatchInput, PatchOutput>(input, classOutput, {
                url,
                method: "PATCH",
                ...config,
            }),
        delete: (classOutput: ClassType<DeleteOutput>) => (
            input: DeleteInput,
            config?: ClientConfig,
        ) =>
            client.enforceOutput<DeleteInput, DeleteOutput>(
                input,
                classOutput,
                {
                    url,
                    method: "DELETE",
                    ...config,
                },
            ),
        stream: (classOutput: ClassType<StreamOutput>) => (
            input: StreamInput,
            onMessage: StreamMessage<StreamInput, StreamOutput>,
            url_?: string,
        ) =>
            stream.enforceOutput<StreamInput, StreamOutput>(
                input,
                classOutput,
                onMessage,
                url_ ?? url,
            ),
    };

    endpoint_.enforceIO = {
        post: (
            classInput: ClassType<PostInput>,
            classOutput: ClassType<PostOutput>,
        ) => (input: PostInput, config?: ClientConfig) =>
            client.enforceIO<PostInput, PostOutput>(
                input,
                classInput,
                classOutput,
                {
                    url,
                    method: "POST",
                    ...config,
                },
            ),
        put: (
            classInput: ClassType<PutInput>,
            classOutput: ClassType<PutOutput>,
        ) => (input: PutInput, config?: ClientConfig) =>
            client.enforceIO<PutInput, PutOutput>(
                input,
                classInput,
                classOutput,
                {
                    url,
                    method: "PUT",
                    ...config,
                },
            ),
        patch: (
            classInput: ClassType<PatchInput>,
            classOutput: ClassType<PatchOutput>,
        ) => (input: PatchInput, config?: ClientConfig) =>
            client.enforceIO<PatchInput, PatchOutput>(
                input,
                classInput,
                classOutput,
                {
                    url,
                    method: "PATCH",
                    ...config,
                },
            ),
        stream: (
            classInput: ClassType<StreamInput>,
            classOutput: ClassType<StreamOutput>,
        ) => (
            input: StreamInput,
            onMessage: StreamMessage<
                StreamInput,
                StreamOutput | MaybeOutput<undefined>
            >,
            url_?: string,
        ) =>
            stream.enforceIO<StreamInput, StreamOutput>(
                input,
                classInput,
                classOutput,
                onMessage,
                url_ ?? url,
            ),
    };

    return endpoint_;
}
