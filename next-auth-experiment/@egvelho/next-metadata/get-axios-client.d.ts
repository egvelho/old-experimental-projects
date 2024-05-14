import { AxiosRequestConfig, AxiosPromise, AxiosResponse, AxiosError } from "axios";
import { ExtractRequestData, ExtractResponseData, Endpoints } from "./endpoint";
export declare type AxiosClient<RequestData, ResponseData> = (requestData: RequestData, config?: AxiosRequestConfig) => AxiosPromise<ResponseData>;
export declare type AxiosClients<Api> = {
    [key in keyof Api]: AxiosClient<ExtractRequestData<Api[key]>, ExtractResponseData<Api[key]>>;
};
export declare function getAxiosClient<Api extends Endpoints<Api>>({ endpoints, beforeRequest, afterRequest, onError, }: {
    endpoints: Api;
    beforeRequest?: (config: AxiosRequestConfig) => Promise<AxiosRequestConfig | void>;
    afterRequest?: (response: AxiosResponse<unknown>) => Promise<void>;
    onError?: (error: AxiosError<unknown>) => Promise<void>;
}): AxiosClients<Api>;
