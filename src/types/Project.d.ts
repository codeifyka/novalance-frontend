interface Project {
    id: string;
    title: string;
    description: string;
    user_id: number;
    images?: Image[];
    created_at: string;
    updated_at: string;
}

interface CreateProject {
    title: string;
    description: string;
    images: string[];
}