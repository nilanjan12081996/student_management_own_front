/**
 * Comprehensive Academic Question Bank & Synthesizer (Zero-Repetition Guaranteed)
 * Provides 45+ university-standard MCQs per domain across all 4 cognitive layers.
 */

export const DBMS_QUESTION_BANK = [
  {
    "question_text": "Which normal form strictly eliminates all partial functional dependencies on a composite candidate key?",
    "options": [
      "Second Normal Form (2NF)",
      "First Normal Form (1NF)",
      "Third Normal Form (3NF)",
      "Boyce-Codd Normal Form (BCNF)"
    ],
    "correct_answer": "Second Normal Form (2NF)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "2NF requires the relation to be in 1NF and that every non-prime attribute is fully functionally dependent on every candidate key, eliminating partial dependencies."
  },
  {
    "question_text": "Which of the following ACID transaction properties guarantees that once a transaction commits, its modifications persist even during a sudden power or system failure?",
    "options": [
      "Durability",
      "Atomicity",
      "Consistency",
      "Isolation"
    ],
    "correct_answer": "Durability",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Durability ensures that the changes of a committed transaction survive system crashes and power failures, typically achieved via non-volatile Write-Ahead Logging (WAL)."
  },
  {
    "question_text": "In a relational schema with relation R(A, B, C) and functional dependencies {A -> B, B -> C}, which normal form is violated by the transitive dependency A -> C?",
    "options": [
      "Third Normal Form (3NF)",
      "First Normal Form (1NF)",
      "Second Normal Form (2NF)",
      "Fourth Normal Form (4NF)"
    ],
    "correct_answer": "Third Normal Form (3NF)",
    "cognitive_layer": "Diagnostic Debugging & Tracing",
    "explanation": "3NF requires that for every functional dependency X -> Y, either X is a superkey or Y is a prime attribute. Transitive dependencies via non-prime attributes violate 3NF."
  },
  {
    "question_text": "What is the primary difference between a clustered index and an unclustered (secondary) index in a relational database?",
    "options": [
      "A clustered index determines the physical storage order of rows in the table (maximum 1 per table)",
      "A clustered index can be created on multiple non-primary key columns without sorting data",
      "An unclustered index stores the entire table row data directly within its leaf nodes",
      "Clustered indexes are slower for range queries than secondary hash indexes"
    ],
    "correct_answer": "A clustered index determines the physical storage order of rows in the table (maximum 1 per table)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "A table can only have one clustered index because the data rows themselves are physically ordered on disk by the clustered index key."
  },
  {
    "question_text": "In the Two-Phase Locking (2PL) concurrency control protocol, when is a transaction prohibited from acquiring any new locks?",
    "options": [
      "Once it enters the Shrinking Phase (after releasing its first lock)",
      "During the Growing Phase while holding shared locks",
      "Immediately after executing its first SELECT query",
      "Only after the transaction issues a COMMIT or ROLLBACK command"
    ],
    "correct_answer": "Once it enters the Shrinking Phase (after releasing its first lock)",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "The Two-Phase Locking protocol consists of a Growing Phase (locks may be acquired) and a Shrinking Phase (locks may only be released; no new locks can be acquired), guaranteeing conflict serializability."
  },
  {
    "question_text": "In SQL, which clause is specifically mandatory when filtering groups created by a GROUP BY aggregation?",
    "options": [
      "HAVING",
      "WHERE",
      "ORDER BY",
      "QUALIFY"
    ],
    "correct_answer": "HAVING",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "The WHERE clause filters individual rows before grouping, whereas the HAVING clause filters the aggregated groups formed by GROUP BY."
  },
  {
    "question_text": "In the Entity-Relationship (ER) model, how is a Weak Entity set identified in a database schema?",
    "options": [
      "Through a Partial Key (discriminator) combined with the Primary Key of its Identifying Owner Entity",
      "By having its own autonomous single-column unique Primary Key",
      "Through a foreign key that allows NULL values exclusively",
      "By defining multiple candidate keys without any composite constraints"
    ],
    "correct_answer": "Through a Partial Key (discriminator) combined with the Primary Key of its Identifying Owner Entity",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "A weak entity set lacks sufficient attributes to form a primary key on its own; it requires its partial key and the primary key of its identifying relationship entity."
  },
  {
    "question_text": "Which SQL command belongs strictly to the Data Definition Language (DDL) subset?",
    "options": [
      "ALTER TABLE",
      "UPDATE",
      "INSERT INTO",
      "SELECT"
    ],
    "correct_answer": "ALTER TABLE",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "DDL commands define and modify database schema structures (CREATE, ALTER, DROP, TRUNCATE), whereas UPDATE and INSERT are DML (Data Manipulation Language)."
  },
  {
    "question_text": "What is the primary operational difference between the TRUNCATE and DELETE statements in SQL?",
    "options": [
      "TRUNCATE is a DDL operation that deallocates entire data pages without logging individual row deletions, making it faster and non-row-triggerable",
      "DELETE is faster than TRUNCATE because it ignores foreign key constraints",
      "TRUNCATE allows a WHERE clause to remove specific rows while DELETE cannot",
      "DELETE completely drops the table schema from the database catalog"
    ],
    "correct_answer": "TRUNCATE is a DDL operation that deallocates entire data pages without logging individual row deletions, making it faster and non-row-triggerable",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "TRUNCATE resets table extents and generates minimal transaction logs, whereas DELETE removes rows one by one, recording each in the transaction log and firing row triggers."
  },
  {
    "question_text": "Under Boyce-Codd Normal Form (BCNF), what condition must hold for every non-trivial functional dependency X -> Y?",
    "options": [
      "X must be a superkey of the relation",
      "Y must be a prime attribute contained in a candidate key",
      "X must consist of exactly one single attribute",
      "The relation must contain no composite primary keys"
    ],
    "correct_answer": "X must be a superkey of the relation",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "BCNF is stricter than 3NF: for every non-trivial functional dependency X -> Y, the determinant X must strictly be a superkey (eliminating the 3NF loophole where Y is prime)."
  },
  {
    "question_text": "In transaction processing, what does the 'Phantom Read' anomaly describe under concurrency?",
    "options": [
      "A transaction re-executes a range query and discovers new rows inserted and committed by a concurrent transaction",
      "A transaction reads data written by an uncommitted transaction that subsequently rolls back",
      "Two transactions overwrite the same record simultaneously without locking",
      "A transaction reads different attribute values of the exact same row across two reads"
    ],
    "correct_answer": "A transaction re-executes a range query and discovers new rows inserted and committed by a concurrent transaction",
    "cognitive_layer": "Edge Cases & Trap Detection",
    "explanation": "Phantom reads occur when a transaction queries a range of rows meeting a predicate, and another committed transaction inserts or deletes rows matching that predicate before the first finishes."
  },
  {
    "question_text": "Which ANSI SQL transaction isolation level guarantees prevention against Dirty Reads, Non-Repeatable Reads, and Phantom Reads?",
    "options": [
      "SERIALIZABLE",
      "REPEATABLE READ",
      "READ COMMITTED",
      "READ UNCOMMITTED"
    ],
    "correct_answer": "SERIALIZABLE",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "SERIALIZABLE is the highest isolation level, completely eliminating dirty reads, non-repeatable reads, and phantom reads through range locks or snapshot serializability."
  },
  {
    "question_text": "In Armstrong's Axioms for functional dependencies, which inference rule states that if X -> Y and Y -> Z, then X -> Z?",
    "options": [
      "Transitivity",
      "Augmentation",
      "Reflexivity",
      "Pseudo-transitivity"
    ],
    "correct_answer": "Transitivity",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Transitivity states that if functional dependency X determines Y and Y determines Z, then X functionally determines Z."
  },
  {
    "question_text": "What does the Write-Ahead Logging (WAL) protocol strictly enforce before modifying an in-memory database page on disk?",
    "options": [
      "The log record describing the update must be written to non-volatile disk storage before the dirty page is flushed to disk",
      "All active transactions must commit before any log record is written",
      "Indexes must be recomputed on disk prior to writing data rows",
      "Database read operations must obtain exclusive locks before logging"
    ],
    "correct_answer": "The log record describing the update must be written to non-volatile disk storage before the dirty page is flushed to disk",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "WAL guarantees Atomicity and Durability by ensuring undo/redo log records reach stable storage before corresponding dirty database pages overwrite disk blocks."
  },
  {
    "question_text": "In B+ Tree index structures, how are data records or primary key pointers referenced?",
    "options": [
      "Leaf nodes exclusively store all data pointers and keys, and are linked as a doubly/singly linked list for fast range scans",
      "Data records are distributed equally across internal and root nodes",
      "Internal nodes store all records while leaf nodes store only null pointers",
      "B+ Trees cannot perform range queries without full index re-scans"
    ],
    "correct_answer": "Leaf nodes exclusively store all data pointers and keys, and are linked as a doubly/singly linked list for fast range scans",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "In B+ Trees, internal nodes only store routing keys, while leaf nodes hold all actual pointers/records and form a linked list enabling efficient O(log N) point lookups and O(K) sequential range queries."
  },
  {
    "question_text": "What is an 'Identifying Relationship' in an Entity-Relationship (ER) diagram?",
    "options": [
      "A relationship that connects a weak entity set to its identifying owner entity set",
      "A recursive relationship where an entity relates to itself",
      "A relationship with many-to-many cardinality requiring no primary keys",
      "A relationship created between two candidate keys within the same table"
    ],
    "correct_answer": "A relationship that connects a weak entity set to its identifying owner entity set",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "An identifying relationship links a weak entity set to its owner entity set and is represented by a double diamond in ER diagrams."
  },
  {
    "question_text": "What constraint enforces that every value of a Foreign Key must match an existing Primary Key in the referenced table or be NULL?",
    "options": [
      "Referential Integrity Constraint",
      "Domain Constraint",
      "Entity Integrity Constraint",
      "Key Constraint"
    ],
    "correct_answer": "Referential Integrity Constraint",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Referential integrity guarantees that foreign key references stay valid and point to existing rows in referenced tables, preventing orphan records."
  },
  {
    "question_text": "In relational algebra, which fundamental operator is denoted by the Greek letter sigma (σ)?",
    "options": [
      "Selection (row filtering)",
      "Projection (column filtering)",
      "Cartesian Product",
      "Natural Join"
    ],
    "correct_answer": "Selection (row filtering)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Sigma (σ) represents the selection operator, which filters rows that satisfy a specified predicate condition, corresponding to SQL's WHERE clause."
  },
  {
    "question_text": "In relational algebra, which fundamental operator is denoted by the Greek letter pi (π)?",
    "options": [
      "Projection (column filtering)",
      "Selection (row filtering)",
      "Intersection",
      "Division"
    ],
    "correct_answer": "Projection (column filtering)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Pi (π) denotes projection, selecting specific columns from a relation and discarding all others while eliminating duplicate tuples in pure relational algebra."
  },
  {
    "question_text": "What is a 'Candidate Key' in relational database design?",
    "options": [
      "A minimal superkey having no proper subset that is also a superkey",
      "Any column containing numbers without text",
      "A foreign key that references multiple database schemas",
      "The specific key selected by the database administrator to be encrypted"
    ],
    "correct_answer": "A minimal superkey having no proper subset that is also a superkey",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "A candidate key is a minimal superkey: it uniquely identifies any tuple in a relation, and removing any attribute destroys the uniqueness property."
  },
  {
    "question_text": "Which of the following functional dependencies is considered 'Trivial'?",
    "options": [
      "X -> Y where Y is a subset of X",
      "X -> Y where Y is disjoint from X",
      "X -> Y where X is an empty set",
      "X -> Y where Y is a candidate key"
    ],
    "correct_answer": "X -> Y where Y is a subset of X",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "A functional dependency X -> Y is trivial if and only if the right-hand side attribute set Y is a subset of the left-hand side attribute set X (e.g., {A, B} -> A)."
  },
  {
    "question_text": "What is the primary condition required for a decomposition of relation R into (R1, R2) to be a 'Lossless Join' decomposition?",
    "options": [
      "(R1 ∩ R2) must functionally determine either R1 or R2 (i.e. (R1 ∩ R2) -> R1 or (R1 ∩ R2) -> R2)",
      "R1 and R2 must have completely disjoint attributes with no common columns",
      "R1 and R2 must have the exact same number of tuples as R",
      "Both R1 and R2 must have identical primary keys"
    ],
    "correct_answer": "(R1 ∩ R2) must functionally determine either R1 or R2 (i.e. (R1 ∩ R2) -> R1 or (R1 ∩ R2) -> R2)",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "A decomposition is lossless-join if the common attributes (R1 ∩ R2) form a superkey of at least one of the decomposed relations, preventing spurious tuples upon natural join."
  },
  {
    "question_text": "In SQL, what is the key difference between UNION and UNION ALL?",
    "options": [
      "UNION removes duplicate rows from the combined result set, whereas UNION ALL preserves all duplicates",
      "UNION ALL sorts the results while UNION preserves input order",
      "UNION can only combine tables from different database engines",
      "UNION ALL requires both queries to have different column types"
    ],
    "correct_answer": "UNION removes duplicate rows from the combined result set, whereas UNION ALL preserves all duplicates",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "UNION performs a distinct sort or hash operation to discard duplicate rows, making UNION ALL noticeably faster when duplicate elimination is unnecessary."
  },
  {
    "question_text": "What anomaly is caused when a transaction reads uncommitted changes made by another concurrent transaction that later rolls back?",
    "options": [
      "Dirty Read",
      "Lost Update",
      "Non-Repeatable Read",
      "Phantom Read"
    ],
    "correct_answer": "Dirty Read",
    "cognitive_layer": "Diagnostic Debugging & Tracing",
    "explanation": "A dirty read happens when transaction T1 reads data modified by uncommitted transaction T2. If T2 executes a ROLLBACK, T1 operated on data that never officially existed."
  },
  {
    "question_text": "What is the role of a 'Checkpoint' in database crash recovery mechanisms?",
    "options": [
      "It periodically flushes all dirty buffer pool pages and log records to disk, bounding the amount of log that must be replayed during crash recovery",
      "It permanently deletes all transaction history and resets auto-increment sequences",
      "It terminates all currently active transactions and locks the database in read-only mode",
      "It re-indexes all primary and foreign keys automatically"
    ],
    "correct_answer": "It periodically flushes all dirty buffer pool pages and log records to disk, bounding the amount of log that must be replayed during crash recovery",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "Checkpoints write dirty pages to disk and record active transaction states so the recovery manager doesn't need to scan the transaction log from the very beginning of the database lifetime."
  },
  {
    "question_text": "What is an 'Aggregate Function' in SQL and which of the following is an example?",
    "options": [
      "AVG()",
      "LENGTH()",
      "SUBSTRING()",
      "CONCAT()"
    ],
    "correct_answer": "AVG()",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Aggregate functions compute a single scalar summary value across multiple row values. Examples include AVG(), SUM(), COUNT(), MIN(), and MAX()."
  },
  {
    "question_text": "In an ER diagram, what does a double rectangle denote?",
    "options": [
      "Weak Entity set",
      "Identifying Relationship",
      "Multivalued Attribute",
      "Derived Attribute"
    ],
    "correct_answer": "Weak Entity set",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "In standard Chen ER notation, a strong entity is depicted by a single rectangle, a weak entity set by a double rectangle, and a multivalued attribute by a double ellipse."
  },
  {
    "question_text": "In an ER diagram, how is a 'Derived Attribute' represented visually?",
    "options": [
      "Dashed ellipse",
      "Double ellipse",
      "Underlined rectangle",
      "Dashed diamond"
    ],
    "correct_answer": "Dashed ellipse",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "A derived attribute (such as age calculated from date of birth) is shown inside a dashed ellipse."
  },
  {
    "question_text": "In SQL, what is the outcome of evaluating 'WHERE column = NULL'?",
    "options": [
      "It evaluates to UNKNOWN (neither TRUE nor FALSE) and returns zero rows",
      "It matches all rows where the column contains a NULL value",
      "It throws a syntax error during query parsing",
      "It converts NULL to an empty string and checks string equality"
    ],
    "correct_answer": "It evaluates to UNKNOWN (neither TRUE nor FALSE) and returns zero rows",
    "cognitive_layer": "Edge Cases & Trap Detection",
    "explanation": "SQL uses three-valued logic (TRUE, FALSE, UNKNOWN). Comparisons with NULL using '=' or '<>' always yield UNKNOWN. Testing for NULL requires 'IS NULL' or 'IS NOT NULL'."
  },
  {
    "question_text": "What is a 'Lossless Decomposition' also known as in database theory?",
    "options": [
      "Non-additive join decomposition",
      "Dependency-preserving decomposition",
      "Full functional decomposition",
      "Atomic schema decomposition"
    ],
    "correct_answer": "Non-additive join decomposition",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Lossless join decomposition is also called non-additive join decomposition because performing a natural join on the decomposed tables produces exactly the original relation without extraneous (additive/spurious) tuples."
  },
  {
    "question_text": "In relational database design, what does Fourth Normal Form (4NF) specifically eliminate?",
    "options": [
      "Non-trivial Multivalued Dependencies (MVDs) not governed by a superkey",
      "Partial functional dependencies on composite candidate keys",
      "Transitive dependencies between non-prime attributes",
      "Foreign key cycles across recursive tables"
    ],
    "correct_answer": "Non-trivial Multivalued Dependencies (MVDs) not governed by a superkey",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "4NF deals with multivalued dependencies (X ->> Y), requiring that for every non-trivial MVD, X must be a superkey of the relation."
  },
  {
    "question_text": "Which SQL constraint ensures that all values in a column are distinct and allows at most one NULL value (or multiple depending on SQL dialect)?",
    "options": [
      "UNIQUE",
      "PRIMARY KEY",
      "CHECK",
      "DEFAULT"
    ],
    "correct_answer": "UNIQUE",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "UNIQUE ensures no two non-null rows have identical values in that column. Unlike PRIMARY KEY, UNIQUE columns generally permit NULL values."
  },
  {
    "question_text": "What is the primary role of the Query Optimizer in a Relational Database Management System (RDBMS)?",
    "options": [
      "Evaluating alternative relational algebra execution plans and choosing the one with the lowest estimated I/O and CPU cost",
      "Formatting SQL code to adhere to style guidelines",
      "Encrypting SQL queries before sending them to database clients",
      "Verifying user passwords and executing SSL handshakes"
    ],
    "correct_answer": "Evaluating alternative relational algebra execution plans and choosing the one with the lowest estimated I/O and CPU cost",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "The query optimizer transforms parsed queries into logical plans, analyzes table statistics, and selects an optimal physical execution plan (e.g. index scan vs hash join)."
  },
  {
    "question_text": "What does the ACID property 'Atomicity' guarantee during transaction execution?",
    "options": [
      "All operations in the transaction succeed completely, or none of their effects persist (All-or-Nothing)",
      "Transactions execute sequentially without interleaved operations",
      "Data written by committed transactions is never lost during hardware crashes",
      "Data satisfies all declared schema constraints before and after execution"
    ],
    "correct_answer": "All operations in the transaction succeed completely, or none of their effects persist (All-or-Nothing)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Atomicity ensures an all-or-nothing execution: if any statement in a transaction fails, the entire transaction is rolled back to leave the database state untouched."
  },
  {
    "question_text": "In database concurrency, what is a 'Wait-For Graph' used for?",
    "options": [
      "Detecting deadlocks among active transactions by finding cycles",
      "Measuring network latency across replica nodes",
      "Scheduling checkpoint intervals based on dirty page counts",
      "Estimating query cost during join ordering"
    ],
    "correct_answer": "Detecting deadlocks among active transactions by finding cycles",
    "cognitive_layer": "Diagnostic Debugging & Tracing",
    "explanation": "A Wait-For Graph has transactions as nodes and edges representing one transaction waiting on a lock held by another. A cycle in the graph indicates a deadlock."
  },
  {
    "question_text": "In SQL, what is the effect of an INNER JOIN between table A with 5 rows and table B with 4 rows when no ON condition matches?",
    "options": [
      "Returns 0 rows",
      "Returns 20 rows (Cartesian product)",
      "Returns 5 rows with NULLs for table B",
      "Throws a runtime constraint violation"
    ],
    "correct_answer": "Returns 0 rows",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "An INNER JOIN only retains rows that satisfy the join predicate. If no pairs match, the result set is completely empty (0 rows)."
  },
  {
    "question_text": "What does a LEFT OUTER JOIN return when a row in the left table has no matching row in the right table?",
    "options": [
      "The left row is included, with NULL values populated for all right table columns",
      "The left row is discarded from the output result set",
      "An error is raised indicating an unfulfilled foreign key",
      "The row is duplicated once for each row in the right table"
    ],
    "correct_answer": "The left row is included, with NULL values populated for all right table columns",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "A LEFT OUTER JOIN preserves all rows from the left relation. Where no match exists on the right, NULL values are assigned to right-side columns."
  },
  {
    "question_text": "What does the 'CASCADE' option in 'ON DELETE CASCADE' accomplish for foreign keys?",
    "options": [
      "When a parent row is deleted, all referencing child rows in the foreign key table are automatically deleted",
      "It prevents parent rows from being deleted if any child rows exist",
      "It sets referencing child foreign keys to NULL",
      "It moves deleted parent rows into an archive audit table"
    ],
    "correct_answer": "When a parent row is deleted, all referencing child rows in the foreign key table are automatically deleted",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "ON DELETE CASCADE maintains referential integrity by automatically removing child records whose referenced primary key row is deleted."
  },
  {
    "question_text": "In database schema normalization, why is 3NF often preferred over BCNF in commercial enterprise architectures?",
    "options": [
      "Every relation has a lossless-join and dependency-preserving 3NF decomposition, whereas BCNF guarantees lossless join but cannot always preserve all functional dependencies",
      "3NF requires zero indexes while BCNF mandates non-clustered indexes on all tables",
      "BCNF relations consume significantly more storage space than 3NF tables",
      "3NF supports recursive SQL queries while BCNF prohibits subqueries"
    ],
    "correct_answer": "Every relation has a lossless-join and dependency-preserving 3NF decomposition, whereas BCNF guarantees lossless join but cannot always preserve all functional dependencies",
    "cognitive_layer": "Edge Cases & Trap Detection",
    "explanation": "3NF is always achievable with both lossless join and dependency preservation; BCNF eliminates every non-superkey FD redundancy but may split an FD across two tables."
  },
  {
    "question_text": "Which of the following SQL clauses executes first in the logical query processing order?",
    "options": [
      "FROM",
      "WHERE",
      "SELECT",
      "ORDER BY"
    ],
    "correct_answer": "FROM",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "Logically, SQL processes clauses in the order: FROM & JOINs -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT/OFFSET."
  },
  {
    "question_text": "What is the key advantage of a B+ Tree over a traditional binary search tree for database indexing?",
    "options": [
      "B+ Trees have high fan-out and shallow depth, minimizing slow disk I/O operations",
      "B+ Trees store data strictly in main memory CPU registers",
      "B+ Trees eliminate the need for primary keys",
      "B+ Trees provide O(1) worst-case search complexity"
    ],
    "correct_answer": "B+ Trees have high fan-out and shallow depth, minimizing slow disk I/O operations",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Because disk block access is thousands of times slower than RAM, the high branching factor (fan-out of 100+) of B+ Trees keeps tree height small (3-4 levels) to minimize disk reads."
  },
  {
    "question_text": "In the context of database transactions, what does the 'Strict Two-Phase Locking' (Strict 2PL) protocol guarantee?",
    "options": [
      "It prevents Cascading Aborts by holding all exclusive (X) locks until the transaction commits or aborts",
      "It completely prevents deadlocks from occurring in all concurrent schedules",
      "It allows dirty reads to accelerate analytical read queries",
      "It requires transactions to declare all locks at system boot time"
    ],
    "correct_answer": "It prevents Cascading Aborts by holding all exclusive (X) locks until the transaction commits or aborts",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "Strict 2PL requires that all exclusive locks acquired by a transaction be held until transaction commit/rollback, ensuring strict serializability and preventing cascading rollbacks."
  },
  {
    "question_text": "What is a 'Correlated Subquery' in SQL?",
    "options": [
      "A subquery that references one or more columns from the outer query, evaluating once for each row processed by the outer query",
      "A subquery that executes independently once before the outer query runs",
      "A subquery that joins two unrelated databases over an RPC network",
      "A subquery that can only appear in the HAVING clause"
    ],
    "correct_answer": "A subquery that references one or more columns from the outer query, evaluating once for each row processed by the outer query",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "A correlated subquery depends on values from the current row of the outer query, so it must be evaluated repeatedly for each candidate row of the outer query."
  },
  {
    "question_text": "In Relational Algebra, what is the result of a Cartesian Product (Cross Join) between relation R with n tuples and relation S with m tuples?",
    "options": [
      "n * m tuples",
      "n + m tuples",
      "max(n, m) tuples",
      "min(n, m) tuples"
    ],
    "correct_answer": "n * m tuples",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "The Cartesian product pairs every single tuple of relation R with every single tuple of relation S, resulting in exactly n * m total tuples."
  },
  {
    "question_text": "Which database log record type is written to mark that a transaction's rollback has completed successfully?",
    "options": [
      "Compensation Log Record (CLR)",
      "Checkpoint Record",
      "Undo Record",
      "Dirty Page Record"
    ],
    "correct_answer": "Compensation Log Record (CLR)",
    "cognitive_layer": "Diagnostic Debugging & Tracing",
    "explanation": "In ARIES recovery algorithm, Compensation Log Records (CLRs) are written during rollback to record actions taken to undo previous updates, ensuring rollbacks are never repeated."
  }
];

