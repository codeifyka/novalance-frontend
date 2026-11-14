interface Service {
    id: number;
    title: string;
    description: string;
    user_id: number;
    category_id: number;
    price_id: number;
    rate: number;
    images?: ServiceImage[];
    category?: Category;
    price?: Price;
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
    path: string;
    service_id: number;
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