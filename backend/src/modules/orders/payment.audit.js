import { Payment, normalizePaymentReference } from './payment.model.js';

export async function auditLegacyPaymentReferences(input = {}) {
  const records = Array.isArray(input)
    ? input
    : await Payment.find(input).lean();

  const missingOrEmpty = [];
  const whitespaceIssues = [];
  const mixedCaseIssues = [];
  const groupsByKey = new Map();

  for (const p of records) {
    const originalReference = typeof p.paymentReference === 'string' ? p.paymentReference : '';
    const normalizedReference = normalizePaymentReference(originalReference);
    const orderIdStr = String(p.orderId || '');
    const paymentId = String(p._id || '');

    const recordSummary = {
      paymentId,
      orderId: orderIdStr,
      orderNumber: p.orderNumber || '',
      originalReference,
      normalizedReference,
      status: p.status || 'Pending',
      createdAt: p.createdAt || null
    };

    if (!originalReference || originalReference.trim() === '') {
      missingOrEmpty.push(recordSummary);
      continue;
    }

    if (originalReference !== originalReference.trim()) {
      whitespaceIssues.push(recordSummary);
    }

    if (originalReference.trim() !== normalizedReference) {
      mixedCaseIssues.push(recordSummary);
    }

    const groupKey = `${orderIdStr}:::${normalizedReference}`;
    if (!groupsByKey.has(groupKey)) {
      groupsByKey.set(groupKey, []);
    }
    groupsByKey.get(groupKey).push(recordSummary);
  }

  const duplicateGroups = [];
  for (const [groupKey, items] of groupsByKey.entries()) {
    if (items.length > 1) {
      const [orderId, normalizedReference] = groupKey.split(':::');
      const uniqueOriginals = new Set(items.map((i) => i.originalReference));
      const hasCaseConflict = items.some((i) => i.originalReference.trim() !== normalizedReference);
      const hasWhitespaceConflict = items.some((i) => i.originalReference !== i.originalReference.trim());

      duplicateGroups.push({
        orderId,
        normalizedReference,
        count: items.length,
        hasCaseConflict,
        hasWhitespaceConflict,
        uniqueOriginalReferences: Array.from(uniqueOriginals),
        records: items
      });
    }
  }

  const totalRecords = records.length;
  const flaggedIds = new Set([
    ...missingOrEmpty.map((r) => r.paymentId),
    ...whitespaceIssues.map((r) => r.paymentId),
    ...mixedCaseIssues.map((r) => r.paymentId),
    ...duplicateGroups.flatMap((g) => g.records.map((r) => r.paymentId))
  ]);

  return {
    dryRun: true,
    totalRecords,
    cleanRecordsCount: totalRecords - flaggedIds.size,
    emptyOrMissingCount: missingOrEmpty.length,
    emptyOrMissing: missingOrEmpty,
    whitespaceIssuesCount: whitespaceIssues.length,
    whitespaceIssues,
    mixedCaseIssuesCount: mixedCaseIssues.length,
    mixedCaseIssues,
    duplicateGroupsCount: duplicateGroups.length,
    duplicateGroups
  };
}

