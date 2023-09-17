import { renderBlurb } from "./blurb.js";
import { renderDiagrams } from "./diagram.js";
import { renderMap } from "./map.js";
import { State } from "./state.js";

async function main() {
  // Load diagrams
  State.diagrams = await (await fetch("./agg.json")).json();

  // Load annotations
  State.annotations = await (await fetch("./annotations.json")).json();

  // Apply annotations
  State.diagrams.forEach((diagram) => {
    const [start, end] = State.annotations[diagram.name];
    diagram.trimmed = diagram.ascii.split("\n").slice(start, end).join("\n");
  });

  // Load title names
  State.titleNames = await (await fetch("./names.json")).json();

  // Render data
  renderDiagrams();

  // Render map
  renderMap();

  // Render outline
  // renderOutline();

  // On scroll, highlight the nearest diagram
  window.addEventListener("scroll", () => updateScroll());

  // Render blurb
  renderBlurb();

  // Update scroll
  updateScroll();
}

export function updateScroll() {
  const scrollY = window.scrollY;
  const diagramEls = Object.values(State.diagramEls);

  if (!State.shouldFade) {
    for (const el of diagramEls) {
      el.classList.add("diagram-highlight");
    }
    return;
  }

  let minDist = Infinity;
  let minEl = null;
  for (const el of diagramEls) {
    const dist = Math.abs(el.offsetTop - (scrollY + 0.2 * window.innerHeight));
    if (dist < minDist) {
      minDist = dist;
      minEl = el;
    }
  }

  if (minEl != null) {
    for (const el of diagramEls) {
      el.classList.remove("diagram-highlight");
    }
    minEl.classList.add("diagram-highlight");
  }
}

export function onSearch(query) {
  // if (query == "") {
  for (const diagram of State.diagrams) {
    const diagramEl = State.diagramEls[diagram.name];
    if (diagramEl == null) {
      continue;
    }

    // Reset 'hide' class
    diagramEl.classList.remove("hide");

    // Reset any highlights of trimmed
    const trimmedEl = diagramEl.querySelector(".ascii");
    if (trimmedEl.innerHTML != diagram.trimmed) {
      trimmedEl.innerText = diagram.trimmed;
    }

    // Reset any highlights of codes
    const dimEl = diagramEl.querySelector(".dim-blocks");
    dimEl.querySelectorAll(".dim-code").forEach((dimCode) => {
      dimCode.classList.remove("dim-code-highlight");
    });
  }

  // Update count
  State.countEl.innerText = `(${getCount()} diagrams found)`;
  // return;
  // }

  if (query == "") {
    return;
  }

  // Go through each diagram and hide it if it doesn't match the query
  const queryLower = query.toLowerCase();
  for (const diagram of State.diagrams) {
    const diagramEl = State.diagramEls[diagram.name];
    if (diagramEl == null) {
      continue;
    }

    // Check if the query is in trimmed
    const trimmed = diagram.trimmed.toLowerCase();
    let index = trimmed.indexOf(queryLower);
    let isHighlighted = false;

    if (index != -1) {
      const trimmedEl = diagramEl.querySelector(".ascii");

      const trimmedText = diagram.trimmed;

      const before = trimmedText.slice(0, index);
      const match = trimmedText.slice(index, index + query.length);
      const after = trimmedText.slice(index + query.length);
      trimmedEl.innerHTML = `${before}<highlight>${match}</highlight>${after}`;

      isHighlighted = true;
    } else {
      // Reset highlight
      const trimmedEl = diagramEl.querySelector(".ascii");
      // if (trimmedEl.innerText != diagram.trimmed) {
      trimmedEl.innerText = diagram.trimmed;
      // }
    }

    // Check if the query is in the codes
    const dimEl = diagramEl.querySelector(".dim-blocks");
    if (dimEl != null) {
      const dimCodes = dimEl.querySelectorAll(".dim-code");
      for (const dimCode of dimCodes) {
        const dimCodeText = dimCode.innerText.toLowerCase();
        index = dimCodeText.indexOf(queryLower);

        if (index != -1) {
          dimCode.classList.add("dim-code-highlight");
          isHighlighted = true;
        } else {
          dimCode.classList.remove("dim-code-highlight");
        }
      }
    }

    if (!isHighlighted) {
      diagramEl.classList.add("hide");

      dimEl.querySelectorAll(".dim-code").forEach((dimCode) => {
        dimCode.classList.remove("dim-code-highlight");
      });
    }
  }

  // Update count
  State.countEl.innerText = `(${getCount()} diagrams found)`;
}

export function getCount() {
  let count = 0;
  for (const diagram of State.diagrams) {
    const diagramEl = State.diagramEls[diagram.name];
    if (diagramEl == null) {
      continue;
    }

    if (!diagramEl.classList.contains("hide")) {
      count++;
    }
  }
  return count;
}

main();
