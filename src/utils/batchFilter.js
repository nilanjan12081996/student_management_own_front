export const normalizeStr = (s) => (s || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');

export const filterAccessibleNotes = (notes, user, batches = []) => {
  if (!Array.isArray(notes)) return [];
  const role = user?.role?.toLowerCase();
  const isAdmin = role === 'admin' || role === 'superadmin';
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
      (!n.batch_id && !n.batch_name && !n.class) ||
      n.batch_id === 'all' ||
      n.batch_name === 'All Batches' ||
      n.batch_name === 'all' ||
      n.class === 'All Classes' ||
      n.class === 'General';

    if (isAllBatches) return true;

    // Must match student's specific batch
    const idMatches = sBatchId && nBatchId && sBatchId === nBatchId;
    const nameMatches =
      (sBatchName && nBatchName && (sBatchName === nBatchName || normalizeStr(sBatchName) === normalizeStr(nBatchName))) ||
      (sBatchName && nClass && (sBatchName === nClass || normalizeStr(sBatchName) === normalizeStr(nClass)));
    const codeMatches = sBatchCode && (nBatchName.toUpperCase() === sBatchCode || nClass.toUpperCase() === sBatchCode);

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
    const qBatchName = (q.batch_name || '').trim().toLowerCase();
    const qBatchId = q.batch_id ? String(q.batch_id) : '';
    const qClass = (q.class || '').trim().toLowerCase();

    // Global / Open to all batches
    const isAllBatches =
      (!q.batch_id && !q.batch_name && !q.class) ||
      q.batch_id === 'all' ||
      q.batch_name === 'All Batches' ||
      q.batch_name === 'all' ||
      q.class === 'All Classes' ||
      q.class === 'General';

    if (isAllBatches) return true;

    // Student without any batch assigned only sees open / global quizzes
    if (!sBatchName && !sBatchId && !sBatchCode) return false;

    // Must match student's specific batch
    const idMatches = sBatchId && qBatchId && sBatchId === qBatchId;
    const nameMatches =
      (sBatchName && qBatchName && (sBatchName === qBatchName || normalizeStr(sBatchName) === normalizeStr(qBatchName))) ||
      (sBatchName && qClass && (sBatchName === qClass || normalizeStr(sBatchName) === normalizeStr(qClass)));
    const codeMatches = sBatchCode && (qBatchName.toUpperCase() === sBatchCode || qClass.toUpperCase() === sBatchCode);

    return !!(idMatches || nameMatches || codeMatches);
  });
};


