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


export const initialMockQuizzes = [];

export const initialMockNotes = [];

export const initialMockSubmissions = [];