export const DSA_QUESTION_BANK = [
  {
    "question_text": "What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST) with N nodes?",
    "options": [
      "O(N)",
      "O(log N)",
      "O(N log N)",
      "O(1)"
    ],
    "correct_answer": "O(N)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "When keys are inserted in sorted order, an unbalanced BST degenerates into a linear linked list (skewed tree), yielding O(N) worst-case search time."
  },
  {
    "question_text": "Which data structure follows the Last-In, First-Out (LIFO) order and is fundamentally used for function call stacks and expression parsing?",
    "options": [
      "Stack",
      "Queue",
      "Priority Queue",
      "Circular Buffer"
    ],
    "correct_answer": "Stack",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "A Stack operates on the LIFO principle where push and pop operations occur at the top of the stack in O(1) time."
  },
  {
    "question_text": "In a min-heap with N elements, what is the time complexity of deleting the minimum element (root)?",
    "options": [
      "O(log N)",
      "O(1)",
      "O(N)",
      "O(N log N)"
    ],
    "correct_answer": "O(log N)",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "Deleting the root requires replacing it with the last element and running heapify (percolate-down), which travels down the height of the tree in O(log N) steps."
  },
  {
    "question_text": "Which graph traversal algorithm uses a Queue data structure to find the shortest path in an unweighted graph?",
    "options": [
      "Breadth-First Search (BFS)",
      "Depth-First Search (DFS)",
      "Topological Sort",
      "Kruskal's Algorithm"
    ],
    "correct_answer": "Breadth-First Search (BFS)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "BFS explores vertices level by level using a FIFO Queue, guaranteeing the shortest path in unweighted graphs."
  },
  {
    "question_text": "What is the average and worst-case time complexity of QuickSort when using a naive first-element pivot on already sorted data?",
    "options": [
      "Average O(N log N), Worst-case O(N²)",
      "Average O(N), Worst-case O(N log N)",
      "Average O(N²), Worst-case O(N²)",
      "Both O(N log N)"
    ],
    "correct_answer": "Average O(N log N), Worst-case O(N²)",
    "cognitive_layer": "Diagnostic Debugging & Tracing",
    "explanation": "Selecting the first element as pivot on an already sorted array creates highly unbalanced partitions of size 0 and N-1, degrading performance to O(N²)."
  },
  {
    "question_text": "What is the time complexity of building a Binary Heap of N elements from an arbitrary unsorted array using bottom-up heapify (Build-Heap)?",
    "options": [
      "O(N)",
      "O(N log N)",
      "O(N²)",
      "O(log N)"
    ],
    "correct_answer": "O(N)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "By sifting elements down starting from the lowest internal nodes up to the root, the sum of heights across all nodes forms a convergent mathematical series bounded by 2N, achieving O(N) linear time."
  },
  {
    "question_text": "In Floyd's Cycle Detection Algorithm (Tortoise and Hare), what is the time and space complexity to detect a loop in a linked list?",
    "options": [
      "O(N) time and O(1) auxiliary space",
      "O(N log N) time and O(N) space",
      "O(N²) time and O(1) space",
      "O(1) time and O(N) space"
    ],
    "correct_answer": "O(N) time and O(1) auxiliary space",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "The slow pointer moves 1 step while the fast pointer moves 2 steps. If a cycle exists, they must collide inside the cycle in at most N steps using only two pointer variables (O(1) space)."
  },
  {
    "question_text": "What is the worst-case time complexity of MergeSort and what auxiliary space does standard array MergeSort require?",
    "options": [
      "O(N log N) time and O(N) auxiliary space",
      "O(N²) time and O(1) space",
      "O(N log N) time and O(1) space",
      "O(N) time and O(log N) space"
    ],
    "correct_answer": "O(N log N) time and O(N) auxiliary space",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "MergeSort recursively divides the array into halves in O(log N) levels and performs linear merging in O(N) at each level, requiring an auxiliary temporary array of size O(N)."
  },
  {
    "question_text": "Which property guarantees that an AVL Tree remains strictly balanced after every insertion and deletion?",
    "options": [
      "The balance factor (Height(left) - Height(right)) of every node must be strictly in {-1, 0, 1}",
      "All leaves must reside on the exact same depth level",
      "Every node must have either 0 or 2 children",
      "The root must be colored black"
    ],
    "correct_answer": "The balance factor (Height(left) - Height(right)) of every node must be strictly in {-1, 0, 1}",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "An AVL tree maintains height balance by verifying that the heights of the two child subtrees of any node differ by at most one, performing single or double rotations if the invariant is violated."
  },
  {
    "question_text": "What is the time complexity of searching for an element in a Hash Table with N keys using Separate Chaining under a uniform hash distribution?",
    "options": [
      "Average O(1), Worst-case O(N)",
      "Average O(log N), Worst-case O(N log N)",
      "Always O(1) in all cases",
      "Always O(N) in all cases"
    ],
    "correct_answer": "Average O(1), Worst-case O(N)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "With a good hash function distributing keys evenly, average chain length is constant (O(1) load factor). In the catastrophic worst case where all keys collide into a single bucket, search degrades to O(N)."
  },
  {
    "question_text": "Which algorithm is used to find the Single-Source Shortest Path in a weighted graph with NON-NEGATIVE edge weights?",
    "options": [
      "Dijkstra's Algorithm",
      "Bellman-Ford Algorithm",
      "Floyd-Warshall Algorithm",
      "Kruskal's Algorithm"
    ],
    "correct_answer": "Dijkstra's Algorithm",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Dijkstra's greedy algorithm repeatedly relaxes edges from the unvisited vertex with the minimum distance using a Priority Queue in O((V + E) log V) time, but fails if negative edge weights exist."
  },
  {
    "question_text": "Which shortest-path algorithm can detect negative-weight cycles in a directed graph?",
    "options": [
      "Bellman-Ford Algorithm",
      "Dijkstra's Algorithm",
      "Prim's Algorithm",
      "Breadth-First Search"
    ],
    "correct_answer": "Bellman-Ford Algorithm",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Bellman-Ford relaxes all edges V-1 times. Running an additional V-th relaxation: if any distance further decreases, a negative-weight cycle is conclusively detected."
  },
  {
    "question_text": "What is the time complexity of Kruskal's algorithm to compute the Minimum Spanning Tree (MST) of a graph with V vertices and E edges?",
    "options": [
      "O(E log E) or O(E log V)",
      "O(V²)",
      "O(V * E)",
      "O(V + E)"
    ],
    "correct_answer": "O(E log E) or O(E log V)",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "Kruskal sorts all edges by weight in O(E log E) and processes them using a Disjoint Set Union (Union-Find) with path compression in near-linear O(E α(V)) time, dominated by edge sorting."
  },
  {
    "question_text": "In a Doubly Linked List, what is the time complexity of deleting a node when given a direct reference/pointer to that specific node?",
    "options": [
      "O(1)",
      "O(N)",
      "O(log N)",
      "O(N²)"
    ],
    "correct_answer": "O(1)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Because each node has direct pointers to both prev and next (node.prev.next = node.next; node.next.prev = node.prev), deletion occurs in O(1) without needing to traverse from head."
  },
  {
    "question_text": "In a Singly Linked List, why is deleting a node given only a pointer to that node (without head pointer) typically impossible for the tail node?",
    "options": [
      "Because there is no preceding node pointer to update the previous node's next pointer to NULL",
      "Because tail nodes are locked by the operating system kernel",
      "Because the tail node cannot be freed using free()",
      "Because singly linked lists cannot have tail nodes"
    ],
    "correct_answer": "Because there is no preceding node pointer to update the previous node's next pointer to NULL",
    "cognitive_layer": "Edge Cases & Trap Detection",
    "explanation": "For non-tail nodes, one can copy data from node.next and delete node.next. For the tail node, there is no next node to copy, requiring the predecessor pointer to clear the link."
  },
  {
    "question_text": "What is the Inorder Traversal sequence of a Binary Search Tree (BST)?",
    "options": [
      "Nodes visited in strictly non-decreasing (sorted) order",
      "Root visited first, followed by all leaves",
      "Nodes visited in reverse level-order",
      "Leaves visited before internal nodes"
    ],
    "correct_answer": "Nodes visited in strictly non-decreasing (sorted) order",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Inorder traversal visits Left Subtree -> Root -> Right Subtree. In a BST where left < root < right, this recursively yields all keys in sorted ascending order."
  },
  {
    "question_text": "How is a Queue implemented using two Stacks (Stack1 and Stack2) so that enqueue is O(1)?",
    "options": [
      "Push incoming items directly onto Stack1; for dequeue, pop from Stack2, transferring all items from Stack1 to Stack2 if Stack2 is empty",
      "Push items alternately to Stack1 and Stack2",
      "Pop items from Stack1 and re-hash them into Stack2",
      "Both operations take O(N²) time"
    ],
    "correct_answer": "Push incoming items directly onto Stack1; for dequeue, pop from Stack2, transferring all items from Stack1 to Stack2 if Stack2 is empty",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "Enqueue is O(1) push to Stack1. Dequeue pops from Stack2; when Stack2 is empty, it dumps Stack1 into Stack2 (reversing the order to FIFO). Each item is pushed/popped twice, giving amortized O(1) dequeue."
  },
  {
    "question_text": "What is the primary condition required to perform Binary Search on an array of N elements in O(log N) time?",
    "options": [
      "The elements in the array must be sorted and accessible via random index access (O(1) index lookup)",
      "The array must contain exclusively positive integers",
      "The number of elements must be an exact power of two",
      "The array must be stored as a linked list"
    ],
    "correct_answer": "The elements in the array must be sorted and accessible via random index access (O(1) index lookup)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Binary search halves the search space at each comparison by checking the middle element. It requires sorted order to determine which half to discard and O(1) index access."
  },
  {
    "question_text": "What is a 'Topological Sort' of a Directed Graph and what condition must the graph satisfy for it to exist?",
    "options": [
      "A linear ordering of vertices such that for every directed edge (u -> v), u comes before v; the graph must be a Directed Acyclic Graph (DAG)",
      "A level-order traversal of a graph containing at least one directed cycle",
      "A sorting of edge weights in ascending order on an undirected graph",
      "A traversal that visits every vertex twice"
    ],
    "correct_answer": "A linear ordering of vertices such that for every directed edge (u -> v), u comes before v; the graph must be a Directed Acyclic Graph (DAG)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Topological sorting schedules tasks subject to dependencies (DAG). If a directed cycle exists, no valid linear ordering is possible (deadlock in dependencies)."
  },
  {
    "question_text": "What data structure is fundamentally used in Kahn's Algorithm for Topological Sorting?",
    "options": [
      "A Queue storing vertices with in-degree equal to 0",
      "A Stack storing vertices with out-degree equal to maximum",
      "A Disjoint Set Union forest",
      "A Min-Heap of edge lengths"
    ],
    "correct_answer": "A Queue storing vertices with in-degree equal to 0",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "Kahn's algorithm calculates in-degrees for all vertices, pushes vertices with in-degree 0 into a Queue, and repeatedly removes a vertex, reducing in-degrees of its neighbors."
  },
  {
    "question_text": "What is the worst-case time complexity of HeapSort on an array of N elements?",
    "options": [
      "O(N log N)",
      "O(N²)",
      "O(N)",
      "O(log N)"
    ],
    "correct_answer": "O(N log N)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Building the max-heap takes O(N) time. Then, N-1 extraction operations each take O(log N) heapify steps, giving a deterministic worst-case time of O(N log N) with O(1) auxiliary space."
  },
  {
    "question_text": "Is standard QuickSort a 'stable' sorting algorithm?",
    "options": [
      "No; element swaps across the pivot can reorder duplicate keys that had identical values",
      "Yes; QuickSort always preserves the relative order of duplicate elements",
      "Yes; but only if the pivot is chosen as the median element",
      "Stability applies only to linked lists, not array sorts"
    ],
    "correct_answer": "No; element swaps across the pivot can reorder duplicate keys that had identical values",
    "cognitive_layer": "Edge Cases & Trap Detection",
    "explanation": "A sorting algorithm is stable if it preserves the original relative order of equal keys. Standard QuickSort partitioning swaps elements over long distances, disrupting relative order."
  },
  {
    "question_text": "What is the lower bound on the worst-case number of comparisons required by ANY comparison-based sorting algorithm on N elements?",
    "options": [
      "Ω(N log N)",
      "Ω(N)",
      "Ω(N²)",
      "Ω(log N)"
    ],
    "correct_answer": "Ω(N log N)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "A comparison sort can be modeled as a decision tree with N! permutations as leaves. The minimum tree height is log2(N!) = Ω(N log N) comparisons by Stirling's approximation."
  },
  {
    "question_text": "Under what condition can non-comparison sorting algorithms like Counting Sort achieve O(N + K) linear time?",
    "options": [
      "When the input consists of integers within a known, reasonably bounded range [0, K] where K = O(N)",
      "When the array is already sorted in descending order",
      "When all elements are 64-bit floating point numbers",
      "When the input is stored in a balanced Red-Black tree"
    ],
    "correct_answer": "When the input consists of integers within a known, reasonably bounded range [0, K] where K = O(N)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Counting sort counts occurrences of each integer value in a frequency array of size K, calculating cumulative prefix sums to place elements in O(N + K) time without comparisons."
  },
  {
    "question_text": "In a Circular Queue implemented using a fixed-size array of capacity C, how are the front and rear indices updated?",
    "options": [
      "Using modulo arithmetic: (index + 1) % C",
      "By shifting all array elements left by one on every dequeue",
      "By doubling the array size on every insertion",
      "Using a bitwise NOT operator (~index)"
    ],
    "correct_answer": "Using modulo arithmetic: (index + 1) % C",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Modulo arithmetic wraps pointers back to index 0 when reaching the end of the buffer, allowing continuous reuse of deallocated space without shifting elements."
  },
  {
    "question_text": "What is a 'Trie' (Prefix Tree) primarily optimized for?",
    "options": [
      "Fast retrieval, prefix searching, and autocomplete of strings with time complexity proportional to word length O(L) rather than number of stored words",
      "Sorting floating-point numbers in descending order",
      "Finding all-pairs shortest paths in weighted dense graphs",
      "Matrix multiplication in neural networks"
    ],
    "correct_answer": "Fast retrieval, prefix searching, and autocomplete of strings with time complexity proportional to word length O(L) rather than number of stored words",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "In a Trie, edges represent characters. Looking up or inserting a word of length L takes O(L) time, completely independent of the total number of words (N) in the dictionary."
  },
  {
    "question_text": "In Dynamic Programming, what two fundamental properties must an optimization problem exhibit to be solvable via DP?",
    "options": [
      "Optimal Substructure and Overlapping Subproblems",
      "Greedy Choice Property and Infinite Memory",
      "Disjoint Partitions and Unbounded Recurrence",
      "Deterministic Sorting and Binary Branching"
    ],
    "correct_answer": "Optimal Substructure and Overlapping Subproblems",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Optimal substructure means optimal solutions to subproblems combine into an optimal overall solution. Overlapping subproblems means recursive solutions recompute the same subproblems repeatedly."
  },
  {
    "question_text": "What is the difference between Top-Down with Memoization and Bottom-Up with Tabulation in Dynamic Programming?",
    "options": [
      "Top-down starts at the original problem and uses recursion with a cache table; bottom-up iteratively fills a table starting from the base cases up to the target",
      "Top-down is always faster than bottom-up because it skips CPU instructions",
      "Bottom-up requires exponential O(2^N) memory while top-down is O(1)",
      "Bottom-up can only be used for graph algorithms"
    ],
    "correct_answer": "Top-down starts at the original problem and uses recursion with a cache table; bottom-up iteratively fills a table starting from the base cases up to the target",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "Tabulation avoids recursion call-stack overhead and often allows space optimization (e.g. keeping only the last 2 values). Memoization only computes subproblems that are strictly visited."
  },
  {
    "question_text": "What is the time complexity of solving the 0/1 Knapsack Problem with N items and knapsack capacity W using dynamic programming?",
    "options": [
      "O(N * W) pseudo-polynomial time",
      "O(2^N) polynomial time",
      "O(N log W) logarithmic time",
      "O(N + W) linear time"
    ],
    "correct_answer": "O(N * W) pseudo-polynomial time",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "The DP table has dimensions (N+1) x (W+1), filled in O(N * W) steps. Because runtime depends on the numeric magnitude of W rather than the number of input bits, it is pseudo-polynomial."
  },
  {
    "question_text": "What is the time complexity of finding the Longest Common Subsequence (LCS) of two strings of lengths M and N using dynamic programming?",
    "options": [
      "O(M * N)",
      "O(M + N)",
      "O(2^(M+N))",
      "O(log(M * N))"
    ],
    "correct_answer": "O(M * N)",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "The standard DP table dp[i][j] compares characters at indices i and j: if characters match, dp[i][j] = 1 + dp[i-1][j-1]; otherwise max(dp[i-1][j], dp[i][j-1]), taking O(M * N) time."
  },
  {
    "question_text": "In a Disjoint Set Union (DSU / Union-Find) data structure, what two optimizations reduce the amortized time per operation to nearly constant O(α(N))?",
    "options": [
      "Union by Rank (or Size) and Path Compression",
      "Binary Splitting and Heapify",
      "Red-Black rotations and AVL balancing",
      "Linear Probing and Quadratic Hashing"
    ],
    "correct_answer": "Union by Rank (or Size) and Path Compression",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Union by rank keeps trees shallow by attaching smaller trees under larger roots. Path compression flattens tree branches during find() lookups, achieving the inverse Ackermann time O(α(N))."
  },
  {
    "question_text": "What is the primary difference between Prim's algorithm and Kruskal's algorithm for finding a Minimum Spanning Tree (MST)?",
    "options": [
      "Prim's algorithm grows a single contiguous tree vertex-by-vertex from a start node; Kruskal's algorithm adds edges globally in increasing order of weight across a forest",
      "Prim's algorithm works only on directed graphs while Kruskal's works on trees",
      "Kruskal's algorithm fails if edge weights are negative",
      "Prim's algorithm uses a Stack while Kruskal's uses recursion"
    ],
    "correct_answer": "Prim's algorithm grows a single contiguous tree vertex-by-vertex from a start node; Kruskal's algorithm adds edges globally in increasing order of weight across a forest",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "Prim's uses a Priority Queue of cut edges maintaining a single growing tree (faster on dense graphs O(V²)). Kruskal's sorts all edges globally and uses Union-Find (faster on sparse graphs)."
  },
  {
    "question_text": "What is the maximum number of nodes in a Binary Tree of height H (where height of a single root node is 1)?",
    "options": [
      "2^H - 1",
      "2^(H-1)",
      "2^H",
      "H²"
    ],
    "correct_answer": "2^H - 1",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Level 1 has 1 node, Level 2 has 2, Level 3 has 4... Level H has 2^(H-1). Summing the geometric series 1 + 2 + 4 + ... + 2^(H-1) yields exactly 2^H - 1."
  },
  {
    "question_text": "In a Red-Black Tree, what is the maximum height of a tree with N internal nodes?",
    "options": [
      "2 * log2(N + 1)",
      "log2(N)",
      "N / 2",
      "N - 1"
    ],
    "correct_answer": "2 * log2(N + 1)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Because no path from root to leaf can contain two consecutive red nodes, the longest path is at most twice the shortest path, guaranteeing a maximum height bounded by 2 log2(N + 1)."
  },
  {
    "question_text": "What is the time complexity of finding the diameter (longest path between any two nodes) of a Binary Tree with N nodes?",
    "options": [
      "O(N)",
      "O(N²)",
      "O(log N)",
      "O(N log N)"
    ],
    "correct_answer": "O(N)",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "By computing the height of the left and right subtrees in a single bottom-up post-order traversal and updating the max diameter (left_height + right_height), each node is visited once in O(N)."
  },
  {
    "question_text": "How does Open Addressing with Linear Probing handle hash collisions?",
    "options": [
      "It searches sequentially for the next immediately available slot in the array using hash(k, i) = (h(k) + i) % m",
      "It appends colliding items to an external singly linked list",
      "It doubles the hash table capacity immediately on the first collision",
      "It discards the older item from the table"
    ],
    "correct_answer": "It searches sequentially for the next immediately available slot in the array using hash(k, i) = (h(k) + i) % m",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Linear probing scans adjacent consecutive cells upon a collision. A major drawback is Primary Clustering, where contiguous blocks of occupied cells grow and slow down lookups."
  },
  {
    "question_text": "What problem does Quadratic Probing solve in Open Addressing hash tables?",
    "options": [
      "It eliminates Primary Clustering by using a quadratic polynomial step: (h(k) + c1*i + c2*i²) % m",
      "It reduces memory consumption to zero",
      "It prevents all hash collisions completely",
      "It converts the hash table into an ordered Binary Search Tree"
    ],
    "correct_answer": "It eliminates Primary Clustering by using a quadratic polynomial step: (h(k) + c1*i + c2*i²) % m",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Quadratic probing spaces out probe steps quadratically, preventing long contiguous clusters of filled cells (though it can experience secondary clustering if keys have identical initial hashes)."
  },
  {
    "question_text": "What is the space complexity of an Adjacency Matrix representation of a graph with V vertices?",
    "options": [
      "O(V²)",
      "O(V + E)",
      "O(E²)",
      "O(V log V)"
    ],
    "correct_answer": "O(V²)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "An adjacency matrix is a 2D array of size V x V, consuming O(V²) space regardless of whether the graph is sparse or dense."
  },
  {
    "question_text": "What is the space complexity of an Adjacency List representation of a graph with V vertices and E edges?",
    "options": [
      "O(V + E)",
      "O(V²)",
      "O(V * E)",
      "O(E²)"
    ],
    "correct_answer": "O(V + E)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "An adjacency list stores V list headers and exactly 2E entries (for undirected graphs) or E entries (for directed graphs), requiring O(V + E) space, ideal for sparse graphs."
  },
  {
    "question_text": "What algorithm finds all-pairs shortest paths in a directed weighted graph in O(V³) time?",
    "options": [
      "Floyd-Warshall Algorithm",
      "Dijkstra's Algorithm",
      "Kruskal's Algorithm",
      "Kosaraju's Algorithm"
    ],
    "correct_answer": "Floyd-Warshall Algorithm",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Floyd-Warshall is a dynamic programming algorithm that checks whether path i -> j can be improved by going through intermediate vertex k (dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j]))."
  },
  {
    "question_text": "What is the primary difference between a Stack and a Heap in computer memory allocation?",
    "options": [
      "Stack memory is automatically managed (LIFO allocation/deallocation on function call/return); Heap memory is manually or GC-managed for dynamically sized objects",
      "Heap memory is faster to allocate than stack memory",
      "Stack memory persists after the program terminates while heap memory does not",
      "Stack memory is shared across all processes in the operating system"
    ],
    "correct_answer": "Stack memory is automatically managed (LIFO allocation/deallocation on function call/return); Heap memory is manually or GC-managed for dynamically sized objects",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "The stack stores stack frames, local variables, and return addresses with trivial pointer movement (fast). The heap holds dynamically allocated blocks that survive beyond local function scopes."
  },
  {
    "question_text": "What is the time complexity of reversing a Singly Linked List of N nodes iteratively in-place?",
    "options": [
      "O(N) time and O(1) auxiliary space",
      "O(N²) time and O(N) space",
      "O(log N) time and O(1) space",
      "O(N log N) time and O(N) space"
    ],
    "correct_answer": "O(N) time and O(1) auxiliary space",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "Using three pointers (prev = NULL, curr = head, next = NULL), we iterate through each node once, reversing curr->next to prev in O(N) time with zero extra heap allocations."
  },
  {
    "question_text": "In a Min-Heap represented as an array (1-based indexing), what are the indices of the left child and right child of node at index i?",
    "options": [
      "Left child: 2*i, Right child: 2*i + 1",
      "Left child: i + 1, Right child: i + 2",
      "Left child: 2*i - 1, Right child: 2*i",
      "Left child: i/2, Right child: i/2 + 1"
    ],
    "correct_answer": "Left child: 2*i, Right child: 2*i + 1",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "In 1-based binary heap array indexing, node i has left child at 2i, right child at 2i+1, and parent at floor(i/2). In 0-based indexing, they are 2i+1, 2i+2, and floor((i-1)/2)."
  },
  {
    "question_text": "Which data structure is ideal for checking whether a string of brackets (e.g. \"{ [ ( ) ] }\") is well-formed and balanced?",
    "options": [
      "Stack",
      "Queue",
      "Binary Search Tree",
      "Hash Set"
    ],
    "correct_answer": "Stack",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Push opening brackets onto a Stack. When a closing bracket is encountered, verify that the Stack is not empty and that the popped top bracket matches the closing bracket type."
  },
  {
    "question_text": "What is the time complexity of converting an infix mathematical expression to postfix notation using the Shunting-Yard algorithm?",
    "options": [
      "O(N) linear time",
      "O(N log N)",
      "O(N²)",
      "O(2^N)"
    ],
    "correct_answer": "O(N) linear time",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "Dijkstra's Shunting-Yard algorithm scans the tokens once: operands are appended directly to output, and operators are pushed/popped from an operator stack at most once, running in O(N) time."
  }
];

