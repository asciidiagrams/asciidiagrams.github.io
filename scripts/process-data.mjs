/**
 * extract only the necessary data from the json.
 * 
 * that is, only the data that was coded,
 * and of those, only get the url/path, the ascii contents, and the codes
 */

import { writeFile } from 'node:fs/promises'

import _data from '../data/agg.json' assert { type: 'json' }

const path_RE = /github\.com\/.*?\/(?<repo>.*?)\/blob\/.+?\/(?<path>.*)#/
/**
 * formats the url to only include the repo and filepath within it
 */
function construct_path(url) {
  // intentionally error here if it fails, since we're only doing this at build time anyway
  const { repo, path } = url
    .trim()
    .match(path_RE)
    .groups

  return `${repo}/${path}`
}

function walk(o, f) {
  if (typeof o === 'object' && o != null) {
    for (const k in o) walk(o[k], f)
  } else {
    f(o)
  }
}
function has_any_true(codes) {
  let any_true = false
  walk(codes, x => { if(x) any_true = true })
  return any_true
}

const data = _data
  .filter(x => x.codes != null)
  // skip diagrams that were "coded" but we found were not actually ascii diagrams - they should not have any codes checked
  .filter(x => has_any_true(x.codes))
  .sort((a, b) => {
    const aa = a.name
    const bb = b.name
    return aa < bb ? -1 : aa > bb ? 1 : 0
  })
  .map(({ url, ascii, codes }) => ({ url, ascii, codes, path: construct_path(url) }))

writeFile('./data/processed.json', JSON.stringify(data, null, 2))