import React, { useState } from "react"
import { Realtor } from "../types/realtor"
import { RealtorData } from "../types/realtorData"

import { useSearchParams } from "react-router-dom";

export type RealtorsFilter = {
    city: string;
    minPrice: string;
    maxPrice: string;
    sort: 'moreDeals'|'lessDeals'|'lowPrice' | 'highPrice';
    page: number,
};

export default function useRealtor(){
    const API_REALTOR = 'http://localhost:5000/api/realtor'

    const [realtor, setRealtor] = useState<RealtorData|null>(null) 

    const [realtors, setRealtors] = useState<Realtor[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [realtorsLoading, setRealtorsLoading] = useState(true);
    
    const filters: RealtorsFilter = {
        city: searchParams.get('city') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sort: (searchParams.get('sort') as any) || 'lowPrice',
        page: Number(searchParams.get('page')) || 1,
    };

    const getRealtorData = async ()=>{
        try{
            const response = await fetch(`${API_REALTOR}/getRealtorData`,{
                method: 'GET',
                credentials: 'include',
            })

            if(!response.ok){
                const errorData = await response.json()
                throw new Error(errorData.message||'Ошибка запроса данных риелтора')
            }

            const result = await response.json()
            setRealtor(result.realtorData)

        }catch(error){
            console.log('Ошибка: ',error)
        }
    }
    
    const changeRealtorData = async (event:React.FormEvent<HTMLFormElement>,changedRealtorData:RealtorData)=>{
        event.preventDefault()
        try{
            const response = await fetch(`${API_REALTOR}/changeRealtorData`,{
                headers: {
                'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify(changedRealtorData),
                credentials: 'include',
            })

            if(!response.ok){
                const errorData = await response.json()
                throw new Error(errorData.message||'Ошибка запроса данных риелтора')
            }

            setRealtor(changedRealtorData)

        }catch(error){
            console.log('Ошибка: ',error)
        }
    }

    const getRealtors = async () => {
        
        try{
            setRealtorsLoading(true);
            const params = new URLSearchParams();
            if (filters.city) params.append('city', filters.city);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            params.append('sort', filters.sort);
            params.append('page', String(filters.page))

            const response = await fetch(`${API_REALTOR}/all?${params}`,{
                method: 'GET',
                credentials: 'include',
            });

            if(!response.ok){
                const errorData = await response.json()
                throw new Error(errorData.status || 'Error listings response')
            }
            const result = await response.json();
            setRealtors(result.realtors);
            console.log('Риелторы: ',realtors)
        }catch(error){
            console.log('Ошибка запроса', error)
        }finally{
            setRealtorsLoading(false);
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
        getRealtors()
    }

    return {
        getRealtorData,
        changeRealtorData,

        getRealtors,
        handleFilterChange,
        loadMore,
        
        realtor,

        searchParams,
        realtorsLoading,
        realtors,
        filters,
    }
}