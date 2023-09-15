import { writeFile } from 'node:fs/promises'

import { getHighlighter } from 'shikiji'

import data from '../data/processed.json' assert { type: 'json' }

import night_owl_light from './night-owl-light-no-italic.json' assert { type: 'json' }

const shiki = await getHighlighter({
  themes: [
    night_owl_light,
    'github-light',
  ],
  langs: ['cpp'],
})

function gen(code) {
  return shiki.codeToHtml(code, { /*lang: 'cpp',*/ theme: 'github-light' })
}

const data_with_html = data.map(({ ascii, ...rest }) => ({ html: gen(ascii), ...rest }))

writeFile('./data/with-html.json', JSON.stringify(data_with_html, null, 2))