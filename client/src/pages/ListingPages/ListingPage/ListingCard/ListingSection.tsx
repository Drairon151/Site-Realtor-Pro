import { useParams } from "react-router-dom";
import useListing from "../../../../hooks/useListing";
import { useEffect, useState } from "react";

import './ListingSection.css'

export default function ListingSection() {
    const { listingId } = useParams<{ listingId: string }>();
    const {
        listing,
        getListingById,
    } = useListing() 

    const [
        listingPhotoIndex,
        setListingPhotoIndex,
    ] = useState(0)
    
    useEffect(()=>{
        if(!listingId) {
            console.log('Плаки плаки')
            return
        }
        getListingById(listingId)
    },[])
    
    // function changeSelectPhotoHandler(event: React.MouseEvent<HTMLButtonElement>){
    //     if(event.currentTarget.dataset.operator == 'increment'){
    //         setListingPhotoIndex(prev=>prev++)
    //     }else(event.currentTarget.dataset.operator == 'decrement'){
    //         setListingPhotoIndex(prev=>prev--)
    //     }
    // }

    

    return(
        <div className="listing-section">
            <div className="listing-photos-gallery">
                <div className="image-frame flex">
                    <div className="image-frame__controlButtonArea">
                        <button 
                            className="image-frame__control--button image-frame__control--button-decrement"
                            onClick={()=>setListingPhotoIndex(prev=>prev--)}
                        />
                    </div>
                    <img 
                        className="selected-photo_img" 
                        src={listing?.images[listingPhotoIndex]}
                        alt={listing?.title}
                    />
                    <div className="image-frame__controlButtonArea">
                        <button 
                            className="image-frame__control--button image-frame__control--button-increment"
                            onClick={()=>setListingPhotoIndex(prev=>prev++)}
                        />
                    </div>
                </div>

                <div className="images-preview flex">
                    {
                        !listing?.images
                            ? null
                            : listing.images.map(img=>(
                                <img
                                    className="images-preview_img" 
                                    src={img}
                                />
                            ))
                    }
                </div>
            </div>            

        </div>
    )
}