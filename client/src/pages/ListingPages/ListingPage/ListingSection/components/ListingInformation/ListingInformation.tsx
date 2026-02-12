import useMessanger from "../../../../../../hooks/useMessanger";
import { Listing } from "../../../../../../types/listing";

import './ListingInformation.css'

interface ListingInformation{
    listingId:string
    listing:Listing
    listingAuthorPhone: string|null,
    getListingAuthorPhone: (_id:string)=>{}
}


export default function ListingInformation({listingId,listing,listingAuthorPhone,getListingAuthorPhone}:ListingInformation){

    const {
        createNewChat
    } = useMessanger()

    return(
        <div className="listing-information">
            <div className="listing-information_content">
                <h1 className="listing-info_title">{listing.title}</h1>

                <p className="listing-info_base listing-info_base--price"
                >
                    <span className="listing-info_base">
                        Цена:
                    </span>
                    {String(listing.price).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')}₽
                </p>
                
                <p className="listing-info_base listing-info_base--specs"
                >
                    <span className="listing-info_base">
                        Характеристики:
                    </span>
                    {listing.specs}
                </p>
                
                <p className="listing-info_base listing-info_base--city"
                >
                    <span className="listing-info_base">
                        Город:    
                    </span> 
                    {listing.city}
                </p>

                <p className="listing-info_base listing-info_base--address"
                >
                    <span className="listing-info_base">
                        Адрес:
                    </span> {listing.address}
                </p>

                <p className="listing-info_base listing-info_base--description"
                >
                    <span className="listing-info_base">
                        Описание: 
                    </span> 
                    {listing.description}
                </p>
            </div>

            <div className="listing-information_buttons flex center">
                <button className="listing-info_button listing-info_button--numberPhone"
                    onClick={
                        !listingAuthorPhone
                        ?()=>getListingAuthorPhone(listingId)
                        :()=>{}
                    }
                >
                    { !listingAuthorPhone 
                        ? 'Узнать номер'
                        : listingAuthorPhone
                    }
                </button>

                <button 
                    className="listing-info_button listing-info_button--writeSeller"
                    onClick={()=>createNewChat(listing.realtor_id)}    
                >
                    Написать продавцу
                </button>
            </div>
        </div>
    )

}