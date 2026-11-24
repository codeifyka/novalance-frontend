import type { AxiosInstance } from "axios";
import Result from "./Result";
import Utils from "./Utils";

export default class RestChat {
    axiosInstance: AxiosInstance;
    constructor(axiosInstance: AxiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    async getUsers(): Promise<Result<string, Chat[]>> {
        return this.axiosInstance.get(`/api/chats/getAll`)
            .then(Utils.handleResponse<string, Chat[]>);
    }

    async storeMessage(message: string, chat_id: number): Promise<Result<string, Message>> {
        return this.axiosInstance.post(`/api/chats/storeMessage`, { message, chat_id })
            .then(Utils.handleResponse<string, Message>);
    }

    async getAllMessages(chat_id: number): Promise<Result<string, Message[]>> {
        return this.axiosInstance.post(`/api/chats/getAllMessages`, { chat_id }).then(Utils.handleResponse<string, Message[]>);
    }

    async getOrCreateChat(user_id: number, job_post_id?: number, service_id?: number, type?: string): Promise<Result<string, Chat>> {
        return this.axiosInstance.post(`/api/chats/getOrCreate`, { user_id, job_post_id, service_id, type })
            .then(Utils.handleResponse<string, Chat>);
    }

    async setExpiryDate(chat_id: number, end_date: Date | string, temporary_removed?: boolean): Promise<Result<string, Chat>> {
        return this.axiosInstance.post(`/api/chats/setExpiryDate`, { chat_id, end_date, temporary_removed }).then(Utils.handleResponse<string, Chat>);
    }
};
