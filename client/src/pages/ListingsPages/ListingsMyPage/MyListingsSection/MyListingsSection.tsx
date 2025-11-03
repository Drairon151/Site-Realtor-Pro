import { useEffect } from 'react'
import useListings from '../../../../hooks/useListings'
import './MyListingsSection.css'
import ListingCard from './components/ListingCard/ListingCard';

import trashBusketIcon from '../../../../assets/img/icons/trash-basket-icon.png'
import changeIcon from '../../../../assets/img/icons/change-icon.png'
import useListing from '../../../../hooks/useListing';

export default function MyListingsSection(){

    const{
        deleteListing,
    }=useListing()

    const {
        myListings,
        getMyListings,
    } = useListings();

    useEffect(()=>{
        getMyListings()
    },[])

    return(
        <div className='my-listings-section'>
                {
                    !myListings 
                        ? 'Загрузка'
                        : 
                        <div className='listing-cards'>
                            {myListings.map((listing, index)=>
                                <div className='listing-card_edit flex center'
                                    key={index}
                                >
                                    <ListingCard
                                        listing = {listing}
                                        index = {index}
                                    />

                                <div className='listing-card_edit--buttons'>
                                    <button className='listing-card_edit--button delete'
                                        onClick={()=>deleteListing(listing._id, getMyListings)}
                                    >
                                        <img
                                            className='listing-card_edit--button-img'
                                            src={trashBusketIcon}
                                        />
                                    </button>

                                    <button className='listing-card_edit--button edit'>
                                        <img
                                            className='listing-card_edit--button-img'
                                            src={changeIcon}
                                        />
                                    </button>
                                </div>

                                </div>
                            )}
                        
                        </div>
                        
                }
        </div>
    )
}