import type { AxiosInstance } from "axios";
import Result from "./Result";
import Utils from "./Utils";

export default class RestDisputes {
    axiosInstance: AxiosInstance;

    constructor(axiosInstance: AxiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    async createDispute(proposalId: number, reason: string): Promise<Result<string, Dispute>> {
        return this.axiosInstance.post(`/api/disputes/${proposalId}`, { reason })
            .then(Utils.handleResponse<string, Dispute>);
    }

    async getMyDisputes(): Promise<Result<string, Dispute[]>> {
        return this.axiosInstance.get('/api/disputes')
            .then(Utils.handleResponse<string, Dispute[]>);
    }
}