export const C_PROGRAMMING_QUESTION_BANK = [
  {
    "question_text": "Which of the following statements regarding C programming language is correct?",
    "options": [
      "C is a procedural, structured language supporting both high-level constructs and low-level memory operations",
      "C is a purely object-oriented language executed inside a bytecode virtual machine",
      "C prohibits explicit pointer arithmetic and manual memory deallocation",
      "C requires an automatic garbage collector to reclaim dynamically allocated heap memory"
    ],
    "correct_answer": "C is a procedural, structured language supporting both high-level constructs and low-level memory operations",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "C is famously known as a middle-level procedural language designed by Dennis Ritchie, offering structured syntax alongside direct memory manipulation through pointers."
  },
  {
    "question_text": "Which function in C dynamically allocates memory on the heap and explicitly initializes all allocated bytes to zero?",
    "options": [
      "calloc()",
      "malloc()",
      "realloc()",
      "valloc()"
    ],
    "correct_answer": "calloc()",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "calloc(n, size) allocates memory for an array of n elements and initializes all bits to zero, whereas malloc() leaves allocated memory uninitialized."
  },
  {
    "question_text": "In C, what is the effect of declaring a variable with the 'static' storage class inside a function block?",
    "options": [
      "It retains its value across multiple function calls and persists for the lifetime of the program",
      "It makes the variable globally visible to all other translation units",
      "It forces the compiler to store the variable inside a CPU register",
      "It causes a segmentation fault if accessed more than once"
    ],
    "correct_answer": "It retains its value across multiple function calls and persists for the lifetime of the program",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "A local static variable is allocated in the data segment rather than the stack, preserving its value between invocations while restricting visibility to that function."
  },
  {
    "question_text": "What happens when a program attempts to modify the contents of a string literal in C (e.g., char *s = \"hello\"; s[0] = 'H';)?",
    "options": [
      "It invokes Undefined Behavior and typically causes a Segmentation Fault at runtime",
      "It mutates the string in place successfully according to ANSI C standards",
      "The compiler automatically duplicates the string into the heap",
      "The program skips the instruction and continues without error"
    ],
    "correct_answer": "It invokes Undefined Behavior and typically causes a Segmentation Fault at runtime",
    "cognitive_layer": "Diagnostic Debugging & Tracing",
    "explanation": "String literals are typically stored in read-only memory segments (.rodata). Attempting to modify them leads to undefined behavior, frequently causing a SIGSEGV segmentation fault."
  },
  {
    "question_text": "In C programming, what is the fundamental difference in memory layout between a 'struct' and a 'union'?",
    "options": [
      "A struct allocates separate memory for every member, while a union shares a single common memory space equal to its largest member",
      "A union can only contain pointer data types while a struct can contain primitive types",
      "A struct is stored on the heap while a union is always placed in CPU cache",
      "A union cannot be passed to a function by value while a struct can"
    ],
    "correct_answer": "A struct allocates separate memory for every member, while a union shares a single common memory space equal to its largest member",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "In a struct, each member has its own distinct offset in memory. In a union, all members share the same base address, allowing only one member to be stored at any time."
  },
  {
    "question_text": "What occurs when an array is passed as an argument to a function in C (e.g., void process(int arr[]))?",
    "options": [
      "The array decays into a pointer to its first element (&arr[0]), losing its size information",
      "The entire array is deeply copied element-by-element onto the function call stack",
      "The compiler enforces compile-time size verification",
      "The array becomes immutable and read-only inside the function body"
    ],
    "correct_answer": "The array decays into a pointer to its first element (&arr[0]), losing its size information",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "In C parameter declarations, array notation decays to a pointer. sizeof(arr) inside the function evaluates to the size of a pointer, requiring the length to be supplied separately."
  },
  {
    "question_text": "What is a 'Dangling Pointer' in C?",
    "options": [
      "A pointer that points to a memory location that has already been deallocated or freed",
      "A pointer that has been declared but initialized to NULL",
      "A pointer pointing to a function address rather than data",
      "A pointer whose target address is aligned to an odd byte boundary"
    ],
    "correct_answer": "A pointer that points to a memory location that has already been deallocated or freed",
    "cognitive_layer": "Diagnostic Debugging & Tracing",
    "explanation": "Dangling pointers occur when memory is freed via free() without resetting the pointer to NULL. Dereferencing a dangling pointer leads to memory corruption and undefined behavior."
  },
  {
    "question_text": "Which standard C header file must be included to use dynamic memory management functions like malloc(), calloc(), and free()?",
    "options": [
      "<stdlib.h>",
      "<stdio.h>",
      "<string.h>",
      "<memory.h>"
    ],
    "correct_answer": "<stdlib.h>",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "<stdlib.h> contains declarations for dynamic memory management, random number generation, process communication, and integer arithmetic."
  },
  {
    "question_text": "What is the primary purpose of preprocessor include guards (#ifndef ... #define ... #endif) in C header files?",
    "options": [
      "To prevent duplicate definition errors caused by circular or multiple header inclusions",
      "To encrypt header file code before compilation",
      "To enforce static type checking during macro expansion",
      "To automatically link external library object files"
    ],
    "correct_answer": "To prevent duplicate definition errors caused by circular or multiple header inclusions",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Include guards guarantee that the contents of a header file are only processed once per translation unit, preventing redefinition errors."
  },
  {
    "question_text": "What is the return value of the printf() function in standard C upon successful execution?",
    "options": [
      "The total number of characters successfully written to the standard output",
      "Void (printf produces no return value)",
      "A status code 0 indicating success",
      "A pointer to the formatted character string"
    ],
    "correct_answer": "The total number of characters successfully written to the standard output",
    "cognitive_layer": "Edge Cases & Trap Detection",
    "explanation": "printf() returns the count of characters printed, or a negative value if an output error occurs."
  },
  {
    "question_text": "What is the result of applying the sizeof operator to a pointer variable in C on a 64-bit architecture?",
    "options": [
      "8 bytes",
      "4 bytes",
      "Depends on the data type the pointer points to",
      "16 bytes"
    ],
    "correct_answer": "8 bytes",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "On a 64-bit architecture, all data pointers occupy 8 bytes of memory regardless of whether they point to char, int, float, or a struct."
  },
  {
    "question_text": "In C, what is the meaning of the declaration 'const int *ptr;'?",
    "options": [
      "ptr points to a constant integer whose value cannot be modified through ptr",
      "ptr is a constant pointer whose address cannot be reassigned",
      "Both the pointer address and the integer value are completely immutable",
      "ptr is allocated in read-only hardware registers"
    ],
    "correct_answer": "ptr points to a constant integer whose value cannot be modified through ptr",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "In 'const int *ptr', the int is const, so *ptr cannot be modified, but ptr itself can be changed to point to a different memory address."
  },
  {
    "question_text": "In C, what is the meaning of the declaration 'int * const ptr;'?",
    "options": [
      "ptr is a constant pointer to an integer; its memory address cannot be reassigned",
      "The value of the integer pointed to by ptr cannot be modified",
      "ptr cannot be passed as an argument to any external function",
      "ptr is allocated strictly in global read-only data"
    ],
    "correct_answer": "ptr is a constant pointer to an integer; its memory address cannot be reassigned",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "'int * const ptr' declares a constant pointer: ptr cannot point to any other memory location once initialized, but *ptr can be modified."
  },
  {
    "question_text": "What does the 'volatile' type qualifier tell the C compiler about a variable?",
    "options": [
      "The variable may be modified by external hardware or concurrent threads, so the compiler must not optimize reads/writes via CPU registers",
      "The variable must be stored in volatile RAM rather than non-volatile disk swap space",
      "The variable's memory is automatically deallocated as soon as the current statement finishes",
      "The variable is strictly thread-safe and requires no synchronization locks"
    ],
    "correct_answer": "The variable may be modified by external hardware or concurrent threads, so the compiler must not optimize reads/writes via CPU registers",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "The 'volatile' qualifier prevents the compiler from caching the variable in a register, forcing it to fetch the latest value directly from memory on every read."
  },
  {
    "question_text": "What does the realloc(ptr, new_size) function do in C when new_size cannot be accommodated in place?",
    "options": [
      "It allocates a new memory block, copies existing contents, frees the old block, and returns the new pointer",
      "It throws a BadAlloc runtime exception and terminates execution",
      "It truncates the existing buffer and leaves memory corrupted",
      "It returns NULL without preserving the original pointer"
    ],
    "correct_answer": "It allocates a new memory block, copies existing contents, frees the old block, and returns the new pointer",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "If memory cannot be expanded contiguously, realloc() allocates a new block elsewhere, copies the original data up to the minimum of old/new size, deallocates old memory, and returns the new address."
  },
  {
    "question_text": "What happens if free(ptr) is called twice on the same heap memory pointer in C without reallocating it?",
    "options": [
      "It results in a 'Double Free' undefined behavior, commonly corrupting the heap allocator metadata and causing a crash",
      "The second free() call simply returns 0 and is safely ignored by the C runtime",
      "The compiler catches the double deallocation at compile time",
      "The operating system automatically restores the deallocated memory"
    ],
    "correct_answer": "It results in a 'Double Free' undefined behavior, commonly corrupting the heap allocator metadata and causing a crash",
    "cognitive_layer": "Diagnostic Debugging & Tracing",
    "explanation": "Double-freeing leads to memory corruption in the heap's free-list data structures, opening up serious security vulnerabilities and runtime crashes."
  },
  {
    "question_text": "In C, which operator is used to access members of a structure through a pointer variable?",
    "options": [
      "-> (arrow operator)",
      ". (dot operator)",
      ":: (scope resolution)",
      "* (asterisk prefix)"
    ],
    "correct_answer": "-> (arrow operator)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "The arrow operator 'ptr->member' is syntactic sugar for '(*ptr).member', dereferencing the pointer and accessing the struct member."
  },
  {
    "question_text": "What is the output or effect of 'int *p = NULL; *p = 5;' in a standard C program?",
    "options": [
      "Segmentation Fault / Access Violation due to dereferencing a NULL pointer",
      "Memory address 0 is updated to store value 5 successfully",
      "The compiler refuses to compile the file with a fatal error",
      "p is automatically reallocated to point to stack memory"
    ],
    "correct_answer": "Segmentation Fault / Access Violation due to dereferencing a NULL pointer",
    "cognitive_layer": "Diagnostic Debugging & Tracing",
    "explanation": "Dereferencing a NULL pointer attempts to access an invalid page in virtual memory (page 0), triggering an immediate segmentation fault (SIGSEGV)."
  },
  {
    "question_text": "In C, what is the size of the following union: union Data { int i; char str[20]; double d; };?",
    "options": [
      "24 bytes (or 20 bytes aligned to double's 8-byte alignment)",
      "32 bytes (sum of all members: 4 + 20 + 8)",
      "4 bytes (size of smallest member)",
      "8 bytes (size of double)"
    ],
    "correct_answer": "24 bytes (or 20 bytes aligned to double's 8-byte alignment)",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "The size of a union is at least the size of its largest member (str[20] = 20 bytes), padded to a multiple of its strictest member alignment (double = 8 bytes), yielding 24 bytes."
  },
  {
    "question_text": "Which string manipulation function in C is safer than strcpy() because it prevents buffer overflow by requiring a maximum destination buffer size?",
    "options": [
      "strncpy()",
      "strcat()",
      "strcmp()",
      "sprintf()"
    ],
    "correct_answer": "strncpy()",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "strncpy(dest, src, n) copies up to n characters, preventing buffer overflow attacks that frequently occur with unbounded strcpy()."
  },
  {
    "question_text": "What is the return value of strcmp(\"apple\", \"banana\") in standard C?",
    "options": [
      "A negative integer",
      "A positive integer",
      "0",
      "1"
    ],
    "correct_answer": "A negative integer",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "strcmp() compares characters lexicographically. Since 'a' has a lower ASCII value than 'b', 'apple' is less than 'banana', returning a negative integer."
  },
  {
    "question_text": "In C, what does the 'extern' storage class specification indicate to the compiler?",
    "options": [
      "The variable or function is defined in another translation unit or source file and linked externally",
      "The variable is strictly allocated on an external storage drive",
      "The variable is inaccessible outside its immediate local block",
      "The compiler must inline the function body directly"
    ],
    "correct_answer": "The variable or function is defined in another translation unit or source file and linked externally",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "'extern' declares a symbol without allocating storage for it, informing the compiler that storage was created in another source file and resolved at link time."
  },
  {
    "question_text": "In C, how are multi-dimensional arrays (such as int arr[3][4]) laid out in physical memory?",
    "options": [
      "In Row-Major order (consecutive elements of a row are stored adjacently)",
      "In Column-Major order (consecutive elements of a column are stored adjacently)",
      "As a linked collection of separate pointers scattered across the heap",
      "In segmented hash blocks sorted by coordinate values"
    ],
    "correct_answer": "In Row-Major order (consecutive elements of a row are stored adjacently)",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "C organizes multi-dimensional arrays in contiguous memory using Row-Major order: row 0 elements are followed immediately by row 1 elements, and so forth."
  },
  {
    "question_text": "What is a 'void pointer' (void *) in C?",
    "options": [
      "A generic pointer that can hold the memory address of any data type without type casting",
      "A pointer that is permanently restricted to NULL",
      "A pointer that cannot be assigned or passed to functions",
      "A pointer that points directly to CPU instruction opcodes only"
    ],
    "correct_answer": "A generic pointer that can hold the memory address of any data type without type casting",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "A void* is a generic pointer in C. It can point to any data object, but it cannot be directly dereferenced without first casting to a concrete data pointer type."
  },
  {
    "question_text": "What is the fundamental hazard of performing pointer arithmetic on a 'void *' pointer in standard ANSI C?",
    "options": [
      "It is disallowed in standard C because void has no known size (sizeof(void) is incomplete)",
      "It always advances the pointer by exactly 4 bytes",
      "It automatically converts the pointer into an unsigned long integer",
      "It frees the memory currently pointed to by the void pointer"
    ],
    "correct_answer": "It is disallowed in standard C because void has no known size (sizeof(void) is incomplete)",
    "cognitive_layer": "Edge Cases & Trap Detection",
    "explanation": "Standard C prohibits arithmetic on void* because the size of void is undefined. (GNU GCC provides an extension treating sizeof(void) as 1, but it is non-standard)."
  },
  {
    "question_text": "What is the exact purpose of the 'fflush(stdout)' call in C programs?",
    "options": [
      "It immediately flushes buffered output characters to the terminal/stream rather than waiting for a newline or full buffer",
      "It clears the standard input buffer to discard unread keyboard strokes",
      "It closes stdout and redirects all subsequent output to stderr",
      "It deletes all temporary files created by the application"
    ],
    "correct_answer": "It immediately flushes buffered output characters to the terminal/stream rather than waiting for a newline or full buffer",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "Standard output is line-buffered or block-buffered. Calling fflush(stdout) forces any characters in the stream buffer to be written to the display immediately."
  },
  {
    "question_text": "In C, what is the effect of the statement '#define SQUARE(x) x * x' when evaluated as 'SQUARE(2 + 3)'?",
    "options": [
      "It evaluates to 11 due to preprocessor textual substitution without parentheses (2 + 3 * 2 + 3)",
      "It evaluates to 25 as expected from mathematical squaring",
      "It causes a preprocessor syntax error at compile time",
      "It evaluates to 36 due to compiler auto-vectorization"
    ],
    "correct_answer": "It evaluates to 11 due to preprocessor textual substitution without parentheses (2 + 3 * 2 + 3)",
    "cognitive_layer": "Diagnostic Debugging & Tracing",
    "explanation": "Macros perform raw textual replacement: SQUARE(2 + 3) expands to 2 + 3 * 2 + 3. Due to operator precedence, 3 * 2 is 6, resulting in 2 + 6 + 3 = 11. Proper macros require '((x) * (x))'."
  },
  {
    "question_text": "Which file access mode in fopen() opens an existing file for reading and writing without erasing its existing contents?",
    "options": [
      "\"r+\"",
      "\"w+\"",
      "\"a\"",
      "\"w\""
    ],
    "correct_answer": "\"r+\"",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "\"r+\" opens an existing file for both reading and writing without truncation. In contrast, \"w+\" immediately truncates the file to zero length upon opening."
  },
  {
    "question_text": "What does the fseek(file_ptr, 0, SEEK_END) call achieve in C file handling?",
    "options": [
      "It positions the file position indicator at the very end of the file",
      "It rewinds the file position indicator to the beginning of the file",
      "It permanently closes and locks the file from future writes",
      "It truncates all file contents from the current cursor position"
    ],
    "correct_answer": "It positions the file position indicator at the very end of the file",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "SEEK_END with offset 0 moves the file position indicator to the end of the file, frequently used in combination with ftell() to measure file size in bytes."
  },
  {
    "question_text": "What happens when an integer overflow occurs in signed integer arithmetic in standard C (e.g., INT_MAX + 1)?",
    "options": [
      "It is Undefined Behavior according to the ISO C standard",
      "It wraps predictably around to INT_MIN in all standard-compliant implementations",
      "The program generates an automatic ArithmeticException",
      "The value saturates at INT_MAX without increasing"
    ],
    "correct_answer": "It is Undefined Behavior according to the ISO C standard",
    "cognitive_layer": "Edge Cases & Trap Detection",
    "explanation": "Signed integer overflow is undefined behavior in C. Unlike unsigned integers which wrap modulo 2^N, compilers are permitted to assume signed overflow never happens when optimizing."
  },
  {
    "question_text": "What does the expression '1 << 4' evaluate to in C?",
    "options": [
      "16",
      "4",
      "8",
      "32"
    ],
    "correct_answer": "16",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "The left shift operator '1 << 4' shifts binary 0001 left by 4 positions, yielding 10000 in binary, which equals 16 (1 * 2^4)."
  },
  {
    "question_text": "In C, what is the role of the 'argc' parameter in 'int main(int argc, char *argv[])'?",
    "options": [
      "It stores the count of command-line arguments passed to the program, including the program name itself",
      "It contains the process ID of the calling parent shell",
      "It specifies the size in megabytes of the heap allocated for the process",
      "It indicates the number of active background threads spawned"
    ],
    "correct_answer": "It stores the count of command-line arguments passed to the program, including the program name itself",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "argc (argument count) holds the total number of arguments supplied in the command line, with argv[0] holding the program executable path."
  },
  {
    "question_text": "What is a 'Function Pointer' in C and what is its primary use?",
    "options": [
      "A pointer that stores the start address of executable code in memory, used for callbacks and dynamic dispatch",
      "A pointer returned by a function that points to a heap array",
      "A pointer that automatically allocates memory for recursive function frames",
      "A special debugging pointer that tracks function execution time"
    ],
    "correct_answer": "A pointer that stores the start address of executable code in memory, used for callbacks and dynamic dispatch",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "A function pointer points to executable code in the text/code segment. It allows passing functions as arguments (e.g. to qsort) and implementing callback tables."
  },
  {
    "question_text": "In C, what is structure padding and why do compilers insert it between struct members?",
    "options": [
      "Compilers add unused bytes between members to align fields with hardware architecture word boundaries for faster CPU memory access",
      "Compilers pad structures to prevent stack smashing and buffer overflow exploits",
      "Padding is added to encrypt sensitive structure members in memory",
      "Compilers add padding to equalize the size of all user-defined structures"
    ],
    "correct_answer": "Compilers add unused bytes between members to align fields with hardware architecture word boundaries for faster CPU memory access",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "Modern CPUs read data from memory in 32-bit or 64-bit word chunks. Unaligned memory accesses require extra CPU cycles or cause hardware faults, so compilers pad structs."
  },
  {
    "question_text": "What does the 'typedef' keyword accomplish in C?",
    "options": [
      "It defines a new alias or synonym for an existing data type",
      "It casts a variable from one data type to another at runtime",
      "It defines a dynamic runtime type checked by the interpreter",
      "It allocates memory on the heap for a new data structure"
    ],
    "correct_answer": "It defines a new alias or synonym for an existing data type",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "typedef gives an existing type a new mnemonic identifier (e.g., 'typedef unsigned long ulong;'), enhancing code clarity and portability."
  },
  {
    "question_text": "What is the output of the expression 'sizeof('a')' in C compared to C++?",
    "options": [
      "In C it equals sizeof(int) (typically 4 bytes), while in C++ it equals sizeof(char) (1 byte)",
      "In both C and C++ it equals 1 byte",
      "In both C and C++ it equals 4 bytes",
      "In C it throws a compile-time syntax error"
    ],
    "correct_answer": "In C it equals sizeof(int) (typically 4 bytes), while in C++ it equals sizeof(char) (1 byte)",
    "cognitive_layer": "Edge Cases & Trap Detection",
    "explanation": "In standard C, character constants like 'a' have type int, making sizeof('a') equal to sizeof(int). In C++, character literals have type char (1 byte)."
  },
  {
    "question_text": "What is the key danger of returning a pointer to a local non-static stack variable from a C function?",
    "options": [
      "The stack frame is popped when the function returns, making the pointer point to invalidated/reused stack memory",
      "The compiler automatically deletes the variable and halts execution",
      "The returned pointer is converted into a void pointer automatically",
      "It causes a compile error in all C standards"
    ],
    "correct_answer": "The stack frame is popped when the function returns, making the pointer point to invalidated/reused stack memory",
    "cognitive_layer": "Diagnostic Debugging & Tracing",
    "explanation": "Local variables allocated on the stack are deallocated when the function frame returns. Retaining and dereferencing their address causes undefined behavior."
  },
  {
    "question_text": "In C, which format specifier in scanf() safely limits string input to prevent buffer overflow (e.g., for char buf[20])?",
    "options": [
      "%19s",
      "%20s",
      "%s",
      "%c20"
    ],
    "correct_answer": "%19s",
    "cognitive_layer": "Diagnostic Debugging & Tracing",
    "explanation": "%19s ensures that at most 19 characters are read into a 20-byte buffer, leaving room for the terminating null character ('\\0')."
  },
  {
    "question_text": "What does the 'break' statement do when executed inside nested loops in C?",
    "options": [
      "It terminates only the innermost loop in which it is immediately enclosed",
      "It terminates all outer loops and returns immediately from the function",
      "It skips to the next iteration of the current loop",
      "It pauses execution of the program for 1 millisecond"
    ],
    "correct_answer": "It terminates only the innermost loop in which it is immediately enclosed",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "'break' exits exclusively from the innermost switch or loop construct containing it; outer enclosing loops continue executing."
  },
  {
    "question_text": "In C, what is the default initial value of global and static variables that are not explicitly initialized by the programmer?",
    "options": [
      "Zero (0 for numeric types, NULL for pointers)",
      "Garbage random values left in memory",
      "Undefined behavior upon read",
      "-1 for signed integers"
    ],
    "correct_answer": "Zero (0 for numeric types, NULL for pointers)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Variables with static storage duration (globals and static locals) are placed in the BSS segment and initialized to zero by the runtime loader."
  },
  {
    "question_text": "What is the difference between '#include <file.h>' and '#include \"file.h\"' in C preprocessors?",
    "options": [
      "\"file.h\" searches the current source directory first before standard system include paths, while <file.h> searches system paths directly",
      "<file.h> is for C source code while \"file.h\" is for assembly code",
      "<file.h> compiles the header into an executable while \"file.h\" does not",
      "Both directives perform completely identical directory searches in all C compilers"
    ],
    "correct_answer": "\"file.h\" searches the current source directory first before standard system include paths, while <file.h> searches system paths directly",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Quoted includes are intended for project-local headers and check the local directory first. Angle bracket includes check standard library and system directories."
  },
  {
    "question_text": "What is the purpose of the 'register' storage class specifier in C?",
    "options": [
      "It hints to the compiler that the variable will be heavily accessed and should be stored in a CPU register if possible",
      "It registers a variable with the operating system kernel for inter-process communication",
      "It forces the compiler to disable pointer arithmetic on the variable",
      "It stores the variable in non-volatile flash memory"
    ],
    "correct_answer": "It hints to the compiler that the variable will be heavily accessed and should be stored in a CPU register if possible",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "'register' suggests storing the variable in a CPU register. Because registers have no memory addresses, the address-of operator (&) cannot be used on a register variable."
  },
  {
    "question_text": "What does the expression 'sizeof(arr) / sizeof(arr[0])' calculate when arr is a statically allocated array in C?",
    "options": [
      "The total number of elements in the array",
      "The size in bytes of the first element",
      "The total memory address range of the process heap",
      "The index of the last element in the array"
    ],
    "correct_answer": "The total number of elements in the array",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Dividing total array bytes (sizeof(arr)) by the size of a single element (sizeof(arr[0])) yields the exact element count of a static stack or global array."
  },
  {
    "question_text": "In C, which of the following is an example of an 'lvalue'?",
    "options": [
      "A variable that occupies an identifiable location in memory and can appear on the left side of an assignment",
      "A constant integer literal such as 42",
      "An arithmetic expression result such as (a + b)",
      "A function call returning void"
    ],
    "correct_answer": "A variable that occupies an identifiable location in memory and can appear on the left side of an assignment",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "An lvalue (locator value) designates an identifiable object in memory that has an address and can receive an assigned value."
  },
  {
    "question_text": "What is the effect of using the bitwise XOR operator '^' to evaluate 'x ^ x' for any integer x in C?",
    "options": [
      "Always 0",
      "Always 1",
      "x",
      "~x"
    ],
    "correct_answer": "Always 0",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "XOR returns 1 only when bits differ. Since all bits in x are identical to themselves, comparing each bit with itself produces 0 for all positions."
  }
];

