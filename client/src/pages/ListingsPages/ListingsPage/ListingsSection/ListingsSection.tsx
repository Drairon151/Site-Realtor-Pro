import React, { useEffect, useState } from "react";


import ListingCard from "../../../../components/ListingCard/ListingCard";
import useListings from "../../../../hooks/useListings";

import './ListingSection.css'
import sortIcon from '../../../../assets/img/icons/sort.svg'

export default function ListingsSection(){


    const {
        searchParams,
        listingsLoading,
        listings,
        filters,

        getListings,
        handleFilterChange,
        loadMore,
    } = useListings()

    const [
        filterInputs,
        setFilterInputs,
    ] = useState({
        city: '',
        minPrice : '',
        maxPrice : '',
    })

    useEffect(() => {

        getListings();
    }, [searchParams]);

    function filterInputChangeHandler(event: React.ChangeEvent<HTMLInputElement>){
        setFilterInputs(prev=>({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }
    
    return (
        <div className="listings-section">

            <div className="listing-filter flex center">
                
                <input
                    className="listing-filter_input listing-filter_element"
                    placeholder="Город"
                    name="city"
                    value={filterInputs.city}
                    onChange={filterInputChangeHandler}
                    onBlur={()=>handleFilterChange(filterInputs.city, 'city')}
                />

                <input
                    className="listing-filter_input listing-filter_element"
                    placeholder="Минимальная цена"
                    name="minPrice"
                    value={filterInputs.minPrice}
                    onChange={filterInputChangeHandler}
                    onBlur={()=>handleFilterChange(filterInputs.minPrice, 'minPrice')}
                />

                <input
                    className="listing-filter_input listing-filter_element"
                    placeholder="Максимальная цена"
                    name="maxPrice"
                    value={filterInputs.maxPrice}
                    onChange={filterInputChangeHandler}
                    onBlur={()=>handleFilterChange(filterInputs.maxPrice, 'maxPrice')}
                />

                <div className="listing-filter_wrapper--select flex">
                    <img
                        className="listing-filter_img--sort-icon"
                        src={
                            sortIcon
                        }
                    />
                    <select 
                        name="sort"
                        className="listing-filter_select listing-filter_element"

                        value={filters.sort}
                        onChange={event=>handleFilterChange(event.target.value, 'sort')}
                    >
                        <option 
                            value="newest"
                            className="listing-filter_option listing-filter_element"
                        >Сначала новые</option>
                        <option 
                            value="oldest"
                            className="listing-filter_option listing-filter_element"
                        >Сначала старые</option>
                        <option 
                            value="lowPrice"
                            className="listing-filter_option listing-filter_element"
                        >Сначала дешёвые</option>
                        <option 
                            value="highPrice"
                            className="listing-filter_option listing-filter_element"
                        >Сначала дорогие</option>
                    </select>

                </div>

            </div>

            <div className="flex center">
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
                                listings.map((listing)=>(
                                    <ListingCard
                                        listing={listing}
                                        key={listing._id}
                                    />
                                )) 
                                )
                    }


                </div>
            </div>
            <div className="button_load-more--wrapper flex center">
                <button
                    className="button_load-more"
                    onClick={loadMore}
                >
                    Следующая страница
                </button>
            </div>
        </div>
    )
}