import { NextApiRequest } from "next";
import { VerifyOptions, SignOptions } from "jsonwebtoken";
declare function encode<Payload extends Object | string>(payload: Payload, options?: SignOptions): string | undefined;
declare function decode<Payload extends Object | string>(token: string, options?: VerifyOptions): Payload | undefined;
declare function extractTokenFromHeader(req: NextApiRequest): string | undefined;
export declare class Jwt {
    static encode: typeof encode;
    static decode: typeof decode;
    static extractTokenFromHeader: typeof extractTokenFromHeader;
}
export {};
