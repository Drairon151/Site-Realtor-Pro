import { useParams } from "react-router-dom";
import useListing from "../../../../hooks/useListing";
import { useEffect } from "react";

import './ListingCard.css'

export default function ListingCard() {
    const { listingId } = useParams<{ listingId: string }>();
    const {
        listing,
        getListingById,
    } = useListing() 

    useEffect(()=>{
        if(!listingId) {
            console.log('Плаки плаки')
            return
        }
        getListingById(listingId)
    },[])

    return(
        <div className="listing-card">
            <p className="listing-card_text listing-card_text--title">{listing?.title}</p>
            <p className="listing-card_text listing-card_text--price">{listing?.price}</p>
            <p className="listing-card_text listing-card_text--specs">{listing?.specs}</p>
            <p className="listing-card_text listing-card_text--city">{listing?.city}</p>
            <p className="listing-card_text listing-card_text--address">{listing?.address}</p>
            <p className="listing-card_text listing-card_text--description">{listing?.description}</p>

            <div className="listing-card_images flex">
                {!listing?.images 
                    ? null
                    : listing.images.map(url=>
                        <div className="listing-card_photo">
                            <img className="listing-card_photo-img" src={url}/>
                        </div>
                        )
                }
            </div>

            
        </div>
    )
}