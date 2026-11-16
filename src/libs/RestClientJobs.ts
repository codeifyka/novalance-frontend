import type { AxiosInstance } from "axios";
import Result from "./Result";
import Utils from "./Utils";

export default class RestClientJobs {
    axiosInstance: AxiosInstance;

    constructor(axiosInstance: AxiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    async getMyJobs(): Promise<Result<string, { jobs: JobPost[]; activity: JobActivity }>> {
        return this.axiosInstance.get('/api/job/').then(res => {
            if (res.data.error) {
                return Result.failure<string, { jobs: JobPost[]; activity: JobActivity }>(res.data.error);
            }
            const jobs: JobPost[] = res.data.data || [];
            const activity: JobActivity = res.data.activity || {
                active_jobs: jobs.length,
                new_proposals: jobs.reduce((sum, j) => sum + (j.pending_proposals_count || 0), 0),
                hiring: jobs.reduce((sum, j) => sum + (j.active_proposals_count || 0), 0),
            };
            return Result.success<string, { jobs: JobPost[]; activity: JobActivity }>({ jobs, activity });
        });
    }

    async getById(id: number): Promise<Result<string, JobPost>> {
        return this.axiosInstance.get(`/api/job/${id}`).then(Utils.handleResponse<string, JobPost>);
    }

    async create(jobPost: FormData) {

        return this.axiosInstance.post('/api/job', jobPost,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            },
        ).then(Response => Response.data)

    }

    async update(id: number, jobPost: CreateJobPost): Promise<Result<string, JobPost>> {
        return this.axiosInstance.put(`/api/job/${id}`, jobPost).then(Utils.handleResponse<string, JobPost>);
    }

    async delete(id: number): Promise<Result<string, string>> {
        return this.axiosInstance.delete(`/api/job/${id}`).then(response => {
            if (response.data.error) {
                return Result.failure<string, string>(response.data.error);
            } else {
                return Result.success<string, string>(response.data.msg);
            }
        })
    }

    async getAll(): Promise<Result<string, JobPost[]>> {
        return this.axiosInstance.get('/api/user/job/getAll').then(Utils.handleResponse<string, JobPost[]>);
    }

    async uploadFiles(files: File[]): Promise<Result<string, string[]>> {
        let formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append(`file${i + 1}`, files[i]);
        }
        return await this.axiosInstance.post('/api/job/upload_files', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then(Utils.handleResponse<string, string[]>);
    }
}