import { For, createMemo } from 'solid-js'

import { $currently_viewing } from '../../state/currently-viewing'

import { find_leaves } from '../../utils/tree'

import s from './s.module.scss'

import type { CodesShape } from '../../data'

export function CodesForCurrent() {

  const codes = createMemo(() => {
    const cv = $currently_viewing()?.codes
    if (cv == null) { return null }

    function get_list_of_codes_for_dimension(dim: keyof CodesShape) {
      return find_leaves(cv![dim], v => !!v)
        .map(({ path }) => path.join(' :: '))
    }

    return Object.entries({
      concept: get_list_of_codes_for_dimension('concept'),
      "visual encoding": get_list_of_codes_for_dimension('visual encoding'),
      annotation: get_list_of_codes_for_dimension('annotation'),
      multiples: get_list_of_codes_for_dimension('multiples'),
      scope: get_list_of_codes_for_dimension('scope'),
      abstraction: get_list_of_codes_for_dimension('abstraction'),
      references: get_list_of_codes_for_dimension('references'),
    })
  })
  
  return (
    <div>
      <For each={codes()}>
        {([dim, codes]) => (
          <>
            <div class={s.dim}>{dim}</div>
            <ul class={s.ul}>
              <For each={codes}>
                {code => (
                  <li class={`${s.code} ${s[`dim-${dim.replace(/\s+/, '_')}`]}`}>
                    {code}
                  </li>
                )}
              </For>
            </ul>
          </>
        )}
      </For>
    </div>
  )
}