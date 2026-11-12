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
  },
  {
    question_text: "In an Entity-Relationship (ER) diagram, what does a double-bordered rectangle represent?",
    options: ["A Weak Entity set", "A Composite Attribute", "A Multivalued Attribute", "A Derived Attribute"],
    correct_answer: "A Weak Entity set",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "In standard Chen ER notation, a weak entity set is depicted with a double rectangle and depends on an identifying strong entity via a double-diamond identifying relationship."
  },
  {
    question_text: "In ER modeling, how is Total Participation of an entity set in a relationship visually represented and interpreted?",
    options: [
      "A double line connecting the entity to the relationship, meaning every entity instance must participate in at least one relationship instance",
      "A dashed oval, meaning the attribute value is dynamically computed at query time",
      "A single line with an arrow, meaning the entity participates optionally (zero or more times)",
      "A dotted diamond, meaning the relationship holds no foreign key constraints"
    ],
    correct_answer: "A double line connecting the entity to the relationship, meaning every entity instance must participate in at least one relationship instance",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "Total participation (mandatory participation) is shown with a double line in ER diagrams, indicating a minimum cardinality of 1 for every entity in the set."
  },
  {
    question_text: "When converting an ER diagram into a relational schema, how is a Many-to-Many (M:N) binary relationship between entities E1 and E2 mapped?",
    options: [
      "By creating a separate junction/associative relation containing the primary keys of both E1 and E2 (plus any relationship attributes)",
      "By merging E1 and E2 permanently into a single unnormalized flat relation",
      "By storing a comma-separated list of E2 keys inside a single column of E1",
      "By dropping the primary key constraint from E2 and converting it into a weak attribute"
    ],
    correct_answer: "By creating a separate junction/associative relation containing the primary keys of both E1 and E2 (plus any relationship attributes)",
    cognitive_layer: "Execution Dynamics & Flow",
    explanation: "An M:N relationship cannot be represented by a foreign key in either entity alone without violating 1NF; it maps to a new table whose key combines the primary keys of both entities."
  },
  {
    question_text: "In an ER diagram, what do a double oval and a dashed oval represent respectively?",
    options: [
      "A Multivalued attribute and a Derived attribute",
      "A Primary key attribute and a Foreign key attribute",
      "A Weak entity set and a Recursive relationship",
      "A Total participation constraint and a Composite entity"
    ],
    correct_answer: "A Multivalued attribute and a Derived attribute",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "A double oval denotes a multivalued attribute (e.g., multiple phone numbers, mapped to a separate table), while a dashed oval denotes a derived attribute (e.g., Age computed from Date of Birth)."
  },
  {
    question_text: "What is a Recursive (Unary) Relationship in an Entity-Relationship model?",
    options: [
      "A relationship in which the same entity set participates more than once in different roles (e.g., Employee supervises Employee)",
      "A relationship connecting three distinct strong entity sets simultaneously",
      "A weak entity connected to two independent parent tables without a partial key",
      "A relationship whose cardinality is fixed at 1:1 with partial participation on both sides"
    ],
    correct_answer: "A relationship in which the same entity set participates more than once in different roles (e.g., Employee supervises Employee)",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "A unary/recursive relationship has degree 1, relating instances of the same entity set to one another using distinct role names (such as Manager and Subordinate)."
  },
  {
    question_text: "In Enhanced ER (EER) modeling, how does Specialization differ from Generalization?",
    options: [
      "Specialization is a top-down process of dividing a higher-level entity into distinct subclasses, whereas Generalization is a bottom-up synthesis of common entity sets into a superclass",
      "Generalization creates multivalued attributes whereas Specialization removes foreign keys",
      "Specialization applies only to 1NF tables while Generalization applies only to BCNF",
      "Generalization eliminates primary keys from all participating subclass entities"
    ],
    correct_answer: "Specialization is a top-down process of dividing a higher-level entity into distinct subclasses, whereas Generalization is a bottom-up synthesis of common entity sets into a superclass",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "Both form an ISA hierarchy: Specialization splits a superclass into specialized subclasses (top-down), while Generalization combines shared attributes of entities into a superclass (bottom-up)."
  },
  {
    question_text: "Which SQL subset consists exclusively of Data Definition Language (DDL) commands used to define and modify database schemas?",
    options: [
      "CREATE, ALTER, DROP, TRUNCATE",
      "INSERT, UPDATE, DELETE, MERGE",
      "GRANT, REVOKE, DENY",
      "COMMIT, ROLLBACK, SAVEPOINT"
    ],
    correct_answer: "CREATE, ALTER, DROP, TRUNCATE",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "DDL commands (CREATE, ALTER, DROP, TRUNCATE, RENAME) define, modify, or remove database structures and metadata, whereas INSERT/UPDATE/DELETE belong to DML."
  },
  {
    question_text: "What is the critical behavioral difference between the DDL command TRUNCATE TABLE and the DML command DELETE FROM?",
    options: [
      "TRUNCATE removes all rows by deallocating data pages without a WHERE filter and typically auto-commits, whereas DELETE removes row-by-row with optional WHERE and can be rolled back",
      "DELETE permanently drops the table schema from the catalog whereas TRUNCATE preserves rows",
      "TRUNCATE supports a WHERE clause to delete selective tuples while DELETE always wipes the full table",
      "DELETE resets AUTO_INCREMENT identity counters automatically while TRUNCATE leaves them unchanged"
    ],
    correct_answer: "TRUNCATE removes all rows by deallocating data pages without a WHERE filter and typically auto-commits, whereas DELETE removes row-by-row with optional WHERE and can be rolled back",
    cognitive_layer: "Diagnostic Debugging & Tracing",
    explanation: "TRUNCATE is a fast DDL operation that frees table storage pages without logging individual row deletions, whereas DELETE is a logged DML operation supporting WHERE filtering and transaction rollback."
  },
  {
    question_text: "Which SQL command is a DDL statement used to add a new column or constraint to an existing table without losing stored rows?",
    options: ["ALTER TABLE", "UPDATE TABLE", "MODIFY ROWS", "INSERT COLUMN"],
    correct_answer: "ALTER TABLE",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "ALTER TABLE (DDL) modifies table structure (ADD, DROP COLUMN, MODIFY/ALTER COLUMN, ADD CONSTRAINT), whereas UPDATE (DML) modifies row data values."
  },
  {
    question_text: "What happens if an SQL DROP TABLE Students; (DDL) command executes compared to TRUNCATE TABLE Students;?",
    options: [
      "DROP TABLE removes both the data and the table schema/definition from the database catalog, whereas TRUNCATE empties rows while keeping the table schema intact",
      "DROP TABLE empties rows while keeping indexes and schema intact, whereas TRUNCATE deletes the schema",
      "DROP TABLE can be undone automatically with a standard DML ROLLBACK in all SQL engines",
      "TRUNCATE removes foreign key tables automatically while DROP fails only when empty"
    ],
    correct_answer: "DROP TABLE removes both the data and the table schema/definition from the database catalog, whereas TRUNCATE empties rows while keeping the table schema intact",
    cognitive_layer: "Execution Dynamics & Flow",
    explanation: "DROP destroys the entire table object (structure, constraints, indexes, and data); TRUNCATE only clears existing tuples while retaining the table definition for future inserts."
  },
  {
    question_text: "Which category of SQL statements comprises Data Manipulation Language (DML) commands?",
    options: [
      "INSERT, UPDATE, DELETE",
      "CREATE, DROP, ALTER",
      "COMMIT, ROLLBACK, SAVEPOINT",
      "GRANT, REVOKE"
    ],
    correct_answer: "INSERT, UPDATE, DELETE",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "DML commands manipulate tuple data inside existing tables: INSERT adds rows, UPDATE modifies column values, and DELETE removes rows."
  },
  {
    question_text: "In SQL DML, what edge-case mistake occurs when executing UPDATE Employees SET salary = 50000; without a WHERE clause?",
    options: [
      "Every single row in the Employees table is updated to 50000",
      "SQL raises a syntax error because WHERE is mandatory in every UPDATE statement",
      "Only the first row returned by the primary key index is updated",
      "Zero rows are modified and the database emits an empty-update warning"
    ],
    correct_answer: "Every single row in the Employees table is updated to 50000",
    cognitive_layer: "Edge Cases & Trap Detection",
    explanation: "In DML UPDATE and DELETE statements, the WHERE clause is optional syntactically; omitting it applies the modification unconditionally to every tuple in the table."
  },
  {
    question_text: "When defining a FOREIGN KEY constraint in SQL DDL, what does the referential action ON DELETE CASCADE enforce during a DML DELETE on the parent table?",
    options: [
      "Deleting a parent row automatically deletes all dependent child rows referencing its key",
      "Deleting a parent row automatically drops the child table from the database schema",
      "Deleting a child row deletes the referenced parent record automatically",
      "Deleting a parent row is blocked with an integrity violation even if child rows exist"
    ],
    correct_answer: "Deleting a parent row automatically deletes all dependent child rows referencing its key",
    cognitive_layer: "Execution Dynamics & Flow",
    explanation: "ON DELETE CASCADE propagates parent row deletions downward to matching foreign key rows in the child table to preserve referential integrity."
  },
  {
    question_text: "In Relational Database theory, how is a Candidate Key precisely distinguished from a Super Key?",
    options: [
      "A Candidate Key is a minimal Super Key—no proper subset of its attributes can uniquely identify a tuple",
      "A Super Key can never contain more than one attribute whereas a Candidate Key is always composite",
      "A Candidate Key allows NULL values in primary columns whereas a Super Key disallows NULLs",
      "Every table can have multiple Primary Keys but at most one Candidate Key"
    ],
    correct_answer: "A Candidate Key is a minimal Super Key—no proper subset of its attributes can uniquely identify a tuple",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "While any superset of a candidate key is also a super key, a candidate key contains no redundant attributes (it is irreducible / minimal)."
  },
  {
    question_text: "If a relational table has 3 Candidate Keys and one is chosen as the Primary Key, what are the remaining 2 Candidate Keys called?",
    options: ["Alternate Keys", "Foreign Keys", "Composite Keys", "Partial Keys"],
    correct_answer: "Alternate Keys",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "All minimal unique identifiers of a relation are Candidate Keys; the one designated for primary identification is the Primary Key, and the others are Alternate Keys."
  },
  {
    question_text: "What is the key difference between a PRIMARY KEY constraint and a UNIQUE key constraint in SQL DDL?",
    options: [
      "A table can have only one PRIMARY KEY (which strictly disallows NULL), whereas a table can have multiple UNIQUE constraints (which permit NULL values)",
      "UNIQUE constraints cannot be referenced by a FOREIGN KEY whereas PRIMARY KEYs can",
      "PRIMARY KEY allows duplicate rows when NULL is inserted while UNIQUE rejects all rows",
      "UNIQUE automatically disables B+ tree index creation on the column"
    ],
    correct_answer: "A table can have only one PRIMARY KEY (which strictly disallows NULL), whereas a table can have multiple UNIQUE constraints (which permit NULL values)",
    cognitive_layer: "Edge Cases & Trap Detection",
    explanation: "Entity integrity mandates that no component of a PRIMARY KEY may be NULL, and a relation has at most one Primary Key, whereas multiple UNIQUE keys may exist and allow NULLs."
  },
  {
    question_text: "In relational key terminology, when is an attribute classified as a 'Prime Attribute'?",
    options: [
      "When the attribute is a member of at least one Candidate Key of the relation",
      "Only when the attribute has an integer data type and auto-increment enabled",
      "When the attribute participates in a transitive functional dependency outside all keys",
      "Only when the attribute is a Foreign Key referencing an external schema"
    ],
    correct_answer: "When the attribute is a member of at least one Candidate Key of the relation",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "Any attribute that belongs to ANY candidate key (not solely the chosen primary key) is a prime attribute; all remaining attributes are non-prime."
  },
  {
    question_text: "In Functional Dependency theory, what does the notation X -> Y mean formally for any relation instance r(R)?",
    options: [
      "Whenever two tuples in r agree on all attribute values of X, they must also agree on all attribute values of Y",
      "Attribute Y uniquely determines every candidate key in table X",
      "The number of rows in column X must equal the number of rows in column Y",
      "Deleting a value in Y cascades automatically to set X to NULL"
    ],
    correct_answer: "Whenever two tuples in r agree on all attribute values of X, they must also agree on all attribute values of Y",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "X -> Y (X functionally determines Y) means for every pair of tuples t1, t2: if t1[X] = t2[X], then necessarily t1[Y] = t2[Y]."
  },
  {
    question_text: "Under what condition is a Functional Dependency X -> Y classified as a 'Trivial Functional Dependency'?",
    options: [
      "When Y is a subset of X (Y ⊆ X)",
      "When X and Y have completely disjoint attribute sets (X ∩ Y = ∅)",
      "When Y is a composite primary key",
      "When X contains only nullable varchar columns"
    ],
    correct_answer: "When Y is a subset of X (Y ⊆ X)",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "By Armstrong's Reflexivity axiom, any attribute set X always functionally determines any subset of itself (e.g., {RollNo, Name} -> Name), making it trivially satisfied in every relation."
  },
  {
    question_text: "Which three inference rules constitute Armstrong's Axioms for reasoning about Functional Dependencies?",
    options: [
      "Reflexivity, Augmentation, and Transitivity",
      "Atomicity, Consistency, and Durability",
      "Selection, Projection, and Cartesian Product",
      "Decomposition, Union, and Lossless Join"
    ],
    correct_answer: "Reflexivity, Augmentation, and Transitivity",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "Armstrong's three core axioms (Reflexivity: if Y ⊆ X then X->Y; Augmentation: if X->Y then XZ->YZ; Transitivity: if X->Y and Y->Z then X->Z) are both sound and complete for functional dependencies."
  },
  {
    question_text: "How is Attribute Closure (X⁺) used in database normalization and key discovery?",
    options: [
      "To compute the full set of attributes functionally determined by X under FDs F, testing whether X is a Superkey (when X⁺ = R)",
      "To count how many DML DELETE triggers are attached to table X",
      "To remove all foreign keys from an ER diagram before DDL generation",
      "To enforce 1NF by splitting composite attributes into JSON blobs"
    ],
    correct_answer: "To compute the full set of attributes functionally determined by X under FDs F, testing whether X is a Superkey (when X⁺ = R)",
    cognitive_layer: "Execution Dynamics & Flow",
    explanation: "If the attribute closure X⁺ equals the entire relation schema R, then X functionally determines every attribute in R, proving X is a Superkey."
  },
  {
    question_text: "What requirement does First Normal Form (1NF) impose on every relational table?",
    options: [
      "Every attribute domain must contain only atomic (indivisible) values, with no repeating groups or multi-valued attributes in a single cell",
      "All non-key attributes must have zero transitive dependencies on candidate keys",
      "Every determinant in every functional dependency must be a candidate key",
      "Every table must have at least two foreign keys referencing parent entities"
    ],
    correct_answer: "Every attribute domain must contain only atomic (indivisible) values, with no repeating groups or multi-valued attributes in a single cell",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "1NF disallows nested tables, arrays, and comma-separated multi-valued entries in a column, requiring each attribute value to be single and atomic."
  },
  {
    question_text: "During Normalization, which property must a decomposition of R into R1 and R2 satisfy so that joining R1 ⋈ R2 never produces spurious extra tuples?",
    options: [
      "Lossless-Join Property: (R1 ∩ R2) -> R1 or (R1 ∩ R2) -> R2 must hold (the common attributes form a Superkey of R1 or R2)",
      "Trivial Dependency Property: R1 ∩ R2 must be completely empty",
      "DML Cascade Property: R1 must have fewer columns than R2",
      "Clustered Index Property: R1 and R2 must share no foreign keys"
    ],
    correct_answer: "Lossless-Join Property: (R1 ∩ R2) -> R1 or (R1 ∩ R2) -> R2 must hold (the common attributes form a Superkey of R1 or R2)",
    cognitive_layer: "Diagnostic Debugging & Tracing",
    explanation: "If the intersection of R1 and R2 is a superkey of at least one decomposed relation, the natural join R1 ⋈ R2 reconstructs R cleanly without generating spurious rows."
  },
  {
    question_text: "Why is 3NF decomposition sometimes chosen over BCNF decomposition in practical database design?",
    options: [
      "Every relation has a lossless-join and dependency-preserving 3NF decomposition, whereas BCNF guarantees lossless join but cannot always preserve all functional dependencies",
      "BCNF fails to eliminate partial dependencies whereas 3NF eliminates multi-valued dependencies",
      "3NF allows repeating multi-valued groups whereas BCNF requires 1NF atomicity",
      "BCNF prevents the use of PRIMARY KEY and FOREIGN KEY DDL constraints"
    ],
    correct_answer: "Every relation has a lossless-join and dependency-preserving 3NF decomposition, whereas BCNF guarantees lossless join but cannot always preserve all functional dependencies",
    cognitive_layer: "Edge Cases & Trap Detection",
    explanation: "3NF is always achievable with both lossless join and dependency preservation; BCNF eliminates every non-superkey FD redundancy but may split an FD across two tables."
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

export const C_PROGRAMMING_QUESTION_BANK = [
  {
    question_text: "Which of the following statements regarding C programming language is correct?",
    options: [
      "C is a procedural, structured language supporting both high-level constructs and low-level memory operations",
      "C is a purely object-oriented language executed inside a bytecode virtual machine",
      "C prohibits explicit pointer arithmetic and manual memory deallocation",
      "C requires an automatic garbage collector to reclaim dynamically allocated heap memory"
    ],
    correct_answer: "C is a procedural, structured language supporting both high-level constructs and low-level memory operations",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "C is famously known as a middle-level procedural language designed by Dennis Ritchie, offering structured syntax alongside direct memory manipulation through pointers."
  },
  {
    question_text: "Which function in C dynamically allocates memory on the heap and explicitly initializes all allocated bytes to zero?",
    options: ["calloc()", "malloc()", "realloc()", "valloc()"],
    correct_answer: "calloc()",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "calloc(n, size) allocates memory for an array of n elements and initializes all bits to zero, whereas malloc() leaves allocated memory uninitialized."
  },
  {
    question_text: "In C, what is the effect of declaring a variable with the 'static' storage class inside a function block?",
    options: [
      "It retains its value across multiple function calls and persists for the lifetime of the program",
      "It makes the variable globally visible to all other translation units",
      "It forces the compiler to store the variable inside a CPU register",
      "It causes a segmentation fault if accessed more than once"
    ],
    correct_answer: "It retains its value across multiple function calls and persists for the lifetime of the program",
    cognitive_layer: "Execution Dynamics & Flow",
    explanation: "A local static variable is allocated in the data segment rather than the stack, preserving its value between invocations while restricting visibility to that function."
  },
  {
    question_text: "What happens when a program attempts to modify the contents of a string literal in C (e.g., char *s = \"hello\"; s[0] = 'H';)?",
    options: [
      "It invokes Undefined Behavior and typically causes a Segmentation Fault at runtime",
      "It mutates the string in place successfully according to ANSI C standards",
      "The compiler automatically duplicates the string into the heap",
      "The program skips the instruction and continues without error"
    ],
    correct_answer: "It invokes Undefined Behavior and typically causes a Segmentation Fault at runtime",
    cognitive_layer: "Diagnostic Debugging & Tracing",
    explanation: "String literals are typically stored in read-only memory segments (.rodata). Attempting to modify them leads to undefined behavior, frequently causing a SIGSEGV segmentation fault."
  },
  {
    question_text: "In C programming, what is the fundamental difference in memory layout between a 'struct' and a 'union'?",
    options: [
      "A struct allocates separate memory for every member, while a union shares a single common memory space equal to its largest member",
      "A union can only contain pointer data types while a struct can contain primitive types",
      "A struct is stored on the heap while a union is always placed in CPU cache",
      "A union cannot be passed to a function by value while a struct can"
    ],
    correct_answer: "A struct allocates separate memory for every member, while a union shares a single common memory space equal to its largest member",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "In a struct, each member has its own distinct offset in memory. In a union, all members share the same base address, allowing only one member to be stored at any time."
  },
  {
    question_text: "What occurs when an array is passed as an argument to a function in C (e.g., void process(int arr[]))?",
    options: [
      "The array decays into a pointer to its first element (&arr[0]), losing its size information",
      "The entire array is deeply copied element-by-element onto the function call stack",
      "The compiler enforces compile-time size verification",
      "The array becomes immutable and read-only inside the function body"
    ],
    correct_answer: "The array decays into a pointer to its first element (&arr[0]), losing its size information",
    cognitive_layer: "Execution Dynamics & Flow",
    explanation: "In C parameter declarations, array notation decays to a pointer. sizeof(arr) inside the function evaluates to the size of a pointer, requiring the length to be supplied separately."
  },
  {
    question_text: "What is a 'Dangling Pointer' in C?",
    options: [
      "A pointer that points to a memory location that has already been deallocated or freed",
      "A pointer that has been declared but initialized to NULL",
      "A pointer pointing to a function address rather than data",
      "A pointer whose target address is aligned to an odd byte boundary"
    ],
    correct_answer: "A pointer that points to a memory location that has already been deallocated or freed",
    cognitive_layer: "Diagnostic Debugging & Tracing",
    explanation: "Dangling pointers occur when memory is freed via free() without resetting the pointer to NULL. Dereferencing a dangling pointer leads to memory corruption and undefined behavior."
  },
  {
    question_text: "Which standard C header file must be included to use dynamic memory management functions like malloc(), calloc(), and free()?",
    options: ["<stdlib.h>", "<stdio.h>", "<string.h>", "<memory.h>"],
    correct_answer: "<stdlib.h>",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "<stdlib.h> contains declarations for dynamic memory management, random number generation, process communication, and integer arithmetic."
  },
  {
    question_text: "What is the primary purpose of preprocessor include guards (#ifndef ... #define ... #endif) in C header files?",
    options: [
      "To prevent duplicate definition errors caused by circular or multiple header inclusions",
      "To encrypt header file code before compilation",
      "To enforce static type checking during macro expansion",
      "To automatically link external library object files"
    ],
    correct_answer: "To prevent duplicate definition errors caused by circular or multiple header inclusions",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "Include guards guarantee that the contents of a header file are only processed once per translation unit, preventing redefinition errors."
  },
  {
    question_text: "What is the return value of the printf() function in standard C upon successful execution?",
    options: [
      "The total number of characters successfully written to the standard output",
      "Void (printf produces no return value)",
      "A status code 0 indicating success",
      "A pointer to the formatted character string"
    ],
    correct_answer: "The total number of characters successfully written to the standard output",
    cognitive_layer: "Edge Cases & Trap Detection",
    explanation: "printf() returns the count of characters printed, or a negative value if an output error occurs."
  }
];

export const JAVA_QUESTION_BANK = [
  {
    question_text: "In Java Object-Oriented Programming, how is an object fundamentally related to a class?",
    options: [
      "A class is a blueprint defining state and behavior, while an object is a runtime instance created from that blueprint on the heap",
      "An object is a compile-time template used to generate multiple static classes",
      "A class holds runtime instance data directly without allocating any objects via new",
      "An object can exist in Java memory completely independent of any class definition"
    ],
    correct_answer: "A class is a blueprint defining state and behavior, while an object is a runtime instance created from that blueprint on the heap",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "A class specifies fields (attributes) and methods, whereas each object instantiated with the 'new' keyword occupies its own memory on the heap with distinct instance state."
  },
  {
    question_text: "Which statement is TRUE regarding constructors in a Java class?",
    options: [
      "A constructor must share the exact name of the class and has no explicit return type, not even void",
      "A constructor must always declare void as its return type so the JVM ignores its output",
      "Constructors are inherited automatically by subclasses and invoked like static utility methods",
      "A Java class fails to compile unless the programmer explicitly writes a no-argument constructor"
    ],
    correct_answer: "A constructor must share the exact name of the class and has no explicit return type, not even void",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "Java constructors initialize newly created objects, share the class name, have no return type (adding void turns one into a regular method), and Java supplies a default no-arg constructor only when no constructor is declared."
  },
  {
    question_text: "What happens if a Java class defines a parameterized constructor (e.g., Student(String name)) and omits a no-argument constructor, and client code calls new Student()?",
    options: [
      "A compile-time error occurs because Java stops generating the implicit default no-argument constructor once any constructor is explicitly declared",
      "The JVM automatically invokes the parameterized constructor with null arguments",
      "The program compiles normally and sets all primitive and reference fields to empty strings",
      "A ClassCastException is thrown at runtime when instantiating the object"
    ],
    correct_answer: "A compile-time error occurs because Java stops generating the implicit default no-argument constructor once any constructor is explicitly declared",
    cognitive_layer: "Edge Cases & Trap Detection",
    explanation: "The Java compiler only synthesizes a default no-argument constructor when a class declares zero constructors. Defining any constructor suppresses the implicit default."
  },
  {
    question_text: "What is the primary purpose of the 'this' keyword inside a Java instance method or constructor?",
    options: [
      "It acts as a reference to the current object instance, allowing disambiguation of shadowed instance variables and constructor chaining via this(...)",
      "It allocates a new object clone inside the JVM stack frame",
      "It references the immediate superclass fields from inside a static method",
      "It forces garbage collection on the current instance after method completion"
    ],
    correct_answer: "It acts as a reference to the current object instance, allowing disambiguation of shadowed instance variables and constructor chaining via this(...)",
    cognitive_layer: "Execution Dynamics & Flow",
    explanation: "'this' refers to the current object whose method or constructor is executing, commonly used as 'this.field = field' or to invoke another overloaded constructor of the same class."
  },
  {
    question_text: "How does Encapsulation in Java protect the internal state of a class?",
    options: [
      "By declaring instance fields as private and exposing controlled access through public getter and setter methods",
      "By marking every variable in the class as public static final",
      "By storing all instance fields inside local variables of the main() method",
      "By allowing subclasses to directly overwrite private fields without validation"
    ],
    correct_answer: "By declaring instance fields as private and exposing controlled access through public getter and setter methods",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "Encapsulation bundles data and methods inside a class while restricting direct external field modification through access modifiers like private, validating state via public methods."
  },
  {
    question_text: "Which Java principle allows multiple methods in the same class to share the exact same name provided they differ in parameter count, types, or order?",
    options: [
      "Method Overloading (Compile-time Polymorphism)",
      "Method Overriding (Runtime Polymorphism)",
      "Multiple Class Inheritance",
      "Dynamic Class Loading"
    ],
    correct_answer: "Method Overloading (Compile-time Polymorphism)",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "Method overloading is resolved at compile time based on the method signature (name + parameter list). Changing only the return type does not overload a method."
  },
  {
    question_text: "In Java inheritance, when a Child object is referenced by a Parent variable (Parent p = new Child();), which overridden instance method executes when p.show() is called?",
    options: [
      "The Child class implementation is invoked at runtime via Dynamic Method Dispatch",
      "The Parent class implementation always executes based on the compile-time reference type",
      "Both Parent and Child implementations execute sequentially",
      "A compilation error occurs because a Parent variable cannot hold a Child reference"
    ],
    correct_answer: "The Child class implementation is invoked at runtime via Dynamic Method Dispatch",
    cognitive_layer: "Execution Dynamics & Flow",
    explanation: "Java resolves overridden instance methods dynamically at runtime according to the actual object's type on the heap (runtime polymorphism), rather than the reference variable's declared type."
  },
  {
    question_text: "What restriction applies when calling a static method (e.g., public static void display()) inside a Java class?",
    options: [
      "It belongs to the class rather than any instance and cannot directly reference non-static fields or use 'this' or 'super'",
      "It can only be called after creating at least one object using the new operator",
      "It automatically becomes private and invisible outside its package",
      "It forces all local variables inside the method to persist permanently across calls"
    ],
    correct_answer: "It belongs to the class rather than any instance and cannot directly reference non-static fields or use 'this' or 'super'",
    cognitive_layer: "Diagnostic Debugging & Tracing",
    explanation: "Static members belong to the class itself and exist before any object is instantiated; therefore, accessing instance-specific state requires an explicit object reference."
  },
  {
    question_text: "In Java, how is the 'super' keyword used inside a subclass constructor?",
    options: [
      "super(...) invokes an immediate superclass constructor and must appear as the very first statement in the subclass constructor",
      "super(...) executes after all subclass fields are initialized to finalize parent cleanup",
      "super allocates an independent copy of the superclass object in static memory",
      "super enables a single Java class to extend multiple concrete parent classes simultaneously"
    ],
    correct_answer: "super(...) invokes an immediate superclass constructor and must appear as the very first statement in the subclass constructor",
    cognitive_layer: "Execution Dynamics & Flow",
    explanation: "Subclass constructors chain to a superclass constructor first (either explicitly via super(...) or implicitly via no-arg super()) to initialize inherited parent state before child state."
  },
  {
    question_text: "What role do the Java compiler (javac) and Java Virtual Machine (JVM) play in making Java platform-independent?",
    options: [
      "javac compiles .java source files into platform-independent bytecode (.class), which the JVM interprets/JIT-compiles on the host OS",
      "javac compiles .java files directly into Windows-only .exe native machine instructions",
      "The JVM translates raw .java text directly without any intermediate .class file",
      "javac links C header files statically to execute inside an OS kernel module"
    ],
    correct_answer: "javac compiles .java source files into platform-independent bytecode (.class), which the JVM interprets/JIT-compiles on the host OS",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "Write Once, Run Anywhere relies on portable bytecode (.class) generated by javac, executed across diverse operating systems by host-specific JVMs."
  },
  {
    question_text: "What is the key difference between an 'abstract class' and an 'interface' in Java?",
    options: [
      "A class can extend only one abstract class, whereas it can implement multiple interfaces",
      "An abstract class can never contain concrete implemented methods or constructors",
      "An interface can store mutable non-final instance state inherited directly by objects",
      "Abstract classes can be instantiated directly using the new keyword"
    ],
    correct_answer: "A class can extend only one abstract class, whereas it can implement multiple interfaces",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "Java enforces single class inheritance (extends) to avoid diamond ambiguity, while allowing a class to implement any number of interfaces to achieve multiple type inheritance."
  },
  {
    question_text: "In Java, why are wrapper classes (such as Integer, Double, Boolean) provided alongside primitive types?",
    options: [
      "They encapsulate primitive values inside objects so primitives can be used with object-only APIs like Java Collections and Generics",
      "They execute arithmetic operations faster than primitive CPU registers",
      "They convert Java from a statically typed language into a dynamically typed scripting language",
      "They prevent garbage collection of numerical constants"
    ],
    correct_answer: "They encapsulate primitive values inside objects so primitives can be used with object-only APIs like Java Collections and Generics",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "Generics and collections (e.g., ArrayList<Integer>) require object references rather than primitives, with autoboxing/unboxing converting smoothly between int and Integer."
  }
];

export const PYTHON_QUESTION_BANK = [
  {
    question_text: "In Python, what is the key difference between a 'list' and a 'tuple'?",
    options: [
      "A list is mutable (elements can be added, removed, or modified), whereas a tuple is immutable once created",
      "A tuple can only store numeric types while a list can store mixed types",
      "Lists are indexed starting from 1 while tuples are indexed starting from 0",
      "A list cannot be nested inside another list"
    ],
    correct_answer: "A list is mutable (elements can be added, removed, or modified), whereas a tuple is immutable once created",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "Lists use square brackets [...] and support in-place mutation, while tuples use parentheses (...) and remain immutable."
  },
  {
    question_text: "In a Python class, what is the role of the '__init__' method and its first parameter 'self'?",
    options: [
      "__init__ initializes attributes on a newly created object instance, and 'self' refers to that specific instance",
      "__init__ destroys objects from memory when reference count reaches zero",
      "'self' is a reserved static keyword that shares values across all classes in a module",
      "__init__ executes once at module import time before any class is defined"
    ],
    correct_answer: "__init__ initializes attributes on a newly created object instance, and 'self' refers to that specific instance",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "Python passes the new instance automatically as the first argument ('self') to __init__ so instance attributes like self.name can be attached."
  },
  {
    question_text: "In Python, how does the 'is' operator differ from the '==' operator?",
    options: [
      "'is' checks object identity (whether both names point to the same object in memory), while '==' checks value equality",
      "'==' compares memory addresses while 'is' performs case-insensitive string comparison",
      "'is' only works for integers while '==' only works for strings",
      "Both operators perform identical value checks in every situation"
    ],
    correct_answer: "'is' checks object identity (whether both names point to the same object in memory), while '==' checks value equality",
    cognitive_layer: "Edge Cases & Trap Detection",
    explanation: "Two distinct lists [1, 2] == [1, 2] evaluate True for value equality, whereas [1, 2] is [1, 2] evaluates False because they are separate objects in memory."
  },
  {
    question_text: "What requirement must a value meet to serve safely as a key in a Python dictionary (dict)?",
    options: [
      "The key must be hashable and immutable (e.g., str, int, tuple of immutables)",
      "The key must be a mutable list so the dictionary can re-sort it dynamically",
      "All dictionary keys within a single dict must share the exact same data type",
      "Keys must be strictly ordered alphabetically upon insertion"
    ],
    correct_answer: "The key must be hashable and immutable (e.g., str, int, tuple of immutables)",
    cognitive_layer: "Concept Foundation & Syntax",
    explanation: "Python dictionaries are hash tables; mutable objects such as lists or sets are unhashable and raise a TypeError if used as keys."
  }
];

const QUESTION_BANKS = {
  java: JAVA_QUESTION_BANK,
  c: C_PROGRAMMING_QUESTION_BANK,
  python: PYTHON_QUESTION_BANK,
  dbms: DBMS_QUESTION_BANK,
  dsa: DSA_QUESTION_BANK,
  os: OS_QUESTION_BANK,
  networking: NETWORKING_QUESTION_BANK
};

const DOMAIN_DISTRACTORS = {
  java: [
    "Java forces manual pointer arithmetic and explicit free() calls instead of automatic garbage collection.",
    "Constructors in Java must declare a void return type in order to instantiate objects.",
    "Java compiles source code directly into platform-specific machine executables without bytecode or a JVM.",
    "A static method in Java can directly access non-static instance variables using the 'this' keyword.",
    "A Java class can directly extend multiple concrete parent classes simultaneously using commas."
  ],
  c: [
    "C is an interpreted scripting language executed strictly through an isolated bytecode virtual machine.",
    "C strictly prohibits direct pointer manipulation and manual heap memory allocation.",
    "C relies on an automatic garbage collector to reclaim dynamically allocated heap memory.",
    "C enforces runtime dynamic typing and eliminates compile-time type declarations.",
    "C executes exclusively through object-oriented virtual method tables."
  ],
  python: [
    "Python requires manual memory deallocation using malloc() and free() for every list.",
    "Python tuples are mutable sequences that dynamically resize during iteration.",
    "Python uses curly braces instead of indentation to delimit class and function blocks.",
    "Python compiles directly to x86 assembly before running without a runtime interpreter."
  ],
  dbms: [
    "It permits partial functional dependencies on composite candidate keys under 2NF.",
    "It disables transaction logging and permits unrecoverable dirty writes during execution.",
    "It forces full table scans by omitting index structures across relational schemas.",
    "It treats all database entities as untyped flat files without relational constraints."
  ],
  general: [
    "It bypasses structured type checking and operates without deterministic state boundaries.",
    "It requires manual assembly instructions instead of modular abstractions.",
    "It disallows reusable components and executes strictly as unvalidated linear scripts.",
    "It prevents automated verification and eliminates predictable control flow."
  ]
};

function detectAcademicDomain(topic = '', referenceText = '') {
  const t = topic.toLowerCase().trim();
  const refSample = (referenceText || '').slice(0, 3000).toLowerCase();

  const matchesJava = (s) =>
    s.includes('java') || s.includes('jvm') || s.includes('jdk') || s.includes('jre') ||
    s.includes('class and object') || s.includes('classes and objects') ||
    s.includes('oop') || s.includes('object oriented') || s.includes('object-oriented') ||
    s.includes('encapsulation') || s.includes('inheritance') || s.includes('polymorphism') ||
    s.includes('constructor') || s.includes('abstract class') || s.includes('icse') ||
    s.includes('system.out') || s.includes('public static void main');

  const matchesC = (s) =>
    s === 'c' || s === 'c language' || s === 'c programming' ||
    /\bc\b/.test(s) || s.includes('c prog') || s.includes('pointer') ||
    s.includes('malloc') || s.includes('calloc') || s.includes('embedded c') ||
    s.includes('stdio.h');

  const matchesPython = (s) =>
    s.includes('python') || s.includes('django') || s.includes('flask') || s.includes('pandas');

  const matchesDbms = (s) =>
    s.includes('dbms') || s.includes('database') || s.includes('sql') ||
    s.includes('mysql') || s.includes('postgres') || s.includes('relational') ||
    s.includes('normaliz') || s.includes('transaction') || s.includes('acid');

  const matchesDsa = (s) =>
    s.includes('dsa') || s.includes('data structure') || s.includes('algorithm') ||
    s.includes('binary tree') || s.includes('graph') || s.includes('linked list') ||
    s.includes('stack') || s.includes('queue') || s.includes('sorting');

  const matchesOs = (s) =>
    s.includes('operating system') || /\bos\b/.test(s) || s.includes('linux') ||
    s.includes('deadlock') || s.includes('paging') || s.includes('semaphore') || s.includes('cpu scheduling');

  const matchesNet = (s) =>
    s.includes('network') || s.includes('tcp') || /\bip\b/.test(s) ||
    s.includes('osi') || s.includes('routing') || s.includes('http') || s.includes('dns');

  if (matchesJava(t)) return 'java';
  if (matchesPython(t)) return 'python';
  if (matchesDbms(t)) return 'dbms';
  if (matchesDsa(t)) return 'dsa';
  if (matchesOs(t)) return 'os';
  if (matchesNet(t)) return 'networking';
  if (matchesC(t)) return 'c';

  if (refSample) {
    if (matchesJava(refSample)) return 'java';
    if (matchesPython(refSample)) return 'python';
    if (matchesDbms(refSample)) return 'dbms';
    if (matchesDsa(refSample)) return 'dsa';
    if (matchesOs(refSample)) return 'os';
    if (matchesNet(refSample)) return 'networking';
    if (matchesC(refSample)) return 'c';
  }

  return 'general';
}

const SUBTOPIC_ALIASES = {
  entity: ['entity', 'weak entity', 'strong entity', 'er ', 'er-', 'er(', 'participation', 'cardinality', 'attribute', 'derived', 'multivalued', 'generalization', 'specialization', 'isa hierarchy'],
  relationship: ['relationship', 'er ', 'er-', 'er(', 'cardinality', 'participation', 'recursive', 'unary', 'm:n', 'many-to-many', 'identifying relationship'],
  er: ['entity', 'relationship', 'er ', 'er-', 'weak entity', 'cardinality', 'participation', 'attribute', 'generalization', 'specialization'],
  dml: ['dml', 'data manipulation', 'insert', 'update', 'delete', 'on delete', 'rollback'],
  ddl: ['ddl', 'data definition', 'create', 'alter table', 'drop table', 'truncate', 'constraint', 'schema'],
  functional: ['functional depend', 'armstrong', 'closure', 'trivial', 'partial', 'transitive', 'x -> y', 'superkey', 'canonical'],
  dependency: ['functional depend', 'armstrong', 'closure', 'trivial', 'partial', 'transitive', 'x -> y'],
  fd: ['functional depend', 'armstrong', 'closure', 'trivial', 'partial', 'transitive', 'x -> y'],
  key: ['key', 'primary key', 'candidate key', 'super key', 'superkey', 'foreign key', 'alternate key', 'composite', 'unique', 'prime attribute'],
  keys: ['key', 'primary key', 'candidate key', 'super key', 'superkey', 'foreign key', 'alternate key', 'composite', 'unique', 'prime attribute'],
  normal: ['normal', '1nf', '2nf', '3nf', 'bcnf', '4nf', 'lossless', 'decomposition', 'dependency-preserving', 'anomal'],
  normalization: ['normal', '1nf', '2nf', '3nf', 'bcnf', '4nf', 'lossless', 'decomposition', 'dependency-preserving', 'anomal'],
  join: ['join', 'inner join', 'lossless', 'cartesian'],
  index: ['index', 'b+ tree', 'clustered', 'secondary'],
  transaction: ['transaction', 'acid', '2pl', 'two-phase locking', 'deadlock', 'serializable', 'wal', 'durability'],
  acid: ['acid', 'durability', 'atomicity', 'consistency', 'isolation', 'wal'],
  class: ['class', 'blueprint', 'object', 'instance', 'constructor', 'encapsulation', 'static'],
  object: ['object', 'class', 'instance', 'new keyword', 'heap', 'constructor', 'this'],
  constructor: ['constructor', 'no-arg', 'super(', 'this(', 'overload'],
  inheritance: ['inheritance', 'subclass', 'superclass', 'extends', 'super(', 'dynamic method dispatch', 'overrid'],
  polymorphism: ['polymorphism', 'overload', 'overrid', 'dynamic method dispatch'],
  encapsulation: ['encapsulation', 'private', 'getter', 'setter'],
  pointer: ['pointer', 'dangling', 'malloc', 'calloc', 'decay', 'address'],
  memory: ['malloc', 'calloc', 'realloc', 'free', 'heap', 'static', 'union', 'struct']
};

const BROAD_DOMAIN_WORDS = new Set([
  'dbms', 'database', 'rdbms', 'sql', 'java', 'python', 'c', 'dsa', 'os',
  'programming', 'language', 'concept', 'concepts', 'basic', 'basics', 'notes',
  'introduction', 'intro', 'unit', 'chapter', 'module', 'syllabus', 'exam', 'quiz'
]);

const INSTRUCTION_FILLER_RE = /\b(give|generate|create|make|prepare|write|provide|list|ask|build|set|suggest|include|focus|topics?|syllabus|questions?|mcqs?|multiple|choice|about|regarding|please|following|based)\b/gi;
const FINITE_FACT_VERB_RE = /\b(is|are|was|were|has|have|had|can|will|does|do|refers|means|defines|provides|eliminates|ensures|allows|uses|stores|represents|consists|requires|enforces|creates|operates|handles|returns|prevents|guarantees|maintains|executes|compiles|allocates|invokes|supports|separates|permits|disallows|depicts|relates|maps)\b/i;

function isInstructionOrTopicList(sentence) {
  const s = (sentence || '').trim();
  if (!s) return true;
  if (/^(give|generate|create|make|prepare|write|provide|list|ask|build|set|suggest|include|focus\s+on|need|want|topics?\s*:|syllabus\s*:|questions?\s+(on|about|for)|mcqs?\s+(on|about|for))\b/i.test(s)) {
    return true;
  }
  const delimiterCount = (s.match(/[,;|]/g) || []).length;
  if (delimiterCount >= 2 && (!FINITE_FACT_VERB_RE.test(s) || s.length / (delimiterCount + 1) < 28)) {
    return true;
  }
  return false;
}

function extractFocusSubtopics(topic = '', referenceText = '') {
  const refSnippet = (referenceText || '').slice(0, 1500);
  const combined = `${topic}\n${refSnippet}`
    .replace(INSTRUCTION_FILLER_RE, ' ')
    .replace(/\b(on|for|with|and|or|of|the|in|to|a|an)\b/gi, ',');

  const rawPhrases = combined
    .split(/[,;\n/|&]+/)
    .map(p => p.trim().toLowerCase().replace(/[^a-z0-9\s+:-]/g, ' ').replace(/\s+/g, ' '))
    .filter(p => p.length >= 2 && !BROAD_DOMAIN_WORDS.has(p));

  const unique = [];
  const seen = new Set();
  for (const phrase of rawPhrases) {
    if (!seen.has(phrase)) {
      seen.add(phrase);
      unique.push(phrase);
    }
    const words = phrase.split(' ').filter(w => w.length >= 2 && !BROAD_DOMAIN_WORDS.has(w));
    for (const w of words) {
      if (!seen.has(w)) {
        seen.add(w);
        unique.push(w);
      }
    }
  }
  return unique;
}

function getSearchTermsForSubtopic(subtopic) {
  const terms = new Set([subtopic]);
  if (SUBTOPIC_ALIASES[subtopic]) {
    for (const alias of SUBTOPIC_ALIASES[subtopic]) terms.add(alias);
  }
  for (const word of subtopic.split(/\s+/)) {
    if (word.length >= 3) terms.add(word);
    if (SUBTOPIC_ALIASES[word]) {
      for (const alias of SUBTOPIC_ALIASES[word]) terms.add(alias);
    }
  }
  return [...terms];
}

function selectTopicRelevantBankQuestions(bank, subtopics, targetCount, safeTopic, cognitiveLayer) {
  const formatItem = (item) => ({
    ...item,
    cognitive_layer: cognitiveLayer && cognitiveLayer !== 'Multi-Layer Balanced' ? cognitiveLayer : item.cognitive_layer,
    topic_tag: safeTopic,
    marks: 2
  });

  if (!subtopics || subtopics.length === 0) {
    return Array.from({ length: targetCount }, (_, idx) => formatItem(bank[idx % bank.length]));
  }

  const searchable = bank.map(item =>
    `${item.question_text} ${item.explanation || ''} ${(item.options || []).join(' ')}`.toLowerCase()
  );

  const buckets = [];
  for (const sub of subtopics) {
    const terms = getSearchTermsForSubtopic(sub);
    const matchingIndices = [];
    bank.forEach((_, idx) => {
      let score = 0;
      for (const term of terms) {
        if (searchable[idx].includes(term)) {
          score += term === sub ? 3 : 1;
        }
      }
      if (score > 0) {
        matchingIndices.push({ idx, score });
      }
    });
    if (matchingIndices.length > 0) {
      matchingIndices.sort((a, b) => b.score - a.score);
      buckets.push(matchingIndices.map(m => m.idx));
    }
  }

  if (buckets.length === 0) {
    return Array.from({ length: targetCount }, (_, idx) => formatItem(bank[idx % bank.length]));
  }

  const pickedIndices = [];
  const used = new Set();
  const cursors = new Array(buckets.length).fill(0);
  let progressed = true;

  while (pickedIndices.length < targetCount && progressed) {
    progressed = false;
    for (let b = 0; b < buckets.length && pickedIndices.length < targetCount; b++) {
      while (cursors[b] < buckets[b].length) {
        const candidateIdx = buckets[b][cursors[b]++];
        if (!used.has(candidateIdx)) {
          used.add(candidateIdx);
          pickedIndices.push(candidateIdx);
          progressed = true;
          break;
        }
      }
    }
  }

  if (pickedIndices.length < targetCount) {
    for (let i = 0; i < bank.length && pickedIndices.length < targetCount; i++) {
      if (!used.has(i)) {
        used.add(i);
        pickedIndices.push(i);
      }
    }
  }

  const result = pickedIndices.map(idx => formatItem(bank[idx]));
  while (result.length < targetCount && result.length > 0) {
    result.push({ ...result[result.length % pickedIndices.length] });
  }
  return result.slice(0, targetCount);
}

function extractCleanStatements(cleanRef) {
  if (!cleanRef) return [];
  const rawChunks = cleanRef
    .split(/(?<=[.?!])\s+|[\r\n]+/)
    .map(s => s.replace(/^[\u2022\-\*\d+\.\)\s]+/, '').trim().replace(/\s+/g, ' '))
    .filter(s => {
      if (s.length < 30 || s.length > 240) return false;
      if (s.startsWith('[Document attached')) return false;
      if (isInstructionOrTopicList(s)) return false;
      const lower = s.toLowerCase();
      if (/\b(endobj|endstream|flatedecode|fontdescriptor|xref|trailer|mediabox)\b/.test(lower)) return false;
      const letters = (s.match(/[a-zA-Z]/g) || []).length;
      const words = s.split(/\s+/).filter(w => /[a-zA-Z]{2,}/.test(w));
      return letters / s.length >= 0.55 && words.length >= 5;
    });

  return [...new Set(rawChunks)];
}

