/**
 * Maps visualizationId -> lazy React component loader.
 * Metadata (kind, label, status) lives in public/configs/dsa/topic-visualizations.json.
 *
 * Folder convention:
 *   src/components/visualizations/
 *   ├── array/               ArrayOperationsVisualization.jsx
 *   ├── binarySearch/        BinarySearchVisualization.jsx
 *   ├── stack/               StackOperationsVisualization.jsx
 *   ├── queue/               QueueOperationsVisualization.jsx
 *   ├── linkedList/          LinkedListVisualization.jsx
 *   ├── tree/                TreeVisualization.jsx
 *   ├── bst/                 BSTVisualization.jsx
 *   ├── heap/                HeapVisualization.jsx
 *   ├── hashTable/           HashTableVisualization.jsx
 *   ├── graph/               GraphVisualization.jsx
 *   ├── bfs/                 BFSVisualization.jsx
 *   ├── dfs/                 DFSVisualization.jsx
 *   ├── dijkstra/            DijkstraVisualization.jsx
 *   ├── bellmanFord/         BellmanFordVisualization.jsx
 *   ├── topologicalSort/     TopologicalSortVisualization.jsx
 *   ├── unionFind/           UnionFindVisualization.jsx
 *   ├── bubbleSort/          BubbleSortVisualization.jsx
 *   ├── selectionSort/       SelectionSortVisualization.jsx
 *   ├── insertionSort/       InsertionSortVisualization.jsx
 *   ├── mergeSort/           MergeSortVisualization.jsx
 *   ├── quickSort/           QuickSortVisualization.jsx
 *   ├── heapSort/            HeapSortVisualization.jsx
 *   ├── linearSearch/        LinearSearchVisualization.jsx
 *   ├── trie/                TrieVisualization.jsx
 *   ├── avlTree/             AVLTreeVisualization.jsx
 *   ├── redBlackTree/        RedBlackTreeVisualization.jsx
 *   ├── segmentTree/         SegmentTreeVisualization.jsx
 *   ├── fenwickTree/         FenwickTreeVisualization.jsx
 *   ├── dp/
 *   │   ├── FibonacciVisualization.jsx
 *   │   ├── KnapsackVisualization.jsx
 *   │   ├── LCSVisualization.jsx
 *   │   └── MaxSubarrayVisualization.jsx
 *   └── classic/
 *       ├── TwoSumVisualization.jsx
 *       ├── ValidParenthesesVisualization.jsx
 *       ├── ReverseLinkedListVisualization.jsx
 *       ├── PalindromeVisualization.jsx
 *       ├── TowerOfHanoiVisualization.jsx
 *       └── NQueensVisualization.jsx
 */

