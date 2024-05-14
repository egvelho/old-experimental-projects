import createRule from "../create-rule";

export const WriteMyself = createRule({
  type: "write",
  firebaseRule(propertyName) {
    return `${propertyName} === auth.uid`;
  },
});
