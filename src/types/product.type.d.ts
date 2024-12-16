export type ProductType = {
    id?: number;
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    businessId?: number;
    createdAt: Date;
}