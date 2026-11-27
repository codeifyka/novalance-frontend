interface Service {
    id: number;
    title: string;
    description: string;
    user_id: number;
    category_id: number;
    price_id: number;
    delivery_days?: number;
    rate: number;
    ratings_count?: number;
    images?: ServiceImage[];
    category?: Category;
    price?: Price;
    user?: User;
    created_at: string;
    updated_at: string;
}

interface CreateService {
    title: string;
    description: string;
    category: string;
    images: string[];
    price: number;
}

interface ServiceImage {
    id?: number;
    path: string;
    url?: string;
    service_id?: number;
}

interface PaginatedServices {
    items: Service[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface ServiceQueryParams {
    page?: number;
    per_page?: number;
    search?: string;
    category_id?: number;
    sort?: string;
    paginate?: boolean;
}

interface Purchase {
    id: number;
    client_id: number;
    freelancer_id: number;
    service_id: number;
    price: string | number;
    status: string;
    started_at?: string;
    ends_at?: string;
    delivered_at?: string;
    completed_at?: string;
    created_at: string;
    updated_at: string;
    service?: Service;
    freelancer?: User;
    client?: User;
    dispute?: Dispute;
}