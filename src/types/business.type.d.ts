export type Business = {
    id?: number;
    name: string;
    address: string;
    city: string;
    country: string;

    latitude?: number;    
    longitude?: number;
    ordersRated?: number;
    ratingSum?: number;
    avgRating?: number;

    createdAt?: Date;
    updatedAt?: Date;
}