function buildGeneralTopicQuestions(topic, targetCount, cognitiveLayer) {
  const safeTopic = (topic || 'Computer Science').trim();
  const defaultLayer = (fallback) =>
    cognitiveLayer && cognitiveLayer !== 'Multi-Layer Balanced' ? cognitiveLayer : fallback;

  const templates = [
    {
      question_text: `Which fundamental design principle is central to organizing and implementing ${safeTopic}?`,
      options: [
        `Decomposing responsibilities into clear, modular abstractions with well-defined interfaces and predictable state`,
        `Combining all unrelated logic into a single global script without encapsulation or structure`,
        `Eliminating type boundaries and avoiding validation across module inputs`,
        `Duplicating state across uncoordinated global variables to bypass encapsulation`
      ],
      correct_answer: `Decomposing responsibilities into clear, modular abstractions with well-defined interfaces and predictable state`,
      cognitive_layer: defaultLayer('Concept Foundation & Syntax'),
      explanation: `Effective work in ${safeTopic} relies on clean abstraction boundaries, modular structure, and predictable state management.`
    },
    {
      question_text: `When tracing program execution in ${safeTopic}, which practice prevents subtle runtime defects?`,
      options: [
        `Validating boundary inputs, handling null/empty edge states, and maintaining clear control flow`,
        `Suppressing all runtime exceptions silently so execution continues with corrupted state`,
        `Hardcoding fixed magic numbers for dynamic user inputs and ignoring error states`,
        `Relying on uninitialized variables without predictable default state`
      ],
      correct_answer: `Validating boundary inputs, handling null/empty edge states, and maintaining clear control flow`,
      cognitive_layer: defaultLayer('Diagnostic Debugging & Tracing'),
      explanation: `Explicit input validation and handling null/boundary states keep execution in ${safeTopic} reliable and easier to debug.`
    },
    {
      question_text: `In ${safeTopic}, why is separating interface behavior from internal implementation details recommended?`,
      options: [
        `It allows internal logic to evolve safely without breaking callers that depend on the public contract`,
        `It disables compiler syntax checking to speed up unverified code changes`,
        `It forces external callers to directly manipulate private internal fields`,
        `It converts runtime logic into uneditable binary constants`
      ],
      correct_answer: `It allows internal logic to evolve safely without breaking callers that depend on the public contract`,
      cognitive_layer: defaultLayer('Execution Dynamics & Flow'),
      explanation: `Encapsulating implementation details behind stable contracts reduces coupling and makes systems in ${safeTopic} maintainable.`
    },
    {
      question_text: `Which testing and verification approach is most effective for catching edge cases in ${safeTopic}?`,
      options: [
        `Testing boundary inputs, zero/null states, and invalid inputs alongside standard happy-path scenarios`,
        `Running a single manual test with ideal inputs and assuming all edge cases succeed`,
        `Disabling assertions in test suites whenever an unexpected failure occurs`,
        `Testing only formatting style while skipping behavioral verification`
      ],
      correct_answer: `Testing boundary inputs, zero/null states, and invalid inputs alongside standard happy-path scenarios`,
      cognitive_layer: defaultLayer('Edge Cases & Trap Detection'),
      explanation: `Boundary and invalid-input cases expose subtle off-by-one, null-reference, and state-transition bugs in ${safeTopic}.`
    }
  ];

  const out = [];
  for (let i = 0; i < targetCount; i++) {
    const item = templates[i % templates.length];
    out.push({
      ...item,
      options: [...item.options].sort(() => 0.5 - Math.random()),
      topic_tag: safeTopic,
      marks: 2
    });
  }
  return out;
}