export const JAVA_QUESTION_BANK = [
  {
    "question_text": "In Java Object-Oriented Programming, how is an object fundamentally related to a class?",
    "options": [
      "A class is a blueprint defining state and behavior, while an object is a runtime instance created from that blueprint on the heap",
      "An object is a compile-time template used to generate multiple static classes",
      "A class holds runtime instance data directly without allocating any objects via new",
      "An object can exist in Java memory completely independent of any class definition"
    ],
    "correct_answer": "A class is a blueprint defining state and behavior, while an object is a runtime instance created from that blueprint on the heap",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "A class specifies fields (attributes) and methods, whereas each object instantiated with the 'new' keyword occupies its own memory on the heap with distinct instance state."
  },
  {
    "question_text": "Which statement is TRUE regarding constructors in a Java class?",
    "options": [
      "A constructor must share the exact name of the class and has no explicit return type, not even void",
      "A constructor must always declare void as its return type so the JVM ignores its output",
      "Constructors are inherited automatically by subclasses and invoked like static utility methods",
      "A Java class fails to compile unless the programmer explicitly writes a no-argument constructor"
    ],
    "correct_answer": "A constructor must share the exact name of the class and has no explicit return type, not even void",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Java constructors initialize newly created objects, share the class name, have no return type, and Java supplies a default no-arg constructor only when no constructor is declared."
  },
  {
    "question_text": "What happens if a Java class defines a parameterized constructor (e.g., Student(String name)) and omits a no-argument constructor, and client code calls new Student()?",
    "options": [
      "A compile-time error occurs because Java stops generating the implicit default no-argument constructor once any constructor is explicitly declared",
      "The JVM automatically invokes the parameterized constructor with null arguments",
      "The program compiles normally and sets all primitive and reference fields to empty strings",
      "A ClassCastException is thrown at runtime when instantiating the object"
    ],
    "correct_answer": "A compile-time error occurs because Java stops generating the implicit default no-argument constructor once any constructor is explicitly declared",
    "cognitive_layer": "Edge Cases & Trap Detection",
    "explanation": "The Java compiler only synthesizes a default no-argument constructor when a class declares zero constructors. Defining any constructor suppresses the implicit default."
  },
  {
    "question_text": "What is the primary purpose of the 'this' keyword inside a Java instance method or constructor?",
    "options": [
      "It acts as a reference to the current object instance, allowing disambiguation of shadowed instance variables and constructor chaining via this(...)",
      "It allocates a new object clone inside the JVM stack frame",
      "It references the immediate superclass fields from inside a static method",
      "It forces garbage collection on the current instance after method completion"
    ],
    "correct_answer": "It acts as a reference to the current object instance, allowing disambiguation of shadowed instance variables and constructor chaining via this(...)",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "'this' refers to the current object whose method or constructor is executing, commonly used as 'this.field = field' or to invoke another overloaded constructor of the same class."
  },
  {
    "question_text": "How does Encapsulation in Java protect the internal state of a class?",
    "options": [
      "By declaring instance fields as private and exposing controlled access through public getter and setter methods",
      "By marking every variable in the class as public static final",
      "By storing all instance fields inside local variables of the main() method",
      "By allowing subclasses to directly overwrite private fields without validation"
    ],
    "correct_answer": "By declaring instance fields as private and exposing controlled access through public getter and setter methods",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Encapsulation bundles data and methods inside a class while restricting direct external field modification through access modifiers like private, validating state via public methods."
  },
  {
    "question_text": "Which Java principle allows multiple methods in the same class to share the exact same name provided they differ in parameter count, types, or order?",
    "options": [
      "Method Overloading (Compile-time Polymorphism)",
      "Method Overriding (Runtime Polymorphism)",
      "Multiple Class Inheritance",
      "Dynamic Class Loading"
    ],
    "correct_answer": "Method Overloading (Compile-time Polymorphism)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Method overloading is resolved at compile time based on the method signature (name + parameter list). Changing only the return type does not overload a method."
  },
  {
    "question_text": "In Java inheritance, when a Child object is referenced by a Parent variable (Parent p = new Child();), which overridden instance method executes when p.show() is called?",
    "options": [
      "The Child class implementation is invoked at runtime via Dynamic Method Dispatch",
      "The Parent class implementation always executes based on the compile-time reference type",
      "Both Parent and Child implementations execute sequentially",
      "A compilation error occurs because a Parent variable cannot hold a Child reference"
    ],
    "correct_answer": "The Child class implementation is invoked at runtime via Dynamic Method Dispatch",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "Java resolves overridden instance methods dynamically at runtime according to the actual object's type on the heap (runtime polymorphism), rather than the reference variable's declared type."
  },
  {
    "question_text": "What restriction applies when calling a static method (e.g., public static void display()) inside a Java class?",
    "options": [
      "It belongs to the class rather than any instance and cannot directly reference non-static fields or use 'this' or 'super'",
      "It can only be called after creating at least one object using the new operator",
      "It automatically becomes private and invisible outside its package",
      "It forces all local variables inside the method to persist permanently across calls"
    ],
    "correct_answer": "It belongs to the class rather than any instance and cannot directly reference non-static fields or use 'this' or 'super'",
    "cognitive_layer": "Diagnostic Debugging & Tracing",
    "explanation": "Static members belong to the class itself and exist before any object is instantiated; therefore, accessing instance-specific state requires an explicit object reference."
  },
  {
    "question_text": "In Java, how is the 'super' keyword used inside a subclass constructor?",
    "options": [
      "super(...) invokes an immediate superclass constructor and must appear as the very first statement in the subclass constructor",
      "super(...) executes after all subclass fields are initialized to finalize parent cleanup",
      "super allocates an independent copy of the superclass object in static memory",
      "super enables a single Java class to extend multiple concrete parent classes simultaneously"
    ],
    "correct_answer": "super(...) invokes an immediate superclass constructor and must appear as the very first statement in the subclass constructor",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "Subclass constructors chain to a superclass constructor first (either explicitly via super(...) or implicitly via no-arg super()) to initialize inherited parent state before child state."
  },
  {
    "question_text": "What role do the Java compiler (javac) and Java Virtual Machine (JVM) play in making Java platform-independent?",
    "options": [
      "javac compiles .java source files into platform-independent bytecode (.class), which the JVM interprets/JIT-compiles on the host OS",
      "javac compiles .java files directly into Windows-only .exe native machine instructions",
      "The JVM translates raw .java text directly without any intermediate .class file",
      "javac links C header files statically to execute inside an OS kernel module"
    ],
    "correct_answer": "javac compiles .java source files into platform-independent bytecode (.class), which the JVM interprets/JIT-compiles on the host OS",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Write Once, Run Anywhere relies on portable bytecode (.class) generated by javac, executed across diverse operating systems by host-specific JVMs."
  },
  {
    "question_text": "What is the key difference between an 'abstract class' and an 'interface' in Java?",
    "options": [
      "A class can extend only one abstract class, whereas it can implement multiple interfaces",
      "An abstract class can never contain concrete implemented methods or constructors",
      "An interface can store mutable non-final instance state inherited directly by objects",
      "Abstract classes can be instantiated directly using the new keyword"
    ],
    "correct_answer": "A class can extend only one abstract class, whereas it can implement multiple interfaces",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Java enforces single class inheritance (extends) to avoid diamond ambiguity, while allowing a class to implement any number of interfaces to achieve multiple type inheritance."
  },
  {
    "question_text": "In Java, why are wrapper classes (such as Integer, Double, Boolean) provided alongside primitive types?",
    "options": [
      "They encapsulate primitive values inside objects so primitives can be used with object-only APIs like Java Collections and Generics",
      "They execute arithmetic operations faster than primitive CPU registers",
      "They convert Java from a statically typed language into a dynamically typed scripting language",
      "They prevent garbage collection of numerical constants"
    ],
    "correct_answer": "They encapsulate primitive values inside objects so primitives can be used with object-only APIs like Java Collections and Generics",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Generics and collections (e.g., ArrayList<Integer>) require object references rather than primitives, with autoboxing/unboxing converting smoothly between int and Integer."
  },
  {
    "question_text": "In Java, what does String immutability mean and where are string literals stored?",
    "options": [
      "Once created, the char sequence of a String cannot be altered in place; string literals are cached in the String Pool inside the heap",
      "Strings can be mutated by calling .setCharAt() directly",
      "String objects are stored permanently in CPU registers",
      "Strings are automatically converted to primitive integers upon garbage collection"
    ],
    "correct_answer": "Once created, the char sequence of a String cannot be altered in place; string literals are cached in the String Pool inside the heap",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Strings in Java are immutable for security, caching, and thread safety. String literals reside in the String Constant Pool in the heap, enabling sharing of identical literals."
  },
  {
    "question_text": "What is the difference between 'str1 == str2' and 'str1.equals(str2)' when comparing two String objects in Java?",
    "options": [
      "'==' checks if both references point to the exact same object in memory, while '.equals()' compares the actual sequence of characters for equality",
      "'==' performs case-insensitive character comparison while '.equals()' is case-sensitive",
      "'==' compares hash codes while '.equals()' compares object memory addresses",
      "Both expressions evaluate identically under all conditions in modern JVMs"
    ],
    "correct_answer": "'==' checks if both references point to the exact same object in memory, while '.equals()' compares the actual sequence of characters for equality",
    "cognitive_layer": "Diagnostic Debugging & Tracing",
    "explanation": "'==' is reference comparison testing memory identity, whereas String.equals() overrides Object.equals() to perform character-by-character value equality."
  },
  {
    "question_text": "What is the essential contract between equals() and hashCode() in Java?",
    "options": [
      "If two objects are equal according to equals(), they must produce the exact same integer hashCode() value",
      "If two objects have the same hashCode(), they are guaranteed to be equal according to equals()",
      "Overriding equals() strictly forbids overriding hashCode()",
      "hashCode() must return a unique value for every single object created in the JVM"
    ],
    "correct_answer": "If two objects are equal according to equals(), they must produce the exact same integer hashCode() value",
    "cognitive_layer": "Edge Cases & Trap Detection",
    "explanation": "The Java object contract dictates: equal objects must have identical hash codes. If violated, hash-based collections (HashMap, HashSet) fail to locate or retrieve entries correctly."
  },
  {
    "question_text": "In Java exception handling, what is the fundamental difference between 'checked' and 'unchecked' exceptions?",
    "options": [
      "Checked exceptions (subclasses of Exception excluding RuntimeException) must be handled by try-catch or declared in throws; Unchecked exceptions (subclasses of RuntimeException/Error) do not require mandatory handling",
      "Checked exceptions terminate the JVM immediately while unchecked exceptions log a warning",
      "Unchecked exceptions only occur during compilation while checked exceptions occur at runtime",
      "Checked exceptions are handled by the operating system kernel directly"
    ],
    "correct_answer": "Checked exceptions (subclasses of Exception excluding RuntimeException) must be handled by try-catch or declared in throws; Unchecked exceptions (subclasses of RuntimeException/Error) do not require mandatory handling",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Checked exceptions represent anticipated recoverable failures (e.g., IOException, SQLException) verified by javac. Unchecked exceptions (NullPointerException, ArrayIndexOutOfBoundsException) denote programming logic bugs."
  },
  {
    "question_text": "What does the 'try-with-resources' statement ensure for resources declared inside its parentheses?",
    "options": [
      "It automatically closes any resource implementing the AutoCloseable interface at the end of the block, even if exceptions occur",
      "It allocates resources exclusively in static off-heap shared memory",
      "It suppresses all NullPointerExceptions thrown inside the try block",
      "It creates an isolated background worker thread to execute the block"
    ],
    "correct_answer": "It automatically closes any resource implementing the AutoCloseable interface at the end of the block, even if exceptions occur",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "Try-with-resources (introduced in Java 7) eliminates boilerplate finally blocks by guaranteeing that .close() is called automatically on all AutoCloseable objects."
  },
  {
    "question_text": "In the Java Collections Framework, what is the primary difference in performance between ArrayList and LinkedList for random index access (get(i))?",
    "options": [
      "ArrayList provides O(1) constant-time access via direct array indexing, whereas LinkedList requires O(N) sequential traversal",
      "LinkedList provides O(1) access while ArrayList requires O(N log N) sorting",
      "Both provide O(1) constant-time access on modern 64-bit JVMs",
      "ArrayList cannot be indexed by integer positions"
    ],
    "correct_answer": "ArrayList provides O(1) constant-time access via direct array indexing, whereas LinkedList requires O(N) sequential traversal",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "ArrayList is backed by a contiguous array with O(1) index lookups. LinkedList is a doubly-linked list requiring pointer traversal from head/tail to reach index i in O(N) time."
  },
  {
    "question_text": "In Java 8 and later, how does HashMap handle excessive hash collisions within a single bucket?",
    "options": [
      "Once a bucket's linked list reaches TREEIFY_THRESHOLD (8 entries) and table capacity >= 64, it transforms into a balanced Red-Black tree (TreeNode), improving lookup from O(N) to O(log N)",
      "It immediately throws a HashCollisionException and terminates execution",
      "It evicts the oldest entries using an LRU cache algorithm",
      "It switches from hash keys to linear string array scanning"
    ],
    "correct_answer": "Once a bucket's linked list reaches TREEIFY_THRESHOLD (8 entries) and table capacity >= 64, it transforms into a balanced Red-Black tree (TreeNode), improving lookup from O(N) to O(log N)",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "To guard against hash collision DoS attacks, Java 8 converts heavily loaded bins from linked lists into Red-Black trees once the bin count exceeds 8, reducing worst-case search to O(log N)."
  },
  {
    "question_text": "What is the difference between Comparable and Comparator interfaces in Java?",
    "options": [
      "Comparable provides natural sorting via compareTo(T o) implemented within the domain class; Comparator defines custom sorting via compare(T o1, T o2) implemented in external classes",
      "Comparable is used for primitive types while Comparator is used for objects",
      "Comparable only works with TreeMap while Comparator only works with TreeSet",
      "Comparable sorts in descending order while Comparator sorts in ascending order"
    ],
    "correct_answer": "Comparable provides natural sorting via compareTo(T o) implemented within the domain class; Comparator defines custom sorting via compare(T o1, T o2) implemented in external classes",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "java.lang.Comparable defines a single natural ordering on class instances. java.util.Comparator enables multiple distinct sorting strategies (e.g. by name, by age, by grade)."
  },
  {
    "question_text": "What is 'Type Erasure' in Java Generics?",
    "options": [
      "The compiler enforces type safety at compile time and erases generic type parameters to their raw bounds (Object) in bytecode, maintaining backward compatibility with older JVMs",
      "The JVM deletes all object instances from memory after generic method execution",
      "The compiler replaces all generic classes with dynamic C++ templates at runtime",
      "A security mechanism that clears sensitive passwords stored in generic lists"
    ],
    "correct_answer": "The compiler enforces type safety at compile time and erases generic type parameters to their raw bounds (Object) in bytecode, maintaining backward compatibility with older JVMs",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Java generics are implemented via erasure: generic type arguments (e.g., List<String>) do not exist at runtime; the bytecode operates on raw List with cast insertions."
  },
  {
    "question_text": "In Java Generics, what does the wildcard principle PECS stand for?",
    "options": [
      "Producer Extends, Consumer Super (use <? extends T> when reading data from a collection, and <? super T> when writing data into it)",
      "Package Encapsulation, Class Synchronization",
      "Primitive Expansion, Constant Specialization",
      "Pointer Evaluation, Constraint Substitution"
    ],
    "correct_answer": "Producer Extends, Consumer Super (use <? extends T> when reading data from a collection, and <? super T> when writing data into it)",
    "cognitive_layer": "Edge Cases & Trap Detection",
    "explanation": "PECS governs generic wildcards: if a collection produces T instances for you to read, use <? extends T>; if it consumes T instances from you to store, use <? super T>."
  },
  {
    "question_text": "In Java multithreading, what does the 'synchronized' keyword provide when placed on an instance method?",
    "options": [
      "It acquires the intrinsic lock (monitor) of the invoking object ('this'), allowing only one thread to execute synchronized blocks on that object at a time",
      "It spawns a new asynchronous daemon thread to execute the method in parallel",
      "It disables thread preemption by increasing thread priority to maximum",
      "It persists method return values into a shared disk cache"
    ],
    "correct_answer": "It acquires the intrinsic lock (monitor) of the invoking object ('this'), allowing only one thread to execute synchronized blocks on that object at a time",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "Synchronized instance methods acquire the monitor lock on 'this'. Other threads attempting to enter synchronized methods on the same object are blocked until the lock is released."
  },
  {
    "question_text": "What guarantee does the 'volatile' keyword provide for a variable in Java?",
    "options": [
      "It ensures visibility across threads: reads and writes go directly to main memory rather than thread-local CPU caches, establishing a happens-before relationship",
      "It makes compound operations like count++ completely atomic without locking",
      "It forces the variable to be serialized and written to persistent storage",
      "It marks the variable as eligible for immediate garbage collection"
    ],
    "correct_answer": "It ensures visibility across threads: reads and writes go directly to main memory rather than thread-local CPU caches, establishing a happens-before relationship",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Volatile guarantees memory visibility and prevents instruction reordering around the variable, but does NOT make non-atomic compound operations (like count++) thread-safe."
  },
  {
    "question_text": "Why must the Object methods wait(), notify(), and notifyAll() be called strictly inside a synchronized block in Java?",
    "options": [
      "A thread must own the monitor lock of the object before calling wait() or notify(); otherwise, an IllegalMonitorStateException is thrown",
      "To prevent the compiler from inlining the method bodies",
      "To prevent deadlock by forcing other threads to terminate",
      "Because wait() deletes the object from the Java heap"
    ],
    "correct_answer": "A thread must own the monitor lock of the object before calling wait() or notify(); otherwise, an IllegalMonitorStateException is thrown",
    "cognitive_layer": "Diagnostic Debugging & Tracing",
    "explanation": "Calling wait() releases the monitor lock and suspends the thread. Calling notify() wakes a waiting thread. Both require holding the object's monitor; failing to do so raises IllegalMonitorStateException."
  },
  {
    "question_text": "In Java 8, what is a 'Functional Interface'?",
    "options": [
      "An interface that declares exactly one abstract method (annotated optionally with @FunctionalInterface), capable of being implemented by lambda expressions",
      "An interface that contains only public static final integer constants",
      "An interface that cannot have any default or static methods",
      "An interface implemented exclusively by functional programming languages like Haskell"
    ],
    "correct_answer": "An interface that declares exactly one abstract method (annotated optionally with @FunctionalInterface), capable of being implemented by lambda expressions",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "A functional interface has a single abstract method (SAM), such as Runnable, Callable, or Predicate, making it the target type for lambda expressions and method references."
  },
  {
    "question_text": "What is the difference between intermediate and terminal operations in the Java Stream API?",
    "options": [
      "Intermediate operations (e.g., filter, map) are lazy and return a new Stream without processing elements until a terminal operation (e.g., collect, count, forEach) is invoked",
      "Intermediate operations execute immediately on the caller thread while terminal operations execute on a background thread",
      "Terminal operations can be chained together indefinitely while intermediate operations can only be called once",
      "Intermediate operations modify the backing collection in place while terminal operations copy it"
    ],
    "correct_answer": "Intermediate operations (e.g., filter, map) are lazy and return a new Stream without processing elements until a terminal operation (e.g., collect, count, forEach) is invoked",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "Streams are lazy: intermediate operations pipeline transformations without processing data until a terminal operation triggers the pipeline execution and produces a result."
  },
  {
    "question_text": "What is the primary design purpose of Java's Optional<T> class introduced in Java 8?",
    "options": [
      "To provide a clear, type-level representation of the presence or absence of a value, helping avoid unexpected NullPointerExceptions",
      "To enable optional compiler type checking for legacy codebases",
      "To allow methods to return multiple unrelated data types simultaneously",
      "To allocate memory optionally based on available heap space"
    ],
    "correct_answer": "To provide a clear, type-level representation of the presence or absence of a value, helping avoid unexpected NullPointerExceptions",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Optional<T> is a container object used primarily as a method return type to explicitly signal when a return value may be empty, encouraging callers to handle absent values cleanly."
  },
  {
    "question_text": "What is the difference between StringBuilder and StringBuffer in Java?",
    "options": [
      "StringBuilder is not thread-safe (methods are unsynchronized) and is faster; StringBuffer is thread-safe (methods are synchronized) with synchronization overhead",
      "StringBuilder is immutable while StringBuffer is mutable",
      "StringBuffer is stored on the stack while StringBuilder is stored on the heap",
      "StringBuilder was deprecated in Java 5 in favor of StringBuffer"
    ],
    "correct_answer": "StringBuilder is not thread-safe (methods are unsynchronized) and is faster; StringBuffer is thread-safe (methods are synchronized) with synchronization overhead",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "For single-threaded string concatenation, StringBuilder is preferred due to superior performance without thread lock overhead. StringBuffer is used when thread safety across threads is required."
  },
  {
    "question_text": "Can a static method be overridden in a Java subclass?",
    "options": [
      "No; static methods are resolved at compile time based on the reference type (known as Method Hiding, not Method Overriding)",
      "Yes; static methods participate fully in runtime dynamic method dispatch",
      "Yes; but only if the subclass method is marked with the @Override annotation",
      "Only if both parent and child classes are in the same package"
    ],
    "correct_answer": "No; static methods are resolved at compile time based on the reference type (known as Method Hiding, not Method Overriding)",
    "cognitive_layer": "Edge Cases & Trap Detection",
    "explanation": "Static methods cannot be overridden. If a subclass declares a static method with the same signature, it hides the superclass method, resolved at compile-time by the declared reference type."
  },
  {
    "question_text": "In Java, what is the 'final' keyword used for when applied to a variable, a method, and a class?",
    "options": [
      "A final variable cannot be reassigned; a final method cannot be overridden; a final class cannot be extended (subclassed)",
      "A final variable is stored in flash memory; a final method runs at system shutdown; a final class cannot be instantiated",
      "A final variable is public; a final method has no return value; a final class is an abstract class",
      "All members marked final are immediately garbage collected after main() completes"
    ],
    "correct_answer": "A final variable cannot be reassigned; a final method cannot be overridden; a final class cannot be extended (subclassed)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "The 'final' keyword enforces immutability/restriction: constants for variables, preventing overriding for methods, and preventing subclassing for classes (like java.lang.String)."
  },
  {
    "question_text": "How does Java handle parameter passing for method arguments?",
    "options": [
      "Java is strictly Pass-by-Value always; for objects, the value passed is the memory reference copy itself",
      "Java uses Pass-by-Reference for all objects and Pass-by-Value for primitives",
      "Java uses Pass-by-Name evaluated lazily at each statement",
      "Java dynamically switches between pass-by-value and pass-by-reference based on object size"
    ],
    "correct_answer": "Java is strictly Pass-by-Value always; for objects, the value passed is the memory reference copy itself",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Java passes all arguments by value. When passing an object reference, a copy of the reference is passed. Reassigning the parameter reference inside the method does not affect the caller's reference."
  },
  {
    "question_text": "What is the difference between Callable and Runnable interfaces in Java multithreading?",
    "options": [
      "Callable's call() method can return a typed result and throw checked exceptions; Runnable's run() method returns void and cannot throw checked exceptions",
      "Runnable can only be used with Thread while Callable can only be used with Timer",
      "Callable runs synchronously on the main thread while Runnable runs on a GPU",
      "Runnable was removed in Java 8 in favor of Callable"
    ],
    "correct_answer": "Callable's call() method can return a typed result and throw checked exceptions; Runnable's run() method returns void and cannot throw checked exceptions",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Callable<V> (introduced in java.util.concurrent) returns V and throws Exception, submitted to ExecutorService to return a Future<V>. Runnable returns void and cannot throw checked exceptions."
  },
  {
    "question_text": "What happens when an exception is thrown inside a try block that has an associated finally block containing a 'return' statement in Java?",
    "options": [
      "The return statement in the finally block executes and discards (suppresses) the thrown exception",
      "The exception is thrown immediately and the finally block is skipped",
      "The JVM crashes with an UnhandledReturnException",
      "The compiler flags a fatal syntax error and halts compilation"
    ],
    "correct_answer": "The return statement in the finally block executes and discards (suppresses) the thrown exception",
    "cognitive_layer": "Edge Cases & Trap Detection",
    "explanation": "Placing a return statement inside a finally block overrides any exception or return value from the try/catch blocks, discarding pending exceptions and leading to hard-to-find bugs."
  },
  {
    "question_text": "In Java serialization, what is the effect of marking an instance field with the 'transient' keyword?",
    "options": [
      "The field is omitted from serialization and is not persisted when the object is converted into a byte stream",
      "The field is encrypted with AES-256 before being transmitted over a network",
      "The field is re-initialized to its initial value whenever garbage collection runs",
      "The field becomes thread-safe across all JVM nodes"
    ],
    "correct_answer": "The field is omitted from serialization and is not persisted when the object is converted into a byte stream",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "'transient' indicates that a field should not be serialized (e.g., cached values, sensitive passwords, thread-local state). When deserialized, transient fields receive default type values."
  },
  {
    "question_text": "What is the purpose of the 'default' keyword inside a Java interface (introduced in Java 8)?",
    "options": [
      "It allows interfaces to define methods with concrete default implementations without breaking existing implementing classes",
      "It restricts the interface to package-private visibility",
      "It designates an interface method as the main entry point of the module",
      "It forces implementing classes to mark the method as private"
    ],
    "correct_answer": "It allows interfaces to define methods with concrete default implementations without breaking existing implementing classes",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Default methods allow adding new capabilities to existing interfaces (such as forEach() on Iterable) while preserving binary backward compatibility with existing implementers."
  },
  {
    "question_text": "In Java, what does dynamic method dispatch rely upon at the JVM bytecode level?",
    "options": [
      "Virtual Method Table (vtable) lookups using the 'invokevirtual' bytecode instruction",
      "Static compile-time address offsets using 'invokestatic'",
      "Direct assembly branch jumps without pointer resolution",
      "JNI C native function bindings"
    ],
    "correct_answer": "Virtual Method Table (vtable) lookups using the 'invokevirtual' bytecode instruction",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "invokevirtual resolves methods dynamically by consulting the actual runtime object's vtable, finding the most specific subclass implementation of the overridden method."
  },
  {
    "question_text": "What is the primary role of the Java Garbage Collector's 'Generational Hypothesis'?",
    "options": [
      "Most allocated objects have short lifespans (die young), so separating the heap into Young (Eden, Survivor) and Old generations optimizes GC collection pauses",
      "Older classes require more memory than newer classes",
      "Every new generation of the Java JDK requires a completely rewritten compiler",
      "Garbage collection must run only once every CPU clock cycle"
    ],
    "correct_answer": "Most allocated objects have short lifespans (die young), so separating the heap into Young (Eden, Survivor) and Old generations optimizes GC collection pauses",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "Empirical studies prove that the vast majority of objects die shortly after creation. Focus-collecting the Young Generation via Minor GCs is fast and reclaims most garbage."
  },
  {
    "question_text": "In Java, what is the effect of calling Thread.sleep(millis)?",
    "options": [
      "The current executing thread transitions to the TIMED_WAITING state and pauses without releasing any monitor locks it holds",
      "The thread releases all object monitor locks and terminates",
      "All threads in the JVM pause for the specified duration",
      "The thread's priority is lowered to MIN_PRIORITY"
    ],
    "correct_answer": "The current executing thread transitions to the TIMED_WAITING state and pauses without releasing any monitor locks it holds",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "Thread.sleep() causes the current thread to suspend execution for the specified time, but crucially does NOT release any monitor locks acquired in synchronized blocks."
  },
  {
    "question_text": "What is the difference between a static nested class and an inner (non-static) class in Java?",
    "options": [
      "An inner class maintains an implicit reference to its enclosing outer class instance, while a static nested class does not",
      "A static nested class cannot be instantiated using the new keyword",
      "An inner class cannot access private fields of its enclosing class",
      "A static nested class must always be an abstract class"
    ],
    "correct_answer": "An inner class maintains an implicit reference to its enclosing outer class instance, while a static nested class does not",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Non-static inner classes require an instance of the outer class and retain an invisible pointer (Outer.this) to it. Static nested classes behave like top-level classes packaged inside outer classes."
  },
  {
    "question_text": "What is the effect of calling System.gc() in Java?",
    "options": [
      "It suggests to the JVM that garbage collection be run, but does not guarantee that the GC will run immediately",
      "It immediately freezes execution, sweeps all heap memory, and frees 100% of inactive objects",
      "It deletes all static variables and unloads all class loaders",
      "It is a deprecated method that throws an UnsupportedOperationException in modern Java"
    ],
    "correct_answer": "It suggests to the JVM that garbage collection be run, but does not guarantee that the GC will run immediately",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "System.gc() is merely a hint to the runtime environment. The JVM is free to ignore the request or defer collection based on memory pressure."
  },
  {
    "question_text": "Which collection implementation should be used in Java when thread-safe, high-concurrency key-value access is required without locking the entire table?",
    "options": [
      "ConcurrentHashMap",
      "Hashtable",
      "Collections.synchronizedMap(new HashMap())",
      "TreeMap"
    ],
    "correct_answer": "ConcurrentHashMap",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "ConcurrentHashMap uses fine-grained bucket-level locks (synchronized on bucket heads) and Lock-free CAS operations for reads/writes, outperforming coarse whole-table synchronized Hashtable."
  },
  {
    "question_text": "What is the return type of the Java Object clone() method and what interface must a class implement to prevent CloneNotSupportedException?",
    "options": [
      "Returns Object; requires implementing the Cloneable marker interface",
      "Returns void; requires implementing the Serializable interface",
      "Returns byte[]; requires implementing the Comparable interface",
      "Returns a generic T; requires implementing the AutoCloseable interface"
    ],
    "correct_answer": "Returns Object; requires implementing the Cloneable marker interface",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Object.clone() performs a shallow field-by-field copy. If invoked on an instance that does not implement the java.lang.Cloneable interface, CloneNotSupportedException is thrown."
  },
  {
    "question_text": "In Java 8 streams, what does the flatMap() operation do compared to map()?",
    "options": [
      "flatMap() transforms each element into a stream of values and then flattens all generated streams into a single combined stream",
      "flatMap() filters null values from the stream before mapping",
      "flatMap() sorts the elements into a flat multidimensional array",
      "flatMap() executes the mapping concurrently across all CPU cores"
    ],
    "correct_answer": "flatMap() transforms each element into a stream of values and then flattens all generated streams into a single combined stream",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "map() maps each item to one value (one-to-one). flatMap() maps each item to a stream and flattens nested streams (one-to-many), transforming Stream<List<T>> into Stream<T>."
  },
  {
    "question_text": "In Java, what is the purpose of the 'transient' keyword in relation to security?",
    "options": [
      "It prevents sensitive data such as passwords or private encryption keys from being written to untrusted disk logs or network serialization streams",
      "It prevents memory dump attacks by zeroing memory after each function exit",
      "It disables reflection on declared fields",
      "It enforces TLS encryption on variable access"
    ],
    "correct_answer": "It prevents sensitive data such as passwords or private encryption keys from being written to untrusted disk logs or network serialization streams",
    "cognitive_layer": "Diagnostic Debugging & Tracing",
    "explanation": "Marking fields transient guarantees they are omitted during object serialization, preventing accidental leakage of sensitive credentials across network boundaries or disk files."
  }
];

