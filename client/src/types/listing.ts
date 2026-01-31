export interface Listing{
    _id:string
    realtor_id:string,
    title: string
    price: string
    address: string
    city: string
    specs: string
    description: string
    images: string[],
    createAt: string
}