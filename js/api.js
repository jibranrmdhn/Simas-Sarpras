/**
 * SIMAS - Frontend API Client Service
 * Menghubungkan antarmuka UI dengan REST API Backend Express.js & SQLite.
 * Dilengkapi graceful fallback untuk ketahanan maksimal.
 */

const API_BASE = (function() {
  if (typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null' && !window.location.origin.startsWith('file:')) {
    return window.location.origin + '/api';
  }
  return 'http://localhost:3000/api';
})();

const API = {
  baseUrl: API_BASE,

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    let activeRoleHeader = {};
    try {
      if (typeof localStorage !== 'undefined') {
        const rawUser = localStorage.getItem('simas_current_user');
        if (rawUser) {
          const parsed = JSON.parse(rawUser);
          if (parsed && parsed.role) {
            activeRoleHeader = { 'X-User-Role': parsed.role };
          }
        }
      }
    } catch (e) {}

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...activeRoleHeader,
      ...(options.headers || {})
    };

    try {
      const res = await fetch(url, { ...options, headers });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        return json;
      }
      return { success: res.ok, status: res.status, text: await res.text() };
    } catch (err) {
      console.warn(`[API Call Warning] Gagal menghubungi backend di ${url}:`, err.message);
      return { success: false, error: err.message, networkError: true };
    }
  },

  get(endpoint, params = null) {
    let url = endpoint;
    if (params) {
      const qs = new URLSearchParams();
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null && v !== '') qs.append(k, v);
      }
      const qStr = qs.toString();
      if (qStr) url += (url.includes('?') ? '&' : '?') + qStr;
    }
    return this.request(url, { method: 'GET' });
  },

  post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  // --- Domain Methods ---

  // Dashboard Stats
  async getDashboardStats() {
    return this.get('/dashboard/stats');
  },

  // Assets
  async getAssets(params = {}) {
    return this.get('/assets', params);
  },
  async getAsset(id) {
    return this.get(`/assets/${id}`);
  },
  async createAsset(assetData) {
    return this.post('/assets', assetData);
  },
  async updateAsset(id, assetData) {
    return this.put(`/assets/${id}`, assetData);
  },
  async deleteAsset(id) {
    return this.delete(`/assets/${id}`);
  },

  // Categories
  async getCategories() {
    return this.get('/categories');
  },
  async createCategory(catData) {
    return this.post('/categories', catData);
  },
  async updateCategory(id, catData) {
    return this.put(`/categories/${id}`, catData);
  },
  async deleteCategory(id) {
    return this.delete(`/categories/${id}`);
  },

  // Locations & Buildings
  async getBuildings() {
    return this.get('/buildings');
  },
  async createBuilding(bldData) {
    return this.post('/buildings', bldData);
  },
  async getLocations() {
    return this.get('/locations');
  },
  async createLocation(locData) {
    return this.post('/locations', locData);
  },
  async updateLocation(idOrCode, locData) {
    return this.put(`/locations/${encodeURIComponent(idOrCode)}`, locData);
  },
  async deleteLocation(idOrCode) {
    return this.delete(`/locations/${encodeURIComponent(idOrCode)}`);
  },

  // Employees
  async getEmployees() {
    return this.get('/employees');
  },
  async createEmployee(empData) {
    return this.post('/employees', empData);
  },
  async updateEmployee(id, empData) {
    return this.put(`/employees/${id}`, empData);
  },
  async deleteEmployee(id) {
    return this.delete(`/employees/${id}`);
  },

  // Loans & Antrean
  async getLoans(params = {}) {
    return this.get('/loans', params);
  },
  async createLoan(loanData) {
    return this.post('/loans', loanData);
  },
  async approveLoan(id, approvedBy = 'Admin/Pimpinan') {
    return this.put(`/loans/${id}/approve`, { approved_by: approvedBy });
  },
  async rejectLoan(id, reason = 'Pengajuan ditolak', rejectedBy = 'Pimpinan') {
    return this.put(`/loans/${id}/reject`, { reason, rejected_by: rejectedBy });
  },
  async requestReturnLoan(id, catatan = '', requestedBy = '') {
    return this.put(`/loans/${id}/request-return`, { catatan, requested_by: requestedBy });
  },
  async returnLoan(id, verifiedBy = 'Petugas Sarpras', catatan = '') {
    return this.put(`/loans/${id}/return`, { verified_by: verifiedBy, catatan });
  },
  async updateLoan(id, loanData) {
    return this.put(`/loans/${id}`, loanData);
  },

  // Auth & Users
  async login(username, password) {
    return this.post('/auth/login', { username, password });
  },
  async register(payload) {
    return this.post('/auth/register', payload);
  },
  async getUsers() {
    return this.get('/users');
  },
  async getPendingUsers() {
    return this.get('/users/pending');
  },
  async approveUser(id, payload = {}) {
    return this.put(`/users/${id}/approve`, payload);
  },
  async rejectUser(id, payload = {}) {
    return this.put(`/users/${id}/reject`, payload);
  },
  async createUser(userData) {
    return this.post('/users', userData);
  },
  async updateUser(id, userData) {
    return this.put(`/users/${id}`, userData);
  },
  async deleteUser(id) {
    return this.delete(`/users/${id}`);
  },

  // Approvals (Antrean Persetujuan)
  async getApprovals() {
    return this.get('/approvals');
  },
  async approveQueue(id) {
    return this.put(`/approvals/${id}/approve`);
  },
  async rejectQueue(id) {
    return this.put(`/approvals/${id}/reject`);
  },
  async revisionQueue(id, notes = '') {
    return this.put(`/approvals/${id}/revision`, { notes });
  },

  // Tickets (Pemeliharaan Kanban)
  async getTickets() {
    return this.get('/tickets');
  },
  async createTicket(ticketData) {
    return this.post('/tickets', ticketData);
  },
  async updateTicket(id, ticketData) {
    return this.put(`/tickets/${id}`, ticketData);
  },
  async deleteTicket(id) {
    return this.delete(`/tickets/${id}`);
  },

  // Mutations (Mutasi Aset)
  async getMutations() {
    return this.get('/mutations');
  },
  async createMutation(mutData) {
    return this.post('/mutations', mutData);
  },
  async approveMutation(id) {
    return this.put(`/mutations/${id}/approve`);
  },

  // Stock Opname
  async getStockOpname() {
    return this.get('/stock-opname');
  },
  async createStockOpname(stockData) {
    return this.post('/stock-opname', stockData);
  },
  async syncStockLocation(id) {
    return this.put(`/stock-opname/${id}/sync`);
  },
  async updateStockOpname(id, stockData) {
    return this.put(`/stock-opname/${id}`, stockData);
  },

  // Settings & System
  async getSettings() {
    return this.get('/settings');
  },
  async saveSettings(settingsData) {
    return this.post('/settings', settingsData);
  },
  async resetAll() {
    return this.post('/reset-all');
  },
  async getActivityLogs() {
    return this.get('/activity-logs');
  },
  async createActivityLog(logData) {
    return this.post('/activity-logs', logData);
  }
};

// Global export
if (typeof window !== 'undefined') {
  window.API = API;
}

