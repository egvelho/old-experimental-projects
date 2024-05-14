import { Jwt } from "@egvelho/next-utils/server";
import { EmailPayload } from "./types";

function encode(payload: EmailPayload) {
  return Jwt.encode(payload, {
    expiresIn: "1h",
  });
}

function decode(token: string) {
  return Jwt.decode<EmailPayload>(token);
}

async function isValid(token: string) {
  return (await Jwt.decode(token)) !== undefined;
}

async function codeMatches(code: string, token: string) {
  const maybePayload = await decode(token);
  if (maybePayload === undefined) {
    return false;
  } else {
    return maybePayload.code === code;
  }
}

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default class EmailToken {
  static encode = encode;
  static decode = decode;
  static isValid = isValid;
  static codeMatches = codeMatches;
  static generateCode = generateCode;
}
