import { NextApiRequest, NextApiResponse } from "next";
import endpoints from "../endpoints";
import createAccount from "./create-account";
import emailVerificationCode from "./email-verification-code";
import getUser from "./get-user";
import login from "./login";
import updatePhoneNumber from "./update-phone-number";
import verifyEmail from "./verify-email";

export default function apiHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const url = request.url;
  const method = request.method;

  if (
    endpoints.createAccount.url === url &&
    endpoints.createAccount.method === method
  ) {
    return createAccount(request as any, response);
  } else if (
    endpoints.emailVerificationCode.url === url &&
    endpoints.emailVerificationCode.method === method
  ) {
    return emailVerificationCode(request as any, response);
  } else if (
    endpoints.getUser.url === url &&
    endpoints.getUser.method === method
  ) {
    return getUser(request as any, response);
  } else if (endpoints.login.url === url && endpoints.login.method === method) {
    return login(request as any, response);
  } else if (
    endpoints.updatePhoneNumber.url === url &&
    endpoints.updatePhoneNumber.method === method
  ) {
    return updatePhoneNumber(request as any, response);
  } else if (
    endpoints.verifyEmail.url === url &&
    endpoints.verifyEmail.method === method
  ) {
    return verifyEmail(request as any, response);
  } else {
    return response.status(404).json({});
  }
}
