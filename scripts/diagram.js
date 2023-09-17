import { State } from "./state.js";
import { createElement, toTitleCase } from "./utils.js";

export function renderDiagrams() {
  const el = document.querySelector(".content");
  State.diagrams.forEach((diagram) => {
    const diagramEl = renderDiagram(diagram);
    if (diagramEl != null) {
      el.appendChild(diagramEl);
      State.diagramEls[diagram.name] = diagramEl;
    }
  });
}

function renderDiagram(diagram) {
  const diagramEl = createElement("div", "diagram");
  const asciiWrapper = createElement("div", "ascii-wrapper", diagramEl);

  // Title name
  const titleName = State.titleNames[diagram.name];
  const titleNameEl = createElement("p", "diagram-name", asciiWrapper);
  titleNameEl.innerText = titleName;

  // URL
  const urlEl = createElement("a", "diagram-url", asciiWrapper);
  urlEl.href = diagram.url;
  urlEl.target = "_blank";
  urlEl.innerText = shortenURL(diagram.url);

  // Diagram
  const asciiEl = createElement("code", "ascii", asciiWrapper);
  asciiEl.innerText = diagram.trimmed;

  // Properties
  const codes = diagram.codes;
  if (codes == null) {
    return null;
  }

  const dimBlocks = [];
  for (const dim of Object.keys(codes)) {
    const values = [];

    const subDims = codes[dim];
    for (const subDim of Object.keys(subDims)) {
      const trueCodes = getTrueCodes([subDim, subDims[subDim]]);
      values.push(...trueCodes);
    }

    if (values.length == 0) {
      continue;
    }

    const className = dim.replace(" ", "-");
    let dimBlock = `<div class='dim-block'> <p class='dim-name'>${toTitleCase(
      dim
    )}</p>`;
    for (let value of values) {
      value = value.replace("not whole file :: ", "");
      value = value.replace(" :: other", "");
      value = value.replace(
        "layout / architecture / ownership",
        "layout / architecture"
      );
      value = toTitleCase(value);
      dimBlock += `<p class="${className} dim-code">${value}</p>`;
    }

    dimBlock += "</div>";

    dimBlocks.push(dimBlock);
  }

  const dimBlocksEl = createElement("div", "dim-blocks", diagramEl);
  dimBlocksEl.innerHTML = dimBlocks.join("\n");

  setTimeout(() => {
    dimBlocksEl.style.maxHeight = `${dimBlocksEl.scrollHeight}px`;
  }, 1000);

  return diagramEl;
}

function abbreviateDim(dim) {
  const mapping = {
    "visual encoding": "V",
    concept: "C",
    annotation: "AN",
    abstraction: "AB",
    multiples: "SU",
    scope: "SC",
    references: "R",
  };

  return mapping[dim];
}

function getTrueCodes(code) {
  // If code is a list where the first element is a string, and the second is an object, then it is a code group
  if (typeof code[1] === "object") {
    return getTrueCodeGroup(code);
  } else {
    return getTrueBaseCode(code);
  }
}

function getTrueCodeGroup(codeGroup) {
  const [name, codes] = codeGroup;
  const trueCodes = [];
  for (const code of Object.entries(codes)) {
    const newCodes = getTrueCodes(code);
    trueCodes.push(...newCodes.map((c) => `${name} :: ${c}`));
  }

  return trueCodes;
}

function getTrueBaseCode(baseCode) {
  if (baseCode[1] == false) {
    return [];
  } else {
    return [baseCode[0]];
  }
}

function shortenURL(url) {
  let split = url.split("/");
  const repo = split[3];
  const folder = split[7];
  const tail = split[split.length - 1];

  return `${repo}/${folder}/.../${tail}`;
}
