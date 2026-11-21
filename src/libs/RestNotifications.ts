import type { AxiosInstance } from "axios";
import Result from "./Result";
import Utils from "./Utils";

export default class RestNotifications {
    axiosInstance: AxiosInstance;

    constructor(axiosInstance: AxiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    async getNotifications(): Promise<Result<string, NotificationsResponse>> {
        return this.axiosInstance
            .get<NotificationsResponse>('/api/notifications')
            .then(Utils.handleResponse<string, NotificationsResponse>)
            .catch(error => {
                const message = error.response?.data?.error || error.message || 'Failed to fetch notifications';
                return Result.failure<string, NotificationsResponse>(message);
            });
    }

    async markAsRead(id: string): Promise<Result<string, { message: string; unread_count: number }>> {
        return this.axiosInstance
            .post<{ message: string; unread_count: number }>(`/api/notifications/${id}/read`)
            .then(Utils.handleResponse<string, { message: string; unread_count: number }>)
            .catch(error => {
                const message = error.response?.data?.error || error.message || 'Failed to mark notification as read';
                return Result.failure<string, { message: string; unread_count: number }>(message);
            });
    }

    async markAllAsRead(): Promise<Result<string, { message: string; unread_count: number }>> {
        return this.axiosInstance
            .post<{ message: string; unread_count: number }>('/api/notifications/read-all')
            .then(Utils.handleResponse<string, { message: string; unread_count: number }>)
            .catch(error => {
                const message = error.response?.data?.error || error.message || 'Failed to mark all notifications as read';
                return Result.failure<string, { message: string; unread_count: number }>(message);
            });
    }

    async deleteNotification(id: string): Promise<Result<string, { message: string; unread_count: number }>> {
        return this.axiosInstance
            .delete<{ message: string; unread_count: number }>(`/api/notifications/${id}`)
            .then(Utils.handleResponse<string, { message: string; unread_count: number }>)
            .catch(error => {
                const message = error.response?.data?.error || error.message || 'Failed to delete notification';
                return Result.failure<string, { message: string; unread_count: number }>(message);
            });
    }
}
