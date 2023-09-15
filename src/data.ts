import type { MapLeaves, Primitive } from './utils/tree'

export { default as data } from '../data/with-html.json' assert { type: 'json' }

export const codes_obj = {
  "visual encoding": {
    "connection": {
      "linear": false,
      "tree": false,
      "graph": {
        "directed": true,
        "undirected": false
      }
    },
    "geometric layout (schematic)": false,
    "table": false,
    "nested": false,
    "sequential": {
      "single": false,
      "aligned": false
    },
    "math notation": false,
    "code annotation": false,
    "pictorial": false
  },
  "annotation": {
    "point": false,
    "multi-point": false,
    "range": false,
    "legend": false
  },
  "abstraction": {
    "unpatterned elision": {
      "fragment of bigger thing": false,
      "other": false
    },
    "patterned elision": {
      "enumerative": false,
      "other": false
    }
  },
  "multiples": {
    "multiple representations": false,
    "multiple scenarios": {
      "over time": false,
      "other": false
    }
  },
  "scope": {
    "file": false,
    "class": true,
    "not whole file": {
      "multiple functions": false,
      "function": false,
      "multiple statements": false,
      "statement": false
    }
  },
  "references": {
    "identifiers": false,
    "constants": false,
    "expressions": false
  },
  "concept": {
    "hardware": false,
    "data": {
      "data format": {
        "bit interpretation": false,
        "other": false
      },
      "data structure": false,
      "memory layout": false,
      "other": false
    },
    "resource management": {
      "memory": false,
      "other": false
    },
    "geometry / graphics": {
      "user interface sketch": false,
      "other": false
    },
    "algorithm / data processing": {
      "math formulas / calculation": false,
      "other": false
    },
    "test case": false,
    "synchronization": {
      "threads": true,
      "hardware signal timing": false,
      "queuing / scheduling": false,
      "other": false
    },
    "layout / architecture / ownership": {
      "actor interactions": false,
      "class diagrams": false,
      "other": false
    },
    "information flow / instructions": {
      "conditional control flow": {
        "state machines": false,
        "other": false
      },
      "data flow": false,
      "programs": false,
      "other": true
    }
  }
}

export type CodesShape<T = Primitive> = MapLeaves<typeof codes_obj, T>