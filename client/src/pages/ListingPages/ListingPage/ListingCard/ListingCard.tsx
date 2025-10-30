import { useParams } from "react-router-dom";
import useListing from "../../../../hooks/useListing";
import { useEffect } from "react";

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
            <p>{listing?.title}</p>
            <p>{listing?.price}</p>
            <p>{listing?.specs}</p>
            <p>{listing?.city}</p>
            <p>{listing?.address}</p>
            <p>{listing?.description}</p>

            {!listing?.photosUrls 
            ? null
            : listing.photosUrls.map(url=><img src={url}/>)
            }

            
        </div>
    )
}