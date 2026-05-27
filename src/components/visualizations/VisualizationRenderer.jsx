import { Alert } from '../shared';
import ArrayBarsVisualization from './types/ArrayBarsVisualization';
import ArrayBoxesVisualization from './types/ArrayBoxesVisualization';
import LinearBlocksVisualization from './types/LinearBlocksVisualization';
import TreeNodeVisualization from './types/TreeNodeVisualization';
import LinkedListVisualization from './types/LinkedListVisualization';
import GraphVisualization from './types/GraphVisualization';
import HashTableVisualization from './types/HashTableVisualization';

/**
 * Unified renderer for all visualization kinds.
 *
 * All variants consume the same source of truth: `steps` JSON + `stepIndex`.
 *
 * ─── Supported kinds ──────────────────────────────────────────────────────
 *
 * ARRAY
 *   'array-bars'      ArrayBarsVisualization  — bar chart (sorting, binary search)
 *   'sorting'         alias → array-bars
 *   'array-boxes'     ArrayBoxesVisualization — indexed box cells (array ops)
 *
 * LINKED LIST
 *   'linked-list'     LinkedListVisualization — singly linked list
 *   'doubly-linked-list' → linked-list with mode="doubly"
 *
 * LINEAR (STACK / QUEUE)
 *   'stack'           LinearBlocksVisualization mode="stack"
 *   'queue'           LinearBlocksVisualization mode="queue"
 *   'deque'           LinearBlocksVisualization mode="queue"  (same view)
 *
 * TREE / HEAP
 *   'tree'            TreeNodeVisualization mode="tree"
 *   'bst'             TreeNodeVisualization mode="bst"
 *   'heap'            TreeNodeVisualization mode="heap"
 *   'min-heap'        → heap
 *   'max-heap'        → heap
 *   'avl-tree'        → tree
 *   'red-black-tree'  → tree
 *
 * GRAPH
 *   'graph'           GraphVisualization mode="undirected"
 *   'directed-graph'  GraphVisualization mode="directed"
 *   'dag'             → directed-graph
 *   'bfs'             → graph  (step data carries visitedNodes, etc.)
 *   'dfs'             → graph
 *   'dijkstra'        → directed-graph
 *
 * HASH
 *   'hash-table'      HashTableVisualization mode="chaining"
 *   'hash-map'        → hash-table
 *   'open-addressing' HashTableVisualization mode="probing"
 *
 * ─────────────────────────────────────────────────────────────────────────
 */
export default function VisualizationRenderer({ kind = 'array-bars', steps = [], stepIndex = 0 }) {
  switch (kind) {
    // ── Array ─────────────────────────────────────────────────────────────
    case 'array-bars':
    case 'sorting':
      return <ArrayBarsVisualization steps={steps} stepIndex={stepIndex} />;

    case 'array-boxes':
      return <ArrayBoxesVisualization steps={steps} stepIndex={stepIndex} />;

    // ── Linked List ───────────────────────────────────────────────────────
    case 'linked-list':
      return <LinkedListVisualization steps={steps} stepIndex={stepIndex} mode="singly" />;

    case 'doubly-linked-list':
      return <LinkedListVisualization steps={steps} stepIndex={stepIndex} mode="doubly" />;

    // ── Stack / Queue / Deque ─────────────────────────────────────────────
    case 'stack':
      return <LinearBlocksVisualization steps={steps} stepIndex={stepIndex} mode="stack" />;

    case 'queue':
    case 'deque':
      return <LinearBlocksVisualization steps={steps} stepIndex={stepIndex} mode="queue" />;

    // ── Tree / BST / Heap ─────────────────────────────────────────────────
    case 'tree':
    case 'avl-tree':
    case 'red-black-tree':
    case 'trie':
      return <TreeNodeVisualization steps={steps} stepIndex={stepIndex} mode="tree" />;

    case 'bst':
    case 'binary-search-tree':
      return <TreeNodeVisualization steps={steps} stepIndex={stepIndex} mode="bst" />;

    case 'heap':
    case 'min-heap':
    case 'max-heap':
      return <TreeNodeVisualization steps={steps} stepIndex={stepIndex} mode="heap" />;

    // ── Graph ─────────────────────────────────────────────────────────────
    case 'graph':
    case 'bfs':
    case 'dfs':
      return <GraphVisualization steps={steps} stepIndex={stepIndex} mode="undirected" />;

    case 'directed-graph':
    case 'dag':
    case 'dijkstra':
    case 'topological-sort':
    case 'bellman-ford':
      return <GraphVisualization steps={steps} stepIndex={stepIndex} mode="directed" />;

    // ── Hash Table ────────────────────────────────────────────────────────
    case 'hash-table':
    case 'hash-map':
      return <HashTableVisualization steps={steps} stepIndex={stepIndex} mode="chaining" />;

    case 'open-addressing':
      return <HashTableVisualization steps={steps} stepIndex={stepIndex} mode="probing" />;

    // ── Fallback ──────────────────────────────────────────────────────────
    default:
      return (
        <Alert severity="info">
          Visualization kind <code>{kind}</code> is not implemented yet.
        </Alert>
      );
  }
}
