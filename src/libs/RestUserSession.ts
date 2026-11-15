import type { AxiosInstance, AxiosResponse } from "axios";
import Result from "./Result";
import Utils from "./Utils";

export default class RestUserSession {
    axiosInstance: AxiosInstance;

    constructor(axiosInstance: AxiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    async login(userCredentials: UserCredentials): Promise<Result<string, UserSession>> {
        let { email, password } = userCredentials;
        return this.axiosInstance.post<UserCredentials, AxiosResponse<UserSession>>('/api/auth/login', { email, password }).then(Utils.handleResponse<string, UserSession>);
    }

    async register(user: CreateUser): Promise<Result<Record<string, string>, User>> {
        return this.axiosInstance.post('/api/auth/register', user).then(Utils.handleResponseWithErrors<Record<string, string>, User>);
    }

    async logout(): Promise<Result<string, string>> {
        return this.axiosInstance.post('/api/auth/logout').then(Utils.handleResponse<string, string>);
    }

    async checkAuth(access_token: string): Promise<Result<string, UserSession>> {
        return this.axiosInstance.get('/api/auth/me', { headers: { Authorization: `Bearer ${access_token}` } }).then(Utils.handleResponse<string, UserSession>);
    }

    async getInfo(): Promise<Result<string, UserInfo>> {
        // NOTE: To use this function you must use inject("axios") to setup the Authorization header by default.
        return this.axiosInstance.get<User>('/api/user').then(Utils.handleResponse<string, UserInfo>);
    }

    async updateUserInfo(user: User): Promise<Result<string, User>> {
        // NOTE: To use this function you must use inject("axios") to setup the Authorization header by default.
        return this.axiosInstance.post('/api/user', user)
            .then(Utils.handleResponse<string, User>)
            .catch(error => {
                const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to update user info';
                return Result.failure<string, User>(message);
            });
    }

    async changePassword(payload: { current_password: string; new_password: string; confirm_password: string }): Promise<Result<string, string>> {
        return this.axiosInstance.post('/api/user/change-password', payload)
            .then(res => {
                if (res.data?.error) {
                    return Result.failure<string, string>(res.data.error);
                }
                return Result.success<string, string>(res.data?.message || 'Password changed successfully');
            })
            .catch(error => {
                const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to change password';
                return Result.failure<string, string>(message);
            });
    }

    async resetPassword(payload: { email: string; password: string; confirm_password: string }): Promise<Result<string, string>> {
        return this.axiosInstance.post('/api/auth/reset-password', payload)
            .then(res => {
                if (res.data?.error) {
                    return Result.failure<string, string>(res.data.error);
                }
                return Result.success<string, string>(res.data?.message || 'Password reset successfully');
            })
            .catch(error => {
                const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to reset password';
                return Result.failure<string, string>(message);
            });
    }

    async uploadProfilePicture(file: File): Promise<Result<string, { profile_picture: string; user: User }>> {
        const formData = new FormData();
        formData.append('profile_picture', file);

        return this.axiosInstance.post('/api/user/profile_picture', formData)
            .then(res => {
                if (res.data?.error) {
                    return Result.failure<string, { profile_picture: string; user: User }>(res.data.error);
                }
                return Result.success<string, { profile_picture: string; user: User }>(res.data.data);
            })
            .catch(error => {
                const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to upload profile picture';
                return Result.failure<string, { profile_picture: string; user: User }>(message);
            });
    }
};
