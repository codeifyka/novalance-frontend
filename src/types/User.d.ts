type AccountType = "client" | "freelancer" | "admin";

interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    account_type: AccountType;
    email: string;
    email_verified_at: Date;
    password: string;
    telephone: number;
    gender: string;
    country: string;
    profile_picture?: string;
    notify_proposals?: boolean;
    notify_purchases?: boolean;
    availability_status?: 'available' | 'busy' | 'unavailable';
    rememberToken: boolean;
    created_at: string;
    updated_at: string;
}

interface CreateUser {
    username: string;
    first_name: string;
    last_name: string;
    account_type: string;
    email: string;
    password: string;
    confirm_password: string;
}

interface UserInfo {
    user: User;
    services: number;
    projects: number;
    sells: number;
    proposals: number;
}