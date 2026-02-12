import { useNavigate, useParams } from "react-router-dom";
import useListing from "../../../../hooks/useListing";
import { useEffect, useState } from "react";

import './ListingSection.css'
import ListingPhotoGallery from "./components/ListingPhotosGallery/ListingPhotoGallery";
import ListingInformation from "./components/ListingInformation/ListingInformation";

export default function ListingSection() {
    const { listingId } = useParams<{ listingId: string }>();
    
    const navigate = useNavigate()
    
    const {
        listing,
        listingAuthorPhone,
        
        getListingById,
        getListingAuthorPhone,
    } = useListing() 
    
    useEffect(()=>{
        if(!listingId) {
            navigate('/')
        }else{
            getListingById(listingId)
        }
    },[])

    return(
        <div className="listing-section flex">

            {
                !(listing && listingId)
                    ?'Загрузка'
                    :
                        <div className="listing-content flex center">
                            <ListingPhotoGallery
                                listingImagesUrls={listing.images}
                                listingTitle = {listing.title}
                            />

                            <ListingInformation
                                listingId={listingId}
                                listing={listing}
                                listingAuthorPhone={listingAuthorPhone}
                                getListingAuthorPhone={getListingAuthorPhone}
                            />
                        </div>
            }

        

        </div>
    )
}