export const VISUALIZATION_LOADERS = {
  // ── Data Structures ────────────────────────────────────────────────────────
  array: () => import('./array/ArrayOperationsVisualization.jsx').then((m) => m.default),

  'linked-list': () =>
    import('./linkedList/LinkedListOperationsVisualization.jsx').then((m) => m.default),

  stack: () => import('./stack/StackOperationsVisualization.jsx').then((m) => m.default),

  // queue: () => import('./queue/QueueOperationsVisualization.jsx').then((m) => m.default),

  // 'binary-tree': () => import('./tree/TreeVisualization.jsx').then((m) => m.default),

  // 'binary-search-tree': () => import('./bst/BSTVisualization.jsx').then((m) => m.default),

  // heap: () => import('./heap/HeapVisualization.jsx').then((m) => m.default),

  // 'hash-table': () => import('./hashTable/HashTableVisualization.jsx').then((m) => m.default),

  // graph: () => import('./graph/GraphVisualization.jsx').then((m) => m.default),

  // trie: () => import('./trie/TrieVisualization.jsx').then((m) => m.default),

  // 'avl-tree': () => import('./avlTree/AVLTreeVisualization.jsx').then((m) => m.default),

  // 'red-black-tree': () =>
  //   import('./redBlackTree/RedBlackTreeVisualization.jsx').then((m) => m.default),

  // 'segment-tree': () => import('./segmentTree/SegmentTreeVisualization.jsx').then((m) => m.default),

  // 'fenwick-tree': () => import('./fenwickTree/FenwickTreeVisualization.jsx').then((m) => m.default),

  // // ── Sorting Algorithms ────────────────────────────────────────────────────
  // 'bubble-sort': () => import('./bubbleSort/BubbleSortVisualization.jsx').then((m) => m.default),

  // 'selection-sort': () =>
  //   import('./selectionSort/SelectionSortVisualization.jsx').then((m) => m.default),

  // 'insertion-sort': () =>
  //   import('./insertionSort/InsertionSortVisualization.jsx').then((m) => m.default),

  // 'merge-sort': () => import('./mergeSort/MergeSortVisualization.jsx').then((m) => m.default),

  // 'quick-sort': () => import('./quickSort/QuickSortVisualization.jsx').then((m) => m.default),

  // 'heap-sort': () => import('./heapSort/HeapSortVisualization.jsx').then((m) => m.default),

  // // ── Searching Algorithms ──────────────────────────────────────────────────
  // 'linear-search': () =>
  //   import('./linearSearch/LinearSearchVisualization.jsx').then((m) => m.default),

  // 'binary-search': () =>
  //   import('./binarySearch/BinarySearchVisualization.jsx').then((m) => m.default),

  // // ── Graph Algorithms ──────────────────────────────────────────────────────
  // bfs: () => import('./bfs/BFSVisualization.jsx').then((m) => m.default),

  // dfs: () => import('./dfs/DFSVisualization.jsx').then((m) => m.default),

  // dijkstra: () => import('./dijkstra/DijkstraVisualization.jsx').then((m) => m.default),

  // 'bellman-ford': () => import('./bellmanFord/BellmanFordVisualization.jsx').then((m) => m.default),

  // 'topological-sort': () =>
  //   import('./topologicalSort/TopologicalSortVisualization.jsx').then((m) => m.default),

  // 'union-find': () => import('./unionFind/UnionFindVisualization.jsx').then((m) => m.default),

  // // ── Dynamic Programming ───────────────────────────────────────────────────
  // 'fibonacci-dp': () => import('./dp/FibonacciVisualization.jsx').then((m) => m.default),

  // 'knapsack-01': () => import('./dp/KnapsackVisualization.jsx').then((m) => m.default),

  // 'longest-common-subsequence': () => import('./dp/LCSVisualization.jsx').then((m) => m.default),

  // 'maximum-subarray': () => import('./dp/MaxSubarrayVisualization.jsx').then((m) => m.default),

  // // ── Classic Problems ──────────────────────────────────────────────────────
  // 'two-sum': () => import('./classic/TwoSumVisualization.jsx').then((m) => m.default),

  // 'valid-parentheses': () =>
  //   import('./classic/ValidParenthesesVisualization.jsx').then((m) => m.default),

  // 'reverse-linked-list': () =>
  //   import('./classic/ReverseLinkedListVisualization.jsx').then((m) => m.default),

  // 'palindrome-check': () => import('./classic/PalindromeVisualization.jsx').then((m) => m.default),

  // 'tower-of-hanoi': () => import('./classic/TowerOfHanoiVisualization.jsx').then((m) => m.default),

  // 'n-queens': () => import('./classic/NQueensVisualization.jsx').then((m) => m.default),

  // // ── Techniques ────────────────────────────────────────────────────────────
  // 'two-pointers': () => import('./classic/TwoSumVisualization.jsx').then((m) => m.default), // reuses two-pointer pattern

  // 'sliding-window': () => import('./classic/SlidingWindowVisualization.jsx').then((m) => m.default),
};

/**
 * @param {string} visualizationId
 * @returns {Promise<React.ComponentType>}
 */
export async function loadVisualization(visualizationId) {
  const loader = VISUALIZATION_LOADERS[visualizationId];
  if (!loader) {
    throw new Error(`No visualization registered for "${visualizationId}".`);
  }
  return loader();
}

export function hasVisualization(visualizationId) {
  return Boolean(VISUALIZATION_LOADERS[visualizationId]);
}
