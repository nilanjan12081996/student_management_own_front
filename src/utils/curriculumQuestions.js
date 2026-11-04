/**
 * Comprehensive Academic Question Bank & Synthesizer
 * Provides university-standard, topic-specific MCQs across all 4 cognitive layers.
 */

export const DBMS_QUESTION_BANK = [
  {
    question_text: "Which normal form strictly eliminates all partial functional dependencies on a composite candidate key?",
    options: ["Second Normal Form (2NF)", "First Normal Form (1NF)", "Third Normal Form (3NF)", "Boyce-Codd Normal Form (BCNF)"],
    correct_answer: "Second Normal Form (2NF)",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "2NF requires the relation to be in 1NF and that every non-prime attribute is fully functionally dependent on every candidate key, eliminating partial dependencies."
  },
  {
    question_text: "Which of the following ACID transaction properties guarantees that once a transaction commits, its modifications persist even during a sudden power or system failure?",
    options: ["Durability", "Atomicity", "Consistency", "Isolation"],
    correct_answer: "Durability",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "Durability ensures that the changes of a committed transaction survive system crashes and power failures, typically achieved via non-volatile Write-Ahead Logging (WAL)."
  },
  {
    question_text: "In a relational schema with relation R(A, B, C) and functional dependencies {A -> B, B -> C}, which normal form is violated by the transitive dependency A -> C?",
    options: ["Third Normal Form (3NF)", "First Normal Form (1NF)", "Second Normal Form (2NF)", "Fourth Normal Form (4NF)"],
    correct_answer: "Third Normal Form (3NF)",
    cognitive_layer: "Diagnostic Debugging & Tracing",
    explanation: "3NF requires that for every functional dependency X -> Y, either X is a superkey or Y is a prime attribute. Transitive dependencies via non-prime attributes violate 3NF."
  },
  {
    question_text: "What is the primary difference between a clustered index and an unclustered (secondary) index in a relational database?",
    options: [
      "A clustered index determines the physical storage order of rows in the table (maximum 1 per table)",
      "A clustered index can be created on multiple non-primary key columns without sorting data",
      "An unclustered index stores the entire table row data directly within its leaf nodes",
      "Clustered indexes are slower for range queries than secondary hash indexes"
    ],
    correct_answer: "A clustered index determines the physical storage order of rows in the table (maximum 1 per table)",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "A table can only have one clustered index because the data rows themselves are physically ordered on disk by the clustered index key."
  },
  {
    question_text: "In the Two-Phase Locking (2PL) concurrency control protocol, when is a transaction prohibited from acquiring any new locks?",
    options: [
      "Once it enters the Shrinking Phase (after releasing its first lock)",
      "During the Growing Phase while holding shared locks",
      "Immediately after executing its first SELECT query",
      "Only after the transaction issues a COMMIT or ROLLBACK command"
    ],
    correct_answer: "Once it enters the Shrinking Phase (after releasing its first lock)",
    cognitive_layer: "Execution Dynamics & Flow",
    explanation: "The Two-Phase Locking protocol consists of a Growing Phase (locks may be acquired) and a Shrinking Phase (locks may only be released; no new locks can be acquired), guaranteeing conflict serializability."
  },
  {
    question_text: "In SQL, which clause is specifically mandatory when filtering groups created by a GROUP BY aggregation?",
    options: ["HAVING", "WHERE", "ORDER BY", "QUALIFY"],
    correct_answer: "HAVING",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "The WHERE clause filters individual rows before grouping, whereas the HAVING clause filters the aggregated groups formed by GROUP BY."
  },
  {
    question_text: "In the Entity-Relationship (ER) model, how is a Weak Entity set identified in a database schema?",
    options: [
      "Through a Partial Key (discriminator) combined with the Primary Key of its Identifying Owner Entity",
      "By having its own autonomous single-column unique Primary Key",
      "Through a foreign key that allows NULL values exclusively",
      "By defining multiple candidate keys without any composite constraints"
    ],
    correct_answer: "Through a Partial Key (discriminator) combined with the Primary Key of its Identifying Owner Entity",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "A weak entity set lacks sufficient attributes to form a primary key on its own; it requires its partial key and the primary key of its identifying relationship entity."
  },
  {
    question_text: "What edge-case condition can occur if two concurrent transactions both hold shared locks on a row and each attempts to upgrade to an exclusive lock?",
    options: [
      "A Deadlock occurs, requiring the DBMS lock manager to abort and roll back one transaction",
      "The DBMS automatically merges both exclusive locks into a single atomic transaction",
      "The second transaction overrides the first transaction without notification",
      "The read operation succeeds and converts directly to dirty read status"
    ],
    correct_answer: "A Deadlock occurs, requiring the DBMS lock manager to abort and roll back one transaction",
    cognitive_layer: "Edge Cases & Trap Detection",
    explanation: "Each transaction waits for the other to release its shared lock before upgrading to exclusive, creating a circular wait cycle (deadlock) that requires DBMS deadlock resolution."
  },
  {
    question_text: "Which Relational Algebra operation returns all tuples present in relation R but NOT present in relation S (assuming union compatibility)?",
    options: ["Set Difference (R - S)", "Cartesian Product (R × S)", "Intersection (R ∩ S)", "Natural Join (R ⋈ S)"],
    correct_answer: "Set Difference (R - S)",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "Set Difference R - S outputs all tuples in relation R that do not appear in relation S. Relations must have identical schemas (union compatible)."
  },
  {
    question_text: "Why are B+ Trees overwhelmingly preferred over standard Binary Search Trees (BST) for disk-based database indexing?",
    options: [
      "High branching factor minimizes disk I/O seek operations, and leaf nodes form a sequential linked list for rapid range scans",
      "B+ Trees consume significantly less volatile RAM memory than binary trees",
      "B+ Trees store full table records exclusively at the root node for O(1) searches",
      "Binary Search Trees cannot support unique primary key constraints"
    ],
    correct_answer: "High branching factor minimizes disk I/O seek operations, and leaf nodes form a sequential linked list for rapid range scans",
    cognitive_layer: "Execution Dynamics & Flow",
    explanation: "B+ trees have large node fan-outs (reducing tree height to 3-4 levels for millions of records) and linked leaf nodes that allow contiguous disk block reading for range queries."
  },
  {
    question_text: "What anomaly is prevented by setting the Transaction Isolation Level to SERIALIZABLE in SQL?",
    options: [
      "Phantom Reads, Non-Repeatable Reads, and Dirty Reads",
      "Only Dirty Reads while permitting Non-Repeatable Reads",
      "Table fragmentation and disk sector reallocation",
      "Primary key auto-increment collisions across distributed nodes"
    ],
    correct_answer: "Phantom Reads, Non-Repeatable Reads, and Dirty Reads",
    cognitive_layer: "Diagnostic Debugging & Tracing",
    explanation: "SERIALIZABLE is the highest isolation level and guarantees complete freedom from dirty reads, non-repeatable reads, and phantom read anomalies."
  },
  {
    question_text: "In database recovery, what does the Write-Ahead Logging (WAL) protocol mandate before a modified dirty page is flushed to disk?",
    options: [
      "The corresponding log records (undo/redo entries) must be forced to non-volatile disk storage before the database page itself",
      "All active transactions must be committed and the database locked in single-user mode",
      "An automated backup dump must be created and indexed",
      "The transaction log must be cleared and checkpoint counters reset to zero"
    ],
    correct_answer: "The corresponding log records (undo/redo entries) must be forced to non-volatile disk storage before the database page itself",
    cognitive_layer: "Execution Dynamics & Flow",
    explanation: "WAL dictates that log records describing a change must be securely written to stable storage before the actual dirty buffer page is written to disk, ensuring recovery is possible."
  },
  {
    question_text: "Which SQL constraint enforces referential integrity between two related tables in a relational database?",
    options: ["FOREIGN KEY ... REFERENCES", "CHECK constraint", "UNIQUE NOT NULL", "DEFAULT PRIMARY KEY"],
    correct_answer: "FOREIGN KEY ... REFERENCES",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "A FOREIGN KEY ensures that a value in the child column must match an existing value in the parent referenced primary key column, enforcing referential integrity."
  },
  {
    question_text: "What is the key criterion that distinguishes Boyce-Codd Normal Form (BCNF) from Third Normal Form (3NF)?",
    options: [
      "In BCNF, for every functional dependency X -> Y, X must strictly be a Superkey (no exception for prime attributes)",
      "BCNF permits partial functional dependencies provided the determinant is numeric",
      "3NF requires relations to have fewer than 10 attributes whereas BCNF has no limit",
      "BCNF only applies to unindexed heap tables without foreign keys"
    ],
    correct_answer: "In BCNF, for every functional dependency X -> Y, X must strictly be a Superkey (no exception for prime attributes)",
    cognitive_layer: "Diagnostic Debugging & Tracing",
    explanation: "3NF allows X -> Y if Y is a prime attribute even if X is not a superkey. BCNF removes this relaxation: X must strictly be a superkey for every non-trivial dependency."
  },
  {
    question_text: "When performing an INNER JOIN between two tables of size M and N where no join predicate matches, what is the resulting cardinality?",
    options: ["0 rows (an empty result set)", "M + N rows", "M × N rows (Cartesian Product)", "Maximum of (M, N) rows"],
    correct_answer: "0 rows (an empty result set)",
    cognitive_layer: "Edge Cases & Trap Detection",
    explanation: "An INNER JOIN only retains rows where the join condition evaluates to TRUE. If zero rows satisfy the predicate, the result set has exactly 0 rows."
  }
];

