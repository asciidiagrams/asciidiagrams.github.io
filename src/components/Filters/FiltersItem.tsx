import { $filter, toggle_category, toggle_leaf } from "../../state/filters"

import { deepget, is_tree, leaves, map_leaves, type Primitive, type Tree } from "../../utils/tree"

import { FiltersItems } from "./FiltersItems"

import s from './s.module.scss'

type FiltersItemProps = {
  path: string[]
  label: string
  value: Tree | Primitive
}
export function FiltersItem(props: FiltersItemProps) {
  return is_tree(props.value)
    ? <FiltersCategory {...props} value={props.value} />
    : <FiltersSingle {...props} />
}

type FiltersCategoryProps = {
  path: string[]
  label: string
  value: Tree
}
export function FiltersCategory(props: FiltersCategoryProps) {

  return (
    <li class={s.li_n}>
      <details>
        {/* label and stuffs */}
        <summary class={s.sum}>
          <label class={s.label}>
            <input
              type="checkbox" 
              checked={leaves(deepget($filter, props.path)).every(l => !!l)}
              onChange={e => {
                toggle_category(props.path, e.currentTarget.checked)
              }}
              class={s.checkbox}
            />
            {props.label}
          </label>
        </summary>
        {/* subitems */}
        <ul class={s.ul}>
          <FiltersItems o={props.value} path={props.path} />
        </ul>
      </details>
    </li>
  )
}

type FiltersSingleProps = {
  path: string[]
  label: string
}
export function FiltersSingle(props: FiltersSingleProps) {
  
  return (
    <li class={s.li_c}>
      <label class={s.label}>
        <input
          type="checkbox" 
          checked={!!deepget($filter, props.path)}
          onChange={(e) =>
            toggle_leaf(props.path, e.currentTarget.checked)
          }
          class={s.checkbox}
        />
        {props.label}
      </label>
    </li>
  )
}