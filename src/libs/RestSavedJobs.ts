import type { AxiosInstance } from "axios";
import Result from "./Result";
import Utils from "./Utils";

export default class RestSavedJobs {
    axiosInstance: AxiosInstance;

    constructor(axiosInstance: AxiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    async getSavedJobs(): Promise<Result<string, JobPost[]>> {
        return this.axiosInstance.get('/api/saved-jobs').then(Utils.handleResponse<string, JobPost[]>);
    }

    async toggleSave(jobPostId: number): Promise<Result<string, { saved: boolean; message: string }>> {
        return this.axiosInstance.post(`/api/saved-jobs/toggle/${jobPostId}`).then(res => {
            if (res.data.error) {
                return Result.failure<string, { saved: boolean; message: string }>(res.data.error);
            }
            return Result.success<string, { saved: boolean; message: string }>({
                saved: res.data.saved,
                message: res.data.message || (res.data.saved ? 'Job saved' : 'Job removed'),
            });
        }).catch(err => {
            const errorMsg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to toggle saved job';
            return Result.failure<string, { saved: boolean; message: string }>(errorMsg);
        });
    }

    async checkIsSaved(jobPostId: number): Promise<Result<string, boolean>> {
        return this.axiosInstance.get(`/api/saved-jobs/check/${jobPostId}`).then(res => {
            return Result.success<string, boolean>(!!res.data.saved);
        }).catch(() => {
            return Result.success<string, boolean>(false);
        });
    }
}
