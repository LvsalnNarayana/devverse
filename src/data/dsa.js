// ============================================================================
// DSA TOPICS DATA - INTERVIEW ESSENTIALS
// ============================================================================
// Focused on the most commonly asked interview topics:
// - Sorting & Searching Algorithms
// - Data Structures (Arrays, Linked Lists, Stacks, Queues, Trees, Graphs)
// - Classic Problems (N-Queens, Tower of Hanoi, etc.)
// - Graph Traversals (BFS, DFS)
// ============================================================================
export const dsaTopics = [
  // ==================== SORTING ALGORITHMS ====================
  {
    id: 'bubble-sort',
    active: true,
    title: 'Bubble Sort',
    description:
      'Repeatedly compares adjacent elements and swaps them if out of order, bubbling the largest unsorted element to its correct position each pass.',
    category: 'Sorting',
    difficulty: 'Easy',
    tags: ['Sorting', 'Comparison', 'In-Place', 'Stable', 'Adaptive'],
    complexity: {
      time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
    },
    interviewFrequency: 'High',
    keyPoints: [
      'Simple but inefficient for large arrays',
      'Stable sort — preserves relative order of equal elements',
      'Adaptive — detects already-sorted input in O(n) with early exit flag',
      'Foundational for teaching comparison-based sorting concepts',
    ],
  },
  {
    id: 'selection-sort',
    active: true,
    title: 'Selection Sort',
    description:
      'Finds the minimum element in the unsorted portion and swaps it into the correct position, extending the sorted region one element at a time.',
    category: 'Sorting',
    difficulty: 'Easy',
    tags: ['Sorting', 'Comparison', 'In-Place', 'Unstable'],
    complexity: {
      time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
    },
    interviewFrequency: 'Medium',
    keyPoints: [
      'Always O(n²) comparisons regardless of input',
      'Performs only n-1 swaps — ideal when write operations are costly',
      'Not stable — equal elements may change relative order',
      'Simple implementation with no auxiliary space',
    ],
  },
  {
    id: 'insertion-sort',
    active: true,
    title: 'Insertion Sort',
    description:
      'Builds a sorted array one element at a time by inserting each new element into its correct position among already-sorted elements.',
    category: 'Sorting',
    difficulty: 'Easy',
    tags: ['Sorting', 'Comparison', 'In-Place', 'Stable', 'Adaptive', 'Online'],
    complexity: {
      time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
    },
    interviewFrequency: 'High',
    keyPoints: [
      'Efficient for small or nearly-sorted arrays',
      'Stable and adaptive — O(n) on nearly-sorted input',
      'Online algorithm — can sort a stream as data arrives',
      'Used as the base case in hybrid sorts like Timsort and Introsort',
    ],
  },
  {
    id: 'merge-sort',
    active: true,
    title: 'Merge Sort',
    description:
      'Recursively divides the array in half, sorts each half, then merges the two sorted halves into a single sorted array.',
    category: 'Sorting',
    difficulty: 'Medium',
    tags: ['Sorting', 'Divide & Conquer', 'Recursive', 'Stable', 'External Sort'],
    complexity: {
      time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
      space: 'O(n)',
    },
    interviewFrequency: 'Very High',
    keyPoints: [
      'Guaranteed O(n log n) — no worst-case degradation',
      'Stable sort — preserves order of equal elements',
      'Not in-place — requires O(n) auxiliary space',
      'Preferred for linked lists and external sorting (disk-based)',
    ],
  },
  {
    id: 'quick-sort',
    active: true,
    title: 'Quick Sort',
    description:
      'Selects a pivot element, partitions the array so all smaller elements are left and larger are right, then recursively sorts each partition.',
    category: 'Sorting',
    difficulty: 'Medium',
    tags: ['Sorting', 'Divide & Conquer', 'Recursive', 'In-Place', 'Unstable'],
    complexity: {
      time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
      space: 'O(log n)',
    },
    interviewFrequency: 'Very High',
    keyPoints: [
      'Fastest practical sorting algorithm on average due to low cache misses',
      'In-place but not stable — equal elements may reorder',
      'Worst case O(n²) with bad pivot selection (e.g. sorted input, naive pivot)',
      'Optimized with randomized pivot or 3-way partitioning for duplicates',
    ],
  },
  {
    id: 'heap-sort',
    active: true,
    title: 'Heap Sort',
    description:
      'Builds a max-heap from the array, then repeatedly extracts the maximum element and places it at the end, shrinking the heap each time.',
    category: 'Sorting',
    difficulty: 'Hard',
    tags: ['Sorting', 'Heap', 'In-Place', 'Unstable', 'Comparison'],
    complexity: {
      time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
      space: 'O(1)',
    },
    interviewFrequency: 'Medium',
    keyPoints: [
      'Guaranteed O(n log n) with O(1) auxiliary space',
      'Not stable — relative order of equal elements is not preserved',
      'Requires understanding of the heap data structure',
      'Rarely used in practice due to poor cache performance vs Quick Sort',
    ],
  },

  // ==================== SEARCHING ALGORITHMS ====================
  {
    id: 'linear-search',
    active: true,
    title: 'Linear Search',
    description:
      'Scans each element in the array sequentially from start to end until the target is found or all elements are exhausted.',
    category: 'Searching',
    difficulty: 'Easy',
    tags: ['Searching', 'Sequential', 'Unsorted', 'Brute Force'],
    complexity: {
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(1)',
    },
    interviewFrequency: 'Medium',
    keyPoints: [
      'Works on unsorted and unstructured data',
      'No preprocessing or extra space required',
      'Only viable option when random access is not available (e.g. linked lists)',
      'Baseline comparison for evaluating more advanced search techniques',
    ],
  },
  {
    id: 'binary-search',
    active: true,
    title: 'Binary Search',
    description:
      'Repeatedly halves the search space on a sorted array by comparing the target against the middle element, discarding the half where the target cannot be.',
    category: 'Searching',
    difficulty: 'Medium',
    tags: ['Searching', 'Divide & Conquer', 'Sorted', 'Logarithmic'],
    complexity: {
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
      space: 'O(1)',
    },
    interviewFrequency: 'Very High',
    keyPoints: [
      'Requires a sorted, randomly-accessible collection',
      'O(log n) — eliminates half the candidates each iteration',
      'Template extends to rotated arrays, answer-space binary search, and more',
      'Edge cases: empty array, single element, target at boundaries',
    ],
  },

  // ==================== GRAPH ALGORITHMS ====================
  {
    id: 'bfs',
    active: true,
    title: 'Breadth-First Search (BFS)',
    description:
      'Traverses a graph level by level using a queue, visiting all neighbors of the current node before moving to the next depth layer.',
    category: 'Graph Algorithms',
    difficulty: 'Medium',
    tags: ['Graph', 'Traversal', 'Queue', 'Shortest Path', 'Level Order'],
    complexity: {
      time: 'O(V + E)',
      space: 'O(V)',
    },
    interviewFrequency: 'Very High',
    keyPoints: [
      'Guarantees shortest path in unweighted graphs',
      'Uses a queue — explores wide before going deep',
      'Detects bipartiteness and connected components',
      'Basis for multi-source BFS, 0-1 BFS, and level-order tree traversal',
    ],
  },
  {
    id: 'dfs',
    active: true,
    title: 'Depth-First Search (DFS)',
    description:
      'Traverses a graph by going as deep as possible along each branch before backtracking, using an explicit stack or the call stack via recursion.',
    category: 'Graph Algorithms',
    difficulty: 'Medium',
    tags: ['Graph', 'Traversal', 'Stack', 'Recursion', 'Backtracking'],
    complexity: {
      time: 'O(V + E)',
      space: 'O(V)',
    },
    interviewFrequency: 'Very High',
    keyPoints: [
      'More memory-efficient than BFS for deep, narrow graphs',
      'Detects cycles, connected components, and bridges',
      'Foundation for topological sort and strongly connected components',
      'Applies to tree traversals (preorder, inorder, postorder) and maze solving',
    ],
  },
  {
    id: 'dijkstra',
    active: true,
    title: "Dijkstra's Algorithm",
    description:
      'Finds shortest paths from a source vertex to all others in a weighted graph with non-negative edge weights, using a greedy approach with a min-heap.',
    category: 'Graph Algorithms',
    difficulty: 'Medium',
    tags: ['Graph', 'Shortest Path', 'Greedy', 'Weighted', 'Priority Queue'],
    complexity: {
      time: 'O((V + E) log V)',
      space: 'O(V)',
    },
    interviewFrequency: 'High',
    keyPoints: [
      'Requires non-negative edge weights — fails with negative edges',
      'Uses a min-heap (priority queue) to greedily pick the closest unvisited node',
      'Produces shortest-path tree from source to all reachable vertices',
      'Extended by A* with a heuristic for goal-directed search',
    ],
  },
  {
    id: 'bellman-ford',
    active: true,
    title: 'Bellman-Ford Algorithm',
    description:
      'Computes shortest paths from a source vertex in graphs that may contain negative edge weights, detecting negative-weight cycles in the process.',
    category: 'Graph Algorithms',
    difficulty: 'Medium',
    tags: ['Graph', 'Shortest Path', 'Negative Weights', 'Dynamic Programming'],
    complexity: {
      time: 'O(V × E)',
      space: 'O(V)',
    },
    interviewFrequency: 'Medium',
    keyPoints: [
      'Handles negative edge weights — unlike Dijkstra',
      'Detects negative-weight cycles by running one extra relaxation round',
      'Relaxes all edges V-1 times to guarantee shortest paths',
      'Slower than Dijkstra but more general',
    ],
  },
  {
    id: 'topological-sort',
    active: true,
    title: 'Topological Sort',
    description:
      'Produces a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u → v, vertex u appears before v.',
    category: 'Graph Algorithms',
    difficulty: 'Medium',
    tags: ['Graph', 'DAG', 'DFS', "Kahn's Algorithm", 'Ordering'],
    complexity: {
      time: 'O(V + E)',
      space: 'O(V)',
    },
    interviewFrequency: 'High',
    keyPoints: [
      'Only valid on Directed Acyclic Graphs (DAGs)',
      "Two approaches: DFS post-order reversal or Kahn's BFS-based algorithm",
      "Kahn's algorithm also detects cycles (leftover nodes with in-degree > 0)",
      'Used in build systems, task scheduling, and dependency resolution',
    ],
  },
  {
    id: 'union-find',
    active: true,
    title: 'Union-Find (Disjoint Set Union)',
    description:
      'Tracks a collection of disjoint sets and supports near-constant-time union and find operations using path compression and union by rank.',
    category: 'Graph Algorithms',
    difficulty: 'Medium',
    tags: ['Graph', 'Connectivity', 'Disjoint Set', 'Path Compression', 'Kruskal'],
    complexity: {
      time: 'O(α(n)) amortized per operation',
      space: 'O(n)',
    },
    interviewFrequency: 'High',
    keyPoints: [
      'Path compression flattens the tree on every find',
      'Union by rank keeps the tree shallow',
      'Detects connected components and cycles in undirected graphs',
      "Core component of Kruskal's MST algorithm",
    ],
  },

  // ==================== DATA STRUCTURES ====================
  {
    id: 'array',
    active: true,
    title: 'Array',
    description:
      'Contiguous block of memory storing fixed-size elements of the same type, providing O(1) random access by index.',
    category: 'Data Structures',
    difficulty: 'Easy',
    structureKind: 'Linear',
    tags: ['Array', 'Linear', 'Contiguous Memory', 'Random Access', 'Cache Friendly'],
    complexity: {
      access: 'O(1)',
      search: 'O(n)',
      insert: 'O(n)',
      delete: 'O(n)',
    },
    interviewFrequency: 'Very High',
    keyPoints: [
      'O(1) index access — most cache-friendly data structure',
      'Insert and delete require shifting elements — O(n) in the worst case',
      'Dynamic arrays (ArrayList, Vec) amortize resizing to O(1) append',
      'Foundation for heaps, hash tables, and most sorting algorithms',
    ],
  },
  {
    id: 'linked-list',
    active: true,
    title: 'Linked List',
    description:
      'Sequence of nodes where each node stores data and a pointer to the next (singly) or both next and previous nodes (doubly), enabling dynamic size without contiguous memory.',
    category: 'Data Structures',
    difficulty: 'Easy',
    structureKind: 'Linear',
    tags: ['Linked List', 'Linear', 'Pointers', 'Dynamic Size', 'Singly', 'Doubly'],
    complexity: {
      access: 'O(n)',
      search: 'O(n)',
      insertHead: 'O(1)',
      insertTail: 'O(1) with tail pointer',
      delete: 'O(1) at known node',
    },
    interviewFrequency: 'Very High',
    keyPoints: [
      'O(1) insert and delete at a known node — no shifting required',
      'No random access — must traverse from head to reach a node',
      "Classic interview patterns: reverse, cycle detection (Floyd's), merge two lists",
      'Doubly linked lists allow O(1) delete without needing the previous pointer',
    ],
  },
  {
    id: 'stack',
    active: true,
    title: 'Stack',
    description:
      'Abstract data type following Last-In-First-Out (LIFO) order — elements are pushed and popped from the same end.',
    category: 'Data Structures',
    difficulty: 'Easy',
    structureKind: 'Linear',
    tags: ['Stack', 'LIFO', 'Linear', 'ADT', 'Recursion', 'DFS'],
    complexity: {
      push: 'O(1)',
      pop: 'O(1)',
      peek: 'O(1)',
      search: 'O(n)',
    },
    interviewFrequency: 'Very High',
    keyPoints: [
      'LIFO — most recently pushed element is always popped first',
      'Models function call stacks, undo/redo history, and DFS traversal',
      'Implement with a dynamic array or singly linked list',
      'Key patterns: valid parentheses, monotonic stack, next greater element',
    ],
  },
  {
    id: 'queue',
    active: true,
    title: 'Queue',
    description:
      'Abstract data type following First-In-First-Out (FIFO) order — elements are enqueued at the rear and dequeued from the front.',
    category: 'Data Structures',
    difficulty: 'Easy',
    structureKind: 'Linear',
    tags: ['Queue', 'FIFO', 'Linear', 'ADT', 'BFS', 'Deque'],
    complexity: {
      enqueue: 'O(1)',
      dequeue: 'O(1)',
      peek: 'O(1)',
      search: 'O(n)',
    },
    interviewFrequency: 'High',
    keyPoints: [
      'FIFO — elements are processed in the order they arrive',
      'Core data structure for BFS and level-order tree traversal',
      'Circular buffer implementation avoids shifting in array-backed queues',
      'Variants: deque (double-ended), priority queue (heap-backed)',
    ],
  },
  {
    id: 'binary-tree',
    active: true,
    title: 'Binary Tree',
    description:
      'Hierarchical data structure where each node has at most two children referred to as the left child and right child.',
    category: 'Data Structures',
    difficulty: 'Medium',
    structureKind: 'Tree',
    tags: ['Binary Tree', 'Tree', 'Recursive', 'Traversal', 'Hierarchy'],
    complexity: {
      access: 'O(n)',
      search: 'O(n)',
      insert: 'O(n)',
      delete: 'O(n)',
    },
    interviewFrequency: 'Very High',
    keyPoints: [
      'Four traversals: inorder, preorder, postorder, and level-order (BFS)',
      'Height determines complexity — balanced is O(log n), skewed is O(n)',
      'Recursive DFS is the natural solution pattern for most tree problems',
      'Base for BSTs, heaps, tries, and segment trees',
    ],
  },
  {
    id: 'binary-search-tree',
    active: true,
    title: 'Binary Search Tree (BST)',
    description:
      'Binary tree with an ordering invariant: for every node, all values in the left subtree are smaller and all values in the right subtree are larger.',
    category: 'Data Structures',
    difficulty: 'Medium',
    structureKind: 'Tree',
    tags: ['BST', 'Tree', 'Search', 'Sorted', 'Ordered'],
    complexity: {
      access: 'O(log n) avg / O(n) worst',
      search: 'O(log n) avg / O(n) worst',
      insert: 'O(log n) avg / O(n) worst',
      delete: 'O(log n) avg / O(n) worst',
    },
    interviewFrequency: 'Very High',
    keyPoints: [
      'Inorder traversal yields elements in sorted ascending order',
      'O(log n) when the tree is balanced; degrades to O(n) when skewed',
      'Three delete cases: leaf node, one child, two children (replace with inorder successor)',
      'Self-balancing variants (AVL, Red-Black) guarantee O(log n) height',
    ],
  },
  {
    id: 'heap',
    active: true,
    title: 'Heap',
    description:
      'Complete binary tree satisfying the heap property: in a min-heap every parent is ≤ its children; in a max-heap every parent is ≥ its children.',
    category: 'Data Structures',
    difficulty: 'Medium',
    structureKind: 'Tree',
    tags: ['Heap', 'Priority Queue', 'Tree', 'Complete Binary Tree', 'Min-Heap', 'Max-Heap'],
    complexity: {
      insert: 'O(log n)',
      extractMin: 'O(log n)',
      peek: 'O(1)',
      build: 'O(n)',
    },
    interviewFrequency: 'Very High',
    keyPoints: [
      'Stored as an array using index arithmetic: parent at ⌊(i-1)/2⌋, children at 2i+1 and 2i+2',
      'Powers priority queues — the abstraction used in Dijkstra and Prim',
      'Common patterns: k-largest elements, merge k sorted lists, median in a stream',
      'Not a BST — only partial order is guaranteed, not full sorted order',
    ],
  },
  {
    id: 'hash-table',
    active: true,
    title: 'Hash Table',
    description:
      'Key-value store where a hash function maps keys to array indices (buckets), enabling average O(1) insert, delete, and lookup.',
    category: 'Data Structures',
    difficulty: 'Medium',
    structureKind: 'Hash',
    tags: ['Hash Table', 'Hash Map', 'Dictionary', 'Key-Value', 'Collision Resolution'],
    complexity: {
      search: 'O(1) avg / O(n) worst',
      insert: 'O(1) avg / O(n) worst',
      delete: 'O(1) avg / O(n) worst',
      space: 'O(n)',
    },
    interviewFrequency: 'Very High',
    keyPoints: [
      'Average O(1) operations with a good hash function and low load factor',
      'Collision strategies: separate chaining (linked list per bucket) vs open addressing (linear probing)',
      'Classic use cases: two sum, frequency counting, anagram detection, caching',
      'Keys must be immutable and hashable — mutable objects as keys cause subtle bugs',
    ],
  },
  {
    id: 'trie',
    active: true,
    title: 'Trie (Prefix Tree)',
    description:
      'Tree-shaped structure for storing a dynamic set of strings where nodes on a path from root to a marked node spell out a word, sharing common prefixes.',
    category: 'Data Structures',
    difficulty: 'Medium',
    structureKind: 'Tree',
    tags: ['Trie', 'Prefix Tree', 'String', 'Autocomplete', 'Pattern Matching'],
    complexity: {
      insert: 'O(m)',
      search: 'O(m)',
      space: 'O(ALPHABET_SIZE × n × m)',
    },
    interviewFrequency: 'High',
    keyPoints: [
      'm is key length — search time is independent of the number of stored keys',
      'Applications: autocomplete, spell checking, IP longest prefix match',
      'Compress shared suffixes with a radix tree (compressed trie) to save space',
      'Contrast with hash table: trie supports prefix queries, hash table does not',
    ],
  },
  {
    id: 'graph',
    active: true,
    title: 'Graph',
    description:
      'Collection of vertices (nodes) and edges (connections) between them, representing pairwise relationships — may be directed or undirected, weighted or unweighted.',
    category: 'Data Structures',
    difficulty: 'Medium',
    structureKind: 'Graph',
    tags: ['Graph', 'Vertices', 'Edges', 'Adjacency List', 'Adjacency Matrix', 'BFS', 'DFS'],
    complexity: {
      storageList: 'O(V + E)',
      storageMatrix: 'O(V²)',
      edgeCheck: 'O(1) matrix / O(degree) list',
    },
    interviewFrequency: 'Very High',
    keyPoints: [
      'Adjacency list for sparse graphs; adjacency matrix for dense graphs or O(1) edge queries',
      'BFS for shortest paths in unweighted graphs; DFS for connectivity and cycle detection',
      'Directed Acyclic Graphs (DAGs) support topological sorting',
      'Key algorithms: Dijkstra, Bellman-Ford, Kruskal, Prim, Floyd-Warshall',
    ],
  },
  {
    id: 'fenwick-tree',
    active: true,
    title: 'Fenwick Tree (Binary Indexed Tree)',
    description:
      'Array-backed structure supporting prefix sum queries and point updates in O(log n) time with very low constant factors and simple implementation.',
    category: 'Data Structures',
    difficulty: 'Medium',
    structureKind: 'Range Query',
    tags: ['Fenwick Tree', 'BIT', 'Prefix Sum', 'Range Query', 'Point Update'],
    complexity: {
      pointUpdate: 'O(log n)',
      prefixQuery: 'O(log n)',
      build: 'O(n log n)',
      space: 'O(n)',
    },
    interviewFrequency: 'Medium',
    keyPoints: [
      'Simpler to code than a segment tree for pure prefix sum problems',
      'Exploits the lowest set bit (i & -i) to navigate the implicit tree',
      'Range sum computed as two prefix queries: sum(r) - sum(l-1)',
      'Extend to 2D Fenwick tree for matrix prefix sums',
    ],
  },
  {
    id: 'segment-tree',
    active: true,
    title: 'Segment Tree',
    description:
      'Binary tree built over array intervals that supports range queries (sum, min, max) and point or range updates in O(log n).',
    category: 'Data Structures',
    difficulty: 'Hard',
    structureKind: 'Range Query',
    tags: ['Segment Tree', 'Range Query', 'Range Update', 'Lazy Propagation', 'Interval Tree'],
    complexity: {
      query: 'O(log n)',
      pointUpdate: 'O(log n)',
      rangeUpdate: 'O(log n) with lazy propagation',
      build: 'O(n)',
      space: 'O(4n)',
    },
    interviewFrequency: 'Medium',
    keyPoints: [
      'Generalizes to any associative operation: sum, min, max, GCD, XOR',
      'Lazy propagation defers range updates to achieve O(log n) per operation',
      'More flexible than Fenwick tree but more complex to implement',
      'Array implementation uses ~4n nodes; index children at 2i and 2i+1',
    ],
  },
  {
    id: 'avl-tree',
    active: true,
    title: 'AVL Tree',
    description:
      'Self-balancing BST that maintains a balance factor |height(left) - height(right)| ≤ 1 at every node, enforced through single and double rotations on insert and delete.',
    category: 'Data Structures',
    difficulty: 'Hard',
    structureKind: 'Balanced Tree',
    tags: ['AVL Tree', 'Self-Balancing', 'BST', 'Rotations', 'Balanced'],
    complexity: {
      search: 'O(log n)',
      insert: 'O(log n)',
      delete: 'O(log n)',
    },
    interviewFrequency: 'Medium',
    keyPoints: [
      'Stricter balance than Red-Black tree — faster lookups, more rotations on writes',
      'Four rotation cases: LL, RR, LR, RL',
      'Height is strictly O(log n) — at most 1.44 × log₂(n+2)',
      'Preferred over Red-Black when reads dominate writes',
    ],
  },
  {
    id: 'red-black-tree',
    active: true,
    title: 'Red-Black Tree',
    description:
      'Self-balancing BST with color invariants (red/black) that ensure O(log n) height and guarantee amortized O(1) rotations per operation.',
    category: 'Data Structures',
    difficulty: 'Hard',
    structureKind: 'Balanced Tree',
    tags: ['Red-Black Tree', 'Self-Balancing', 'BST', 'Ordered Map', 'Color Invariants'],
    complexity: {
      search: 'O(log n)',
      insert: 'O(log n)',
      delete: 'O(log n)',
    },
    interviewFrequency: 'High',
    keyPoints: [
      'Five invariants ensure height ≤ 2 × log₂(n+1)',
      'Fewer rotations than AVL on average — better write performance',
      'Backing implementation for std::map (C++), TreeMap (Java), and SortedDictionary (.NET)',
      'Focus on the five invariants in interviews rather than memorizing delete cases',
    ],
  },
  {
    id: 'b-tree',
    active: true,
    title: 'B-Tree',
    description:
      'Multi-way self-balancing search tree where each node can hold many keys and children, designed to minimize disk I/O by fitting nodes into storage pages.',
    category: 'Data Structures',
    difficulty: 'Hard',
    structureKind: 'Balanced Tree',
    tags: ['B-Tree', 'Database Index', 'Disk I/O', 'Multi-Way Tree', 'Filesystem'],
    complexity: {
      search: 'O(log n)',
      insert: 'O(log n)',
      delete: 'O(log n)',
    },
    interviewFrequency: 'Medium',
    keyPoints: [
      'Nodes hold many keys — designed to match database page or disk block size',
      'All leaf nodes are at the same depth — perfectly height-balanced',
      'Foundation of InnoDB, PostgreSQL, and most filesystem indexes',
      'B+ tree variant stores all data in leaves for efficient range scans',
    ],
  },

  // ==================== DYNAMIC PROGRAMMING ====================
  {
    id: 'fibonacci-dp',
    active: true,
    title: 'Fibonacci Sequence',
    description:
      'Computes the nth Fibonacci number where F(n) = F(n-1) + F(n-2), demonstrating the progression from exponential naive recursion to linear DP to constant-space iteration.',
    category: 'Dynamic Programming',
    difficulty: 'Easy',
    tags: ['Dynamic Programming', 'Memoization', 'Tabulation', 'Recursion', 'Classic'],
    complexity: {
      time: { naive: 'O(2ⁿ)', memoized: 'O(n)', iterative: 'O(n)' },
      space: { naive: 'O(n)', memoized: 'O(n)', iterative: 'O(1)' },
    },
    interviewFrequency: 'High',
    keyPoints: [
      'Teaches top-down memoization vs bottom-up tabulation trade-offs',
      'Space-optimized iterative solution uses O(1) — only track last two values',
      'Matrix exponentiation achieves O(log n) for very large n',
      'Serves as the canonical entry point for understanding overlapping subproblems',
    ],
  },
  {
    id: 'knapsack-01',
    active: true,
    title: '0/1 Knapsack',
    description:
      'Given items with weights and values and a capacity limit, determine the maximum total value achievable by selecting items where each item can be taken at most once.',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    tags: ['Dynamic Programming', 'Optimization', 'Tabulation', 'Subset Selection', 'Classic'],
    complexity: {
      time: 'O(n × W)',
      space: 'O(n × W) or O(W) optimized',
    },
    interviewFrequency: 'High',
    keyPoints: [
      'State: dp[i][w] = max value using first i items with capacity w',
      'Choice at each item: include (if fits) or exclude',
      'Space-optimize to a 1D array by iterating capacity in reverse',
      'Foundation for subset sum, partition equal subset, and coin change variants',
    ],
  },
  {
    id: 'longest-common-subsequence',
    active: true,
    title: 'Longest Common Subsequence (LCS)',
    description:
      'Finds the longest subsequence present in both strings in the same relative order, where subsequence elements need not be contiguous.',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    tags: ['Dynamic Programming', 'String', 'Subsequence', '2D DP', 'Classic'],
    complexity: {
      time: 'O(m × n)',
      space: 'O(m × n) or O(min(m,n)) optimized',
    },
    interviewFrequency: 'High',
    keyPoints: [
      'State: dp[i][j] = LCS length of first i chars of s1 and first j chars of s2',
      'If s1[i] == s2[j]: dp[i][j] = dp[i-1][j-1] + 1; else take max of dp[i-1][j] and dp[i][j-1]',
      'Foundation for edit distance, shortest common supersequence, and diff tools',
      'Reconstruct the actual subsequence by backtracking the DP table',
    ],
  },
  {
    id: 'maximum-subarray',
    active: true,
    title: "Maximum Subarray (Kadane's Algorithm)",
    description:
      'Finds the contiguous subarray with the largest sum in O(n) time by tracking the running maximum sum and resetting when it goes negative.',
    category: 'Dynamic Programming',
    difficulty: 'Easy',
    tags: ['Dynamic Programming', 'Array', 'Greedy', 'Sliding Window', 'Classic'],
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
    },
    interviewFrequency: 'High',
    keyPoints: [
      'Track currentSum and bestSum — reset currentSum to 0 when it goes negative',
      'Handles all-negative arrays by tracking the maximum element',
      'Extends to maximum subarray product and circular subarray variants',
      'Foundation for many 1D DP and greedy array problems',
    ],
  },

  // ==================== CLASSIC PROBLEMS ====================
  {
    id: 'two-sum',
    active: true,
    title: 'Two Sum',
    description:
      'Given an array and a target, find the indices of two numbers that add up to the target value.',
    category: 'Classic Problems',
    difficulty: 'Easy',
    tags: ['Hash Table', 'Array', 'Two Pointers', 'Classic', 'Complement'],
    complexity: {
      time: 'O(n)',
      space: 'O(n)',
    },
    interviewFrequency: 'Very High',
    keyPoints: [
      "Hash map approach: store each element's index and look up the complement",
      'For sorted arrays, two-pointer approach uses O(1) space',
      'Handle edge cases: duplicate values, same element used twice',
      'Most commonly asked interview question — gateway to hash map pattern',
    ],
  },
  {
    id: 'valid-parentheses',
    active: true,
    title: 'Valid Parentheses',
    description:
      'Determines whether a string of brackets ((), [], {}) is valid — every opening bracket must be closed by the correct bracket type in the correct order.',
    category: 'Classic Problems',
    difficulty: 'Easy',
    tags: ['Stack', 'String', 'Classic', 'Bracket Matching'],
    complexity: {
      time: 'O(n)',
      space: 'O(n)',
    },
    interviewFrequency: 'Very High',
    keyPoints: [
      'Push opening brackets onto a stack; pop and match on closing brackets',
      "If stack top doesn't match the closing bracket, return false immediately",
      'Final check: stack must be empty — unmatched opening brackets remain',
      "Classic demonstration of stack's LIFO property solving a matching problem",
    ],
  },
  {
    id: 'reverse-linked-list',
    active: true,
    title: 'Reverse Linked List',
    description:
      'Reverses the direction of all next pointers in a singly linked list so the last node becomes the new head.',
    category: 'Classic Problems',
    difficulty: 'Easy',
    tags: ['Linked List', 'Pointers', 'In-Place', 'Classic', 'Iterative', 'Recursive'],
    complexity: {
      time: 'O(n)',
      space: 'O(1) iterative / O(n) recursive',
    },
    interviewFrequency: 'Very High',
    keyPoints: [
      'Iterative approach: three pointers — prev, curr, next — scan in a single pass',
      'Recursive approach: reverse the rest of the list, then fix the tail pointer',
      'Edge cases: empty list and single-node list return as-is',
      'Core technique reused in reverse a sub-list, palindrome linked list, and k-group reversal',
    ],
  },
  {
    id: 'palindrome-check',
    active: true,
    title: 'Palindrome Check',
    description:
      'Determines whether a string reads the same forwards and backwards, optionally ignoring case and non-alphanumeric characters.',
    category: 'Classic Problems',
    difficulty: 'Easy',
    tags: ['String', 'Two Pointers', 'Classic', 'In-Place'],
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
    },
    interviewFrequency: 'High',
    keyPoints: [
      'Two-pointer technique: compare characters moving inward from both ends',
      'Handle edge cases: empty string and single character are trivially palindromes',
      'Clarify whether to ignore case and non-alphanumeric characters before coding',
      'Extends to palindrome permutation, longest palindromic substring (expand around center)',
    ],
  },
  {
    id: 'tower-of-hanoi',
    active: true,
    title: 'Tower of Hanoi',
    description:
      'Move n disks from a source peg to a destination peg using one auxiliary peg, with the constraint that a larger disk may never rest on a smaller one.',
    category: 'Classic Problems',
    difficulty: 'Medium',
    tags: ['Recursion', 'Divide & Conquer', 'Classic', 'Mathematical'],
    complexity: {
      time: 'O(2ⁿ)',
      space: 'O(n)',
    },
    interviewFrequency: 'Medium',
    keyPoints: [
      'Optimal solution requires exactly 2ⁿ - 1 moves — cannot be done in fewer',
      'Recursive structure: move n-1 disks to auxiliary, move largest to destination, move n-1 back',
      'Base case: moving a single disk is a single direct move',
      'Teaches recursive decomposition — a large problem broken into identical smaller subproblems',
    ],
  },
  {
    id: 'n-queens',
    active: true,
    title: 'N-Queens Problem',
    description:
      'Place N chess queens on an N×N board so that no two queens share the same row, column, or diagonal.',
    category: 'Classic Problems',
    difficulty: 'Hard',
    tags: ['Backtracking', 'Recursion', 'Constraint Satisfaction', 'Classic', 'Pruning'],
    complexity: {
      time: 'O(N!)',
      space: 'O(N²)',
    },
    interviewFrequency: 'High',
    keyPoints: [
      'Backtracking: place a queen row by row, pruning branches that violate constraints',
      'Track occupied columns and both diagonals with sets for O(1) conflict checking',
      'Bit manipulation optimization represents column and diagonal state as bitmasks',
      'Tests recursive backtracking, constraint propagation, and pruning',
    ],
  },

  // ==================== TWO POINTERS & SLIDING WINDOW ====================
  {
    id: 'two-pointers',
    active: true,
    title: 'Two Pointers',
    description:
      'Technique that uses two indices moving through the array — either toward each other (opposite ends) or in the same direction — to reduce a naive O(n²) solution to O(n).',
    category: 'Techniques',
    difficulty: 'Medium',
    tags: ['Two Pointers', 'Array', 'String', 'Sorted', 'In-Place', 'Technique'],
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
    },
    interviewFrequency: 'Very High',
    keyPoints: [
      'Opposite-end pattern: used for two sum on sorted arrays, container with most water, valid palindrome',
      'Same-direction (slow/fast) pattern: remove duplicates, move zeros, partition arrays',
      "Fast/slow pointer variant detects cycles in linked lists (Floyd's algorithm)",
      'Often eliminates a nested loop — shift from O(n²) to O(n)',
    ],
  },
  {
    id: 'sliding-window',
    active: true,
    title: 'Sliding Window',
    description:
      'Maintains a variable or fixed-size window over a sequence, expanding or contracting its boundaries to efficiently compute properties over all contiguous subarrays or substrings.',
    category: 'Techniques',
    difficulty: 'Medium',
    tags: ['Sliding Window', 'Array', 'String', 'Subarray', 'Substring', 'Technique'],
    complexity: {
      time: 'O(n)',
      space: 'O(k) where k is window or alphabet size',
    },
    interviewFrequency: 'Very High',
    keyPoints: [
      'Fixed window: compute sum or average of every subarray of size k in O(n)',
      'Variable window: expand right pointer, contract left pointer when constraint breaks',
      'Common problems: longest substring without repeating characters, minimum window substring',
      'Often paired with a hash map or frequency array to track window contents',
    ],
  },
].filter((topic) => topic.active === true);

