import { $matches } from '../../state/matches'

import s from './s.module.scss'

// this should properly resolve the `//` when base url is undefined or `/`
const base = (new URL(import.meta.env.BASE_URL ?? '/', import.meta.env.SITE)).href
const download_link = (new URL('static/collection.json', base)).href

export function MainContentHeader() {
  return (
    <div class={s.d}>
      <span class={s.nmatches}>{$matches().length} results</span>
      <a href={download_link} download class={s.download}>Download Full Collection (.json)</a>
    </div>
  )
}