export const DSA_QUESTION_BANK = [
  {
    question_text: "What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST) with N nodes?",
    options: ["O(N)", "O(log N)", "O(N log N)", "O(1)"],
    correct_answer: "O(N)",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "When keys are inserted in sorted order, an unbalanced BST degenerates into a linear linked list (skewed tree), yielding O(N) worst-case search time."
  },
  {
    question_text: "Which data structure follows the Last-In, First-Out (LIFO) order and is fundamentally used for function call stacks and expression parsing?",
    options: ["Stack", "Queue", "Priority Queue", "Circular Buffer"],
    correct_answer: "Stack",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "A Stack operates on the LIFO principle where push and pop operations occur at the top of the stack in O(1) time."
  },
  {
    question_text: "In a min-heap with N elements, what is the time complexity of deleting the minimum element (root)?",
    options: ["O(log N)", "O(1)", "O(N)", "O(N log N)"],
    correct_answer: "O(log N)",
    cognitive_layer: "Execution Dynamics & Flow",
    explanation: "Deleting the root requires replacing it with the last element and running heapify (percolate-down), which travels down the height of the tree in O(log N) steps."
  },
  {
    question_text: "Which graph traversal algorithm uses a Queue data structure to find the shortest path in an unweighted graph?",
    options: ["Breadth-First Search (BFS)", "Depth-First Search (DFS)", "Topological Sort", "Kruskal's Algorithm"],
    correct_answer: "Breadth-First Search (BFS)",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "BFS explores vertices level by level using a FIFO Queue, guaranteeing the shortest path in unweighted graphs."
  },
  {
    question_text: "What is the average and worst-case time complexity of QuickSort when using a naive first-element pivot on already sorted data?",
    options: ["Average O(N log N), Worst-case O(N²)", "Average O(N), Worst-case O(N log N)", "Average O(N²), Worst-case O(N²)", "Both O(N log N)"],
    correct_answer: "Average O(N log N), Worst-case O(N²)",
    cognitive_layer: "Diagnostic Debugging & Tracing",
    explanation: "Selecting the first element as pivot on an already sorted array creates highly unbalanced partitions of size 0 and N-1, degrading performance to O(N²)."
  }
];

