import { codes_obj } from '../../data'

import { FiltersItems } from './FiltersItems'

import s from './s.module.scss'

export function Filters() {
  
  return (
    <ul class={s.ul}>
      <FiltersItems o={codes_obj} path={[]} />
    </ul>
  )
}