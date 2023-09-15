import { createMemo } from 'solid-js'
import { createStore } from 'solid-js/store'

import { log, ser } from '../utils/log'
import { leaves, map_leaves, deepget } from '../utils/tree'

import { codes_obj } from '../data'

const all_false = map_leaves(codes_obj, _ => false)
const all_true = map_leaves(codes_obj, _ => true)

export const [$filter, set_$filter] = createStore(all_false)

export const $selected_filters = createMemo(() => leaves($filter).filter(x => !!x))
export const $n_selected_filters = createMemo(() => $selected_filters().length)

export const $resolved_filter = createMemo(() => $n_selected_filters() === 0 ? all_true : $filter)

export function toggle_category(path: string[], val: boolean) {
  // @ts-ignore "will definitely fix typings later"
  set_$filter(...path, o => map_leaves(o, _ => !!val))
}

export function toggle_leaf(path: string[], val: boolean) {
  // @ts-ignore "will definitely fix typings later"
  set_$filter(...path, _ => !!val)
}