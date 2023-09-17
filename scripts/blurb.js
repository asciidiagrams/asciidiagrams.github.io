import { getCount, onSearch, updateScroll } from "./main.js";
import { State } from "./state.js";
import { createElement } from "./utils.js";

export function renderBlurb() {
  const el = createElement("div", "blurb", document.querySelector(".header"));

  let blurb = "";

  blurb += '<p class="blurb-title">ASCII Diagrams</p>';

  blurb += `<p class="blurb-text">
    This web page catalogs ASCII diagrams extracted from four open source code-bases: 
    Chromium, Linux, LLVM, and TensorFlow. There are ${
      State.diagrams.length
    } diagrams in total, of which ${
    State.diagrams.filter((d) => d.codes != null).length
  } have been annotated with our design framework.
  </p>`;

  blurb += `<p class="blurb-text"> For information on how the dataset was collected and on the design framework, please refer to the paper.
    </p>`;

  // Option to download the data
  blurb += `<p class="blurb-text">
    The dataset can be downloaded <a href="./agg.json" download>here</a>.
    </p>`;

  el.innerHTML = blurb;

  const sticky = document.querySelector(".sticky");
  // sticky.innerHTML = `<div> Controls to change the page's appearence and to enable all diagrams (<i>i.e.</i> include uncoded diagrams).
  // </div>`;

  // Option to toggle the codes
  const toggleCodes = createElement("input", "sticky-button", sticky);
  toggleCodes.type = "button";
  toggleCodes.value = "Hide codes";
  toggleCodes.addEventListener("click", () => {
    document.querySelector(".content").classList.toggle("hide-codes");
    toggleCodes.value =
      toggleCodes.value == "Hide codes" ? "Show codes" : "Hide codes";
  });

  // Option to disable fading
  const toggleFading = createElement("input", "sticky-button", sticky);
  toggleFading.type = "button";
  toggleFading.value = "Enable fading";
  toggleFading.addEventListener("click", () => {
    State.shouldFade = !State.shouldFade;
    updateScroll();
    toggleFading.value =
      toggleFading.value == "Disable fading"
        ? "Enable fading"
        : "Disable fading";
  });

  // Option to show all diagrams
  // const searchTitle = createElement("div", "sticky-search-title", sticky);
  // searchTitle.innerHTML =
  //   "Search for parts of the diagram or for codes (<i>e.g.</i> 'Geometry / Graphics').";

  // Search
  const search = createElement("input", "sticky-search", sticky);
  search.type = "text";
  search.placeholder = "Search diagram...";

  let typingTimer = null; // timer identifier

  let doneTypingInterval = 300; // time in ms

  search.addEventListener("input", () => {
    clearTimeout(typingTimer);

    typingTimer = setTimeout(() => {
      onSearch(search.value);
    }, doneTypingInterval);
  });

  // Count
  State.countEl = createElement("span", "sticky-count", sticky);
  State.countEl.innerText = `(${getCount()} diagrams found)`;

  // End horizontal line
  //   createElement("hr", "fat", sticky);
}
