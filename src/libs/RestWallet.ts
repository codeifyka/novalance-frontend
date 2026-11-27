import type { AxiosInstance } from "axios";
import Result from "./Result";
import Utils from "./Utils";

export default class RestWallet {
    axiosInstance: AxiosInstance;

    constructor(axiosInstance: AxiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    async getMyWallet(): Promise<Result<string, WalletSummary>> {
        return this.axiosInstance.get('/api/wallet').then(Utils.handleResponse<string, WalletSummary>);
    }

    async getGatewayConfig(): Promise<Result<string, WalletGatewayConfig>> {
        return this.axiosInstance.get('/api/wallet/config').then(Utils.handleResponse<string, WalletGatewayConfig>);
    }

    async depositIntent(amount: number, provider: string = 'stripe'): Promise<Result<string, DepositIntentResult>> {
        return this.axiosInstance.post('/api/wallet/deposit/intent', { amount, provider }).then(Utils.handleResponse<string, DepositIntentResult>);
    }

    async confirmDeposit(payment_id: string, amount: number, provider: string = 'stripe'): Promise<Result<string, { transaction: WalletTransaction, wallet: WalletSummary }>> {
        return this.axiosInstance.post('/api/wallet/deposit/confirm', { payment_id, amount, provider }).then(Utils.handleResponse<string, { transaction: WalletTransaction, wallet: WalletSummary }>);
    }

    async requestPayout(amount: number, provider: string = 'stripe', account_details?: Record<string, any>): Promise<Result<string, PayoutRequest>> {
        return this.axiosInstance.post('/api/wallet/payout-request', { amount, provider, account_details }).then(Utils.handleResponse<string, PayoutRequest>);
    }
}