// ----------------------------------------------------------------------------
// Derived fields — populated once at module load so consumers can rely on
// `to`, `difficultyRank`, and `frequencyRank` without duplicating data above.
// ----------------------------------------------------------------------------

const DIFFICULTY_RANK = { Easy: 1, Medium: 2, Hard: 3 };
const FREQUENCY_RANK = { Low: 0, Medium: 1, High: 2, 'Very High': 3 };

/** Display order for category filter and category sort. */
const CATEGORY_ORDER = [
  'Data Structures',
  'Graph Algorithms',
  'Sorting',
  'Searching',
  'Dynamic Programming',
  'Classic Problems',
  'Techniques',
];

const CATEGORY_RANK = Object.fromEntries(CATEGORY_ORDER.map((name, index) => [name, index]));

dsaTopics.forEach((topic) => {
  topic.to = `/dsa/${topic.id}`;
  topic.tags = Array.isArray(topic.tags) ? topic.tags : [];
  topic.difficultyRank = DIFFICULTY_RANK[topic.difficulty] ?? 99;
  topic.frequencyRank = FREQUENCY_RANK[topic.interviewFrequency] ?? 0;
  topic.categoryRank = CATEGORY_RANK[topic.category] ?? CATEGORY_ORDER.length;
});

// ============================================================================
// CATEGORIES, DIFFICULTY LEVELS, AND INTERVIEW FREQUENCIES
// ============================================================================

