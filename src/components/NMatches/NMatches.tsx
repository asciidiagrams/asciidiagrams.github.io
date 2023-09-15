import { $matches } from '../../state/matches'

import s from './s.module.scss'

export function NMatches() {
  return (
    <div class={s.d}>
      {$matches().length} results
    </div>
  )
}