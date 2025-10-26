import { useState, useEffect } from "react";
import { listingFormDataInterface } from "../types/listingFormDataInterface";
import baseInputValidator from "../utils/baseInputValidator";

export default function useListingFormField(){
    const [listingFormData, setListingFormData]=useState<listingFormDataInterface>({
        title: '',
        price: '',
        address: '',
        city: '',
        specs: '',
        description: '',
    })

    const [formatPrice, setFormatPrice] = useState<string>('');

    const listingInputValidator = (event: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>{
        const inputElement = event.currentTarget;
        const baseValidResult = baseInputValidator(inputElement.value)
        if(baseValidResult.validStatus == 'input is empty'){
            inputElement.classList.add('create-listing-form--error')
        }else{
            inputElement.classList.remove('create-listing-form--error')
        }
        
        switch(inputElement.name){
            case 'title':
            case 'description':
            case 'specs':
            case 'address':
            case 'city':
                setListingFormData(prev => {return {...prev, [inputElement.name]: inputElement.value} })
                break

            case 'price':
                let clearPrice = inputElement.value.replace(/\D/g,'')

                setListingFormData(prev => {return {...prev, price: clearPrice} })
                setFormatPrice(clearPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ' '))

                break

        }

    }


    return{
        listingFormData,
        formatPrice,

        listingInputValidator,
    }

}