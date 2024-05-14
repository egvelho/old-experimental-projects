import type { NextApiRequest as BaseNextApiRequest, NextApiResponse } from "next";
import { ExtractRequestData, ExtractResponseData, Endpoint, Endpoints } from "./endpoint";
export interface NextApiRequest<RequestData, ResponseData> extends BaseNextApiRequest {
    body: RequestData;
    params: RequestData;
    method: Endpoint<RequestData, ResponseData>["method"];
}
export declare type ApiRoute<RequestData, ResponseData> = (callback: (requestData: RequestData, request: NextApiRequest<RequestData, ResponseData>, response: NextApiResponse) => Promise<ResponseData>) => (request: NextApiRequest<RequestData, ResponseData>, response: NextApiResponse<ResponseData>) => Promise<void>;
export declare type ApiRoutes<Api> = {
    [key in keyof Api]: ApiRoute<ExtractRequestData<Api[key]>, ExtractResponseData<Api[key]>>;
};
export declare function getApiRoutes<Api extends Endpoints<Api>>(endpoints: Api): ApiRoutes<Api>;
