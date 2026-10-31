// Initial B2B multi-tenant datasets matching backend models and seeders

export const initialMockOrganizations = [
  {
    id: 1,
    name: 'Apex Academy & Tutors',
    slug: 'apex-academy',
    owner_name: 'Prof. Arthur Smith',
    email: 'smith@apexacademy.com',
    plan: 'pro',
    status: 'active',
    student_count: 24,
    createdAt: '2026-09-01T09:00:00.000Z'
  },
  {
    id: 2,
    name: 'Zenith STEM Learning',
    slug: 'zenith-stem',
    owner_name: 'Dr. Sarah Connor',
    email: 'sarah@zenithtutors.com',
    plan: 'starter',
    status: 'active',
    student_count: 12,
    createdAt: '2026-09-05T10:30:00.000Z'
  },
  {
    id: 3,
    name: 'Quantum Code Institute',
    slug: 'quantum-code',
    owner_name: 'David Vance',
    email: 'david@quantumcode.edu',
    plan: 'enterprise',
    status: 'active',
    student_count: 85,
    createdAt: '2026-09-10T14:15:00.000Z'
  }
];

export const initialMockBatches = [];

export const initialMockUsers = [
  {
    id: 1,
    name: 'Platform Super Admin',
    email: 'superadmin@eduadmin.com',
    role: 'superadmin',
    organization_id: null,
    class: 'Global Operations',
    semester: 'Staff',
    course: 'SaaS Platform Owner',
    status: 'active',
    tuition_code: 'MASTER-PASS',
    active_device_id: null,
    last_active_at: '2026-09-24T18:00:00.000Z',
    createdAt: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 2,
    name: 'Prof. Arthur Smith',
    email: 'smith@apexacademy.com',
    role: 'admin',
    organization_id: 1,
    class: 'Computer Science Faculty',
    semester: 'Staff',
    course: 'Lead Instructor at Apex Academy',
    status: 'active',
    tuition_code: 'TUTOR-ADMIN-01',
    active_device_id: null,
    last_active_at: '2026-09-24T18:30:00.000Z',
    createdAt: '2026-09-01T09:00:00.000Z'
  },
  {
    id: 3,
    name: 'Dr. Sarah Connor',
    email: 'sarah@zenithtutors.com',
    role: 'admin',
    organization_id: 2,
    class: 'Mathematics Faculty',
    semester: 'Staff',
    course: 'Founder at Zenith STEM',
    status: 'active',
    tuition_code: 'TUTOR-ADMIN-02',
    active_device_id: null,
    last_active_at: '2026-09-24T18:20:00.000Z',
    createdAt: '2026-09-05T10:30:00.000Z'
  },
  {
    id: 4,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'student',
    organization_id: 1,
    batch_id: 1,
    batch_name: 'CS 101 - Core JavaScript',
    class: 'Computer Science',
    semester: 'Semester 1',
    course: 'B.Tech CS (Apex Academy)',
    status: 'active',
    tuition_code: 'TUITION-PASS-2026',
    active_device_id: null,
    last_active_at: '2026-09-24T19:00:00.000Z',
    createdAt: '2026-09-14T11:20:00.000Z'
  },
  {
    id: 5,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'student',
    organization_id: 1,
    batch_id: 2,
    batch_name: 'Full Stack Web Dev 2026',
    class: 'Computer Science',
    semester: 'Semester 2',
    course: 'B.Tech CS (Apex Academy)',
    status: 'active',
    tuition_code: 'CLAIMED-PASS-88',
    active_device_id: null,
    last_active_at: '2026-09-24T17:45:00.000Z',
    createdAt: '2026-09-14T12:15:00.000Z'
  },
  {
    id: 6,
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    role: 'student',
    organization_id: 2,
    batch_id: 3,
    batch_name: 'Advanced SAT Mathematics',
    class: 'Mathematics',
    semester: 'Semester 1',
    course: 'SAT Math (Zenith STEM)',
    status: 'active',
    tuition_code: 'ZEN-SAT-99',
    active_device_id: null,
    last_active_at: '2026-09-24T16:10:00.000Z',
    createdAt: '2026-09-14T13:40:00.000Z'
  }
];

export const initialMockTuitionPasses = [
  {
    id: 1,
    organization_id: 1,
    code: 'TUITION-CS2026-01',
    student_name: 'David Miller',
    student_email: 'david.m@example.com',
    batch_name: 'CS 101 - Core JavaScript',
    is_single_use: true,
    is_redeemed: false,
    redeemed_by: null,
    expires_at: '2026-12-31T23:59:59.000Z',
    createdAt: '2026-09-20T10:00:00.000Z'
  },
  {
    id: 2,
    organization_id: 1,
    code: 'TUITION-PASS-2026',
    student_name: 'Enrolled Tuition Student (Multi-Seat Batch)',
    student_email: null,
    batch_name: 'CS 101 - Core JavaScript',
    is_single_use: false,
    is_redeemed: false,
    redeemed_by: null,
    expires_at: '2026-12-31T23:59:59.000Z',
    createdAt: '2026-09-20T10:00:00.000Z'
  },
  {
    id: 3,
    organization_id: 1,
    code: 'CLAIMED-PASS-88',
    student_name: 'Jane Smith',
    student_email: 'jane.smith@example.com',
    batch_name: 'CS 101 - Core JavaScript',
    is_single_use: true,
    is_redeemed: true,
    redeemed_by: 'jane.smith@example.com',
    expires_at: '2026-12-31T23:59:59.000Z',
    createdAt: '2026-09-14T09:00:00.000Z'
  },
  {
    id: 4,
    organization_id: 2,
    code: 'ZEN-SAT-99',
    student_name: 'Alex Johnson',
    student_email: 'alex.j@example.com',
    batch_name: 'SAT Math & Algebra Prep',
    is_single_use: true,
    is_redeemed: true,
    redeemed_by: 'alex.j@example.com',
    expires_at: '2026-12-31T23:59:59.000Z',
    createdAt: '2026-09-14T10:00:00.000Z'
  }
];


