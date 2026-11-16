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
    created_at: string;
    updated_at: string;
}

interface JobActivity {
    active_jobs: number;
    new_proposals: number;
    hiring: number;
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