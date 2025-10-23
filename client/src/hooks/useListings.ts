import { useState, useEffect} from "react";
import photoValidator from "../utils/photoValidator";
import { photoErrorStatusInterface } from "../types/photoErrorStatusInterface";
import {fileData} from "../types/fileData"

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

    ] = useState<fileData[]>([]);

    

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
            photos: selectedFiles.map(item=>item.file),
        }

    }
    

    const photoChangeHandler = (event: React.ChangeEvent<HTMLInputElement>)=>{
        const files  = (event.currentTarget.files) ;

        if(!files){
            return 0
        }


        const validateResult = photoValidator(files)

        

        setSelectedFiles(validateResult.validFiles)
        setImageFileError(validateResult.photoErrorStatus)
    }

    const photoDeleteHandler = (choicedFile:fileData)=>{
        let result:fileData[] = []
        
        selectedFiles.forEach(fileData=>{
            if(fileData.fileURL !== choicedFile.fileURL){
                result.push(fileData)
            }
        })

        setSelectedFiles(result)
    }

    return{
        listingOnLoading,
        selectedFiles,
        imageFileError,
        
        createListing,
        photoChangeHandler,
        photoDeleteHandler,
    }
}