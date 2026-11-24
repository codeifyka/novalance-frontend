interface Chat {
    id: number;
    freelancer_id: number;
    client_id: number;
    job_post_id?: number | null;
    service_id?: number | null;
    chattable_type?: string | null;
    chattable_id?: number | null;
    tag?: 'job_post' | 'service' | string;
    chat_tag?: 'job_post' | 'service' | string;
    chattable_title?: string;
    chattable?: any;
    job_post?: JobPost;
    service?: any;
    start_date: string;
    end_date: string;
    temporary_removed?: boolean;
    is_expired?: boolean;
    created_at: string;
    updated_at: string;
    freelancer?: User;
    client?: User;
    last_message?: Message;
}