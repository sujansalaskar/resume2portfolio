const API_BASE = import.meta.env.VITE_API_URL;

// Generate or retrieve a persistent visitor ID for tracking
function getSessionId() {
  let sid = localStorage.getItem('visitor_session_id');
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem('visitor_session_id', sid);
  }
  return sid;
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return res.json();
}
export const auth = {
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),
  updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  updatePassword: (data) => request('/auth/password', { method: 'PUT', body: JSON.stringify(data) }),
  deleteAccount: () => request('/auth/account', { method: 'DELETE' }),
};

export const resume = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const token = localStorage.getItem('auth_token');
    return fetch(`${API_BASE}/resume/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }).then(r => r.json());
  },
};

export const portfolio = {
  create: (data) => request('/portfolio/create', { method: 'POST', body: JSON.stringify(data) }),
  get: (username) => request(`/portfolio/${username}`, {
    headers: { 'x-session-id': getSessionId() },
  }),
  publish: (data) => request('/portfolio/publish', { method: 'POST', body: JSON.stringify(data) }),
  unpublish: (portfolioId) => request('/portfolio/unpublish', { method: 'POST', body: JSON.stringify({ portfolioId }) }),
  getMyPortfolios: () => request('/portfolio/my'),
  delete: (portfolioId) => request(`/portfolio/${portfolioId}`, { method: 'DELETE' }),
  update: (portfolioId, data) => request(`/portfolio/${portfolioId}`, { method: 'PATCH', body: JSON.stringify(data) }),
  preview: (portfolioId) => request(`/portfolio/${portfolioId}/preview`),
};

export const analytics = {
  get: (portfolioId) => request(`/analytics/portfolio/${portfolioId}`),
  dashboard: () => request('/analytics/dashboard'),
};

export const upload = {
  image: (base64) => request('/upload/image', { method: 'POST', body: JSON.stringify({ image: base64 }) }),
};
