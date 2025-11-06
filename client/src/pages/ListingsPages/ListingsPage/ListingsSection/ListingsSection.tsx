import { useEffect, useState } from "react";


import ListingCard from "../../../../components/ListingCard/ListingCard";
import useListings from "../../../../hooks/useListings";

import './ListingSection.css'

export default function ListingsSection(){


    const {
        searchParams,
        listingsLoading,
        listings,
        filters,

        getListings,
        handleFilterChange,
    } = useListings()



    useEffect(() => {

        getListings();
    }, [searchParams]);



    
    return (
        <div className="listings-section">

            <div className="listing-filter">
                <input
                    className="listing-filter_input"
                    placeholder=""
                    value={filters.city}
                    onBlur={event=>handleFilterChange({city: event.target.value})}
                />
                <input
                    className="listing-filter_input"
                    placeholder="Минимальная цена"
                    value={filters.minPrice}
                    onBlur={event=>handleFilterChange({minPrice: event.target.value})}
                />
                <input
                    className="listing-filter_input"
                    placeholder="Максимальная цена"
                    value={filters.maxPrice}
                    onBlur={event=>handleFilterChange({maxPrice: event.target.value})}
                />

            </div>

            <div className="listings">
                {
                    listingsLoading
                        ? (
                            <div>
                                Загрузка
                            </div>
                        )
                        : !listings ? null
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