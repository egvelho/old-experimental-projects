import { useEffect } from "react";

export interface WithTokenProps {
  token: string | undefined;
  setToken: (token: string | undefined) => void;
}

export default function WithToken({ token, setToken }: WithTokenProps) {
  useEffect(() => {
    const token = localStorage.getItem("token");
    token && setToken(token);
  }, []);

  useEffect(() => {
    if (token === "DELETE") {
      localStorage.removeItem("token");
      setToken(undefined);
    } else {
      const storedToken = localStorage.getItem("token");
      if (storedToken && (token === undefined || token === "")) {
        setToken(storedToken);
      }

      if (token !== undefined && token !== "") {
        localStorage.setItem("token", token);
      }
    }
  }, [token]);

  return null;
}