export const dsaCategories = [
  'All',
  ...CATEGORY_ORDER.filter((name) => dsaTopics.some((topic) => topic.category === name)),
];

export const dsaDifficulties = ['All', 'Easy', 'Medium', 'Hard'];

export const dsaFrequencies = ['All', 'Low', 'Medium', 'High', 'Very High'];

/** Structure kinds used by Data Structures topics (derived from active catalog). */
export const dsaStructureKinds = [
  'All',
  ...['Linear', 'Tree', 'Graph', 'Hash', 'Range Query', 'Balanced Tree'].filter((kind) =>
    dsaTopics.some((topic) => topic.structureKind === kind),
  ),
];

/** Unique tags on active topics (for filter chips). */
export const dsaAllTags = [...new Set(dsaTopics.flatMap((t) => t.tags))].sort((a, b) =>
  a.localeCompare(b),
);

/**
 * Page integration note:
 * - `src/pages/DSA.jsx` passes `dsaTopics` + these option arrays into `ModuleListingLayout`.
 * - `public/configs/modulePageLayouts.json` references these arrays via `optionsSource` keys.
 * - Keep names in `optionsBySource` and JSON `optionsSource` aligned.
 */

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Filter topics by category
 */
export const filterByCategory = (topics, category) => {
  if (category === 'All') return topics;
  return topics.filter((topic) => topic.category === category);
};

