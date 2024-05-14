export type Role = "user" | "admin";

export interface Payload {
  id: number;
  role: Role;
}

export interface MailPayload extends Payload {
  code: string;
}
