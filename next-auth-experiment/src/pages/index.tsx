import { useContext } from "react";
import { AccountModal } from "../account-modal";
import { Context } from "../context";

export default function Index() {
  const { context, setContext } = useContext(Context);
  return (
    <div>
      <AccountModal context={context} setContext={setContext} />
    </div>
  );
}
