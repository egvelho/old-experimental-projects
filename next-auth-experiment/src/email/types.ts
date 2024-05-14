import { Payload } from "../auth/types";

export interface EmailPayload extends Payload {
  code: string;
}
