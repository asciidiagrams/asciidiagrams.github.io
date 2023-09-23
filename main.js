const diagramLookup = {};

async function main() {
  // Setup a lookup for the diagrams
  const diagramEls = document.querySelectorAll(".diagram");
  for (const diagramEl of diagramEls) {
    const name = diagramEl.dataset.name;
    diagramLookup[name] = {
      name: name,
      el: diagramEl,
      trimmed: diagramEl.querySelector(".diagram-ascii").innerText,
    };
  }

  // Option to toggle the codes
  const toggleCodes = document.getElementById("toggle-codes-button");
  toggleCodes.addEventListener("click", () => {
    document.querySelector(".diagrams").classList.toggle("hide-codes");
    toggleCodes.value =
      toggleCodes.value == "Hide Codes" ? "Show Codes" : "Hide Codes";
  });

  // Search
  const search = document.getElementById("search-input");

  let typingTimer = null;
  search.addEventListener("input", () => {
    clearTimeout(typingTimer);

    typingTimer = setTimeout(() => {
      onSearch(search.value);
    }, 300); // time in ms
  });

  // Count
  document.getElementById("diagram-count").innerText = `${getCount()}`;

  // On clicking any 'tag' populate the search box
  const tags = document.querySelectorAll(".tag");
  for (const tag of tags) {
    tag.addEventListener("click", () => {
      let val = tag.innerText;
      if (tag.dataset.full != null) {
        val = tag.dataset.full;
      }

      val = `"${val}"`;

      if (search.value == val) {
        search.value = "";
        onSearch(search.value);
        return;
      }

      search.value = val;
      onSearch(search.value);
    });
  }
}

export function onSearch(query) {
  /* ------------------------ Reset ----------------------- */
  for (const diagram of Object.values(diagramLookup)) {
    // Reset 'hide' class
    diagram.el.classList.remove("hide");

    // Reset any highlights of trimmed
    const trimmedEl = diagram.el.querySelector(".diagram-ascii");
    if (trimmedEl.innerHTML != diagram.trimmed) {
      trimmedEl.innerText = diagram.trimmed;
    }

    // Reset any highlights of codes
    const dimEl = diagram.el.querySelector(".tags");
    dimEl.querySelectorAll(".tag").forEach((dimCode) => {
      dimCode.classList.remove("tag-highlight");
    });
  }

  if (query == "") {
    // Update count
    document.getElementById("diagram-count").innerText = `${getCount()}`;

    return;
  }

  /* -------------------- Update search ------------------- */
  const getSearchIndex = (val) => {
    let queryCompare = query.toLowerCase();
    let valCompare = val.toLowerCase();

    // If query starts and end with "
    if (query[0] == '"' && query[query.length - 1] == '"') {
      queryCompare = query.slice(1, query.length - 1);
      valCompare = val;
    }

    return valCompare.indexOf(queryCompare);
  };

  for (const diagram of Object.values(diagramLookup)) {
    // Check if the query is in trimmed
    let index = getSearchIndex(diagram.trimmed);
    let isHighlighted = false;

    if (index != -1) {
      const trimmedEl = diagram.el.querySelector(".diagram-ascii");
      const trimmedText = diagram.trimmed;

      const before = trimmedText.slice(0, index);
      const match = trimmedText.slice(index, index + query.length);
      const after = trimmedText.slice(index + query.length);
      trimmedEl.innerHTML = `${before}<highlight>${match}</highlight>${after}`;

      isHighlighted = true;
    } else {
      // Reset highlight
      const trimmedEl = diagram.el.querySelector(".diagram-ascii");
      trimmedEl.innerText = diagram.trimmed;
    }

    // Check if the query is in the codes
    const dimEl = diagram.el.querySelector(".tags");
    if (dimEl != null) {
      const dimCodes = dimEl.querySelectorAll(".tag");
      for (const dimCode of dimCodes) {
        let index = getSearchIndex(dimCode.innerText);

        if (index != -1) {
          dimCode.classList.add("tag-highlight");
          isHighlighted = true;
        } else {
          dimCode.classList.remove("tag-highlight");
        }
      }
    }

    if (!isHighlighted) {
      diagram.el.classList.add("hide");

      dimEl.querySelectorAll(".tag").forEach((dimCode) => {
        dimCode.classList.remove("tag-highlight");
      });
    }
  }

  // Update count
  document.getElementById("diagram-count").innerText = `${getCount()}`;
}

export function getCount() {
  let count = 0;
  for (const diagram of Object.values(diagramLookup)) {
    if (!diagram.el.classList.contains("hide")) {
      count++;
    }
  }

  return count;
}

main();
