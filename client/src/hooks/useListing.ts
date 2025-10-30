import { useState } from "react";

import { Listing } from "../types/listing";

export default function useListing() {
    const API_LISTING: string = 'http://localhost:5000/api/listing';
    
    const [
        listingLoading, 
        setListingLoading
    ] = useState(false);

    const [listing, setListing] = useState<Listing|null>(null)

    const getListingById = async (_id:string) => {
        setListingLoading(true);
        
        try{
            const response = await fetch(`${API_LISTING}/${_id}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                credentials: 'include',   
            })
            
            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.status || 'Listing response error')
            }
            
            const result = await response.json();
            setListing(result.listing);


        }catch(error){
            
        }finally{
            setListingLoading(false);
        }
    }
    return {
        listing,

        getListingById,
    }
}