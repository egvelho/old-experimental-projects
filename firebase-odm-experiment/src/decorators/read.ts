import createRule from "../create-rule";

export const Read = createRule({
  type: "read",
  firebaseRule() {
    return true;
  },
});
