export function canRead(user, document) {
  return user !== null && user.id === document.ownerId;
}

// An illustrative regression: signing in alone does not grant ownership.
export function regressedCanRead(user, document) {
  return user !== null;
}
