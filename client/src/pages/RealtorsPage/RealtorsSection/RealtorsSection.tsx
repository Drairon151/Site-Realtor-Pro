import { useState, useEffect } from "react"

import useRealtor from "../../../hooks/useRealtor"
import { RealtorsFilter } from "../../../hooks/useRealtor"

import './RealtorsSection.css'

import sortIcon from '../../../assets/img/icons/sort.svg'
import RealtorCard from "../../../components/RealtorCard/RealtorCard"

export default function RealtorSection(){
    const {
        getRealtors,
        handleFilterChange,
        loadMore,

        searchParams,
        realtorsLoading,
        realtors,
        filters,
    } = useRealtor()
    
    const [
        filterInputs,
        setFilterInputs,
    ] = useState({
        city: '',
        minPrice : '',
        maxPrice : '',
    })

    useEffect(() => {

        getRealtors();
    }, [searchParams]);

    function filterInputChangeHandler(event: React.ChangeEvent<HTMLInputElement>){
        setFilterInputs(prev=>({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }
    

    return(
        <div
            className="realtors-page_realtor-card-section"

        >

            <div className="realtor-filter flex center">
                
                <input
                    className="realtor-filter_input realtor-filter_element"
                    placeholder="Город"
                    name="city"
                    value={filterInputs.city}
                    onChange={filterInputChangeHandler}
                    onBlur={()=>handleFilterChange(filterInputs.city, 'city')}
                />

                <input
                    className="realtor-filter_input realtor-filter_element"
                    placeholder="Минимальная цена"
                    name="minPrice"
                    value={filterInputs.minPrice}
                    onChange={filterInputChangeHandler}
                    onBlur={()=>handleFilterChange(filterInputs.minPrice, 'minPrice')}
                />

                <input
                    className="realtor-filter_input realtor-filter_element"
                    placeholder="Максимальная цена"
                    name="maxPrice"
                    value={filterInputs.maxPrice}
                    onChange={filterInputChangeHandler}
                    onBlur={()=>handleFilterChange(filterInputs.maxPrice, 'maxPrice')}
                />

                <div className="realtor-filter_wrapper--select flex">
                    <img
                        className="realtor-filter_img--sort-icon"
                        src={
                            sortIcon
                        }
                    />
                    <select 
                        name="sort"
                        className="realtor-filter_select realtor-filter_element"

                        value={filters.sort}
                        onChange={event=>handleFilterChange(event.target.value, 'sort')}
                    >
                        <option 
                            value="lowPrice"
                            className="realtor-filter_option realtor-filter_element"
                        >Сначала дешёвые</option>
                        <option 
                            value="highPrice"
                            className="realtor-filter_option realtor-filter_element"
                        >Сначала дорогие</option>
                        <option 
                            value="moreDeals"
                            className="realtor-filter_option realtor-filter_element"
                        >Больше сделок</option>
                        <option 
                            value="lessDeals"
                            className="realtor-filter_option realtor-filter_element"
                        >Меньше сделок</option>
                    </select>

                </div>

            </div>

            <div className="flex center">
                <div className="realtors">
                    {
                        realtorsLoading
                            ? (
                                <div>
                                    Загрузка
                                </div>
                            )
                            : !realtors ? null
                                :  (
                                realtors.map((realtor, index)=>(
                                    <div
                                        className="realtor-card-wrapper"
                                    >
                                        <RealtorCard
                                            realtor={realtor}
                                            key={index}
                                        />
                                    </div>
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