import { useState } from "react";
import { Listing } from "../types/listing";

export default function useListings(){
    const API_LISTINGS = 'http://localhost:5000/api/listings'

    const [myListings, setMyListings] = useState<Listing[]|null>(null)

    const getMyListings = async ()=>{

        try{

            const response = await fetch(`${API_LISTINGS}/my`,{
                method: 'POST',
                credentials: 'include',   
            })

            if (!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.status || 'Respons my listings error')
            }

            const result = await response.json(); 

            setMyListings(result.listings)
            console.log('Данные обьявлений получены: ',result.listings)
        }catch(error){

        }

    }

    return {
        myListings,
        getMyListings,
    }
    
}