import type { AxiosInstance } from "axios";
import Result from "./Result";
import Utils from "./Utils";

export default class RestCategories {
    axiosInstance: AxiosInstance;
    constructor(axiosInstance: AxiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    async getAll(): Promise<Result<string, Category[]>> {
        return this.axiosInstance
            .get(`/api/categories`)
            .then(Utils.handleResponse<string, Category[]>);
    }

    async getAllByJobPost(job_post_id:number): Promise<Result<string, Category[]>> {
        return this.axiosInstance
            .get(`/api/categories/${job_post_id}`)
            .then(Utils.handleResponse<string, Category[]>);
    }
};
