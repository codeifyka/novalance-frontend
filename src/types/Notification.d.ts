interface NotificationData {
    type: string;
    title: string;
    message: string;
    link?: string;
    job_post_id?: number;
    proposal_id?: number;
    service_id?: number;
    purchase_id?: number;
    bid?: number;
    price?: string;
    sender_id?: number;
    sender_name?: string;
    sender_avatar?: string;
}

interface AppNotification {
    id: string;
    type: string;
    notifiable_type: string;
    notifiable_id: number;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
    updated_at: string;
}

interface NotificationsResponse {
    notifications: AppNotification[];
    unread_count: number;
}
