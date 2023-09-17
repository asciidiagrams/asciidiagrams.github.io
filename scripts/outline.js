import { State } from "./state.js";
import { createElement } from "./utils.js";

export function renderOutline() {
  const el = createElement(
    "div",
    "outline",
    document.querySelector(".sidebar")
  );
  const diagrams = State.diagrams;

  const createRepo = (name) => {
    const repo = createElement("div", "outline-repo", el);
    const repoName = createElement("div", "outline-repo-name", repo);
    repoName.innerText = name;
    repoName.addEventListener("click", () => {
      repo.classList.toggle("outline-repo-collapsed");
    });
    return repo;
  };

  const repos = {
    chromium: createRepo("Chromium"),
    linux: createRepo("Linux"),
    llvm: createRepo("LLVM"),
    tensorflow: createRepo("TensorFlow"),
  };

  for (const diagram of diagrams) {
    const repo = diagram.name.split("_")[0];
    if (diagram.codes == null) {
      continue;
    }

    const diagramEl = createElement("div", "outline-diagram-name", repos[repo]);
    diagramEl.innerText = State.titleNames[diagram.name];
  }

  // Set the max-heights for each repo
  for (const repo of Object.values(repos)) {
    const height = repo.scrollHeight;
    repo.style.maxHeight = `${Math.min(window.screen.height, height)}px`;
  }
}