/**
 * Intelligent topic selector & question synthesizer
 */
export function generateSmartQuestions({ topic, referenceText, count, difficulty, cognitiveLayer }) {
  const targetCount = Math.max(1, Math.min(30, Number(count) || 4));
  const safeTopic = (topic || 'Computer Science').trim();
  const ref = (referenceText || '').trim();

  const isPlaceholder = ref.startsWith('[Document attached:') || ref.includes('Ready for AI reference parsing') || ref.length < 3;
  const cleanRef = isPlaceholder ? '' : ref;

  const domain = detectAcademicDomain(safeTopic, cleanRef);
  const selectedBank = QUESTION_BANKS[domain] || null;
  const domainDistractors = DOMAIN_DISTRACTORS[domain] || DOMAIN_DISTRACTORS.general;
  const focusSubtopics = extractFocusSubtopics(safeTopic, cleanRef);

  // If genuine factual reference notes were extracted/pasted (not merely an instruction/topic list), synthesize from them
  if (cleanRef) {
    const rawSentences = extractCleanStatements(cleanRef);

    if (rawSentences.length >= 1) {
      const questions = [];
      const phrasingTemplates = [
        `Which of the following statements regarding ${safeTopic} is correct?`,
        `In the context of ${safeTopic}, which of the following is TRUE?`,
        `Which of the following accurately describes a core concept in ${safeTopic}?`,
        `Regarding ${safeTopic}, which statement correctly highlights its key characteristics?`,
        `Which of the following is a verified principle in ${safeTopic}?`
      ];

      for (let i = 0; i < Math.min(targetCount, rawSentences.length); i++) {
        const sentence = rawSentences[i];
        const distractors = [];
        for (let k = 0; k < 3; k++) {
          distractors.push(domainDistractors[(i + k) % domainDistractors.length]);
        }

        const options = [sentence, ...distractors].sort(() => 0.5 - Math.random());
        const qText = phrasingTemplates[i % phrasingTemplates.length];

        questions.push({
          question_text: qText,
          options,
          correct_answer: sentence,
          marks: 2,
          cognitive_layer: cognitiveLayer && cognitiveLayer !== 'Multi-Layer Balanced' ? cognitiveLayer : (i % 2 === 0 ? 'Concept Foundation & Syntax' : 'Execution Dynamics & Flow'),
          topic_tag: safeTopic,
          explanation: `In ${safeTopic}, this statement accurately reflects its core technical definition and behavior.`
        });
      }

      if (questions.length < targetCount) {
        const remaining = targetCount - questions.length;
        const fill = selectedBank
          ? selectTopicRelevantBankQuestions(selectedBank, focusSubtopics, remaining, safeTopic, cognitiveLayer)
          : buildGeneralTopicQuestions(safeTopic, remaining, cognitiveLayer);
        questions.push(...fill);
      }

      return questions.slice(0, targetCount);
    }
  }

  if (!selectedBank) {
    return buildGeneralTopicQuestions(safeTopic, targetCount, cognitiveLayer);
  }

  return selectTopicRelevantBankQuestions(selectedBank, focusSubtopics, targetCount, safeTopic, cognitiveLayer);
}

