import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Listing } from "../../../../../../types/listing"

import './ListingCard.css'

interface ListingCard{
    listing: Listing
    index: number
}

export default function ListingCard({listing, index}:ListingCard){

    const [listingCardPhotoId, setListingCardPhotoId] = useState<number>(0)

    const [listingCardPhotos, setListingCardPhotos] = useState<string[]>([])

    const navigate = useNavigate()

    // useEffect(()=>{
    //     const imagesLength = listing.images.length
    //     for(
    //         let imageIndex = 0; 
    //         imagesLength <= 5
    //             ? imageIndex <= imagesLength-1
    //             : imageIndex <= 5; 
    //         imageIndex++
    //     ){

    //         setListingCardPhotos(
    //             prev => {
    //                 return [...prev, listing.images[imageIndex]]
    //             }
    //         )
            
    //     }
    // },[])

    function openListingPageHandler(_id:string){
        navigate(`../listing/${_id}`)
    }

    useEffect(()=>{
        setListingCardPhotos(listing.images.slice(0,5))
    },[])


    return(
        <div 
            className="listing-card flex"
            key={index}
            onClick={()=>openListingPageHandler(listing._id)}
        >
            {

                !listingCardPhotos
                    ? 
                        <div>
                            Фоточек ниту
                        </div>
                    :
                        <div className="photo-slider_wrapper flex center">
                            <div className="photo-slider flex">

                                <img 
                                    className="photo-slider_select-image"
                                    src={listing.images[listingCardPhotoId]}
                                />  


                                <ul className="photo-slider_list flex">
                                    {
                                        listingCardPhotos.map((image, index)=>
                                        <>
            
                                            <li 
                                                className="photo-slider_list--item flex"
                                                onMouseOver={()=>setListingCardPhotoId(index)}
                                                key={index}
                                            >
                                            </li>

                                        </>
                                    )
                                    }
                                </ul>
                            </div>
                        </div>
            }

            <div className="listing-card_information">
                <p className="listing-card_info listing-card_info--title">{listing.title}</p>
                <p className="listing-card_info listing-card_info--price"
                
                >
                    <span className="listing-card_info--span">
                        Цена:
                    </span>
                    {String(listing.price).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')}₽
                </p>
                <p className="listing-card_info listing-card_info--specs"
                
                >
                    <span className="listing-card_info--span">
                        Характеристики:
                    </span>
                    {listing.specs}
                </p>
                <p className="listing-card_info listing-card_info--city"
                
                >
                    <span className="listing-card_info--span">
                        Город:
                    </span>
                    {listing.city}
                </p>
                <p className="listing-card_info listing-card_info--address"
                
                >
                    <span className="listing-card_info--span">
                        Адрес:
                    </span>
                    {listing.address}
                </p>
                <p className="listing-card_info listing-card_info--description"
                
                >
                    <span className="listing-card_info--span">
                        Описание:
                    </span>
                    {listing.description}
                </p>
            </div>
        </div>
    )
}