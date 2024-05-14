import "reflect-metadata";
import fs from "fs";
import path from "path";
import { generateSchema } from "./generate-schema";

(async () => {
  const [rulesPath, outPath] = process.argv.slice(2);
  const rules = (await import(rulesPath)).default;
  fs.writeFileSync(
    path.normalize(outPath),
    JSON.stringify(generateSchema(rules))
  );
  console.log("Firebase rules creation success.");
})();
