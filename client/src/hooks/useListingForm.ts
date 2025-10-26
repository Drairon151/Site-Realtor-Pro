import { useNavigate } from "react-router-dom";
import { useState} from "react";
import baseInputValidator from "../utils/baseInputValidator";

import { listingFormDataInterface } from "../types/listingFormDataInterface";
import { fileData } from "../types/fileData";

export default function useListingForm(){

    const URL_LISTING = 'http://localhost:5000/api/listing';
    
    const [
        listingOnLoading, 
        setListingOnLoading
    ] = useState(false) 

    const [
        listingOnError, 
        setListingOnError
    ] = useState<string|null>(null)
    
    const navigate = useNavigate();

    const createListing = async (
        event: React.FormEvent<HTMLFormElement>, 
        listingFormData: listingFormDataInterface,
        selectedFiles: fileData[], 
    ) => {
        
        
        event.preventDefault()
        setListingOnLoading(true)

        try{
            const listingData = {
                title: listingFormData.title,
                price: listingFormData.price,
                address: listingFormData.address,
                city: listingFormData.city,
                specs: listingFormData.specs,
                description: listingFormData.description,
                photos: selectedFiles,    
            }

            for (let inputValue of Object.values(listingFormData)){

                if(baseInputValidator(inputValue).validStatus == 'input is empty'){
                    setListingOnError('Все поля должны быть заполнены')
                    throw new Error('Все поля должны быть заполнены');
                }
            }

            const response =  await fetch(`${URL_LISTING}/createListing`,
                {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(listingData),
                credentials: 'include',
                }
            )

            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка создания формы')
            }

            const result = await response.json();

            navigate(result.listingURL)
            

        }catch(error){
        
        }
    }

    return{
        listingOnLoading,
        listingOnError,
        
        createListing,

    }
}