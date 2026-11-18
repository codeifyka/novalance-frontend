import type { AxiosInstance } from "axios";
import Result from "./Result";
import Utils from "./Utils";

export default class RestFreelancerProjects {
    axiosInstance: AxiosInstance;

    constructor(axiosInstance: AxiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    async getAll(username: string): Promise<Result<string, Project[]>> {
        if (!username) {
            return this.axiosInstance.get(`/api/user/projects`).then(Utils.handleResponse<string, Project[]>);
        }
        return this.axiosInstance.get(`/api/user/${username}/projects`).then(Utils.handleResponse<string, Project[]>);
    }

    async getById(project_id: number): Promise<Result<string, Project>> {
        return this.axiosInstance.get(`/api/projects/${project_id}`).then(Utils.handleResponse<string, Project>);
    }

    async uploadImages(files: File[]): Promise<Result<string, string[]>> {
        let formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append(`file${i + 1}`, files[i]);
        }

        return await this.axiosInstance.post('/api/projects/upload_images', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Important for file uploads
            },
            onUploadProgress: progressEvent => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
                console.log(percentCompleted);
            }
        }).then(Utils.handleResponse<string, string[]>);
    }

    async create(project: CreateProject): Promise<Result<string, Project>> {
        return await this.axiosInstance.post('/api/projects/create', project).then(Utils.handleResponse<string, Project>);
    }

    async update(project_id: number, project: CreateProject): Promise<Result<string, Project>> {
        return await this.axiosInstance.put(`/api/projects/${project_id}`, project).then(Utils.handleResponse<string, Project>);
    }

    async delete(project_id: number): Promise<Result<string, string>> {
        return this.axiosInstance.delete(`/api/projects/${project_id}`).then(res => {
            if (res.data.error) {
                return Result.failure<string, string>(res.data.error);
            }
            return Result.success<string, string>(res.data.message || 'Project deleted');
        }).catch(err => {
            const errorMsg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to delete project';
            return Result.failure<string, string>(errorMsg);
        });
    }
};
