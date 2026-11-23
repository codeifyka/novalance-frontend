interface JobPost {
    id: number;
    title: string;
    description: string;
    size: string | number;
    experience_level: string;
    budjet: number;
    expected_delivery_time: string;
    illustrative_files: string;
    user_id: number;
    categories?: Category[];
    proposals_count?: number;
    pending_proposals_count?: number;
    active_proposals_count?: number;
    user?: ClientInfo;
    is_saved?: boolean;
    saved_at?: string;
    created_at: string;
    updated_at: string;
}

interface ClientInfo {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
    country?: string;
    profile_picture?: string;
    created_at: string;
    job_posts_count?: number;
}

interface JobActivity {
    active_jobs: number;
    new_proposals: number;
    hiring: number;
}

interface PaginatedJobs {
    items: JobPost[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface JobQueryParams {
    page?: number;
    per_page?: number;
    search?: string;
    user_id?: number;
}

interface CreateJobPost {
    title: string;
    description: string;
    skills: (Category | string)[];
    level: string;
    size: string | number;
    budjet: number;
    time: string;
    files: string;
    expected_delivery_time: string;
}