export const OS_QUESTION_BANK = [
  {
    question_text: "Which of the following is NOT one of the four necessary Coffman conditions required for a Deadlock to occur?",
    options: ["Preemptive Resource Allocation", "Mutual Exclusion", "Hold and Wait", "Circular Wait"],
    correct_answer: "Preemptive Resource Allocation",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "The fourth condition is 'No Preemption' (resources cannot be forcibly taken). Preemptive allocation prevents deadlocks."
  },
  {
    question_text: "What hardware component is responsible for translating Virtual Memory Addresses generated by the CPU into Physical RAM Addresses?",
    options: ["Memory Management Unit (MMU)", "Direct Memory Access (DMA) Controller", "Arithmetic Logic Unit (ALU)", "Translation Cache Register (TCR)"],
    correct_answer: "Memory Management Unit (MMU)",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "The MMU performs runtime virtual-to-physical address mapping utilizing page tables and the Translation Lookaside Buffer (TLB)."
  },
  {
    question_text: "In CPU scheduling, what is the phenomenon called where a high-priority process is indefinitely delayed because a lower-priority process holds a needed lock?",
    options: ["Priority Inversion", "Convoy Effect", "Thrashing", "Starvation via Aging"],
    correct_answer: "Priority Inversion",
    cognitive_layer: "Diagnostic Debugging & Tracing",
    explanation: "Priority Inversion happens when a low-priority task holds a resource needed by a high-priority task, and is preempted by a medium-priority task. Solved via Priority Inheritance."
  }
];