/**
 * Filter topics by difficulty
 */
export const filterByDifficulty = (topics, difficulty) => {
  if (difficulty === 'All') return topics;
  return topics.filter((topic) => topic.difficulty === difficulty);
};

/**
 * Filter topics by interview frequency
 */
export const filterByFrequency = (topics, frequency) => {
  if (frequency === 'All') return topics;
  return topics.filter((topic) => topic.interviewFrequency === frequency);
};

/**
 * Filter Data Structures topics by structure kind (Linear, Tree, etc.)
 */
export const filterByStructureKind = (topics, structureKind) => {
  if (structureKind === 'All') return topics;
  return topics.filter((topic) => topic.structureKind === structureKind);
};

/**
 * @param {Record<string, unknown>} topic
 */
export function getTopicSearchText(topic) {
  const tags = Array.isArray(topic.tags) ? topic.tags.join(' ') : '';
  const keyPoints = Array.isArray(topic.keyPoints) ? topic.keyPoints.join(' ') : '';
  return [
    topic.id,
    topic.title,
    topic.description,
    topic.category,
    topic.structureKind,
    topic.difficulty,
    topic.interviewFrequency,
    tags,
    keyPoints,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

/**
 * Search topics across title, description, tags, category, difficulty, and key points.
 */
export const searchTopics = (topics, query) => {
  if (!query?.trim()) return topics;
  const lowerQuery = query.trim().toLowerCase();
  return topics.filter((topic) => getTopicSearchText(topic).includes(lowerQuery));
};

/**
 * Sort topics by title, category, difficulty, or interview frequency.
 */
export const sortTopics = (topics, sortBy = 'title') => {
  const sorted = [...topics];

  switch (sortBy) {
    case 'category':
      return sorted.sort(
        (a, b) => (a.categoryRank ?? 99) - (b.categoryRank ?? 99) || a.title.localeCompare(b.title),
      );

    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));

    case 'difficulty':
      return sorted.sort(
        (a, b) =>
          (a.difficultyRank ?? 99) - (b.difficultyRank ?? 99) || a.title.localeCompare(b.title),
      );

    case 'frequency':
      return sorted.sort(
        (a, b) => (b.frequencyRank ?? 0) - (a.frequencyRank ?? 0) || a.title.localeCompare(b.title),
      );

    default:
      return sorted;
  }
};

/**
 * Get topics by category
 */
export const getTopicsByCategory = (category) => {
  return dsaTopics.filter((topic) => topic.category === category);
};

/**
 * Get topic by ID
 */
export const getTopicById = (id) => {
  return dsaTopics.find((topic) => topic.id === id);
};

// Alias with the consistent naming used by the inner detail routes.
export const getDsaTopicById = getTopicById;

/**
 * Get statistics about topics
 */
export const getTopicStats = () => {
  const stats = {
    total: dsaTopics.length,
    byCategory: {},
    byDifficulty: {},
    byFrequency: {},
  };

  dsaTopics.forEach((topic) => {
    // Count by category
    stats.byCategory[topic.category] = (stats.byCategory[topic.category] || 0) + 1;

    // Count by difficulty
    stats.byDifficulty[topic.difficulty] = (stats.byDifficulty[topic.difficulty] || 0) + 1;

    // Count by frequency
    stats.byFrequency[topic.interviewFrequency] =
      (stats.byFrequency[topic.interviewFrequency] || 0) + 1;
  });

  return stats;
};

export default dsaTopics;
