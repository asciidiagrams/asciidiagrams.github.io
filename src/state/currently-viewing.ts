import { createSignal } from 'solid-js'

import { $matches } from './matches'

import type { ElementOf } from '../utils/types'
import type { data } from '../data'

export const [$currently_viewing, set_$currently_viewing] = createSignal<ElementOf<typeof data> | null>($matches()[0] ?? null)

