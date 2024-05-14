import { NextApiRequest } from "next";
import { Jwt } from "@egvelho/next-utils/server";
import prisma from "../prisma";
import { Payload } from "./types";

function encode(payload: Payload) {
  return Jwt.encode(payload);
}

function decode(token: string) {
  return Jwt.decode<Payload>(token);
}

async function isValid(token: string) {
  return (await Jwt.decode(token)) !== undefined;
}

function fromHeader(request: NextApiRequest) {
  return Jwt.extractTokenFromHeader(request);
}

export async function getUser(request: NextApiRequest) {
  const token = fromHeader(request);

  if (token === undefined) {
    return null;
  }

  const payload = await decode(token);

  if (payload === undefined) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.id,
    },
  });

  return user;
}

export default class Token {
  static encode = encode;
  static decode = decode;
  static isValid = isValid;
  static fromHeader = fromHeader;
  static getUser = getUser;
}
