import { State } from "./state.js";
import { createElement } from "./utils.js";

export function renderMap() {
  return;

  const diagrams = State.diagrams;
  const ascii = diagrams
    .map((diagram) => {
      const [start, end] = State.annotations[diagram.name];
      return diagram.ascii.split("\n").slice(start, end).join("\n");
    })
    .join("\n\n");

  const mapEl = createElement(
    "div",
    "map",
    document.querySelector(".content-wrapper")
  );
  const asciiWrapper = createElement("div", "ascii-map-wrapper", mapEl);
  asciiWrapper.innerText = ascii;
}
