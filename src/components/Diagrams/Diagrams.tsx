import { For, createMemo, onMount } from "solid-js"

import { $matches } from "../../state/matches"
import { set_$currently_viewing } from "../../state/currently-viewing"

import s from './s.module.scss'

import type { CodesShape } from "../../data"

export function Diagrams() {
  let ref: HTMLUListElement | undefined = undefined

  let refs = createMemo(() => $matches().map(_ => undefined) as (HTMLLIElement | undefined)[])

  // ngl this hacky but w/e
  onMount(() => {
    function listener() {
      const next_viewing = refs().findIndex(el => (el?.getBoundingClientRect().top ?? 0) >= 48)
      const is_first = next_viewing === 0
      const is_last = next_viewing === $matches().length - 1
      
      if (is_first || is_last) {
        set_$currently_viewing($matches()[next_viewing])
        return
      }

      // must be the last one, or there are no matches.
      // if there are no matches, set currently viewing to null
      if (next_viewing == null) {
        set_$currently_viewing($matches().at(-1) ?? null)
        return
      }

      set_$currently_viewing($matches()[next_viewing - 1])
    }

    ref?.addEventListener('scroll', listener)
    return () => {
      ref?.removeEventListener('scroll', listener)
    }
  })


  return (
    <ul ref={ref} class={s.ul}>
      <For each={$matches()}>
        {(diagram, i) => <Diagram {...diagram} ref={el => refs()[i()] = el} />}
      </For>
      <div style={{ height: '100vh' }} />
    </ul>
  )
}

type DiagramProps = {
  ref: (el: HTMLLIElement) => void
  url: string
  path: string
  codes: CodesShape<boolean>
  html: string
} 
function Diagram(props: DiagramProps) {
  return (
    <li ref={props.ref} class={s.li}>
      <a href={props.url} class={s.path}>{props.path}</a>
      <div innerHTML={props.html} />
    </li>
  )
}