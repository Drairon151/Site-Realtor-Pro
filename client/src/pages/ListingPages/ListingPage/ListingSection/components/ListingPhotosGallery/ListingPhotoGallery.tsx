import {useEffect, useState} from 'react';

import './ListingPhotoGallery.css'

import plug from '../../../../../../assets/img/icons/plug.png'

interface ListingPhotoGallery{
    listingImagesUrls: string[];
    listingTitle: string;
}

export default function ListingPhotoGallery({listingImagesUrls, listingTitle}:ListingPhotoGallery){

    const [
        listingPhotoIndex,
        setListingPhotoIndex,
    ] = useState(0)

    function changeSelectPhotoHandler(operator: string){
        switch (operator) {
            case 'increment':
                if(listingPhotoIndex == (listingImagesUrls.length! - 1)){
                    setListingPhotoIndex(0)
                }else{
                    setListingPhotoIndex(prev=>++prev)
                }
                break;

            case 'decrement':
                if(listingPhotoIndex == 0){
                    setListingPhotoIndex(listingImagesUrls.length!-1)
                }else{
                    setListingPhotoIndex(prev=>--prev)
                }
                break;

            default:
                break;
        }
    }

    return(
            <div className="listing-photos-gallery">
                {
                    listingImagesUrls.length == 0
                    ?
                        <div className="selected-photo flex">

                            <span
                                className="selected-photo_blur-img-background"
                                style={{backgroundImage:`url(${plug})`}}
                            ></span>

                            <img 
                                className="selected-photo_img" 
                                src={plug}
                                alt={listingTitle}
                            />
                        </div>
                    :
                    <>
                <div className="image-frame flex">
                    <div className="image-frame__controlButtonArea image-frame__controlButtonArea-left"
                        onClick={()=>changeSelectPhotoHandler('decrement')}
                    >
                        
                        <button 
                            className="image-frame__control--button image-frame__control--button-decrement"
                        />
                    </div>

                    <div className="selected-photo flex">

                        <span
                            className="selected-photo_blur-img-background"
                            style={{backgroundImage:`url(${listingImagesUrls[listingPhotoIndex]})`}}
                        ></span>

                        <img 
                            className="selected-photo_img" 
                            src={listingImagesUrls[listingPhotoIndex]}
                            alt={listingTitle}
                        />
                    </div>

                    <div className="image-frame__controlButtonArea image-frame__controlButtonArea-right"
                        onClick={()=>changeSelectPhotoHandler('increment')}
                    >
                        <button 
                            className="image-frame__control--button image-frame__control--button-increment flex center"
                        />
                    </div>
                </div>

                <div className="images-preview">
                    {
                        !listingImagesUrls
                            ? null
                            : listingImagesUrls.map((img, index)=>(
                                <img
                                    className="images-preview_img" 
                                    src={img}
                                    key={index}
                                    onClick={()=>setListingPhotoIndex(index)}
                                />
                            ))
                        
                    }

                </div>
                </>
                }
            </div>
    )

}