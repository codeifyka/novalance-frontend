import type { AxiosInstance } from "axios";
import Result from "./Result";
import Utils from "./Utils";

export default class RestProposals {
    axiosInstance: AxiosInstance;

    constructor(axiosInstance: AxiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    async create(proposal: CreateProposal): Promise<Result<string, Proposal>> {
        return this.axiosInstance.post('/api/proposals/create', proposal).then(Utils.handleResponse<string, Proposal>);
    }

    async getProposalByJobId(job_id: number): Promise<Result<string, Proposal[]>> {
        return this.axiosInstance.get(`/api/proposals/${job_id}`).then(Utils.handleResponse<string, Proposal[]>);
    }

    async getMyProposals(): Promise<Result<string, Proposal[]>> {
        return this.axiosInstance.get(`/api/proposals/getMyProposals`).then(Utils.handleResponse<string, Proposal[]>);
    }

    async getUserInfo(user_id: number): Promise<Result<string, User>> {
        return this.axiosInstance.get(`/api/user/${user_id}`).then(Utils.handleResponse<string, User>);
    }

    async acceptProposal(id: number, ends_at?: string): Promise<Result<string, Proposal>> {
        return this.axiosInstance.put(`/api/proposals/${id}/accept`, { ends_at }).then(Utils.handleResponse<string, Proposal>);
    }

    async completeProposal(id: number): Promise<Result<string, Proposal>> {
        return this.axiosInstance.put(`/api/proposals/${id}/complete`).then(Utils.handleResponse<string, Proposal>);
    }

    async getFreelancerProposals(): Promise<Result<string, Proposal[]>> {
        return this.axiosInstance.get(`/api/proposals/getFreelancerProposals`).then(Utils.handleResponse<string, Proposal[]>);
    }
};
