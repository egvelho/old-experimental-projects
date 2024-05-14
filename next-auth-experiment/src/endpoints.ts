import { endpoint } from "@egvelho/next-metadata";
import type { User } from "@prisma/client";
import type { ValidationError } from "class-validator";
import type ValidLogin from "./auth/valid-login";
import type ValidNewUser from "./user/valid-new-user";
import type ValidNewPhoneNumber from "./user/valid-new-phone-number";
import type ValidEmailVerification from "./email/valid-email-verification";
import type ValidEmailToken from "./email/valid-email-token";

export interface OperationResponse {
  errors: ValidationError[];
  success: boolean;
}

export type TokenResponse = OperationResponse & {
  token?: string;
};

export default {
  createAccount: endpoint<ValidNewUser, TokenResponse>(
    "PUT",
    "/api/account/create-account",
  ),
  login: endpoint<ValidLogin, TokenResponse>("POST", "/api/account/login"),
  emailVerificationCode: endpoint<ValidEmailVerification, TokenResponse>(
    "POST",
    "/api/account/email-verification-code",
  ),
  verifyEmail: endpoint<ValidEmailToken, TokenResponse>(
    "POST",
    "/api/account/verify-email",
  ),
  updatePhoneNumber: endpoint<ValidNewPhoneNumber, OperationResponse>(
    "PATCH",
    "/api/account/update-phone-number",
  ),
  getUser: endpoint<{}, { user?: User }>("GET", "/api/account/get-user"),
};
