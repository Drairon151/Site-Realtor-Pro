import { useNavigate } from "react-router-dom";
import { useState} from "react";
import baseInputValidator from "../utils/baseInputValidator";

import { listingFormDataInterface } from "../types/listingFormDataInterface";
import { fileData } from "../types/fileData";

export default function useListingForm(){

    const API_LISTING = 'http://localhost:5000/api/listing';
    
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

        console.log('Массив фоток перед отправкой ',selectedFiles.map(file=>file.file),)

        try{
            for (let inputValue of Object.values(listingFormData)){

                if(baseInputValidator(inputValue).validStatus == 'input is empty'){
                    setListingOnError('Все поля должны быть заполнены')
                    throw new Error('Все поля должны быть заполнены');
                }
            }

            const formData = new FormData();
            formData.append('title',listingFormData.title)
            formData.append('price',listingFormData.price)
            formData.append('specs',listingFormData.specs)
            formData.append('city',listingFormData.city)
            formData.append('address',listingFormData.address)
            formData.append('description',listingFormData.description)
            selectedFiles.forEach(f => formData.append('photos', f.file));

            const response =  await fetch(`${API_LISTING}/createListing`,
                {
                method: 'POST',
                body: formData,
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