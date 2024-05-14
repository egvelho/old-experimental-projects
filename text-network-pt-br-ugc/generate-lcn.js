function sortEdges(a, b) {
  if (a[1] < b[1]) return -1;
  if (a[1] > b[1]) return 1;
  return 0;
}

function normalize(s) {
  return s
    .replace(/<br>/gm, "\n")
    .replace(/&nbsp/gm, "\n")
    .replace(/<[^>]*>?/gm, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n\s*\n/g, "\n")
    .replace(/\n/g, " ")
    .replace(/\s\s+/g, " ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^\w\s]/gi, "")
    .trim();
}

const abbrs = (() => {
  const abbrs = require("./abbrs.json");
  return Object.keys(abbrs).reduce(
    (s, i) => ({ ...s, [normalize(i)]: normalize(abbrs[i]) }),
    {}
  );
})();

const stopwords = require("./stopwords.json").reduce(
  (s, i) => ({ ...s, [normalize(i)]: true }),
  {}
);

module.exports = function generateLCN({
  coocurrenceWindow = 4,
  maxEdges = 1,
  minFrequency = 1,
  nodeLimit = Infinity,
  inputText,
}) {
  if (inputText === undefined) {
    return false;
  }

  const tokens = normalize(inputText)
    .split(" ")
    .filter((s) => s)
    .filter((s) => !stopwords[s])
    .filter((s) => isNaN(s))
    .map((s) => abbrs[s] || s)
    .map((s) =>
      s.replace(
        /^(a*ha+h[ha]*|e*he+h[he]*|o?l+o+l+[ol]*|kk+|r?s+r+s+[rs]*)$/,
        "risos"
      )
    );

  const textFrequencies = tokens.reduce(
    (obj, token) => ({ ...obj, [token]: (obj[token] || 0) + 1 }),
    {}
  );

  let graph = {
    vertex: {},
    nodes: {},
    edges: {},
  };

  let out = "";
  let keys = {};

  tokens.forEach((token, index) => {
    let list = tokens.slice(
      index - coocurrenceWindow || 0,
      index + coocurrenceWindow + 1
    );
    list.forEach((near) => {
      if (near !== token) {
        if (!graph.vertex[token]) {
          graph.vertex[token] = {};
        }
        graph.vertex[token][near] = true;

        if (!graph.edges[near]) {
          graph.edges[near] = {};
        }
        graph.edges[near][token] = (graph.edges[near][token] || 0) + 1;
      }
      graph.nodes[near] = (graph.nodes[near] || 0) + 1;
    });
  });

  graph.nodes = Object.entries(graph.nodes)
    .filter(([key]) => textFrequencies[key] >= minFrequency)
    .sort(sortEdges)
    .reverse()
    .slice(0, nodeLimit)
    .reduce((items, [key, value]) => ({ ...items, [key]: value }), {});

  Object.keys(graph.vertex).forEach((vert) => {
    if (!graph.nodes[vert]) {
      delete graph.vertex[vert];
    } else {
      Object.keys(graph.vertex[vert]).forEach((sub) => {
        if (!graph.nodes[sub]) {
          delete graph.vertex[vert][sub];
        }
      });
    }
  });

  Object.entries(graph.nodes).forEach(
    ([vert]) =>
      graph.vertex[vert] &&
      Object.keys(graph.vertex[vert]).forEach((item) => {
        const freqEdges = Object.entries(graph.edges[item])
          .reverse()
          .slice(0, maxEdges);
        if (freqEdges.filter(([key]) => vert === key).length > 0) {
          keys[vert] = true;
          keys[item] = true;
          out = out.concat(`"${vert}" -- "${item}";`);
        }
      })
  );

  const mean =
    Object.keys(textFrequencies).reduce((s, i) => s + textFrequencies[i], 0) /
    Object.keys(textFrequencies).length;

  const fontSize = Object.keys(textFrequencies)
    .filter((key) => keys[key])
    .map((node) => {
      const size = parseInt((36 * textFrequencies[node]) / mean);
      return `"${node}" [fontsize=${size}];`;
    })
    .join("");

  out =
    'graph G {graph [overlap=false][outputorder=edgesfirst];node [style=filled shape=box fillcolor="#efefef" margin=0 fontname=Roboto nodesep=0.75];'
      .concat(fontSize)
      .concat(out)
      .concat("}");

  return out;
};
