export function applySnapshot(current, event) {
  if (!Number.isSafeInteger(event.revision) || event.revision < 0) {
    throw new TypeError('Revision must be a non-negative safe integer');
  }
  if (typeof event.entityId !== 'string' || !event.entityId || typeof event.status !== 'string' || !event.status) {
    throw new TypeError('A complete entity snapshot is required');
  }
  if (current && current.entityId !== event.entityId) throw new Error('Snapshots must belong to the same entity');
  if (current && event.revision <= current.revision) return current;
  return Object.freeze({ entityId: event.entityId, revision: event.revision, status: event.status });
}
