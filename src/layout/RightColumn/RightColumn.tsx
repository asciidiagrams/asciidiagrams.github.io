import s from './s.module.scss'

import type { JSX } from 'solid-js/jsx-runtime'

type RightColumnProps = {
  children: JSX.Element
}

export function RightColumn(props: RightColumnProps) {
  return (
    <div class={s.rc}>
      {props.children}
    </div>
  )
}