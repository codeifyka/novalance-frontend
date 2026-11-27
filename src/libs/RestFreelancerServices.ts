import type { AxiosInstance } from "axios";
import Result from "./Result";
import Utils from "./Utils";

export default class RestFreelancerServices {
    axiosInstance: AxiosInstance;

    constructor(axiosInstance: AxiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    async getAll(username?: string): Promise<Result<string, Service[]>> {
        if (!username) {
            return this.axiosInstance.get(`/api/user/services`).then(Utils.handleResponse<string, Service[]>);
        }
        return this.axiosInstance.get(`/api/user/${username}/services`).then(Utils.handleResponse<string, Service[]>)
    }

    async getAll2(params?: ServiceQueryParams): Promise<Result<string, Service[]>> {
        return this.axiosInstance.get(`/api/getAll2`, { params }).then(Utils.handleResponse<string, Service[]>);
    }

    async getPaginated(params: ServiceQueryParams): Promise<Result<string, PaginatedServices>> {
        return this.axiosInstance.get(`/api/getAll2`, { params: { ...params, paginate: true } }).then(Utils.handleResponse<string, PaginatedServices>);
    }

    async getById(service_id: number): Promise<Result<string, Service>> {
        return this.axiosInstance.get(`/api/services/${service_id}`).then(Utils.handleResponse<string, Service>);
    }

    async uploadImages(files: File[]): Promise<Result<string, string[]>> {
        let formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append(`file${i + 1}`, files[i]);
        }

        return await this.axiosInstance.post('/api/services/upload_images', formData, {
            onUploadProgress: progressEvent => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                console.log(percentCompleted);
            }
        }).then(Utils.handleResponse<string, string[]>);
    }

    async create(service: CreateService): Promise<Result<string, Service>> {
        return await this.axiosInstance.post('/api/services/create', service).then(Utils.handleResponse<string, Service>);
    }

    async update(service_id: number, service: CreateService | Partial<CreateService>): Promise<Result<string, Service>> {
        return await this.axiosInstance.put(`/api/services/${service_id}`, service).then(Utils.handleResponse<string, Service>);
    }

    async delete(service_id: number): Promise<Result<string, string>> {
        return this.axiosInstance.delete(`/api/services/${service_id}`).then(res => {
            if (res.data.error) {
                return Result.failure<string, string>(res.data.error);
            }
            return Result.success<string, string>(res.data.message || 'Service deleted');
        }).catch(err => {
            const errorMsg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to delete service';
            return Result.failure<string, string>(errorMsg);
        });
    }

    async searchByTitle(query: string): Promise<Result<string, Service[]>> {
        return this.axiosInstance.get(`/api/services/search/${query}`).then(Utils.handleResponse<string, Service[]>);
    }

    async purchase(service_id: number, ends_at?: string): Promise<Result<string, Purchase>> {
        return this.axiosInstance.post('/api/purchases', { service_id, ends_at })
            .then(Utils.handleResponse<string, Purchase>)
            .catch(err => {
                const errorData = err?.response?.data;
                const errorMsg = errorData?.error || errorData?.message || err?.message || 'Failed to purchase service';
                return Result.failure<string, Purchase>(errorMsg);
            });
    }

    async completePurchase(id: number): Promise<Result<string, Purchase>> {
        return this.axiosInstance.put(`/api/purchases/${id}/complete`)
            .then(Utils.handleResponse<string, Purchase>)
            .catch(err => {
                const errorMsg = err?.response?.data?.error || err?.message || 'Failed to complete order';
                return Result.failure<string, Purchase>(errorMsg);
            });
    }

    async deliverPurchase(id: number): Promise<Result<string, Purchase>> {
        return this.axiosInstance.put(`/api/purchases/${id}/deliver`)
            .then(Utils.handleResponse<string, Purchase>)
            .catch(err => {
                const errorMsg = err?.response?.data?.error || err?.message || 'Failed to mark deliverable';
                return Result.failure<string, Purchase>(errorMsg);
            });
    }

    async extendPurchase(id: number, ends_at: string): Promise<Result<string, Purchase>> {
        return this.axiosInstance.put(`/api/purchases/${id}/extend`, { ends_at })
            .then(Utils.handleResponse<string, Purchase>)
            .catch(err => {
                const errorMsg = err?.response?.data?.error || err?.message || 'Failed to extend deadline';
                return Result.failure<string, Purchase>(errorMsg);
            });
    }

    async disputePurchase(purchase_id: number, reason: string): Promise<Result<string, any>> {
        return this.axiosInstance.post(`/api/disputes/purchase/${purchase_id}`, { reason })
            .then(Utils.handleResponse<string, any>)
            .catch(err => {
                const errorMsg = err?.response?.data?.error || err?.message || 'Failed to open dispute';
                return Result.failure<string, any>(errorMsg);
            });
    }

    async getPurchases(): Promise<Result<string, Purchase[]>> {
        return this.axiosInstance.get('/api/purchases').then(Utils.handleResponse<string, Purchase[]>);
    }
};
