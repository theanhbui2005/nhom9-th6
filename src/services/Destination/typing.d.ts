export interface Destination {
    id: string;
    name: string;
    description: string;
    image: string;
    location: string;
    rating: number;
    price: number;
    category: string;
    visitTime: string;
    foodCost: number;
    accommodationCost: number;
    transportCost: number;
    imageUrl: string;
}

export interface DestinationQueryParams {
    search?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface DestinationResponse {
    data: Destination[];
    total: number;
    page: number;
    pageSize: number;
}
