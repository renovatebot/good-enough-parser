import { zipper } from '@thi.ng/zipper';
import { isTree } from './tree.ts';
import type { Cursor, Node, Tree } from './types.ts';

export function createCursor(tree: Node): Cursor {
  return zipper<Node>(
    {
      branch: isTree,
      children: (x) => (<Tree>x).children,
      factory: (tree, children) => ({ ...tree, children }),
    },
    tree,
  );
}
