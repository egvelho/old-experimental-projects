import createRule from "../create-rule";

export const IndexOn = createRule<(indexes: string[]) => never>({
  type: "indexOn",
  firebaseRule(indexes) {
    return indexes;
  },
});
