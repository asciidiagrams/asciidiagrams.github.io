import { createMemo } from 'solid-js'

import { deepget, find_leaves } from '../utils/tree'

import { $filter, $resolved_filter } from './filters'

import { data } from '../data'

export const $matches = createMemo(() => {
  const paths = find_leaves($resolved_filter(), x => !!x)
    .map(x => x.path)
  
  const matched_data = data
    .filter(x => paths.some(path => deepget(x.codes, path)))

  return matched_data
})