export const initialMockQuizzes = [
  {
    "id": 1,
    "organization_id": 1,
    "title": "JavaScript Fundamentals & ES6+",
    "month": "September",
    "total_marks": 25,
    "createdAt": "2026-09-14T10:00:00.000Z",
    "questions": [
      {
        "id": 1,
        "quiz_id": 1,
        "question_text": "Which keyword declares a block-scoped variable in modern JavaScript?",
        "options": [
          "var",
          "let",
          "global",
          "define"
        ],
        "correct_answer": "let",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "Variables & Scope",
        "explanation": "The \"let\" keyword declares a block-scoped local variable, whereas \"var\" is function-scoped."
      },
      {
        "id": 2,
        "quiz_id": 1,
        "question_text": "What is the evaluated output of typeof null in JavaScript?",
        "options": [
          "null",
          "undefined",
          "object",
          "number"
        ],
        "correct_answer": "object",
        "marks": 5,
        "cognitive_layer": "Edge Cases & Trap Detection",
        "topic_tag": "Type System & Coercion",
        "explanation": "In JavaScript, typeof null returns \"object\" due to a legacy design quirk from the original 1995 JS engine."
      },
      {
        "id": 5,
        "quiz_id": 1,
        "question_text": "What is the priority order between microtask queue (Promise.then) and macrotask queue (setTimeout)?",
        "options": [
          "Microtasks drain entirely before the next macrotask is processed",
          "Macrotasks execute first because they interface with system clock",
          "They execute simultaneously on parallel web worker threads",
          "The browser executes whichever task was created first chronologically"
        ],
        "correct_answer": "Microtasks drain entirely before the next macrotask is processed",
        "marks": 5,
        "cognitive_layer": "Execution Dynamics & Flow",
        "topic_tag": "Event Loop & Promises",
        "explanation": "Microtasks (Promises, queueMicrotask) have strict priority and are emptied before the event loop advances to the next macrotask."
      },
      {
        "id": 101,
        "quiz_id": 1,
        "question_text": "What does the spread operator (...) do when applied to an object like {...obj}?",
        "options": [
          "Creates a shallow clone of the enumerable properties",
          "Creates a deep recursive clone of all nested objects",
          "Freezes the object preventing any mutations",
          "Deletes all prototype chains and functions"
        ],
        "correct_answer": "Creates a shallow clone of the enumerable properties",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "Object Spread & Immutability",
        "explanation": "Spread performs a shallow copy of properties. Nested object references remain shared."
      },
      {
        "id": 125,
        "quiz_id": 1,
        "question_text": "What is a Closure in JavaScript and how does it manage memory?",
        "options": [
          "A function retaining access to variables in its outer lexical scope even after that outer function returns",
          "A method that immediately frees unused heap objects from RAM",
          "A loop construct that automatically closes when an array runs out of elements",
          "A browser security feature prohibiting cross-origin requests"
        ],
        "correct_answer": "A function retaining access to variables in its outer lexical scope even after that outer function returns",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "Closures & Lexical Scope",
        "explanation": "A closure is formed whenever an inner function retains references to its outer enclosing scope variables."
      }
    ]
  },
  {
    "id": 2,
    "organization_id": 1,
    "title": "Node.js & Express REST Architecture",
    "month": "October",
    "total_marks": 25,
    "createdAt": "2026-09-14T11:00:00.000Z",
    "questions": [
      {
        "id": 3,
        "quiz_id": 2,
        "question_text": "Which HTTP method is idempotent and used to replace an entire resource representation?",
        "options": [
          "POST",
          "PUT",
          "PATCH",
          "CONNECT"
        ],
        "correct_answer": "PUT",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "REST Principles & HTTP Verbs",
        "explanation": "PUT is idempotent and replaces the target resource entirely. PATCH is used for partial updates."
      },
      {
        "id": 6,
        "quiz_id": 2,
        "question_text": "In Express middleware pipelines, what must you invoke to pass control to the subsequent handler?",
        "options": [
          "next()",
          "continue()",
          "res.forward()",
          "return process.step()"
        ],
        "correct_answer": "next()",
        "marks": 5,
        "cognitive_layer": "Execution Dynamics & Flow",
        "topic_tag": "Middleware Chaining",
        "explanation": "Calling next() hands execution over to the subsequent middleware function in the request pipeline."
      },
      {
        "id": 7,
        "quiz_id": 2,
        "question_text": "What is the standard HTTP status code returned when a client attempts to access a protected resource without valid credentials?",
        "options": [
          "401 Unauthorized",
          "403 Forbidden",
          "400 Bad Request",
          "404 Not Found"
        ],
        "correct_answer": "401 Unauthorized",
        "marks": 5,
        "cognitive_layer": "Diagnostic Debugging & Tracing",
        "topic_tag": "Authentication & Status Codes",
        "explanation": "401 indicates authentication credentials are required or missing. 403 indicates authentication succeeded but authorization was denied."
      },
      {
        "id": 102,
        "quiz_id": 2,
        "question_text": "How does Node.js achieve non-blocking asynchronous I/O with single-threaded JavaScript?",
        "options": [
          "Using the libuv event loop and thread pool for system calls",
          "By creating a new OS thread for each HTTP incoming request",
          "By running an interpreter instance on every CPU core automatically",
          "By converting all asynchronous code into synchronous bytecode"
        ],
        "correct_answer": "Using the libuv event loop and thread pool for system calls",
        "marks": 5,
        "cognitive_layer": "Execution Dynamics & Flow",
        "topic_tag": "Node Architecture & libuv",
        "explanation": "Node.js delegates file system, DNS, and network tasks to libuv which handles them asynchronously via kernel mechanisms or worker threads."
      },
      {
        "id": 126,
        "quiz_id": 2,
        "question_text": "Which middleware is required in Express 4.16+ to parse incoming JSON request payloads?",
        "options": [
          "express.json()",
          "express.bodyParser()",
          "express.parsePayload()",
          "express.requestParser()"
        ],
        "correct_answer": "express.json()",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "Express Body Parsing",
        "explanation": "express.json() is built into modern Express to parse incoming requests with JSON bodies."
      }
    ]
  },
  {
    "id": 3,
    "organization_id": 2,
    "title": "Algebra II & Quadratic Functions",
    "month": "November",
    "total_marks": 25,
    "createdAt": "2026-09-14T12:00:00.000Z",
    "questions": [
      {
        "id": 4,
        "quiz_id": 3,
        "question_text": "What is the discriminant formula for the quadratic equation ax^2 + bx + c = 0?",
        "options": [
          "b^2 - 4ac",
          "b^2 + 4ac",
          "4ac - b^2",
          "-b / 2a"
        ],
        "correct_answer": "b^2 - 4ac",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "Quadratic Discriminant",
        "explanation": "The discriminant is D = b^2 - 4ac. When D > 0 there are two real roots, when D = 0 there is one, and when D < 0 there are complex roots."
      },
      {
        "id": 8,
        "quiz_id": 3,
        "question_text": "If the discriminant of a quadratic equation is negative (D < 0), what is the nature of its roots?",
        "options": [
          "Two complex conjugate roots with non-zero imaginary parts",
          "Two distinct real irrational roots",
          "One single repeated real root",
          "The equation has no mathematical solution in any number system"
        ],
        "correct_answer": "Two complex conjugate roots with non-zero imaginary parts",
        "marks": 5,
        "cognitive_layer": "Execution Dynamics & Flow",
        "topic_tag": "Complex Roots & Graphs",
        "explanation": "When b^2 - 4ac < 0, the square root yields an imaginary value, resulting in a pair of complex conjugate solutions."
      },
      {
        "id": 103,
        "quiz_id": 3,
        "question_text": "What are the coordinates of the vertex for a parabola defined by y = ax^2 + bx + c?",
        "options": [
          "x = -b / (2a), y = f(-b / 2a)",
          "x = b / (2a), y = -c",
          "x = -b / a, y = c / a",
          "x = 2a / b, y = b^2 - 4ac"
        ],
        "correct_answer": "x = -b / (2a), y = f(-b / 2a)",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "Parabola Vertices & Extremum",
        "explanation": "The axis of symmetry is x = -b / (2a). Evaluating the quadratic function at that x value gives the vertex coordinate."
      },
      {
        "id": 104,
        "quiz_id": 3,
        "question_text": "If the vertex of a parabola opens upwards (a > 0) and its vertex y-value is positive, how many real x-intercepts exist?",
        "options": [
          "0 real x-intercepts",
          "1 real x-intercept",
          "2 real x-intercepts",
          "Infinitely many x-intercepts"
        ],
        "correct_answer": "0 real x-intercepts",
        "marks": 5,
        "cognitive_layer": "Diagnostic Debugging & Tracing",
        "topic_tag": "Quadratic Graphs & Intercepts",
        "explanation": "Since the parabola opens upwards and its minimum value lies above the x-axis (y > 0), it never intersects the x-axis."
      },
      {
        "id": 127,
        "quiz_id": 3,
        "question_text": "What are the solutions to the equation x^2 - 6x + 9 = 0?",
        "options": [
          "x = 3 (multiplicity 2)",
          "x = 3 and x = -3",
          "x = 0 and x = 6",
          "x = 9 and x = 1"
        ],
        "correct_answer": "x = 3 (multiplicity 2)",
        "marks": 5,
        "cognitive_layer": "Execution Dynamics & Flow",
        "topic_tag": "Perfect Square Trinomials",
        "explanation": "(x - 3)^2 = 0 yields one repeated root at x = 3."
      }
    ]
  },
  {
    "id": 4,
    "organization_id": 1,
    "title": "Python Programming & Data Structures",
    "month": "October",
    "total_marks": 25,
    "createdAt": "2026-09-18T09:00:00.000Z",
    "questions": [
      {
        "id": 105,
        "quiz_id": 4,
        "question_text": "Which of the following built-in Python data structures is mutable?",
        "options": [
          "list",
          "tuple",
          "frozenset",
          "str"
        ],
        "correct_answer": "list",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "Mutability & Built-in Collections",
        "explanation": "Lists in Python are mutable sequences, whereas tuples, strings, and frozensets cannot be altered after creation."
      },
      {
        "id": 106,
        "quiz_id": 4,
        "question_text": "What will dict.get(key, default) return if the key is not found in the dictionary?",
        "options": [
          "The provided default value without throwing KeyError",
          "Raises a KeyError exception",
          "None and inserts the key with None into the dict",
          "False"
        ],
        "correct_answer": "The provided default value without throwing KeyError",
        "marks": 5,
        "cognitive_layer": "Edge Cases & Trap Detection",
        "topic_tag": "Dictionary Operations & Safe Lookup",
        "explanation": ".get() safely retrieves a value for a key, returning the specified default (or None) without raising KeyError."
      },
      {
        "id": 107,
        "quiz_id": 4,
        "question_text": "What is the result of the list comprehension: [x**2 for x in range(5) if x % 2 == 0]?",
        "options": [
          "[0, 4, 16]",
          "[1, 9]",
          "[0, 1, 4, 9, 16]",
          "[4, 16]"
        ],
        "correct_answer": "[0, 4, 16]",
        "marks": 5,
        "cognitive_layer": "Execution Dynamics & Flow",
        "topic_tag": "List Comprehensions & Filtering",
        "explanation": "range(5) gives 0, 1, 2, 3, 4. Even numbers are 0, 2, 4. Their squares are 0, 4, 16."
      },
      {
        "id": 108,
        "quiz_id": 4,
        "question_text": "In Python, what is the primary purpose of the __init__ method in a class definition?",
        "options": [
          "Initializer method to set initial attributes on a newly created instance",
          "Constructor that allocates memory for the instance from the OS",
          "Destructor called when garbage collection removes the instance",
          "Static decorator method to declare class variables"
        ],
        "correct_answer": "Initializer method to set initial attributes on a newly created instance",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "Python OOP & Magic Methods",
        "explanation": "__init__ is the initializer called after __new__ creates the instance to configure object state."
      },
      {
        "id": 128,
        "quiz_id": 4,
        "question_text": "What does a Python decorator (@decorator_name) do to a target function?",
        "options": [
          "Takes the function as an argument and returns a modified wrapper function",
          "Translates the function into C language extensions at compile time",
          "Restricts the function to run only on a single worker process",
          "Deletes all docstrings inside the function body"
        ],
        "correct_answer": "Takes the function as an argument and returns a modified wrapper function",
        "marks": 5,
        "cognitive_layer": "Execution Dynamics & Flow",
        "topic_tag": "Python Decorators & Higher-Order Functions",
        "explanation": "Decorators wrap a function, modifying its behavior or injecting cross-cutting logic dynamically."
      }
    ]
  },
  {
    "id": 5,
    "organization_id": 1,
    "title": "Relational Databases & SQL Queries",
    "month": "September",
    "total_marks": 25,
    "createdAt": "2026-09-20T10:00:00.000Z",
    "questions": [
      {
        "id": 109,
        "quiz_id": 5,
        "question_text": "Which SQL clause is used to filter group summary rows after an aggregate function (e.g., GROUP BY)?",
        "options": [
          "HAVING",
          "WHERE",
          "ORDER BY",
          "LIMIT"
        ],
        "correct_answer": "HAVING",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "SQL Aggregations & Grouping",
        "explanation": "WHERE filters rows before aggregation; HAVING filters aggregated groups."
      },
      {
        "id": 110,
        "quiz_id": 5,
        "question_text": "In relational database normalization, what defines Second Normal Form (2NF)?",
        "options": [
          "1NF + No partial functional dependency of any non-prime attribute on a composite candidate key",
          "Eliminating all multi-valued attributes and ensuring scalar columns",
          "Eliminating all transitive dependencies between non-key attributes",
          "Eliminating all duplicate rows using auto-increment primary keys"
        ],
        "correct_answer": "1NF + No partial functional dependency of any non-prime attribute on a composite candidate key",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "Database Normalization (1NF - 3NF)",
        "explanation": "2NF requires 1NF compliance and that all non-key attributes are fully functionally dependent on the primary key."
      },
      {
        "id": 111,
        "quiz_id": 5,
        "question_text": "What will a LEFT OUTER JOIN return if there is no matching row on the right-hand table?",
        "options": [
          "All columns from the right-hand table will contain NULL values",
          "The row from the left table is omitted completely from the result",
          "A SQL foreign key runtime violation error is thrown",
          "An empty string is substituted for integer columns"
        ],
        "correct_answer": "All columns from the right-hand table will contain NULL values",
        "marks": 5,
        "cognitive_layer": "Execution Dynamics & Flow",
        "topic_tag": "SQL Joins & Null Handling",
        "explanation": "LEFT JOIN keeps every row from the left table; unmatched columns from the right table are padded with NULL."
      },
      {
        "id": 112,
        "quiz_id": 5,
        "question_text": "What does the \"A\" in ACID database transactions stand for and guarantee?",
        "options": [
          "Atomicity: All operations in a transaction either complete entirely or are fully rolled back",
          "Asynchrony: Operations can run on background worker threads without locks",
          "Availability: The database cluster remains accessible during network partitioning",
          "Authentication: Cryptographic validation of every SQL transaction caller"
        ],
        "correct_answer": "Atomicity: All operations in a transaction either complete entirely or are fully rolled back",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "ACID Transaction Principles",
        "explanation": "Atomicity ensures that all database modifications within a single transaction succeed together or fail together without partial state changes."
      },
      {
        "id": 129,
        "quiz_id": 5,
        "question_text": "What is the primary benefit of adding a B-Tree Index on a frequently queried SQL column?",
        "options": [
          "Reduces query search complexity from O(N) full-table scan to O(log N)",
          "Compresses the table size on disk by removing duplicated rows",
          "Prevents SQL injection attacks automatically",
          "Guarantees all values in the column become strictly uppercase"
        ],
        "correct_answer": "Reduces query search complexity from O(N) full-table scan to O(log N)",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "Database Indexing & Performance",
        "explanation": "Indexes create balanced tree pointer maps to locate matching rows in logarithmic time."
      }
    ]
  },
  {
    "id": 6,
    "organization_id": 1,
    "title": "React & Modern Frontend Engineering",
    "month": "October",
    "total_marks": 25,
    "createdAt": "2026-09-22T11:00:00.000Z",
    "questions": [
      {
        "id": 113,
        "quiz_id": 6,
        "question_text": "Why should you never mutate state directly in React (e.g., state.count = 5)?",
        "options": [
          "React relies on shallow object reference equality checks to schedule re-renders",
          "Direct mutation causes browser JavaScript engines to throw fatal memory leaks",
          "The state variable becomes read-only and deletes its prototype methods",
          "Direct mutations bypass CSS stylesheet recalculations"
        ],
        "correct_answer": "React relies on shallow object reference equality checks to schedule re-renders",
        "marks": 5,
        "cognitive_layer": "Execution Dynamics & Flow",
        "topic_tag": "React State Immutability & Re-renders",
        "explanation": "React compares previous and new state by reference. Mutating in-place retains the same reference, preventing re-renders."
      },
      {
        "id": 114,
        "quiz_id": 6,
        "question_text": "When does the cleanup function returned by useEffect() execute?",
        "options": [
          "Before the effect runs again on dependency change and when the component unmounts",
          "Only once when the browser window closes",
          "Immediately synchronously after the return statement in render()",
          "Every time the parent component receives new props"
        ],
        "correct_answer": "Before the effect runs again on dependency change and when the component unmounts",
        "marks": 5,
        "cognitive_layer": "Execution Dynamics & Flow",
        "topic_tag": "React useEffect Lifecycle & Cleanup",
        "explanation": "React invokes the cleanup function before executing the next effect iteration and right before component unmounting."
      },
      {
        "id": 115,
        "quiz_id": 6,
        "question_text": "What primary problem does the useMemo() hook solve in React applications?",
        "options": [
          "Caches the result of an expensive calculation between re-renders based on dependencies",
          "Stores authentication tokens in browser localStorage automatically",
          "Prevents children components from mounting until an API request finishes",
          "Compresses component JSX into binary format"
        ],
        "correct_answer": "Caches the result of an expensive calculation between re-renders based on dependencies",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "Performance Optimization & Memoization",
        "explanation": "useMemo memoizes computational results so expensive algorithms only re-run when specified dependencies change."
      },
      {
        "id": 116,
        "quiz_id": 6,
        "question_text": "What is the purpose of the \"key\" prop when rendering dynamic lists in React?",
        "options": [
          "Enables React Virtual DOM diffing algorithm to identify which items have changed, added, or removed",
          "Encrypts list items for secure client-side storage",
          "Specifies the CSS grid index for layout ordering",
          "Binds the item directly to the Redux global store"
        ],
        "correct_answer": "Enables React Virtual DOM diffing algorithm to identify which items have changed, added, or removed",
        "marks": 5,
        "cognitive_layer": "Diagnostic Debugging & Tracing",
        "topic_tag": "Virtual DOM Diffing & Keys",
        "explanation": "Keys give list items stable identity across renders, preventing unwanted DOM recreation and state loss in children."
      },
      {
        "id": 130,
        "quiz_id": 6,
        "question_text": "What is the recommended approach to share state across non-parent/child components in React?",
        "options": [
          "Using Context API or Redux global state stores",
          "Attaching values directly to the window global object",
          "Using setInterval polling to inspect DOM values",
          "Writing and reading synchronous cookies on every click"
        ],
        "correct_answer": "Using Context API or Redux global state stores",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "React State Management Architecture",
        "explanation": "Context API and Redux provide predictable, unidirectional state dispatch across decoupled component trees."
      }
    ]
  },
  {
    "id": 7,
    "organization_id": 1,
    "title": "Object-Oriented Programming (OOP) in Java",
    "month": "November",
    "total_marks": 25,
    "createdAt": "2026-09-25T14:00:00.000Z",
    "questions": [
      {
        "id": 117,
        "quiz_id": 7,
        "question_text": "In Java, can an interface contain implemented methods with code bodies?",
        "options": [
          "Yes, using the default or static keyword (introduced in Java 8)",
          "No, interfaces can strictly declare method signatures without bodies",
          "Only if the class extending it is marked final",
          "Yes, but only private native methods are allowed"
        ],
        "correct_answer": "Yes, using the default or static keyword (introduced in Java 8)",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "Java Interfaces & Default Methods",
        "explanation": "Java 8 introduced default and static methods in interfaces to enable backwards-compatible API evolution."
      },
      {
        "id": 118,
        "quiz_id": 7,
        "question_text": "What is the key difference between Method Overloading and Method Overriding in Java?",
        "options": [
          "Overloading occurs within the same class with different parameters (compile-time); Overriding redefines a superclass method in a subclass (runtime)",
          "Overloading is only permitted on private methods; Overriding is only for public static methods",
          "Overloading requires the @Override annotation; Overriding does not",
          "Overriding happens at compile-time while overloading happens at runtime"
        ],
        "correct_answer": "Overloading occurs within the same class with different parameters (compile-time); Overriding redefines a superclass method in a subclass (runtime)",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "Polymorphism: Static vs Dynamic",
        "explanation": "Overloading is compile-time (different signatures in same class). Overriding is dynamic polymorphism (subclass overrides parent method)."
      },
      {
        "id": 119,
        "quiz_id": 7,
        "question_text": "What happens when an unhandled Checked Exception is thrown by a method in Java?",
        "options": [
          "The code fails compilation unless declared in a throws clause or handled in a try-catch block",
          "The JVM automatically swallows the exception and continues to the next statement",
          "It is converted into a RuntimeException at runtime automatically",
          "The thread sleeps for 1000 milliseconds then retries"
        ],
        "correct_answer": "The code fails compilation unless declared in a throws clause or handled in a try-catch block",
        "marks": 5,
        "cognitive_layer": "Diagnostic Debugging & Tracing",
        "topic_tag": "Java Exception Handling & Checked Types",
        "explanation": "Checked exceptions (extending Exception but not RuntimeException) are verified at compile time and must be handled or declared."
      },
      {
        "id": 120,
        "quiz_id": 7,
        "question_text": "Where are Java static class variables stored in memory across modern JVMs?",
        "options": [
          "In the Metaspace (method area) associated with the class definition",
          "On the individual execution call stack of every active thread",
          "Directly inside the CPU L1 cache registers",
          "In thread-local storage deleted after main() terminates"
        ],
        "correct_answer": "In the Metaspace (method area) associated with the class definition",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "JVM Memory Architecture & Static State",
        "explanation": "Static variables belong to the Class itself rather than any individual instance and are allocated in the JVM class metadata memory."
      },
      {
        "id": 131,
        "quiz_id": 7,
        "question_text": "What is the purpose of the final keyword when applied to a Java class definition?",
        "options": [
          "Prevents other classes from extending or inheriting from this class",
          "Makes all variables in the class static and immutable",
          "Allocates the entire class in GPU memory",
          "Forces all methods to return primitive values"
        ],
        "correct_answer": "Prevents other classes from extending or inheriting from this class",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "Java Class Inheritance & Final Modifier",
        "explanation": "Marking a class final prevents inheritance, ensuring its behavior cannot be sub-classed or altered."
      }
    ]
  },
  {
    "id": 8,
    "organization_id": 1,
    "title": "Data Structures & Algorithms Basics",
    "month": "December",
    "total_marks": 25,
    "createdAt": "2026-09-28T09:30:00.000Z",
    "questions": [
      {
        "id": 121,
        "quiz_id": 8,
        "question_text": "What is the worst-case time complexity of searching for an element in an unsorted array of size N?",
        "options": [
          "O(N)",
          "O(1)",
          "O(log N)",
          "O(N log N)"
        ],
        "correct_answer": "O(N)",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "Linear Search & Time Complexity",
        "explanation": "In an unsorted array, linear search must examine every element in the worst case (element at end or not present)."
      },
      {
        "id": 122,
        "quiz_id": 8,
        "question_text": "Which data structure follows the First-In, First-Out (FIFO) principle?",
        "options": [
          "Queue",
          "Stack",
          "Binary Search Tree",
          "Heap"
        ],
        "correct_answer": "Queue",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "Queues & Buffer Dynamics",
        "explanation": "A Queue enforces FIFO (first element inserted is the first element dequeued)."
      },
      {
        "id": 123,
        "quiz_id": 8,
        "question_text": "What is the average time complexity for key insertion and retrieval in a well-distributed Hash Table?",
        "options": [
          "O(1)",
          "O(log N)",
          "O(N)",
          "O(N^2)"
        ],
        "correct_answer": "O(1)",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "Hash Tables & Hashing Functions",
        "explanation": "With a uniform hash distribution and dynamic resizing, hash table lookup and insertion average O(1) constant time."
      },
      {
        "id": 124,
        "quiz_id": 8,
        "question_text": "What is a major advantage of a Singly Linked List over a fixed-size Array?",
        "options": [
          "Constant time O(1) insertion and deletion at the head without shifting subsequent elements",
          "Instant O(1) random access by index",
          "Lower cache locality and zero memory overhead for pointers",
          "Automatic sorting of elements as they are appended"
        ],
        "correct_answer": "Constant time O(1) insertion and deletion at the head without shifting subsequent elements",
        "marks": 5,
        "cognitive_layer": "Execution Dynamics & Flow",
        "topic_tag": "Linked Lists vs Arrays",
        "explanation": "Inserting at the head of a linked list only requires updating pointer references (O(1)), whereas an array must shift elements (O(N))."
      },
      {
        "id": 132,
        "quiz_id": 8,
        "question_text": "Which search algorithm requires the input collection to be sorted beforehand?",
        "options": [
          "Binary Search",
          "Linear Search",
          "Breadth-First Search",
          "Depth-First Search"
        ],
        "correct_answer": "Binary Search",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "Binary Search Requirements",
        "explanation": "Binary Search halves the search space at each step, requiring monotonic ordered data."
      }
    ]
  },
  {
    "id": 9,
    "organization_id": 1,
    "title": "Student Progress Diagnostic Assessment",
    "month": "October",
    "total_marks": 50,
    "createdAt": "2026-10-29T10:00:00.000Z",
    "questions": [
      {
        "id": 201,
        "quiz_id": 9,
        "question_text": "Which JavaScript operator provides a safe way to access deeply nested object properties without throwing TypeError if an intermediate reference is null or undefined?",
        "options": [
          "Optional chaining (?.)",
          "Nullish coalescing (??)",
          "Spread operator (...)",
          "Logical OR (||)"
        ],
        "correct_answer": "Optional chaining (?.)",
        "marks": 5,
        "cognitive_layer": "Edge Cases & Trap Detection",
        "topic_tag": "JavaScript Syntax & Defensive Access",
        "explanation": "Optional chaining (?.) short-circuits to undefined if the reference before ?. is null or undefined."
      },
      {
        "id": 202,
        "quiz_id": 9,
        "question_text": "In Python, what is the key difference between \"==\" and \"is\"?",
        "options": [
          "\"==\" checks value equality; \"is\" checks object identity in memory",
          "\"==\" is for numbers; \"is\" is for strings",
          "\"is\" converts types automatically; \"==\" does not",
          "They are identical and interchangeable synonyms in Python 3"
        ],
        "correct_answer": "\"==\" checks value equality; \"is\" checks object identity in memory",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "Python Memory & Identity",
        "explanation": "== compares the values using __eq__, whereas \"is\" checks if both references point to the same id() memory address."
      },
      {
        "id": 203,
        "quiz_id": 9,
        "question_text": "Which normal form is violated if a non-key attribute depends on another non-key attribute (Transitive Dependency)?",
        "options": [
          "Third Normal Form (3NF)",
          "First Normal Form (1NF)",
          "Second Normal Form (2NF)",
          "Boyce-Codd Normal Form (BCNF)"
        ],
        "correct_answer": "Third Normal Form (3NF)",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "Database Normalization (3NF)",
        "explanation": "3NF requires being in 2NF and eliminating all transitive functional dependencies among non-prime attributes."
      },
      {
        "id": 204,
        "quiz_id": 9,
        "question_text": "What will happen if you call a React state setter with the exact same primitive value as current state (e.g. setCount(5) when count is 5)?",
        "options": [
          "React bails out of re-rendering the component and its children",
          "React throws an infinite loop warning in the console",
          "The component unmounts and remounts immediately",
          "The component state resets to the initial useState default"
        ],
        "correct_answer": "React bails out of re-rendering the component and its children",
        "marks": 5,
        "cognitive_layer": "Execution Dynamics & Flow",
        "topic_tag": "React Reconciliation & Bailouts",
        "explanation": "Using Object.is equality, React detects identical values and bails out without re-rendering children."
      },
      {
        "id": 205,
        "quiz_id": 9,
        "question_text": "In Java, what happens if a class does not explicitly define a constructor?",
        "options": [
          "The compiler provides a default no-argument public constructor",
          "The class cannot be instantiated under any circumstances",
          "A compilation error occurs at runtime",
          "The class becomes an abstract interface"
        ],
        "correct_answer": "The compiler provides a default no-argument public constructor",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "Java Constructors & Object Creation",
        "explanation": "Java automatically synthesizes a default parameterless constructor if no other constructor is defined."
      },
      {
        "id": 206,
        "quiz_id": 9,
        "question_text": "What is the average time complexity of finding an item in a balanced Binary Search Tree (AVL or Red-Black Tree)?",
        "options": [
          "O(log N)",
          "O(1)",
          "O(N)",
          "O(N log N)"
        ],
        "correct_answer": "O(log N)",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "Tree Search Complexity",
        "explanation": "Balanced BSTs maintain a height of O(log N), guaranteeing logarithmic search time."
      },
      {
        "id": 207,
        "quiz_id": 9,
        "question_text": "Which HTTP response code signifies that the server successfully fulfilled the request and returned the resource representation?",
        "options": [
          "200 OK",
          "201 Created",
          "204 No Content",
          "304 Not Modified"
        ],
        "correct_answer": "200 OK",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "HTTP Status Codes",
        "explanation": "200 OK is the standard response for successful HTTP GET requests."
      },
      {
        "id": 208,
        "quiz_id": 9,
        "question_text": "In asynchronous JavaScript, what state is a Promise in while an async operation is still executing?",
        "options": [
          "Pending",
          "Fulfilled",
          "Rejected",
          "Settled"
        ],
        "correct_answer": "Pending",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "JavaScript Promises & Lifecycle",
        "explanation": "A Promise starts in \"pending\" before transitioning once to either \"fulfilled\" or \"rejected\"."
      },
      {
        "id": 209,
        "quiz_id": 9,
        "question_text": "What Git command is used to record staged snapshots permanently into the repository history?",
        "options": [
          "git commit -m \"message\"",
          "git push origin main",
          "git add -A",
          "git checkout -b new-branch"
        ],
        "correct_answer": "git commit -m \"message\"",
        "marks": 5,
        "cognitive_layer": "Concept Foundation & Syntax",
        "topic_tag": "Git Version Control",
        "explanation": "git commit creates a new commit snapshot from changes staged in the index."
      },
      {
        "id": 210,
        "quiz_id": 9,
        "question_text": "Why should passwords never be stored in plain text or with reversible two-way encryption?",
        "options": [
          "Because if the database is breached, passwords can be read directly; secure systems use salted cryptographic hashes (e.g. bcrypt)",
          "Because reversible encryption increases SQL database disk usage by 1000%",
          "Because plain text passwords cause browser cookies to fail validation",
          "Because SQL foreign key constraints disallow plain string formats"
        ],
        "correct_answer": "Because if the database is breached, passwords can be read directly; secure systems use salted cryptographic hashes (e.g. bcrypt)",
        "marks": 5,
        "cognitive_layer": "Diagnostic Debugging & Tracing",
        "topic_tag": "Web Security & Password Hashing",
        "explanation": "One-way salted cryptographic hashing (like bcrypt) ensures passwords cannot be reversed even if the database is leaked."
      }
    ]
  }
];

