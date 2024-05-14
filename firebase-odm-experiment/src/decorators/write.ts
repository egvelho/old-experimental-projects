import createRule from "../create-rule";

export const Write = createRule({
  type: "write",
  firebaseRule() {
    return true;
  },
});