export const PYTHON_QUESTION_BANK = [
  {
    "question_text": "In Python, what is the key difference between a 'list' and a 'tuple'?",
    "options": [
      "A list is mutable (elements can be added, removed, or modified), whereas a tuple is immutable once created",
      "A tuple can only store numeric types while a list can store mixed types",
      "Lists are indexed starting from 1 while tuples are indexed starting from 0",
      "A list cannot be nested inside another list"
    ],
    "correct_answer": "A list is mutable (elements can be added, removed, or modified), whereas a tuple is immutable once created",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Lists use square brackets [...] and support in-place mutation, while tuples use parentheses (...) and remain immutable, making tuples hashable when their elements are immutable."
  },
  {
    "question_text": "In a Python class, what is the role of the '__init__' method and its first parameter 'self'?",
    "options": [
      "__init__ initializes attributes on a newly created object instance, and 'self' refers to that specific instance",
      "__init__ destroys objects from memory when reference count reaches zero",
      "'self' is a reserved static keyword that shares values across all classes in a module",
      "__init__ executes once at module import time before any class is defined"
    ],
    "correct_answer": "__init__ initializes attributes on a newly created object instance, and 'self' refers to that specific instance",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Python passes the new instance automatically as the first argument ('self') to __init__ so instance attributes like self.name can be attached."
  },
  {
    "question_text": "In Python, how does the 'is' operator differ from the '==' operator?",
    "options": [
      "'is' checks object identity (whether both names point to the same object in memory), while '==' checks value equality",
      "'==' compares memory addresses while 'is' performs case-insensitive string comparison",
      "'is' only works for integers while '==' only works for strings",
      "Both operators perform identical value checks in every situation"
    ],
    "correct_answer": "'is' checks object identity (whether both names point to the same object in memory), while '==' checks value equality",
    "cognitive_layer": "Edge Cases & Trap Detection",
    "explanation": "Two distinct lists [1, 2] == [1, 2] evaluate True for value equality, whereas [1, 2] is [1, 2] evaluates False because they are separate objects in memory."
  },
  {
    "question_text": "What requirement must a value meet to serve safely as a key in a Python dictionary (dict)?",
    "options": [
      "The key must be hashable and immutable (e.g., str, int, tuple of immutables)",
      "The key must be a mutable list so the dictionary can re-sort it dynamically",
      "All dictionary keys within a single dict must share the exact same data type",
      "Keys must be strictly ordered alphabetically upon insertion"
    ],
    "correct_answer": "The key must be hashable and immutable (e.g., str, int, tuple of immutables)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Python dictionaries are hash tables; mutable objects such as lists or sets are unhashable and raise a TypeError if used as keys."
  },
  {
    "question_text": "What does the slice expression 'a[::-1]' do when applied to a Python list or string?",
    "options": [
      "It returns a new reversed copy of the sequence with a step of -1",
      "It removes the last element from the sequence in place",
      "It retrieves only the first element from the sequence",
      "It raises an IndexError if the sequence length is odd"
    ],
    "correct_answer": "It returns a new reversed copy of the sequence with a step of -1",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "The slice syntax is [start:stop:step]. Omitting start and stop while passing -1 as step reverses the entire sequence cleanly."
  },
  {
    "question_text": "What is the difference between list.append(x) and list.extend(x) in Python?",
    "options": [
      "append adds x as a single element at the end; extend iterates through x and appends each of its elements individually",
      "extend adds x to the beginning of the list while append adds to the end",
      "append only accepts integers while extend accepts strings",
      "Both methods perform identical operations under all circumstances"
    ],
    "correct_answer": "append adds x as a single element at the end; extend iterates through x and appends each of its elements individually",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "If x = [3, 4], [1, 2].append(x) produces [1, 2, [3, 4]], whereas [1, 2].extend(x) unpacks and appends to yield [1, 2, 3, 4]."
  },
  {
    "question_text": "What subtle trap occurs when using a mutable default argument in a Python function (e.g., def add_item(item, basket=[]))?",
    "options": [
      "The default list is created only once when the function is defined, causing all invocations that omit basket to share the exact same list instance",
      "Python raises a SyntaxError at module import time",
      "The basket list is automatically cleared whenever the function finishes executing",
      "The function can only be called once per process lifetime"
    ],
    "correct_answer": "The default list is created only once when the function is defined, causing all invocations that omit basket to share the exact same list instance",
    "cognitive_layer": "Diagnostic Debugging & Tracing",
    "explanation": "Default argument expressions are evaluated once at function definition time, not at call time. The standard idiom is 'def add_item(item, basket=None): if basket is None: basket = []'."
  },
  {
    "question_text": "In Python, what do *args and **kwargs in a function signature allow?",
    "options": [
      "*args captures arbitrary positional arguments as a tuple, and **kwargs captures arbitrary keyword arguments as a dictionary",
      "*args captures keyword arguments and **kwargs captures positional arguments",
      "They enforce static type checking on incoming pointers",
      "They force the function to execute in an isolated multiprocessing sub-process"
    ],
    "correct_answer": "*args captures arbitrary positional arguments as a tuple, and **kwargs captures arbitrary keyword arguments as a dictionary",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "*args packs excess positional arguments into a tuple; **kwargs packs excess keyword arguments (key=value) into a dictionary."
  },
  {
    "question_text": "What is the LEGB rule for variable scope resolution in Python?",
    "options": [
      "Python looks for variables in order: Local, Enclosing (nested functions), Global (module level), Built-in",
      "Linear, Exponential, Geometric, Binary search order",
      "Literal, Expression, Grammar, Bytecode compilation order",
      "Low-level, Encapsulated, Garbage-collected, Buffered execution"
    ],
    "correct_answer": "Python looks for variables in order: Local, Enclosing (nested functions), Global (module level), Built-in",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "When referencing an identifier, Python searches Local scope first, then Enclosing outer function closures, then Global module namespace, and finally Built-in namespace."
  },
  {
    "question_text": "What is the purpose of the 'nonlocal' keyword in Python?",
    "options": [
      "It allows a nested function to modify a variable in the nearest enclosing non-global scope",
      "It declares a variable that is shared across all processes on the local network",
      "It prevents a variable from being accessed by local functions",
      "It forces the compiler to allocate the variable in CPU cache"
    ],
    "correct_answer": "It allows a nested function to modify a variable in the nearest enclosing non-global scope",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "The 'nonlocal' statement causes the identifier to refer to previously bound variables in the nearest enclosing scope (excluding globals), enabling stateful closures."
  },
  {
    "question_text": "What is a Python Generator and what keyword is used to yield values one by one?",
    "options": [
      "A function that returns an iterator which produces a sequence of values lazily using the 'yield' statement",
      "A class that inherits from threading.Thread using the 'spawn' keyword",
      "A compiler optimizer that generates C machine code using the 'inline' keyword",
      "A build script that creates virtual environments using the 'pip' keyword"
    ],
    "correct_answer": "A function that returns an iterator which produces a sequence of values lazily using the 'yield' statement",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Generators pause execution at 'yield', maintaining their stack frame and local variables between next() calls, producing values on demand without loading entire datasets into RAM."
  },
  {
    "question_text": "What is the key difference in memory consumption between a list comprehension [x*2 for x in range(1000000)] and a generator expression (x*2 for x in range(1000000))?",
    "options": [
      "The list comprehension immediately allocates memory for all 1,000,000 elements, while the generator computes each value on-the-fly consuming O(1) memory",
      "The generator expression consumes 10x more memory than the list comprehension",
      "Both consume identical amounts of RAM on 64-bit Python runtimes",
      "The generator expression stores its elements on disk instead of RAM"
    ],
    "correct_answer": "The list comprehension immediately allocates memory for all 1,000,000 elements, while the generator computes each value on-the-fly consuming O(1) memory",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "List comprehensions are eagerly evaluated and store all elements in memory simultaneously. Generator expressions evaluate lazily, consuming negligible memory regardless of dataset size."
  },
  {
    "question_text": "In Python, what is a 'Decorator' and what syntax is used to apply it?",
    "options": [
      "A callable that takes a function as input and returns a modified or enhanced function, applied with the '@' syntax above a function definition",
      "A visual theme applied to the Tkinter graphical interface",
      "A special comment formatted with triple hashtags (###)",
      "A macro that transforms Python syntax into HTML output"
    ],
    "correct_answer": "A callable that takes a function as input and returns a modified or enhanced function, applied with the '@' syntax above a function definition",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Decorators wrap another function, altering or extending its behavior (e.g. logging, caching, authentication) without permanently modifying the wrapped function's source code."
  },
  {
    "question_text": "Why should @functools.wraps(fn) be used inside a custom Python decorator?",
    "options": [
      "It preserves the original function's metadata, such as __name__, __doc__, and parameter annotations, which would otherwise be overwritten by the wrapper",
      "It compiles the decorated function using PyPy for 5x speedups",
      "It prevents other threads from calling the decorated function simultaneously",
      "It automatically converts all return values into JSON strings"
    ],
    "correct_answer": "It preserves the original function's metadata, such as __name__, __doc__, and parameter annotations, which would otherwise be overwritten by the wrapper",
    "cognitive_layer": "Edge Cases & Trap Detection",
    "explanation": "Without functools.wraps, inspecting fn.__name__ or help(fn) reflects the wrapper function's identity, breaking introspection, documentation tools, and debuggers."
  },
  {
    "question_text": "What is the Global Interpreter Lock (GIL) in standard CPython?",
    "options": [
      "A mutex that protects access to Python objects, preventing multiple native operating system threads from executing Python bytecodes simultaneously in a single process",
      "A security sandbox that disables internet access in Python scripts",
      "A hardware lock that restricts Python to a single CPU core permanently",
      "A database lock that prevents concurrent sqlite writes"
    ],
    "correct_answer": "A mutex that protects access to Python objects, preventing multiple native operating system threads from executing Python bytecodes simultaneously in a single process",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "The GIL ensures memory safety with CPython's reference counting. While I/O-bound tasks benefit from multithreading (the GIL is released during I/O), CPU-bound concurrency requires the multiprocessing module."
  },
  {
    "question_text": "In Python, what is the difference between copy.copy() (shallow copy) and copy.deepcopy()?",
    "options": [
      "Shallow copy creates a new compound object but inserts references to the original child objects; deep copy recursively copies all nested objects",
      "Shallow copy is for text strings while deep copy is for numeric arrays",
      "Deep copy modifies the original object in place while shallow copy preserves it",
      "Shallow copy deletes the source object from memory after copying"
    ],
    "correct_answer": "Shallow copy creates a new compound object but inserts references to the original child objects; deep copy recursively copies all nested objects",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "With shallow copy, modifying a nested mutable element (e.g., list within a list) affects both copies. Deep copy creates completely independent copies of all nested children."
  },
  {
    "question_text": "What is the difference between the dunder methods __str__ and __repr__ in Python?",
    "options": [
      "__str__ provides an informal, user-friendly string representation; __repr__ provides an unambiguous, developer-oriented representation (ideally valid Python code to recreate the object)",
      "__str__ is called when converting to JSON; __repr__ is called when printing to the console",
      "__repr__ was deprecated in Python 3.6 in favor of __str__",
      "__str__ is for numbers while __repr__ is for text objects"
    ],
    "correct_answer": "__str__ provides an informal, user-friendly string representation; __repr__ provides an unambiguous, developer-oriented representation (ideally valid Python code to recreate the object)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "print(obj) and str(obj) invoke __str__ (falling back to __repr__ if absent). Evaluating obj directly in the REPL or using repr(obj) invokes __repr__."
  },
  {
    "question_text": "What dunder methods must a Python class implement to support the Context Manager protocol used in the 'with' statement?",
    "options": [
      "__enter__ and __exit__",
      "__init__ and __del__",
      "__open__ and __close__",
      "__start__ and __stop__"
    ],
    "correct_answer": "__enter__ and __exit__",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "The 'with' statement calls __enter__() at entry (binding the return value to the 'as' variable) and guarantees __exit__() is called upon leaving the block, even during exceptions."
  },
  {
    "question_text": "What does the 'else' block do in a Python 'try ... except ... else ... finally' construct?",
    "options": [
      "It executes if and only if no exception was raised in the try block",
      "It executes only when an uncaught exception is raised",
      "It executes immediately before the try block starts",
      "It replaces the finally block when handling fatal errors"
    ],
    "correct_answer": "It executes if and only if no exception was raised in the try block",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "The 'else' clause runs only when code in the try block ran without throwing any exceptions. It helps avoid accidentally catching exceptions thrown by code that wasn't meant to be protected."
  },
  {
    "question_text": "In Python multiple inheritance, what algorithm determines the Method Resolution Order (MRO)?",
    "options": [
      "C3 Linearization algorithm",
      "Depth-First Search with backtracking",
      "Dijkstra's shortest path algorithm",
      "Random walk selection"
    ],
    "correct_answer": "C3 Linearization algorithm",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Python uses C3 Linearization to compute class MRO, guaranteeing monotonicity and preserving local precedence order across complex multiple inheritance hierarchies."
  },
  {
    "question_text": "What is the purpose of the 'frozenset' data type in Python?",
    "options": [
      "It is an immutable version of a set that is hashable, allowing it to be used as a dictionary key or an element of another set",
      "It is a set stored in persistent cold-storage flash memory",
      "It is a set that automatically sorts elements in descending order",
      "It prevents other threads from reading its elements concurrently"
    ],
    "correct_answer": "It is an immutable version of a set that is hashable, allowing it to be used as a dictionary key or an element of another set",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Because standard sets are mutable, they cannot be hashed or used as keys in dicts. frozenset provides set operations while being completely immutable and hashable."
  },
  {
    "question_text": "In Python, what is the output of 'bool([])', 'bool({})', and 'bool(\"\")'?",
    "options": [
      "All evaluate to False",
      "All evaluate to True",
      "True, False, False",
      "Raises a TypeError"
    ],
    "correct_answer": "All evaluate to False",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "In Python's truth value testing, empty collections, empty sequences, zero numbers (0, 0.0), None, and False all evaluate to boolean False."
  },
  {
    "question_text": "What does the dictionary method dict.get(key, default) do when the specified key is not present in the dictionary?",
    "options": [
      "It returns the specified default value without raising a KeyError",
      "It raises a KeyError and logs a traceback",
      "It automatically inserts the key into the dictionary mapped to default",
      "It terminates the script with exit code 1"
    ],
    "correct_answer": "It returns the specified default value without raising a KeyError",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Unlike dict[key] which raises a KeyError if the key is missing, dict.get(key, default) safely returns default (or None if default is omitted)."
  },
  {
    "question_text": "What is the primary benefit of using a list comprehension over a manual for-loop with append() in Python?",
    "options": [
      "List comprehensions are more concise and run noticeably faster because the bytecode uses optimized C-level loop mechanisms (LIST_APPEND)",
      "List comprehensions execute in separate threads on the GPU",
      "List comprehensions bypass all Python syntax errors",
      "List comprehensions convert mutable lists into immutable tuples automatically"
    ],
    "correct_answer": "List comprehensions are more concise and run noticeably faster because the bytecode uses optimized C-level loop mechanisms (LIST_APPEND)",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "List comprehensions avoid the overhead of repeated attribute lookups (list.append) and function call frames, executing loop construction directly in C inside the CPython interpreter."
  },
  {
    "question_text": "What does the built-in zip() function do when passed iterables of unequal length in Python 3?",
    "options": [
      "It stops producing pairs as soon as the shortest input iterable is exhausted (or strict=True raises ValueError in Python 3.10+)",
      "It pads missing elements with None automatically",
      "It raises an IndexError immediately",
      "It repeats elements from the shorter iterable cyclically"
    ],
    "correct_answer": "It stops producing pairs as soon as the shortest input iterable is exhausted (or strict=True raises ValueError in Python 3.10+)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "By default, zip() truncates to the shortest iterable. If padding with fill values is desired, itertools.zip_longest() should be used."
  },
  {
    "question_text": "What does the '@property' decorator achieve in a Python class?",
    "options": [
      "It allows a method to be accessed as an attribute, enabling encapsulation with getter, setter, and deleter logic",
      "It registers the class as a global singleton across all modules",
      "It stores the class instance in the Windows Registry",
      "It makes the class immutable and prohibits adding new attributes"
    ],
    "correct_answer": "It allows a method to be accessed as an attribute, enabling encapsulation with getter, setter, and deleter logic",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "@property turns a method into a read-only attribute getter. Paired with @name.setter, it enables data validation and encapsulation while keeping clean dot-attribute syntax."
  },
  {
    "question_text": "In Python, how is memory deallocated when an object's reference count drops to zero?",
    "options": [
      "CPython reclaims the memory immediately, invoking the object's __del__ finalizer method",
      "Memory is never reclaimed until the operating system terminates the process",
      "It waits for a manual call to gc.collect() before any memory can be freed",
      "Memory is written to virtual swap memory and kept indefinitely"
    ],
    "correct_answer": "CPython reclaims the memory immediately, invoking the object's __del__ finalizer method",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "CPython uses reference counting as its primary memory management mechanism. As soon as references reach zero, memory is freed immediately. Cyclic garbage collection handles circular references."
  },
  {
    "question_text": "What does the Walrus operator (:=) introduced in Python 3.8 do?",
    "options": [
      "It assigns values to variables as part of a larger expression (Assignment Expression)",
      "It checks for deep object equality across threads",
      "It converts a generator function into an asynchronous coroutine",
      "It denotes a bitwise rotate-right operator"
    ],
    "correct_answer": "It assigns values to variables as part of a larger expression (Assignment Expression)",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "The walrus operator ':=' assigns and returns a value in one step, commonly used in while loops: 'while (chunk := file.read(1024)): ...'."
  },
  {
    "question_text": "What is the purpose of the '__slots__' attribute in a Python class definition?",
    "options": [
      "It restricts allowed instance attributes to a fixed tuple of names, preventing the creation of instance __dict__ and saving significant RAM when creating millions of instances",
      "It configures time slots for thread execution in asyncio",
      "It registers slot listeners for Qt and Tkinter GUI frameworks",
      "It disables class inheritance permanently"
    ],
    "correct_answer": "It restricts allowed instance attributes to a fixed tuple of names, preventing the creation of instance __dict__ and saving significant RAM when creating millions of instances",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "__slots__ replaces the dynamic per-instance dictionary (__dict__) with a compact static array of references, significantly reducing memory consumption for data-heavy classes."
  },
  {
    "question_text": "What is the difference between 'raise' and 'raise from' in Python exception handling?",
    "options": [
      "'raise from' explicitly chains exceptions by setting the __cause__ attribute, linking the new exception to the original root cause",
      "'raise from' converts a runtime error into a compile error",
      "'raise from' suppresses the traceback completely",
      "Both keywords perform identical exception propagation"
    ],
    "correct_answer": "'raise from' explicitly chains exceptions by setting the __cause__ attribute, linking the new exception to the original root cause",
    "cognitive_layer": "Diagnostic Debugging & Tracing",
    "explanation": "Explicit exception chaining (e.g., 'raise DatabaseError() from err') shows both exceptions in tracebacks, clearly indicating that the second error was caused directly by the first."
  },
  {
    "question_text": "What is the result of 'lambda x, y: x + y' in Python?",
    "options": [
      "An anonymous inline function that accepts two parameters and returns their sum",
      "A closure that executes asynchronously in the background",
      "A mathematical vector definition in NumPy",
      "A syntax error because lambdas can only accept a single argument"
    ],
    "correct_answer": "An anonymous inline function that accepts two parameters and returns their sum",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Lambdas are small anonymous functions created with the lambda keyword, restricted to a single expression whose evaluated result is returned."
  },
  {
    "question_text": "What is the purpose of the '__name__ == \"__main__\"' guard in Python scripts?",
    "options": [
      "It checks whether the script is being executed directly as the top-level program, preventing code inside the block from running when imported as a module",
      "It checks if the current user has administrative permissions",
      "It verifies that Python is running in 64-bit mode",
      "It registers the module with PyPI"
    ],
    "correct_answer": "It checks whether the script is being executed directly as the top-level program, preventing code inside the block from running when imported as a module",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "When run directly, Python sets __name__ to '__main__'. When imported, __name__ is set to the module's file name, allowing dual-use files that act as both scripts and libraries."
  },
  {
    "question_text": "In Python, what is the output of 'set([1, 2, 2, 3, 3, 3])'?",
    "options": [
      "{1, 2, 3}",
      "[1, 2, 3]",
      "{3, 2, 1, 1}",
      "Raises a DuplicateValueError"
    ],
    "correct_answer": "{1, 2, 3}",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Sets in Python are unordered collections of distinct, hashable elements. Converting a list with duplicates into a set automatically discards all redundant values."
  },
  {
    "question_text": "What does the enumerate(iterable, start=0) function yield in Python?",
    "options": [
      "Tuples containing a running counter index and the corresponding element from the iterable",
      "A sorted list of elements",
      "The total count of items in the iterable without reading elements",
      "A dictionary mapping each item to its memory address"
    ],
    "correct_answer": "Tuples containing a running counter index and the corresponding element from the iterable",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "enumerate() produces pairs of (index, item), eliminating the need for manual counter variables like 'i = 0' inside for loops."
  },
  {
    "question_text": "How does Python's 'any()' function evaluate truthiness across an iterable?",
    "options": [
      "It returns True if at least one element in the iterable is truthy, short-circuiting as soon as a True value is encountered",
      "It returns True only if every single element in the iterable is True",
      "It returns the count of truthy values in the collection",
      "It evaluates all items in parallel using multithreading"
    ],
    "correct_answer": "It returns True if at least one element in the iterable is truthy, short-circuiting as soon as a True value is encountered",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "any() behaves like an iterative logical OR with short-circuit evaluation: it returns True immediately upon seeing the first truthy value without iterating the rest."
  },
  {
    "question_text": "How does Python's 'all()' function evaluate truthiness across an iterable?",
    "options": [
      "It returns True only if every element in the iterable is truthy, short-circuiting and returning False immediately upon encountering a falsy element",
      "It returns True if any single element is truthy",
      "It returns False for empty iterables like all([])",
      "It converts all elements into string types"
    ],
    "correct_answer": "It returns True only if every element in the iterable is truthy, short-circuiting and returning False immediately upon encountering a falsy element",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "all() acts like an iterative logical AND. It short-circuits to False at the first falsy element. Note that all([]) vacuously returns True for empty collections."
  },
  {
    "question_text": "In Python, why is string concatenation using '+= ' in a loop generally considered an anti-pattern compared to ''.join(list)?",
    "options": [
      "Strings are immutable, so '+=' frequently creates and destroys new string allocations in O(N²) time, whereas ''.join() calculates total buffer size and copies in O(N) linear time",
      "'+=' strips whitespace characters automatically from the string",
      "'+=' is not supported in Python 3",
      "''.join() encrypts the final string in memory"
    ],
    "correct_answer": "Strings are immutable, so '+=' frequently creates and destroys new string allocations in O(N²) time, whereas ''.join() calculates total buffer size and copies in O(N) linear time",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "Because strings cannot be modified in place, repeated '+=' in loops can trigger quadratic memory reallocations. Accumulating chunks in a list and calling ''.join() executes in fast linear time."
  },
  {
    "question_text": "What does the '@dataclass' decorator from the standard 'dataclasses' module automatically generate for a Python class?",
    "options": [
      "Standard boilerplate methods including __init__, __repr__, and __eq__ based on type-annotated fields",
      "A SQLite database table corresponding to the class fields",
      "A graphical user interface form with text input fields",
      "A network REST endpoint serving the class as JSON"
    ],
    "correct_answer": "Standard boilerplate methods including __init__, __repr__, and __eq__ based on type-annotated fields",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "Introduced in Python 3.7, @dataclass inspects type annotations on the class to generate __init__, __repr__, __eq__, and optionally ordering/immutability methods."
  },
  {
    "question_text": "What is the difference between 'isinstance(obj, Class)' and 'type(obj) is Class' in Python?",
    "options": [
      "'isinstance' evaluates to True for instances of subclasses (respects inheritance), while 'type(obj) is Class' requires an exact class match",
      "'isinstance' is only for primitive types while 'type' is for user-defined classes",
      "'type(obj) is Class' throws a TypeError when evaluated on custom objects",
      "Both checks are 100% equivalent in all Python inheritance hierarchies"
    ],
    "correct_answer": "'isinstance' evaluates to True for instances of subclasses (respects inheritance), while 'type(obj) is Class' requires an exact class match",
    "cognitive_layer": "Edge Cases & Trap Detection",
    "explanation": "isinstance(bool_val, int) returns True because bool inherits from int in Python. type(bool_val) is int returns False because it strictly compares object identities."
  },
  {
    "question_text": "What is a 'closure' in Python?",
    "options": [
      "A nested function that retains access to variables in its enclosing scope even after the outer enclosing function has completed execution",
      "A function that closes all open file descriptors before exiting",
      "A class destructor method that deletes instance variables",
      "A loop termination statement similar to break"
    ],
    "correct_answer": "A nested function that retains access to variables in its enclosing scope even after the outer enclosing function has completed execution",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "A closure captures and stores local variables from its enclosing lexical environment in its __closure__ attribute, allowing state retention without global variables or classes."
  },
  {
    "question_text": "What does the 'yield from' expression achieve in Python generators?",
    "options": [
      "It transparently delegates sub-iteration to another generator or iterable, establishing a two-way communication channel for send() and throw()",
      "It terminates the parent generator and deletes the sub-generator",
      "It converts an asynchronous coroutine into a synchronous blocking loop",
      "It yields values in reverse chronological order"
    ],
    "correct_answer": "It transparently delegates sub-iteration to another generator or iterable, establishing a two-way communication channel for send() and throw()",
    "cognitive_layer": "Execution Dynamics & Flow",
    "explanation": "'yield from' replaces manual 'for x in sub_gen: yield x' loops while correctly routing values, exceptions (throw), and return values across nested generator pipelines."
  },
  {
    "question_text": "What happens when an unhandled exception occurs inside a thread spawned by the 'threading' module in Python?",
    "options": [
      "The thread terminates and prints a traceback to sys.stderr, but the main application process continues running",
      "The entire Python interpreter immediately crashes with SIGSEGV",
      "The main thread automatically catches the exception via sys.exc_info()",
      "The operating system reboots the failed thread with clean state"
    ],
    "correct_answer": "The thread terminates and prints a traceback to sys.stderr, but the main application process continues running",
    "cognitive_layer": "Diagnostic Debugging & Tracing",
    "explanation": "Exceptions in standard threading.Thread instances do not propagate to the main thread; the thread silently dies after printing to stderr, unless threading.excepthook is configured."
  },
  {
    "question_text": "In Python, what is the output of '1.1 + 2.2 == 3.3'?",
    "options": [
      "False (due to IEEE 754 binary floating-point rounding representation)",
      "True (Python automatically fixes floating-point representation errors)",
      "Raises a FloatingPointError",
      "None"
    ],
    "correct_answer": "False (due to IEEE 754 binary floating-point rounding representation)",
    "cognitive_layer": "Edge Cases & Trap Detection",
    "explanation": "In IEEE 754 floating-point arithmetic, 1.1 + 2.2 evaluates to 3.3000000000000003, which does not equal 3.3. Safe comparison requires math.isclose()."
  },
  {
    "question_text": "What is the purpose of the 'sys.argv' list in Python's standard 'sys' module?",
    "options": [
      "It stores the command-line arguments passed to the script, where sys.argv[0] is the script name",
      "It lists all environment variables set in the operating system",
      "It records all installed third-party packages in site-packages",
      "It contains pointers to currently running background threads"
    ],
    "correct_answer": "It stores the command-line arguments passed to the script, where sys.argv[0] is the script name",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "sys.argv holds command-line tokens as strings: sys.argv[0] is the Python script path/name, and sys.argv[1:] are user-supplied arguments."
  },
  {
    "question_text": "What is the purpose of the 'collections.defaultdict' in Python?",
    "options": [
      "It provides a dictionary subclass that calls a factory function to supply missing values automatically instead of raising a KeyError",
      "It provides an immutable dictionary that rejects additions",
      "It sorts dictionary keys automatically in descending order",
      "It encrypts dictionary entries in memory"
    ],
    "correct_answer": "It provides a dictionary subclass that calls a factory function to supply missing values automatically instead of raising a KeyError",
    "cognitive_layer": "Concept Foundation & Syntax",
    "explanation": "defaultdict(list) initializes missing keys with empty lists upon first access (d[key].append(val)), eliminating verbose 'if key not in d: d[key] = []' checks."
  }
];

