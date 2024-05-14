#!/usr/bin/env node

const path = require("path");

function findCommon(str1, str2) {
  const s1 = [...str1];
  const s2 = [...str2];
  const arr = Array(s2.length + 1)
    .fill(null)
    .map(() => {
      return Array(s1.length + 1).fill(null);
    });
  for (let j = 0; j <= s1.length; j += 1) {
    arr[0][j] = 0;
  }
  for (let i = 0; i <= s2.length; i += 1) {
    arr[i][0] = 0;
  }
  let len = 0;
  let col = 0;
  let row = 0;
  for (let i = 1; i <= s2.length; i += 1) {
    for (let j = 1; j <= s1.length; j += 1) {
      if (s1[j - 1] === s2[i - 1]) {
        arr[i][j] = arr[i - 1][j - 1] + 1;
      } else {
        arr[i][j] = 0;
      }
      if (arr[i][j] > len) {
        len = arr[i][j];
        col = j;
        row = i;
      }
    }
  }
  if (len === 0) {
    return "";
  }
  let res = "";
  while (arr[row][col] > 0) {
    res = s1[col - 1] + res;
    row -= 1;
    col -= 1;
  }
  return res;
}

const [rulesPath, outPath] = process.argv.slice(2);
const root = findCommon(__dirname, process.cwd());
const exec = require("child_process").exec;

process.chdir(__dirname);

const crossEnv = path.join("..", ".bin", "cross-env");
const tsNode = path.join("..", ".bin", "ts-node");
const env = "TS_NODE_FILES=true TS_NODE_TRANSPILE_ONLY=true";
const script = "./src/script-generate-schema";
const relativeRulesPath = path.join("..", "..", "..", rulesPath);
const relativeOutPath = path.join(path.relative(__dirname, root), outPath);

exec(
  `${crossEnv} ${env} ${tsNode} ${script} ${relativeRulesPath} ${relativeOutPath}`,
  (error, stdout, stdin) => {
    error && console.log(error);
    stdout && console.log(stdout);
    stdin && console.log(stdin);
  }
);
