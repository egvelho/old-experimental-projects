import React from "react";
import Account, { AccountProps } from "./account/account";
import VerifyEmail from "./email/verify-email";
import WithUser from "./user/with-user";
import WithToken from "./auth/with-token";
import client from "./client";
import type { ContextProps } from "./context";

export function AccountModal<AccountContext extends ContextProps>({
  context,
  setContext,
}: AccountProps<AccountContext>) {
  return (
    <>
      <WithToken
        token={context.token}
        setToken={(token) => setContext({ token } as Partial<AccountContext>)}
      />
      <WithUser
        user={context.user}
        token={context.token}
        getUser={async () => (await client.getUser({})).data.user}
        setUser={async (user) =>
          setContext({ user } as Partial<AccountContext>)
        }
      />
      <Account context={context} setContext={setContext} />
      <VerifyEmail />
    </>
  );
}
