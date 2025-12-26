export interface Realtor {
    name: string,
    surname: string,
    patronymic: string,

    numberPhone: string,

    successfulTransactions: number,
    realtorDescription: string,
    city: string,
    priceList: number,

    avatarUrl: string|null,
}