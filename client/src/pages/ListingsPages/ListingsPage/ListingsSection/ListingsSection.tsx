import { useEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';

import ListingCard from "../../../../components/ListingCard/ListingCard";
import { Listing } from "../../../../types/listing";

export default function ListingsSection(){
    const [searchParams, setSearchParams] = useSearchParams();
    const [listings, setListings] = useState<Listing[]|null>(null)
    const [loading, setLoading] = useState(true);

    const city = searchParams.get('city') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';


    const loadListings = async () => {
        console.log('Гойдакоптер')

        setLoading(true);
        const params = new URLSearchParams();
        if (city) params.append('city', city);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        params.append('sortBy', sortBy);
        params.append('order', order);

        const res = await fetch(`/api/listings/all?${params}`);
        const data = await res.json();
        setListings(data.listings);
        setLoading(false);
    };

    useEffect(() => {

        loadListings();
    }, [searchParams]);


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
    
    return (
        <div className="listings-section">

            <div className="listing-filter">
                <input
                    className="listing-filter_input"
                    placeholder=""
                    value={city}
                    onBlur={}
                />
                <input
                    className="listing-filter_input"
                    placeholder="Минимальная цена"
                    value={minPrice}
                    onBlur={}
                />
                <input
                    className="listing-filter_input"
                    placeholder="Максимальная цена"
                    value={maxPrice}
                    onBlur={}
                />
                <input
                    className="listing-filter_input"
                    placeholder=""
                    value={}
                    onBlur={}
                />
            </div>

            <div className="listings">
                {
                    !listings
                        ? null
                        :  (
                           listings.map((listing, index)=>(
                            <ListingCard
                                listing={listing}
                                index={index}
                                key={index}
                            />
                           )) 
                        )
                }
            </div>

        </div>
    )
}