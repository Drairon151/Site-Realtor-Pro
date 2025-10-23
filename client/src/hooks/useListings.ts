import { useState, useEffect} from "react";
import photoValidator from "../utils/photoValidator";
import { photoErrorStatusInterface } from "../types/photoErrorStatusInterface";

export default function useListings(){
    const [
        listingOnLoading, 
        setListingOnLoading
    ] = useState(false) 

    const [
        imageFileError,
        setImageFileError
    ] = useState<photoErrorStatusInterface[] | null>(null)

    const [
        
        selectedFiles, 
        setSelectedFiles

    ] = useState<{files: File[], filesURL:string}[]>([]);

    

    const createListing = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setListingOnLoading(true)

        const formData = new FormData(event.currentTarget);

        const listingData = {
            title: formData.get('title'),
            price: formData.get('price'),
            adress: formData.get('adress'),
            sity: formData.get('sity'),
            specs: formData.get('specs'),
            description: formData.get('description'),
            photos: selectedFiles.files,
        }

    }
    

    const photoChangeHandler = (event: React.ChangeEvent<HTMLInputElement>)=>{
        const files  = (event.currentTarget.files) ;

        if(!files){
            return 0
        }


        const validateResult = photoValidator(files)

        

        setSelectedFiles(prev=>{
            return{...prev,files:validateResult.validFiles}
        })
        setImageFileError(validateResult.photoErrorStatus)
    }

    return{
        listingOnLoading,
        selectedFiles,
        imageFileError,
        
        createListing,
        photoChangeHandler,
    }
}