import s from './s.module.scss'

import type { JSX } from 'solid-js/jsx-runtime'

type SidebarProps = {
  children: JSX.Element
}

export function MainContent(props: SidebarProps) {
  return (
    <div class={s.main}>
      {props.children}
    </div>
  )
}