export const NETWORKING_QUESTION_BANK = [
  {
    question_text: "In the 7-layer OSI reference model, at which layer do IP Addressing, Packet Routing, and Forwarding take place?",
    options: ["Network Layer (Layer 3)", "Transport Layer (Layer 4)", "Data Link Layer (Layer 2)", "Application Layer (Layer 7)"],
    correct_answer: "Network Layer (Layer 3)",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "Layer 3 (Network Layer) is responsible for logical IP addressing, routing packets across networks, and path determination."
  },
  {
    question_text: "What sequence of packets establishes a reliable connection in the TCP Three-Way Handshake?",
    options: ["SYN -> SYN-ACK -> ACK", "ACK -> SYN -> FIN", "SYN -> ACK -> RST", "CONNECT -> ACCEPT -> READY"],
    correct_answer: "SYN -> SYN-ACK -> ACK",
    cognitive_layer: "Execution Dynamics & Flow",
    explanation: "Client sends SYN, server responds with SYN-ACK, and client sends ACK, synchronizing sequence numbers and establishing the TCP connection."
  }
];

/**
 * Intelligent topic selector & question synthesizer
 */
export function generateSmartQuestions({ topic, referenceText, count, difficulty, cognitiveLayer }) {
  const targetCount = Math.max(1, Math.min(30, Number(count) || 4));
  const t = (topic || '').toLowerCase();
  const ref = (referenceText || '').trim();

  const isPlaceholder = ref.startsWith('[Document attached:') || ref.includes('Ready for AI reference parsing') || ref.length < 35;
  const cleanRef = isPlaceholder ? '' : ref;

  let selectedBank = [];

  // Detect domain
  if (t.includes('dbms') || t.includes('database') || t.includes('sql') || t.includes('relational') || t.includes('normaliz') || t.includes('transaction')) {
    selectedBank = DBMS_QUESTION_BANK;
  } else if (t.includes('dsa') || t.includes('data structure') || t.includes('algorithm') || t.includes('tree') || t.includes('graph') || t.includes('stack') || t.includes('queue') || t.includes('sort')) {
    selectedBank = DSA_QUESTION_BANK;
  } else if (t.includes('os') || t.includes('operating system') || t.includes('linux') || t.includes('process') || t.includes('memory') || t.includes('deadlock')) {
    selectedBank = OS_QUESTION_BANK;
  } else if (t.includes('network') || t.includes('tcp') || t.includes('ip') || t.includes('osi') || t.includes('routing')) {
    selectedBank = NETWORKING_QUESTION_BANK;
  } else {
    // Default to DBMS questions if DBMS is in the name, or merge
    selectedBank = DBMS_QUESTION_BANK;
  }

  // If genuine reference text was extracted from file, synthesize from it
  if (cleanRef) {
    const rawSentences = cleanRef
      .split(/(?<=[.?!])\s+/)
      .map(s => s.trim().replace(/\s+/g, ' '))
      .filter(s => s.length > 30 && s.length < 250 && !s.startsWith('[Document attached'));

    if (rawSentences.length >= 2) {
      const questions = [];
      const usedSentences = new Set();

      for (let i = 0; i < Math.min(targetCount, rawSentences.length); i++) {
        const sentence = rawSentences[i];
        if (usedSentences.has(sentence)) continue;
        usedSentences.add(sentence);

        // Derive plausible distractors
        const bankDistractors = selectedBank[(i + 1) % selectedBank.length].options.filter(o => o !== selectedBank[(i + 1) % selectedBank.length].correct_answer);
        const options = [sentence, ...bankDistractors.slice(0, 3)];
        
        // Shuffle options
        options.sort(() => 0.5 - Math.random());

        questions.push({
          question_text: `According to the uploaded reference material on ${topic}, which of the following is correct?`,
          options,
          correct_answer: sentence,
          marks: 2,
          cognitive_layer: cognitiveLayer && cognitiveLayer !== 'Multi-Layer Balanced' ? cognitiveLayer : (i % 2 === 0 ? "Concept Foundation & Syntax" : "Execution Dynamics & Flow"),
          topic_tag: topic,
          explanation: `Direct from uploaded study material: "${sentence.slice(0, 160)}..."`
        });
      }

      // If we need more questions to meet targetCount, pull from domain bank
      let bankIdx = 0;
      while (questions.length < targetCount) {
        const item = selectedBank[bankIdx % selectedBank.length];
        questions.push({
          ...item,
          topic_tag: topic,
          marks: 2
        });
        bankIdx++;
      }

      return questions.slice(0, targetCount);
    }
  }

  // Domain bank generator (pure academic questions)
  const result = [];
  let idx = 0;
  while (result.length < targetCount) {
    const item = selectedBank[idx % selectedBank.length];
    result.push({
      ...item,
      topic_tag: topic,
      marks: 2
    });
    idx++;
  }

  return result.slice(0, targetCount);
}
