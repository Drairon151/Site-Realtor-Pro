export interface Realtor {
    name: string,
    surname: string,
    patronymic: string,

    _id: string,
    userId: string,

    numberPhone: string,

    successfulTransactions: number,
    realtorDescription: string,
    city: string,
    priceList: number,

    avatarUrl: string|null,
}