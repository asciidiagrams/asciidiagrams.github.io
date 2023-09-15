export type Primitive =
  | string
  | number
  | boolean
  | null
  | undefined
  | symbol
  | bigint

export type Tree<L extends Primitive = Primitive> = 
  { [K: string]: L | Tree }

export type Leaf<T extends Tree> =
  T extends Tree<infer L>
    ? L
    : never

/**
 * checks whether a treelike value (i.e. a tree or leaf) is a tree
 */
export function is_tree<T extends Tree>(x: T | Primitive): x is T {
  return !!x && typeof x === 'object'
}

export type Keys<T extends Tree> =
  Extract<keyof T, string>

export type DeepKeys<T> =
  T extends Primitive
    ? never
    : keyof T | DeepKeys<T[keyof T]>

/**
 * basic/minimal function to walk the leaves of the tree
 */
export function walk<T extends Tree, F extends (arg: Leaf<T>) => any>(o: T, f: F) {
  for (const k in o) {
    const v = o[k]
    if (is_tree(v)) {
      // @ts-ignore ts no likey this sort of thing
      walk(v, f)
    } else {
      // @ts-ignore ts no likey this sort of thing
      f(v)
    }
  }
}

/**
 * more memory intensive function to walk the leaves of the tree,
 * keeping track of the path (i.e. keys) needed to reach the leaf
 */
export function walk_with_path(o: Tree, f: (arg: Primitive, path: string[]) => any, path: string[] = []) {
  for (const k in o) {
    const v = o[k]
    const path_v = [...path, k]
    if (is_tree(v)) {
      // @ts-ignore ts no likey this sort of thing
      walk_with_path(v, f, path_v)
    } else {
      // @ts-ignore ts no likey this sort of thing
      f(v, path_v)
    }
  }
}

export type MapLeaves<T, L> =
  { [K in keyof T]: T[K] extends Primitive
    ? L
    : MapLeaves<T[K], L>
  }

export function map_leaves<T extends Tree, F extends (arg: Primitive) => any>(o: T, f: F): MapLeaves<T, ReturnType<F>> {
  let res = {}
  for (const k in o) {
    const v = o[k]
    // @ts-ignore typescript doesnt like this sort of stuff
    res[k] = is_tree(v)
      // @ts-ignore typescript doesnt like this sort of stuff
      ? map_leaves(v, f)
      // @ts-ignore typescript doesnt like this sort of stuff
      : f(v)
  }
  return res as MapLeaves<T, ReturnType<F>>
}

export function leaves<T extends Tree>(o: T): Leaf<T>[] {
  let res: Leaf<T>[] = []
  walk(o, l => res.push(l))
  return res
} 

export function deepget(o: Tree, path: string[]) {
  let res = o
  for (const p of path) {
    // @ts-ignore ts no likey
    res = res[p]
  }
  return res
}

export function deepset(o: Tree, path: string[], f: (arg: Tree | Primitive) => Tree | Primitive) {
  let p = deepget(o, path.slice(0, -1)!)
  let c = path[path.length - 1]
  p[c] = f(c)
}

export function find_leaves<T extends Tree, F extends (val: Leaf<T>, path: string[]) => boolean>(o: T, f: F): { path: string[], val: Leaf<T> }[] {
  let res: { path: string[], val: Leaf<T> }[] = []
  walk_with_path(o, (val, path) => {
    if (!f(val, path)) { return }
    res.push({ path, val })
  })
  return res
}