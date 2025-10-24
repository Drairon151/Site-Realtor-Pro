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

        try{
            const formData = new FormData(event.currentTarget);

            const listingData = {
                title: formData.get('title'),
                price: formData.get('price'),
                adress: formData.get('address'),
                sity: formData.get('city'),
                specs: formData.get('specs'),
                description: formData.get('description'),
                photos: selectedFiles.map(item=>item.file),
            }

        }catch(error){
            
        }
    }

    const inputValidator = (event: React.ChangeEvent<HTMLInputElement>)=>{
        const inputData = event.currentTarget;
        if(!inputData){
            
        }
                
    }
    

    const photoChangeHandler = (event: React.ChangeEvent<HTMLInputElement>)=>{
        const files  = (event.currentTarget.files) ;
        setImageFileError(null)

        if(!files){
            return 0
        }


        const validateResult = photoValidator(files)


        setSelectedFiles(prev=>{
            const newFiles = validateResult.validFiles.map(fileData=>{
                return {file: fileData, fileURL: URL.createObjectURL(fileData)}
            })

            return[...prev, ...newFiles]            
        })

        setImageFileError(prev=>{
            if(!prev){
                return[...validateResult.photoErrorStatus]
            }else{
                return[...prev, ...validateResult.photoErrorStatus]
            }
            }
        )

    }

    const photoDeleteHandler = (choicedFile:fileData)=>{
        let result:fileData[] = []
        setImageFileError(null)
        
        selectedFiles.forEach(fileData=>{
            if(fileData.fileURL !== choicedFile.fileURL){
                result.push(fileData)
            }else{
                URL.revokeObjectURL(fileData.fileURL)
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