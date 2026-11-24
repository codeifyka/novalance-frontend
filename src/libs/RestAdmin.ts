import type { AxiosInstance } from "axios";
import Result from "./Result";
import Utils from "./Utils";

export interface DisputeDetailsResponse {
    data: Dispute;
    chat?: any;
}

export default class RestAdmin {
    axiosInstance: AxiosInstance;

    constructor(axiosInstance: AxiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    async getDisputes(status?: string): Promise<Result<string, Dispute[]>> {
        const query = status && status !== 'all' ? `?status=${status}` : '';
        return this.axiosInstance.get(`/api/admin/disputes${query}`)
            .then(Utils.handleResponse<string, Dispute[]>);
    }

    async getDispute(id: number): Promise<Result<string, DisputeDetailsResponse>> {
        return this.axiosInstance.get(`/api/admin/disputes/${id}`)
            .then(response => {
                if (response.data.error) {
                    return Result.failure<string, DisputeDetailsResponse>(response.data.error);
                }
                return Result.success<string, DisputeDetailsResponse>({
                    data: response.data.data,
                    chat: response.data.chat,
                });
            });
    }

    async resolveDispute(
        id: number,
        resolution_type: 'full_refund' | 'partial_refund' | 'release_freelancer',
        client_refund_amount?: number,
        freelancer_amount?: number,
        admin_notes?: string
    ): Promise<Result<string, Dispute>> {
        return this.axiosInstance.post(`/api/admin/disputes/${id}/resolve`, {
            resolution_type,
            client_refund_amount,
            freelancer_amount,
            admin_notes,
        }).then(Utils.handleResponse<string, Dispute>);
    }

    async failProposal(id: number, reason?: string): Promise<Result<string, Proposal>> {
        return this.axiosInstance.post(`/api/admin/proposals/${id}/fail`, { reason })
            .then(Utils.handleResponse<string, Proposal>);
    }

    async getPayouts(status?: string): Promise<Result<string, PayoutRequest[]>> {
        const query = status && status !== 'all' ? `?status=${status}` : '';
        return this.axiosInstance.get(`/api/admin/payouts${query}`)
            .then(Utils.handleResponse<string, PayoutRequest[]>);
    }

    async processPayout(id: number, admin_notes?: string): Promise<Result<string, PayoutRequest>> {
        return this.axiosInstance.post(`/api/admin/payouts/${id}/process`, { admin_notes })
            .then(Utils.handleResponse<string, PayoutRequest>);
    }

    async rejectPayout(id: number, admin_notes?: string): Promise<Result<string, PayoutRequest>> {
        return this.axiosInstance.post(`/api/admin/payouts/${id}/reject`, { admin_notes })
            .then(Utils.handleResponse<string, PayoutRequest>);
    }
}
