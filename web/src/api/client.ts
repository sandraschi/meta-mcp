/**
 * MetaMCP Frontend API Client
 * Handles communication with the MetaMCP backend REST API
 */

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '';

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    errors?: string[];
    metadata?: {
        service: string;
        timestamp: number;
    };
}

// Generic API client class
class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseUrl}${endpoint}`;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                errors: [error instanceof Error ? error.message : 'Unknown error'],
            };
        }
    }

    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }
}

// Create singleton instance
const apiClient = new ApiClient();

// Tool-specific API methods
export const api = {
    // Health and status
    async getHealth(): Promise<ApiResponse> {
        return apiClient.get('/health');
    },

    async getDetailedHealth(): Promise<ApiResponse> {
        return apiClient.get('/api/v1/health/detailed');
    },

    async listTools(): Promise<ApiResponse> {
        return apiClient.get('/api/v1/tools/list');
    },

    // Diagnostics tools
    async runEmojiBuster(params: {
        operation: string;
        repo_path?: string;
        scan_mode?: string;
        auto_fix?: boolean;
        backup?: boolean;
    }): Promise<ApiResponse> {
        return apiClient.post('/api/v1/diagnostics/emojibuster', params);
    },

    async runPowerShellTools(params: {
        operation: string;
        repo_path?: string;
        scan_mode?: string;
        include_aliases?: boolean;
    }): Promise<ApiResponse> {
        return apiClient.post('/api/v1/diagnostics/powershell', params);
    },

    // Analysis tools
    async runRuntAnalyzer(params: {
        operation: string;
        repo_path?: string;
        scan_mode?: string;
        include_dependencies?: boolean;
    }): Promise<ApiResponse> {
        return apiClient.post('/api/v1/analysis/runt-analyzer', params);
    },

    async getRepoStatus(params: {
        operation: string;
        repo_path?: string;
    }): Promise<ApiResponse> {
        return apiClient.post('/api/v1/analysis/repo-status', params);
    },

    // Discovery tools
    async discoverServers(params: {
        operation: string;
        client_type?: string;
    }): Promise<ApiResponse> {
        return apiClient.post('/api/v1/discovery/servers', params);
    },

    async checkClientIntegration(params: {
        operation: string;
        client_type?: string;
    }): Promise<ApiResponse> {
        return apiClient.post('/api/v1/discovery/client-integration', params);
    },

    // Scaffolding tools
    async createProject(params: {
        template_type: string;
        project_name: string;
        output_path: string;
        features?: Record<string, any>;
    }): Promise<ApiResponse> {
        return apiClient.post('/api/v1/scaffolding/create', params);
    },

    // Repository analysis tools
    async scanRepository(params: {
        repo_path: string;
        deep_analysis?: boolean;
    }): Promise<ApiResponse> {
        return apiClient.post('/api/v1/repos/scan', params);
    },
};

// Utility functions
export const isSuccessResponse = (response: ApiResponse): boolean => {
    return response.success === true;
};

export const getErrorMessage = (response: ApiResponse): string => {
    if (response.errors && response.errors.length > 0) {
        return response.errors[0];
    }
    return response.message || 'An unknown error occurred';
};

export const getSuccessMessage = (response: ApiResponse): string => {
    return response.message || 'Operation completed successfully';
};

// Type guards
export const isApiResponse = (obj: any): obj is ApiResponse => {
    return obj && typeof obj === 'object' && 'success' in obj && 'message' in obj;
};

export default api;