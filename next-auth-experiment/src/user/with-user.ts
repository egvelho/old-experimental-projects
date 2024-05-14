import { useEffect } from "react";

function storeUser<User>(user: User) {
  localStorage.setItem("user", JSON.stringify(user));
}

function removeUser() {
  localStorage.removeItem("user");
}

function retrieveUser<User>(): User | undefined {
  const stringifiedUser = localStorage.getItem("user");

  if (stringifiedUser) {
    const user: User = JSON.parse(stringifiedUser);
    return user;
  } else {
    return undefined;
  }
}

interface WithUserProps<User> {
  token: string | undefined;
  user: User | undefined;
  getUser: () => Promise<User>;
  setUser: (user: User | undefined) => Promise<void>;
}

export default function WithUser<User>({
  token,
  user,
  getUser,
  setUser,
}: WithUserProps<User>) {
  const syncUser = async () => {
    if (token === "DELETE") {
      removeUser();
      setUser(undefined);
    } else if (token) {
      const maybeUser = <User>retrieveUser();
      if (maybeUser === undefined) {
        const nextUser = await getUser();
        await setUser(nextUser);
      } else {
        await setUser(maybeUser);
      }
    }
  };

  useEffect(() => {
    syncUser();
  }, []);

  useEffect(() => {
    syncUser();
  }, [token]);

  useEffect(() => {
    user && storeUser(user);
  }, [user]);

  return null;
}
