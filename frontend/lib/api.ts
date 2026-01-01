const API_URL = "http://localhost:5000/api";

export const storeToken = (token: string) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
    }
};

export const getToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token");
    }
    return null;
};

export const removeToken = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }
};

export const storeUser = (user: any) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user));
    }
};

export const getUser = () => {
    if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
    }
    return null;
};

const getHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 422) {
            removeToken();
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.msg || errorData.message || "API Error");
    }
    return response.json();
};

const api = {
    login: async (email: string, password: string) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        return handleResponse(response);
    },

    register: async (data: {
        email: string;
        full_name: string;
        password: string;
        is_teacher: boolean;
    }) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    getClasses: async () => {
        const response = await fetch(`${API_URL}/classes/`, {
            method: "GET",
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    joinClass: async (code: string) => {
        const response = await fetch(`${API_URL}/classes/join`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ code }),
        });
        return handleResponse(response);
    },

    // Temporary for testing
    createClass: async (name: string, section: string) => {
        const response = await fetch(`${API_URL}/classes/`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ name, section }),
        });
        return handleResponse(response);
    },

    inviteStudent: async (token: string, data: { email: string; full_name: string }) => {
        const response = await fetch(`${API_URL}/teacher/invite`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    updateProfile: async (full_name: string) => {
        const response = await fetch(`${API_URL}/auth/update-profile`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify({ full_name }),
        });
        return handleResponse(response);
    },

    getProfile: async () => {
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: "GET",
            headers: getHeaders(),
        });
        return handleResponse(response);
    }
};

export default api;
