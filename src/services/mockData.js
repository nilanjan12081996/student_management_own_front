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

export const initialMockBatches = [
  {
    id: 1,
    organization_id: 1,
    name: 'CS 101 - Core JavaScript',
    subject: 'Computer Science',
    join_code: 'APEX-CS101',
    student_count: 14,
    createdAt: '2026-09-02T10:00:00.000Z'
  },
  {
    id: 2,
    organization_id: 1,
    name: 'Full Stack Web Dev 2026',
    subject: 'Web Development',
    join_code: 'APEX-WEB26',
    student_count: 10,
    createdAt: '2026-09-04T11:30:00.000Z'
  },
  {
    id: 3,
    organization_id: 2,
    name: 'SAT Math & Algebra Prep',
    subject: 'Mathematics',
    join_code: 'ZEN-SAT26',
    student_count: 12,
    createdAt: '2026-09-06T12:00:00.000Z'
  }
];

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
    id: 1,
    organization_id: 1,
    title: 'JavaScript Fundamentals & ES6+',
    month: 'September',
    total_marks: 25,
    createdAt: '2026-09-14T10:00:00.000Z',
    questions: [
      {
        id: 1,
        quiz_id: 1,
        question_text: 'Which keyword declares a block-scoped variable in JavaScript?',
        options: ['var', 'let', 'global', 'define'],
        correct_answer: 'let',
        marks: 5,
        explanation: 'The "let" keyword declares a block-scoped local variable.'
      },
      {
        id: 2,
        quiz_id: 1,
        question_text: 'What is the output of typeof null in JavaScript?',
        options: ['null', 'undefined', 'object', 'number'],
        correct_answer: 'object',
        marks: 5,
        explanation: 'In JavaScript, typeof null returns "object" due to a historical legacy bug.'
      }
    ]
  },
  {
    id: 2,
    organization_id: 1,
    title: 'Node.js & Express REST Architecture',
    month: 'October',
    total_marks: 20,
    createdAt: '2026-09-14T11:00:00.000Z',
    questions: [
      {
        id: 3,
        quiz_id: 2,
        question_text: 'Which HTTP method is typically used to create a new resource in REST?',
        options: ['GET', 'POST', 'PUT', 'PATCH'],
        correct_answer: 'POST',
        marks: 5,
        explanation: 'POST submits data to create a resource.'
      }
    ]
  },
  {
    id: 3,
    organization_id: 2,
    title: 'Algebra II & Quadratic Functions',
    month: 'November',
    total_marks: 30,
    createdAt: '2026-09-14T12:00:00.000Z',
    questions: [
      {
        id: 4,
        quiz_id: 3,
        question_text: 'What is the discriminant formula for quadratic equation ax^2 + bx + c = 0?',
        options: ['b^2 - 4ac', 'b^2 + 4ac', '4ac - b^2', '-b / 2a'],
        correct_answer: 'b^2 - 4ac',
        marks: 10,
        explanation: 'The discriminant is b^2 - 4ac.'
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
