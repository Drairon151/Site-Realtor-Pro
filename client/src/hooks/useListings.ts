import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Listing } from "../types/listing";

export type ListingFilter = {
    city: string;
    minPrice: string;
    maxPrice: string;
    sort: 'newest' | 'oldest' | 'lowPrice' | 'highPrice';
    page: number,
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
        sort: (searchParams.get('sort') as any) || 'newest',
        page: Number(searchParams.get('page')) || 1,
    };
    
    const getListings = async () => {
        
        try{
            setListingsLoading(true);
            const params = new URLSearchParams();
            if (filters.city) params.append('city', filters.city);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            params.append('sort', filters.sort);
            params.append('page', String(filters.page))

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
        }finally{
            setListingsLoading(false);
        }

    }

    const handleFilterChange = (newFilter: string | number, newFilterKey: string ) => {

        setSearchParams(prev=>{
            const next = new URLSearchParams(prev);
            next.set(newFilterKey, String(newFilter));
            return next;
        })

    };

    const loadMore = ()=>{
        handleFilterChange(filters.page+1, 'page')
        getListings()
    }

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
        loadMore,
    }
    
}