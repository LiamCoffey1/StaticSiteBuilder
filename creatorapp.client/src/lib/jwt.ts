export function getValidToken(): string | null {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  try {
    const [, payloadB64] = token.split('.');
    const payloadStr = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(payloadStr || '{}');
    const exp = typeof payload.exp === 'number' ? payload.exp : 0;
    const now = Math.floor(Date.now() / 1000);
    if (exp && exp > now + 30) { // 30s clock skew
      return token;
    }
  } catch {
    // invalid token
  }
  return null;
}

export function handleExpiredToken() {
  localStorage.removeItem('authToken');
  // optional: also clear cached pages selection to avoid confusion
  // localStorage.removeItem('pages');
  // localStorage.removeItem('selectedPageId');
  if (location.pathname !== '/login') {
    location.href = '/login';
  }
}