const QUESTION_BANKS = {
  java: JAVA_QUESTION_BANK,
  c: C_PROGRAMMING_QUESTION_BANK,
  python: PYTHON_QUESTION_BANK,
  dbms: DBMS_QUESTION_BANK,
  dsa: DSA_QUESTION_BANK
};

const DOMAIN_DISTRACTORS = {
  java: [
    "Java forces manual pointer arithmetic and explicit free() calls instead of automatic garbage collection.",
    "Constructors in Java must declare a void return type in order to instantiate objects.",
    "Java compiles source code directly into platform-specific machine executables without bytecode or a JVM.",
    "A static method in Java can directly access non-static instance variables using the 'this' keyword.",
    "A Java class can directly extend multiple concrete parent classes simultaneously using commas.",
    "Java interfaces cannot define static or default methods under any language specification.",
    "All Java objects are allocated exclusively on the operating system call stack.",
    "Java string literals are mutable sequences modified via in-place memory offsets."
  ],
  c: [
    "C is an interpreted scripting language executed strictly through an isolated bytecode virtual machine.",
    "C strictly prohibits direct pointer manipulation and manual heap memory allocation.",
    "C relies on an automatic garbage collector to reclaim dynamically allocated heap memory.",
    "C enforces runtime dynamic typing and eliminates compile-time type declarations.",
    "C executes exclusively through object-oriented virtual method tables.",
    "C structures allocate all members starting at the exact same base memory offset.",
    "C arrays automatically resize dynamically when written beyond their allocated boundary.",
    "String literals in C are placed in writable stack memory and can be mutated safely."
  ],
  python: [
    "Python requires manual memory deallocation using malloc() and free() for every list.",
    "Python tuples are mutable sequences that dynamically resize during iteration.",
    "Python uses curly braces instead of indentation to delimit class and function blocks.",
    "Python compiles directly to x86 assembly before running without a runtime interpreter.",
    "Python dictionaries allow mutable unhashable lists to serve as lookup keys.",
    "Python does not support multiple inheritance or custom exception classes.",
    "Python generators compute all values eagerly and store them permanently in RAM.",
    "Python variables declared inside a function are globally visible by default."
  ],
  dbms: [
    "It permits partial functional dependencies on composite candidate keys under 2NF.",
    "It disables transaction logging and permits unrecoverable dirty writes during execution.",
    "It forces full table scans by omitting index structures across relational schemas.",
    "It treats all database entities as untyped flat files without relational constraints.",
    "A weak entity set possesses an autonomous single-attribute primary key.",
    "In 3NF, transitive dependencies between non-prime attributes are explicitly mandatory.",
    "Clustered indexes do not alter the physical storage order of table rows on disk.",
    "TRUNCATE executes slower than DELETE because it fires triggers for every deleted row."
  ],
  dsa: [
    "Binary Search operates efficiently on unsorted linked lists in O(1) time.",
    "A Queue operates strictly on a Last-In First-Out (LIFO) stack order.",
    "MergeSort requires O(1) constant auxiliary memory in standard array implementations.",
    "An unbalanced BST guarantees O(1) worst-case search time for all keys.",
    "Dijkstra's algorithm successfully computes shortest paths in graphs with negative weight cycles.",
    "Breadth-First Search uses a Stack data structure while Depth-First Search uses a FIFO Queue.",
    "Building a binary heap from an unsorted array requires O(N²) worst-case comparisons.",
    "Hash tables with linear probing completely prevent primary clustering."
  ],
  general: [
    "It bypasses structured type checking and operates without deterministic state boundaries.",
    "It requires manual assembly instructions instead of modular abstractions.",
    "It disallows reusable components and executes strictly as unvalidated linear scripts.",
    "It prevents automated verification and eliminates predictable control flow.",
    "It forces all runtime state into un-synchronized global mutable registers.",
    "It rejects defensive error handling and silences all runtime hardware faults."
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

  if (matchesJava(t)) return 'java';
  if (matchesPython(t)) return 'python';
  if (matchesDbms(t)) return 'dbms';
  if (matchesDsa(t)) return 'dsa';
  if (matchesC(t)) return 'c';

  if (refSample) {
    if (matchesJava(refSample)) return 'java';
    if (matchesPython(refSample)) return 'python';
    if (matchesDbms(refSample)) return 'dbms';
    if (matchesDsa(refSample)) return 'dsa';
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
  join: ['join', 'inner join', 'left outer', 'lossless', 'cartesian', 'cross join'],
  index: ['index', 'b+ tree', 'clustered', 'secondary', 'fan-out', 'disk i/o'],
  transaction: ['transaction', 'acid', '2pl', 'two-phase locking', 'deadlock', 'serializable', 'wal', 'durability', 'checkpoint'],
  acid: ['acid', 'durability', 'atomicity', 'consistency', 'isolation', 'wal'],
  class: ['class', 'blueprint', 'object', 'instance', 'constructor', 'encapsulation', 'static'],
  object: ['object', 'class', 'instance', 'new keyword', 'heap', 'constructor', 'this'],
  constructor: ['constructor', 'no-arg', 'super(', 'this(', 'overload', 'parameterized'],
  inheritance: ['inheritance', 'subclass', 'superclass', 'extends', 'super(', 'dynamic method dispatch', 'overrid', 'vtable'],
  polymorphism: ['polymorphism', 'overload', 'overrid', 'dynamic method dispatch', 'dynamic binding'],
  encapsulation: ['encapsulation', 'private', 'getter', 'setter', 'access modifier'],
  pointer: ['pointer', 'dangling', 'malloc', 'calloc', 'realloc', 'free', 'decay', 'address', 'dereference', 'const int *'],
  memory: ['malloc', 'calloc', 'realloc', 'free', 'heap', 'stack', 'static', 'union', 'struct', 'padding'],
  tree: ['tree', 'bst', 'binary search tree', 'avl', 'red-black', 'inorder', 'traversal', 'heap'],
  graph: ['graph', 'bfs', 'dfs', 'dijkstra', 'bellman-ford', 'kruskal', 'prim', 'topological', 'dag']
};

const BROAD_DOMAIN_WORDS = new Set([
  'dbms', 'database', 'rdbms', 'sql', 'java', 'python', 'c', 'dsa', 'os',
  'programming', 'language', 'concept', 'concepts', 'basic', 'basics', 'notes',
  'introduction', 'intro', 'unit', 'chapter', 'module', 'syllabus', 'exam', 'quiz'
]);

const INSTRUCTION_FILLER_RE = /\b(give|generate|create|make|prepare|write|provide|list|ask|build|set|suggest|include|focus|topics?|syllabus|questions?|mcqs?|multiple|choice|about|regarding|please|following|based)\b/gi;

function extractFocusSubtopics(topic = '', referenceText = '') {
  const combined = `${topic} ${referenceText || ''}`;
  const sanitized = combined
    .replace(INSTRUCTION_FILLER_RE, ' ')
    .replace(/[^a-zA-Z0-9#+]/g, ' ')
    .toLowerCase();

  const tokens = sanitized.split(/\s+/).filter(w => w.length >= 2);
  const found = new Set();

  for (const token of tokens) {
    if (BROAD_DOMAIN_WORDS.has(token)) continue;
    if (SUBTOPIC_ALIASES[token]) {
      found.add(token);
      continue;
    }
    for (const [key, aliases] of Object.entries(SUBTOPIC_ALIASES)) {
      if (aliases.some(a => a.trim() === token || (token.length >= 4 && a.includes(token)))) {
        found.add(key);
        break;
      }
    }
  }

  return [...found];
}

function isInstructionOrTopicList(sentence = '') {
  if (!sentence) return false;
  const s = sentence.trim().toLowerCase();
  if (s.startsWith('give questions') || s.startsWith('give mcqs') || s.startsWith('generate questions')) return true;
  if (s.startsWith('prepare questions') || s.startsWith('create quiz')) return true;
  if (/^\s*topics?\s*:/i.test(s)) return true;
  const commas = (s.match(/,/g) || []).length;
  const words = s.split(/\s+/).filter(Boolean);
  if (commas >= 3 && words.length <= 15) return true;
  return false;
}

/**
 * Builds completely unique general computer science questions when no domain bank matches.
 * Uses 25 distinct pedagogical templates with strict signature deduplication.
 */
function buildGeneralTopicQuestions(topic, targetCount, cognitiveLayer, usedSignatures = new Set()) {
  const safeTopic = (topic || 'Computer Science').trim();
  const defaultLayer = (fallback) =>
    cognitiveLayer && cognitiveLayer !== 'Multi-Layer Balanced' ? cognitiveLayer : fallback;

  const templates = [
    {
      stem: "Which fundamental design principle is central to organizing and implementing {T}?",
      correct: "Decomposing responsibilities into clear, modular abstractions with well-defined interfaces and predictable state",
      distractors: [
        "Combining all unrelated logic into a single global script without encapsulation",
        "Eliminating type boundaries and avoiding validation across module inputs",
        "Duplicating state across uncoordinated global variables to bypass encapsulation"
      ],
      layer: "Concept Foundation & Syntax",
      exp: "Effective engineering in {T} relies on clean abstraction boundaries, modular structure, and predictable state management."
    },
    {
      stem: "When tracing runtime execution flow in {T}, which defensive engineering practice prevents subtle defects?",
      correct: "Validating boundary inputs, handling null/empty states, and maintaining clear deterministic control flow",
      distractors: [
        "Suppressing all runtime exceptions silently so execution continues with corrupted state",
        "Hardcoding fixed magic numbers for dynamic user inputs and ignoring error states",
        "Relying on uninitialized variables without predictable default state"
      ],
      layer: "Diagnostic Debugging & Tracing",
      exp: "Explicit input validation and defensive boundary handling keep execution in {T} reliable and maintainable."
    },
    {
      stem: "In {T}, why is separating interface contracts from internal implementation details recommended?",
      correct: "It allows internal logic to evolve safely without breaking callers that depend on the public contract",
      distractors: [
        "It disables compiler syntax checking to speed up unverified code changes",
        "It forces external callers to directly manipulate private internal fields",
        "It converts runtime logic into uneditable binary constants"
      ],
      layer: "Execution Dynamics & Flow",
      exp: "Encapsulating implementation details behind stable contracts reduces coupling and makes systems in {T} robust."
    },
    {
      stem: "Which verification approach is most effective for catching edge-case failures in {T}?",
      correct: "Testing boundary inputs, zero/null states, and invalid inputs alongside standard happy-path scenarios",
      distractors: [
        "Running a single manual test with ideal inputs and assuming all edge cases succeed",
        "Disabling assertions in test suites whenever an unexpected failure occurs",
        "Testing only formatting style while skipping behavioral verification"
      ],
      layer: "Edge Cases & Trap Detection",
      exp: "Boundary and invalid-input cases expose subtle off-by-one, null-reference, and state-transition bugs in {T}."
    },
    {
      stem: "In system architecture for {T}, how is optimal scalability achieved under heavy concurrent workloads?",
      correct: "By eliminating shared mutable state, utilizing asynchronous I/O, and partitioning data to minimize lock contention",
      distractors: [
        "By holding global exclusive locks across all read and write queries indefinitely",
        "By running all network requests synchronously on the single primary UI thread",
        "By disabling caching and forcing full disk re-reads on every operation"
      ],
      layer: "Execution Dynamics & Flow",
      exp: "Minimizing lock contention and isolating mutable state are fundamental to horizontal and vertical scalability in {T}."
    },
    {
      stem: "What is the primary operational risk of unmanaged dynamic memory or resource handles in {T}?",
      correct: "Resource and memory leaks leading to degraded performance, memory exhaustion, and process termination",
      distractors: [
        "Automatic compilation of source code into machine firmware",
        "Immediate encryption of all runtime variables by the operating system",
        "Conversion of dynamic types into static constant strings"
      ],
      layer: "Diagnostic Debugging & Tracing",
      exp: "Failing to release dynamically allocated memory or file/socket descriptors causes gradual starvation and crashes in {T}."
    },
    {
      stem: "When designing APIs and function signatures in {T}, what ensures high maintainability and low defect rates?",
      correct: "Adhering to Single Responsibility, maintaining explicit parameter types, and documenting expected invariants",
      distractors: [
        "Passing arbitrary untyped tuples with undocumented positional indices",
        "Writing functions exceeding 5,000 lines that handle completely unrelated domains",
        "Ignoring error return codes and bypassing caller assertions"
      ],
      layer: "Concept Foundation & Syntax",
      exp: "Clean APIs with clear responsibilities and explicit contracts make code in {T} self-documenting and easier to test."
    },
    {
      stem: "In {T}, how does automated unit testing contribute to long-term software quality?",
      correct: "It enables rapid regression detection, facilitates safe refactoring, and documents expected behavior",
      distractors: [
        "It eliminates the need for any runtime error handling or input validation",
        "It guarantees that software will never experience hardware or network outages",
        "It automatically deploys unreviewed code changes directly to production"
      ],
      layer: "Concept Foundation & Syntax",
      exp: "A comprehensive unit test suite acts as a safety harness, verifying that code modifications in {T} preserve correctness."
    },
    {
      stem: "Which strategy is most effective for resolving concurrency race conditions in {T}?",
      correct: "Using atomic synchronization primitives, mutexes, or immutable data structures to coordinate access to shared state",
      distractors: [
        "Adding random Thread.sleep() delays and hoping operations finish in order",
        "Ignoring thread boundaries and allowing concurrent unsynchronized writes",
        "Disabling compiler optimization flags without code synchronization"
      ],
      layer: "Edge Cases & Trap Detection",
      exp: "Sleep delays do not prevent races. Deterministic concurrency in {T} requires formal synchronization or immutable data."
    },
    {
      stem: "What role does asymptotic complexity analysis (Big-O notation) play in {T}?",
      correct: "It characterizes how execution time and memory requirements scale as input size N grows toward infinity",
      distractors: [
        "It measures the exact millisecond elapsed time on a specific model of hardware",
        "It verifies grammatical syntax correctness during source code tokenization",
        "It encrypts sensitive algorithms before network distribution"
      ],
      layer: "Concept Foundation & Syntax",
      exp: "Asymptotic analysis abstracts away hardware quirks, allowing objective comparison of algorithms in {T}."
    },
    {
      stem: "In {T}, what is the primary benefit of using immutable data structures?",
      correct: "They are inherently thread-safe, eliminate side effects, and make state changes easy to reason about",
      distractors: [
        "They allow in-place modification of elements without memory allocation",
        "They permanently disable garbage collection to speed up execution",
        "They reduce binary executable file sizes to zero bytes"
      ],
      layer: "Execution Dynamics & Flow",
      exp: "Because immutable objects cannot change after construction, they cannot experience race conditions or unexpected mutations in {T}."
    },
    {
      stem: "When handling exceptions and runtime errors in {T}, what is considered best practice?",
      correct: "Catching specific exceptions at appropriate architectural boundaries and logging diagnostic context without silent suppression",
      distractors: [
        "Wrapping the entire application in an empty catch-all block that discards all errors",
        "Terminating the host operating system whenever a validation error occurs",
        "Retrying failed network requests in an infinite unthrottled loop"
      ],
      layer: "Diagnostic Debugging & Tracing",
      exp: "Catching specific errors and preserving stack traces enables effective debugging and graceful degradation in {T}."
    },
    {
      stem: "What is 'Technical Debt' in the engineering lifecycle of {T}?",
      correct: "The cumulative long-term cost of choosing quick, expedient workarounds over well-architected solutions",
      distractors: [
        "The financial cost of purchasing hardware servers and software licenses",
        "The memory consumed by unreferenced static variables in the data segment",
        "The bandwidth used during automated code compilation"
      ],
      layer: "Concept Foundation & Syntax",
      exp: "Technical debt accumulates when shortcuts are taken, requiring future refactoring to maintain velocity and stability in {T}."
    },
    {
      stem: "In {T}, why is Dependency Injection or Inversion of Control (IoC) widely adopted?",
      correct: "It decouples component instantiation from business logic, allowing easy substitution of mock dependencies for testing",
      distractors: [
        "It compiles high-level code directly into analog electrical signals",
        "It forces all software modules to be written in a single source file",
        "It prevents functions from accepting parameters"
      ],
      layer: "Execution Dynamics & Flow",
      exp: "Injecting dependencies from the outside decouples classes and allows seamless unit testing with test doubles in {T}."
    },
    {
      stem: "When implementing caching mechanisms in {T}, what is the primary challenge?",
      correct: "Cache invalidation and maintaining consistency between cached copies and the underlying source of truth",
      distractors: [
        "Calculating integer addition on modern 64-bit processors",
        "Preventing the cache from accepting ASCII string keys",
        "Forcing the cache to delete its contents on every single read operation"
      ],
      layer: "Edge Cases & Trap Detection",
      exp: "Ensuring that stale data in the cache is promptly updated or evicted when source data changes is a classic challenge in {T}."
    },
    {
      stem: "In {T}, what does the Principle of Least Privilege dictate regarding security permissions?",
      correct: "Modules, users, and processes should operate with the minimum access rights strictly necessary to perform their authorized task",
      distractors: [
        "Every component in the application should run with root/administrator access",
        "Security validation should be deferred until after malicious code executes",
        "All database passwords should be hardcoded in public source repositories"
      ],
      layer: "Concept Foundation & Syntax",
      exp: "Least privilege minimizes the blast radius of security vulnerabilities and bugs in {T}."
    },
    {
      stem: "In {T}, what distinguishes synchronous execution from asynchronous execution?",
      correct: "Synchronous operations block the caller thread until completion; asynchronous operations return immediately and notify completion via callbacks, promises, or events",
      distractors: [
        "Synchronous code runs in the cloud while asynchronous code runs on local machines",
        "Asynchronous operations cannot process numeric calculations",
        "Synchronous operations are always 100x faster than asynchronous operations"
      ],
      layer: "Execution Dynamics & Flow",
      exp: "Asynchronous processing frees the calling thread to service other tasks while I/O or network requests are in flight in {T}."
    },
    {
      stem: "What is the primary benefit of Idempotent operations in distributed systems and APIs for {T}?",
      correct: "An idempotent request can be retried multiple times without producing unintended side effects or duplicate modifications",
      distractors: [
        "It guarantees that every API call executes in exactly 0 milliseconds",
        "It allows database records to be deleted without administrative permissions",
        "It encrypts request headers using proprietary compression formats"
      ],
      layer: "Execution Dynamics & Flow",
      exp: "In distributed networks with dropped packets, idempotency enables safe retries without corrupting database state in {T}."
    },
    {
      stem: "In {T}, why is defensive input sanitization mandatory before evaluating user-supplied strings in database or command contexts?",
      correct: "To prevent injection attacks (e.g. SQL Injection, Command Injection) that could compromise system integrity or leak confidential data",
      distractors: [
        "To translate non-English characters into machine binary instructions",
        "To automatically capitalize all vowels in user input",
        "To reduce network bandwidth consumption by 90%"
      ],
      layer: "Edge Cases & Trap Detection",
      exp: "Sanitizing inputs and using parameterized queries prevents attackers from executing unauthorized commands or queries in {T}."
    },
    {
      stem: "What is the purpose of Continuous Integration (CI) in {T} software projects?",
      correct: "Automatically building and executing test suites whenever code is committed to detect bugs and integration issues early",
      distractors: [
        "Continuously running the application in infinite background loops without stopping",
        "Replacing human software developers with automated deployment scripts",
        "Preventing developers from creating new git branches"
      ],
      layer: "Concept Foundation & Syntax",
      exp: "CI ensures code health by providing fast feedback on builds and tests across developer pull requests in {T}."
    },
    {
      stem: "In {T}, what is the role of an Invariant in algorithm and class design?",
      correct: "A condition or assertion that must always hold true throughout the execution lifecycle of the component",
      distractors: [
        "A variable whose value changes unpredictably on every clock cycle",
        "A function that returns different data types depending on CPU temperature",
        "A compiler warning that can be ignored safely in production"
      ],
      layer: "Concept Foundation & Syntax",
      exp: "Class and loop invariants ensure that data structures maintain valid, non-corrupted internal state across all operations in {T}."
    },
    {
      stem: "How does structured logging improve observability in {T} applications?",
      correct: "Emitting logs in standardized formats (such as JSON) with metadata enables automated parsing, indexing, and rapid root-cause diagnosis",
      distractors: [
        "By writing unstructured plain text logs to temporary volatile registers",
        "By disabling all error reporting to reduce disk file sizes",
        "By encrypting log messages with keys that are discarded immediately"
      ],
      layer: "Diagnostic Debugging & Tracing",
      exp: "Structured logs allow centralized monitoring platforms to filter, alert, and query system events across complex {T} deployments."
    },
    {
      stem: "In {T}, what is the purpose of Semantic Versioning (MAJOR.MINOR.PATCH)?",
      correct: "To communicate backward-incompatible breaking changes (MAJOR), backward-compatible features (MINOR), and bug fixes (PATCH)",
      distractors: [
        "To indicate the day, month, and year a software package was published",
        "To measure the number of lines of source code in the repository",
        "To track the monetary price of the software license"
      ],
      layer: "Concept Foundation & Syntax",
      exp: "Semantic versioning provides a clear contract to consumers about whether upgrading a dependency in {T} is safe or requires code changes."
    },
    {
      stem: "What is 'Graceful Degradation' in resilient systems engineered with {T}?",
      correct: "The ability of a system to maintain core functionality at reduced capacity when non-essential dependencies or subsystems fail",
      distractors: [
        "Crashing the entire system immediately upon the failure of any minor background feature",
        "Slowly deleting user data when storage space falls below 10%",
        "Overclocking CPU processors until hardware components fail"
      ],
      layer: "Edge Cases & Trap Detection",
      exp: "Graceful degradation ensures critical services stay online even when secondary components (e.g. recommendation engines) fail in {T}."
    },
    {
      stem: "When refactoring legacy code in {T}, what provides the strongest assurance against introducing regressions?",
      correct: "Having comprehensive automated test coverage with high assertion density covering existing behavioral contracts",
      distractors: [
        "Deleting all existing comments and renaming variables alphabetically",
        "Rewriting the entire codebase from scratch without running legacy tests",
        "Assuming that code which compiles is inherently free of behavioral defects"
      ],
      layer: "Diagnostic Debugging & Tracing",
      exp: "Solid test suites verify that behavioral contracts remain intact while internal structures in {T} are refactored for clarity and efficiency."
    },
    {
      stem: "In {T}, what is the key architectural difference between Horizontal Scaling and Vertical Scaling?",
      correct: "Horizontal scaling adds more machine nodes to the distributed pool; vertical scaling adds more CPU, RAM, or storage to a single server",
      distractors: [
        "Horizontal scaling only works for relational databases while vertical scaling is for web servers",
        "Vertical scaling requires changing source code while horizontal scaling requires zero configuration",
        "Horizontal scaling eliminates network latency completely"
      ],
      layer: "Concept Foundation & Syntax",
      exp: "Horizontal scaling (scaling out) provides elasticity and fault tolerance by distributing workloads across multiple independent nodes in {T}."
    },
    {
      stem: "In distributed architectures for {T}, what does the CAP theorem state regarding partition tolerance?",
      correct: "In the presence of a network partition, a distributed system must choose between Consistency (all nodes see same data) or Availability (every request receives a response)",
      distractors: [
        "A system can simultaneously guarantee 100% Consistency, 100% Availability, and 100% Partition Tolerance under all network failures",
        "Computers can only process Asynchronous Packets when running on optical networks",
        "Database partitions are strictly prohibited in modern cloud infrastructures"
      ],
      layer: "Execution Dynamics & Flow",
      exp: "The CAP theorem fundamentally limits distributed data stores: when network partitions occur, one must trade off between consistency and availability."
    },
    {
      stem: "What is the primary benefit of Event-Driven Architecture when integrating services in {T}?",
      correct: "Loose coupling between message producers and consumers, enabling asynchronous scaling and independent deployment",
      distractors: [
        "It forces all services to share a single monolithic database table",
        "It eliminates the need for any network serialization or data validation",
        "It runs all service workloads synchronously within the client browser"
      ],
      layer: "Execution Dynamics & Flow",
      exp: "Event-driven systems use message brokers (like Kafka or RabbitMQ) so producers publish events without needing to know which consumers process them."
    },
    {
      stem: "In {T}, how does Rate Limiting protect backend infrastructure from catastrophic outages?",
      correct: "By capping the number of requests a client can submit within a time window, preventing resource starvation and Denial of Service (DoS)",
      distractors: [
        "By slowing down CPU clock speeds during peak business hours",
        "By permanently deleting user accounts that make more than 3 requests",
        "By converting HTTP GET requests into WebSocket connections"
      ],
      layer: "Edge Cases & Trap Detection",
      exp: "Rate limiting algorithms (such as Token Bucket or Leaky Bucket) protect downstream services from being overwhelmed by spikes or malicious traffic in {T}."
    },
    {
      stem: "What is the purpose of Liveness and Readiness probes in containerized {T} services?",
      correct: "Liveness probes determine if the container should be restarted; Readiness probes determine if the container is ready to accept user network traffic",
      distractors: [
        "Liveness probes measure internet connection speeds while readiness probes scan for malware",
        "Both probes serve identical functions and cannot be configured independently",
        "Probes compile unit tests inside the running production container"
      ],
      layer: "Execution Dynamics & Flow",
      exp: "Orchestrators (like Kubernetes) use liveness probes to recover deadlocked processes and readiness probes to prevent routing traffic to warming services."
    },
    {
      stem: "What is a 'Blue-Green Deployment' strategy in {T} continuous delivery?",
      correct: "Running two identical production environments (Blue and Green), routing live traffic to one while deploying and validating the new release on the other before switching",
      distractors: [
        "Deploying half the software on Linux and half on Windows simultaneously",
        "Alternating source code colors between green and blue to assist colorblind developers",
        "Deploying software exclusively between midnight and 2 AM"
      ],
      layer: "Concept Foundation & Syntax",
      exp: "Blue-Green deployment ensures near-zero downtime and instant rollback capability by switching router traffic between the two production environments."
    },
    {
      stem: "What is the core premise of a 'Zero Trust' security architecture in {T}?",
      correct: "Never trust, always verify: every request, whether originating inside or outside the network perimeter, must be authenticated, authorized, and encrypted",
      distractors: [
        "Trusting any device that connects from within the corporate office Wi-Fi network without passwords",
        "Prohibiting developers from committing code to version control repositories",
        "Disabling all firewall rules to accelerate database query throughput"
      ],
      layer: "Concept Foundation & Syntax",
      exp: "Zero Trust removes implicit trust based on network location, verifying identity and least-privilege permissions on every individual request."
    },
    {
      stem: "In {T}, what distinguishes database connection pooling from opening fresh connections on each query?",
      correct: "Connection pools maintain a cache of established, reusable database connections, eliminating the heavy latency of TCP and SSL handshakes on every request",
      distractors: [
        "Connection pools convert relational SQL queries into unstructured flat files",
        "Connection pools bypass all database authentication checks",
        "Fresh connections are 100x faster than pooled connections on modern networks"
      ],
      layer: "Execution Dynamics & Flow",
      exp: "Establishing database connections involves socket handshakes, authentication, and backend process spawning. Pooling amortizes this cost across thousands of queries in {T}."
    },
    {
      stem: "When designing microservices in {T}, why is Database-per-Service recommended over a single shared database?",
      correct: "It guarantees loose coupling, allows independent schema evolution, and prevents cross-service database locks and data leaks",
      distractors: [
        "It forces all services to run on a single physical computer",
        "It completely eliminates the need for network APIs between microservices",
        "It reduces cloud hosting bills to zero"
      ],
      layer: "Concept Foundation & Syntax",
      exp: "Sharing a database across microservices creates tight schema coupling and hidden dependencies. Database-per-service preserves bounded contexts and deployment autonomy."
    }
  ];

  const out = [];
  const getSig = (q) => (q.question_text || '').trim().toLowerCase();

  for (let i = 0; i < templates.length && out.length < targetCount; i++) {
    const t = templates[i];
    const qText = t.stem.replace(/{T}/g, safeTopic);
    const sig = qText.toLowerCase().trim();
    if (usedSignatures.has(sig)) continue;
    usedSignatures.add(sig);

    const corr = t.correct.replace(/{T}/g, safeTopic);
    const dist = t.distractors.map(d => d.replace(/{T}/g, safeTopic));
    const opts = [corr, ...dist].sort(() => 0.5 - Math.random());

    out.push({
      question_text: qText,
      options: opts,
      correct_answer: corr,
      marks: 2,
      cognitive_layer: defaultLayer(t.layer),
      topic_tag: safeTopic,
      explanation: t.exp.replace(/{T}/g, safeTopic)
    });
  }

  return out;
}

/**
 * Selects topic-relevant questions from domain banks with STRICT ZERO REPETITION.
 * Every selected question is deduplicated. If requested count exceeds bank matches,
 * remaining slots are filled with distinct general topic questions (never duplicates).
 */
function selectTopicRelevantBankQuestions(bank, focusSubtopics, targetCount, topic, cognitiveLayer, usedSignatures = new Set()) {
  const safeTopic = (topic || '').trim();
  const formatItem = (item) => {
    const finalLayer = cognitiveLayer && cognitiveLayer !== 'Multi-Layer Balanced'
      ? cognitiveLayer
      : (item.cognitive_layer || 'Concept Foundation & Syntax');
    return {
      question_text: item.question_text,
      options: [...item.options].sort(() => 0.5 - Math.random()),
      correct_answer: item.correct_answer,
      marks: item.marks || 2,
      cognitive_layer: finalLayer,
      topic_tag: safeTopic || item.topic_tag || 'Core Concept',
      explanation: item.explanation
    };
  };

  const getSig = (q) => (q.question_text || '').trim().toLowerCase();

  const searchable = bank.map(q =>
    `${q.question_text} ${q.correct_answer} ${(q.options || []).join(' ')} ${q.explanation || ''}`.toLowerCase()
  );

  const buckets = [];
  for (const sub of (focusSubtopics || [])) {
    const terms = SUBTOPIC_ALIASES[sub] || [sub];
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

  const pickedIndices = [];
  const used = new Set();

  // Round-robin across matched subtopic buckets strictly WITHOUT repeating
  const cursors = new Array(buckets.length).fill(0);
  let progressed = true;
  while (pickedIndices.length < targetCount && progressed) {
    progressed = false;
    for (let b = 0; b < buckets.length && pickedIndices.length < targetCount; b++) {
      while (cursors[b] < buckets[b].length) {
        const candidateIdx = buckets[b][cursors[b]++];
        const sig = getSig(bank[candidateIdx]);
        if (!used.has(candidateIdx) && !usedSignatures.has(sig)) {
          used.add(candidateIdx);
          usedSignatures.add(sig);
          pickedIndices.push(candidateIdx);
          progressed = true;
          break;
        }
      }
    }
  }

  // If still fewer than targetCount, fill remaining unique slots from the bank
  if (pickedIndices.length < targetCount) {
    for (let i = 0; i < bank.length && pickedIndices.length < targetCount; i++) {
      const sig = getSig(bank[i]);
      if (!used.has(i) && !usedSignatures.has(sig)) {
        used.add(i);
        usedSignatures.add(sig);
        pickedIndices.push(i);
      }
    }
  }

  const result = pickedIndices.map(idx => formatItem(bank[idx]));

  // If the bank had fewer than targetCount available unique items,
  // fill the remainder with distinct, non-repeating general topic questions.
  if (result.length < targetCount) {
    const remaining = targetCount - result.length;
    const generalFill = buildGeneralTopicQuestions(safeTopic || 'Computer Science', remaining, cognitiveLayer, usedSignatures);
    result.push(...generalFill);
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

export function generateSmartQuestions({ topic, referenceText, count, difficulty, cognitiveLayer }) {
  const targetCount = Math.max(1, Math.min(50, Number(count) || 4));
  const safeTopic = (topic || 'Computer Science').trim();
  const ref = (referenceText || '').trim();

  const isPlaceholder = ref.startsWith('[Document attached:') || ref.includes('Ready for AI reference parsing') || ref.length < 3;
  const cleanRef = isPlaceholder ? '' : ref;

  const domain = detectAcademicDomain(safeTopic, cleanRef);
  const selectedBank = QUESTION_BANKS[domain] || null;
  const domainDistractors = DOMAIN_DISTRACTORS[domain] || DOMAIN_DISTRACTORS.general;
  const focusSubtopics = extractFocusSubtopics(safeTopic, cleanRef);

  const usedSignatures = new Set();
  const getSig = (q) => (q.question_text || '').trim().toLowerCase();

  // If genuine factual reference notes were extracted/pasted, synthesize from them
  if (cleanRef) {
    const rawSentences = extractCleanStatements(cleanRef);

    if (rawSentences.length >= 1) {
      const questions = [];
      const phrasingTemplates = [
        `Which of the following statements regarding ${safeTopic} is correct?`,
        `In the context of ${safeTopic}, which of the following is TRUE?`,
        `Which of the following accurately describes a core technical property in ${safeTopic}?`,
        `Regarding ${safeTopic}, which statement correctly highlights its key characteristics?`,
        `Which of the following is an established foundational principle in ${safeTopic}?`,
        `When evaluating architectural mechanics in ${safeTopic}, which assertion is valid?`,
        `Which statement accurately represents the runtime behavior of ${safeTopic}?`,
        `In modern systems engineering, what is the primary technical role of ${safeTopic}?`,
        `Which of the following correctly characterizes the operational scope of ${safeTopic}?`,
        `What key principle governs the execution and state management of ${safeTopic}?`,
        `Which of the following statements about ${safeTopic} is supported by technical specifications?`,
        `Under standard implementation guidelines, which statement regarding ${safeTopic} holds true?`,
        `When analyzing system reliability in ${safeTopic}, which fact is verifiable?`,
        `Which of the following represents an accurate definition within ${safeTopic}?`,
        `In comparative analysis of ${safeTopic}, which statement is technically sound?`
      ];

      for (let i = 0; i < Math.min(targetCount, rawSentences.length); i++) {
        const sentence = rawSentences[i];
        const distractors = [];
        for (let k = 0; k < 3; k++) {
          distractors.push(domainDistractors[(i + k) % domainDistractors.length]);
        }

        const options = [sentence, ...distractors].sort(() => 0.5 - Math.random());
        const qText = phrasingTemplates[i % phrasingTemplates.length];
        const sig = qText.toLowerCase().trim();
        usedSignatures.add(sig);

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
          ? selectTopicRelevantBankQuestions(selectedBank, focusSubtopics, remaining, safeTopic, cognitiveLayer, usedSignatures)
          : buildGeneralTopicQuestions(safeTopic, remaining, cognitiveLayer, usedSignatures);
        questions.push(...fill);
      }

      return questions.slice(0, targetCount);
    }
  }

  // Domain bank prioritized strictly by subtopics with strict zero-repetition
  if (!selectedBank) {
    return buildGeneralTopicQuestions(safeTopic, targetCount, cognitiveLayer, usedSignatures);
  }

  return selectTopicRelevantBankQuestions(selectedBank, focusSubtopics, targetCount, safeTopic, cognitiveLayer, usedSignatures);
}
