const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class ApiClient {
    constructor() {
        this.token = typeof window !== 'undefined' ? localStorage.getItem('gocart_jwt_token') : null;
    }

    setToken(token) {
        this.token = token;
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('gocart_jwt_token', token);
            } else {
                localStorage.removeItem('gocart_jwt_token');
            }
        }
    }

    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {}),
            ...options.headers,
        };

        const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(error.message || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.warn(`API call to ${endpoint} failed:`, error.message);
            throw error;
        }
    }

    // Authentication endpoints
    async login(email, password) {
        const res = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (res.token) {
            this.setToken(res.token);
        }
        return res;
    }

    async register(name, email, password, role = 'ROLE_CUSTOMER') {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, role }),
        });
    }

    async getCurrentUser() {
        return this.request('/auth/me');
    }

    // Stores
    async createStore(data) {
        return this.request('/stores/create', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Catalog & Products
    async getProducts(category) {
        const query = category ? `?category=${encodeURIComponent(category)}` : '';
        return this.request(`/products${query}`);
    }

    async getProductById(id) {
        return this.request(`/products/${id}`);
    }

    async searchProducts(keyword) {
        return this.request(`/products/search?q=${encodeURIComponent(keyword)}`);
    }

    // Orders
    async placeOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    }

    async getMyOrders() {
        return this.request('/orders/my-orders');
    }
}

export const api = new ApiClient();
export default api;
