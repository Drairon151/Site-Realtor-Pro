import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Listing } from "../types/listing";

export type ListingFilter = {
  city: string;
  minPrice: string;
  maxPrice: string;
  sortBy: 'createdAt' | 'price';
  order: 'asc' | 'desc';
};

export default function useListings(){
    const API_LISTINGS = 'http://localhost:5000/api/listings'

    const [myListings, setMyListings] = useState<Listing[]|null>(null)
    const [listings, setListings] = useState<Listing[]>([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const [listingsLoading, setListingsLoading] = useState(true);
    
    const filters: ListingFilter = {
        city: searchParams.get('city') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
        order: (searchParams.get('order') as any) || 'desc',
    };
    
    const getListings = async () => {
        
        try{
            setListingsLoading(true);
            const params = new URLSearchParams();
            if (filters.city) params.append('city', filters.city);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            params.append('sortBy', filters.sortBy);
            params.append('order', filters.order);

            console.log('Начало запроса обьявлений')
            const response = await fetch(`${API_LISTINGS}/all?${params}`,{
                method: 'GET',
                credentials: 'include',
            });

            if(!response.ok){
                const errorData = await response.json()
                throw new Error(errorData.status || 'Error listings response')
            }

            const result = await response.json();
            setListings(result.listings);
        }catch(error){
            console.log('Ошибка при запросе обьявлений')
        }finally{
            setListingsLoading(false);
        }

    }

    const handleFilterChange = (newFilters: Record<string, string>) => {
        setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value) newParams.set(key, value);
            else newParams.delete(key);
        });
        return newParams;
        });
    };

    const getMyListings = async ()=>{

        try{

            const response = await fetch(`${API_LISTINGS}/my`,{
                method: 'GET',
                credentials: 'include',   
            })

            if (!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.status || 'Respons my listings error')
            }

            const result = await response.json(); 

            setMyListings(result.listings)
            console.log('Данные обьявлений получены: ',result.listings)
        }catch(error){

        }

    }

    return {
        myListings,
        listingsLoading,
        listings,
        searchParams,
        filters,

        getListings,
        handleFilterChange,
        getMyListings,
    }
    
}