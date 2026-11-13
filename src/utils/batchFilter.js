export const normalizeStr = (s) => (s || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');

const splitBatchTokens = (str) => {
  if (!str) return [];
  return str
    .split(/[,;/|]/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
};

export const isQuizPublished = (quiz) => {
  if (!quiz) return false;
  if (quiz.is_published === true || quiz.is_published === 1) return true;
  if (quiz.is_published === false || quiz.is_published === 0) return false;
  // Fallback for legacy database records
  const bName = (quiz.batch_name || '').toLowerCase().trim();
  if (bName.includes('draft') || bName.includes('unpublished')) return false;
  if (quiz.batch_ids && String(quiz.batch_ids).trim() !== '') return true;
  if (quiz.batch_name && quiz.batch_name !== 'All Batches' && quiz.batch_name.trim() !== '') return true;
  if (quiz.batch_id && quiz.batch_id !== 'all') return true;
  return false;
};

export const filterAccessibleNotes = (notes, user, batches = []) => {
  if (!Array.isArray(notes)) return [];
  const role = user?.role?.toLowerCase();
  const isAdmin = role === 'admin' || role === 'superadmin' || role === 'tutor' || role === 'teacher';
  if (isAdmin) return notes;

  const rawBatches = Array.isArray(batches) ? batches : [];

  const studentBatch = rawBatches.find(
    (b) =>
      (user?.class && b.name?.trim().toLowerCase() === user.class.trim().toLowerCase()) ||
      (user?.batch_name && b.name?.trim().toLowerCase() === user.batch_name.trim().toLowerCase()) ||
      (user?.tuition_code && b.join_code?.trim().toUpperCase() === user.tuition_code.trim().toUpperCase()) ||
      (user?.batch_id && String(b.id) === String(user.batch_id))
  );

  const sBatchName = (studentBatch?.name || user?.batch_name || user?.class || '').trim().toLowerCase();
  const sBatchId = studentBatch?.id ? String(studentBatch.id) : (user?.batch_id ? String(user.batch_id) : '');
  const sBatchCode = (studentBatch?.join_code || user?.tuition_code || '').trim().toUpperCase();

  return notes.filter((n) => {
    const nBatchName = (n.batch_name || '').trim().toLowerCase();
    const nBatchId = n.batch_id ? String(n.batch_id) : '';
    const nClass = (n.class || '').trim().toLowerCase();

    // Global / Open to all batches
    const isAllBatches =
      (!n.batch_id && !n.batch_name && !n.class && !n.batch_ids) ||
      n.batch_id === 'all' ||
      nBatchName === 'all batches' ||
      nBatchName === 'all' ||
      nClass === 'all classes' ||
      nClass === 'general';

    if (isAllBatches) return true;

    // Student without any batch assigned only sees open / global notes
    if (!sBatchName && !sBatchId && !sBatchCode) return false;

    // Check multiple assigned batch names or IDs
    const nBatchNames = splitBatchTokens(n.batch_name);
    if (nBatchNames.includes('all batches') || nBatchNames.includes('all')) return true;

    const nClasses = splitBatchTokens(n.class);
    const nBatchIds = [
      nBatchId,
      ...(typeof n.batch_ids === 'string' ? n.batch_ids.split(/[,;]/).map((s) => s.trim()) : (Array.isArray(n.batch_ids) ? n.batch_ids.map(String) : []))
    ].filter(Boolean);

    // 1. Match by Batch ID
    const idMatches = sBatchId && nBatchIds.includes(sBatchId);

    // 2. Match by Batch Name or Class
    const nameMatches =
      sBatchName &&
      (nBatchNames.some((nb) => nb === sBatchName || normalizeStr(nb) === normalizeStr(sBatchName)) ||
        nClasses.some((nc) => nc === sBatchName || normalizeStr(nc) === normalizeStr(sBatchName)));

    // 3. Match by Batch Join Code
    const codeMatches =
      sBatchCode &&
      (nBatchNames.some((nb) => nb.toUpperCase() === sBatchCode) ||
        nClasses.some((nc) => nc.toUpperCase() === sBatchCode));

    return !!(idMatches || nameMatches || codeMatches);
  });
};

export const filterAccessibleQuizzes = (quizzes, user, batches = []) => {
  if (!Array.isArray(quizzes)) return [];
  const role = user?.role?.toLowerCase();
  const isAdmin = role === 'admin' || role === 'superadmin' || role === 'tutor' || role === 'teacher';
  if (isAdmin) return quizzes;

  const rawBatches = Array.isArray(batches) ? batches : [];

  const studentBatch = rawBatches.find(
    (b) =>
      (user?.class && b.name?.trim().toLowerCase() === user.class.trim().toLowerCase()) ||
      (user?.batch_name && b.name?.trim().toLowerCase() === user.batch_name.trim().toLowerCase()) ||
      (user?.tuition_code && b.join_code?.trim().toUpperCase() === user.tuition_code.trim().toUpperCase()) ||
      (user?.batch_id && String(b.id) === String(user.batch_id))
  );

  const sBatchName = (studentBatch?.name || user?.batch_name || user?.class || '').trim().toLowerCase();
  const sBatchId = studentBatch?.id ? String(studentBatch.id) : (user?.batch_id ? String(user.batch_id) : '');
  const sBatchCode = (studentBatch?.join_code || user?.tuition_code || '').trim().toUpperCase();

  return quizzes.filter((q) => {
    // Non-admin students can only view quizzes that have been published
    if (!isQuizPublished(q)) return false;

    const qBatchName = (q.batch_name || '').trim().toLowerCase();
    const qBatchId = q.batch_id ? String(q.batch_id) : '';
    const qClass = (q.class || '').trim().toLowerCase();

    // Global / Open to all batches
    const isAllBatches =
      (!q.batch_id && !q.batch_name && !q.class && !q.batch_ids) ||
      q.batch_id === 'all' ||
      qBatchName === 'all batches' ||
      qBatchName === 'all' ||
      qClass === 'all classes' ||
      qClass === 'general';

    if (isAllBatches) return true;

    // Student without any batch assigned only sees open / global quizzes
    if (!sBatchName && !sBatchId && !sBatchCode) return false;

    // Check multiple assigned batch names or IDs
    const qBatchNames = splitBatchTokens(q.batch_name);
    if (qBatchNames.includes('all batches') || qBatchNames.includes('all')) return true;

    const qClasses = splitBatchTokens(q.class);
    const qBatchIds = [
      qBatchId,
      ...(typeof q.batch_ids === 'string' ? q.batch_ids.split(/[,;]/).map((s) => s.trim()) : (Array.isArray(q.batch_ids) ? q.batch_ids.map(String) : []))
    ].filter(Boolean);

    // 1. Match by Batch ID
    const idMatches = sBatchId && qBatchIds.includes(sBatchId);

    // 2. Match by Batch Name or Class
    const nameMatches =
      sBatchName &&
      (qBatchNames.some((qb) => qb === sBatchName || normalizeStr(qb) === normalizeStr(sBatchName)) ||
        qClasses.some((qc) => qc === sBatchName || normalizeStr(qc) === normalizeStr(sBatchName)));

    // 3. Match by Batch Join Code
    const codeMatches =
      sBatchCode &&
      (qBatchNames.some((qb) => qb.toUpperCase() === sBatchCode) ||
        qClasses.some((qc) => qc.toUpperCase() === sBatchCode));

    return !!(idMatches || nameMatches || codeMatches);
  });
};
