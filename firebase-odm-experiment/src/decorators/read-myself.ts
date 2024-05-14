import createRule from "../create-rule";

export const ReadMyself = createRule({
  type: "read",
  firebaseRule(propertyName) {
    return `${propertyName} === auth.uid`;
  },
});