export const initialMockNotes = [
  {
    id: 1,
    organization_id: 1,
    batch_id: 1,
    batch_name: 'CS 101 - Core JavaScript',
    title: 'Object-Oriented Programming Principles & ES6+',
    topic: 'Core Computer Science',
    class: 'Computer Science',
    semester: 'Semester 1',
    content_type: 'pdf',
    content_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    createdAt: '2026-09-14T09:30:00.000Z'
  },
  {
    id: 2,
    organization_id: 1,
    batch_id: 2,
    batch_name: 'Full Stack Web Dev 2026',
    title: 'React Architecture & State Management Deep Dive',
    topic: 'Web Development',
    class: 'Computer Science',
    semester: 'Semester 2',
    content_type: 'text',
    content_url: 'Comprehensive guide to React 18 hooks, context API, and server components performance patterns.',
    createdAt: '2026-09-14T10:45:00.000Z'
  },
  {
    id: 3,
    organization_id: 1,
    batch_id: 2,
    batch_name: 'Full Stack Web Dev 2026',
    title: 'Node.js & Express RESTful API Design Patterns',
    topic: 'Backend Engineering',
    class: 'Computer Science',
    semester: 'Semester 2',
    content_type: 'text',
    content_url: 'Architectural overview of middleware chaining, JWT authentication, and structured error handlers.',
    createdAt: '2026-09-15T11:00:00.000Z'
  },
  {
    id: 4,
    organization_id: 2,
    batch_id: 3,
    batch_name: 'Advanced SAT Mathematics',
    title: 'Polynomial Equations & Graph Factoring',
    topic: 'Advanced Mathematics',
    class: 'Mathematics',
    semester: 'Semester 1',
    content_type: 'text',
    content_url: 'Factoring polynomials using synthetic division and the Rational Root Theorem.',
    createdAt: '2026-09-14T14:10:00.000Z'
  }
];

export const initialMockSubmissions = [
  {
    id: 1,
    organization_id: 1,
    quiz_id: 1,
    user_id: 4,
    student_name: 'John Doe',
    quiz_title: 'JavaScript Fundamentals & ES6+',
    score: 10,
    total_marks: 10,
    answers_json: JSON.stringify({ 1: 'let', 2: 'object' }),
    feedback: 'Great job John! Perfect score on block scoping and typeof operators.',
    graded_at: '2026-09-15T14:00:00.000Z',
    createdAt: '2026-09-15T13:45:00.000Z'
  },
  {
    id: 2,
    organization_id: 1,
    quiz_id: 1,
    user_id: 5,
    student_name: 'Jane Smith',
    quiz_title: 'JavaScript Fundamentals & ES6+',
    score: 5,
    total_marks: 10,
    answers_json: JSON.stringify({ 1: 'let', 2: 'null' }),
    feedback: 'Remember: typeof null is a legacy quirk returning "object", not "null".',
    graded_at: '2026-09-16T10:30:00.000Z',
    createdAt: '2026-09-16T10:15:00.000Z'
  }
];
