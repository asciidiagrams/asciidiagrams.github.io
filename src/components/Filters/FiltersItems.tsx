import { For } from "solid-js"

import type { Tree } from "../../utils/tree"

import { FiltersItem } from "./FiltersItem"

type _FiltersProps = {
  path: string[]
  o: Tree
}
export function FiltersItems(props: _FiltersProps) {
  return (
    <For each={Object.keys(props.o)}>
      {(k) => (
        <FiltersItem path={[...props.path, k]} label={k} value={props.o[k]} />
      )}
    </For>
  )
}