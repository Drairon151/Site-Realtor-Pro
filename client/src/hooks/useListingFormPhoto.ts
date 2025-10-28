import { useState } from "react";

import photoValidator from "../utils/photoValidator";

import { photoErrorStatusInterface } from "../types/photoErrorStatusInterface";
import {fileData} from "../types/fileData"

export default function usePhotoUploader(){
    const [
        imageFileError,
        setImageFileError
    ] = useState<photoErrorStatusInterface[] | null>(null)

    const [
        
        selectedFiles, 
        setSelectedFiles

    ] = useState<fileData[]>([]);

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

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
        });
    };

    const photosBase64 = await Promise.all(
        selectedFiles.map(f => fileToBase64(f.file))
    );

    return{
        selectedFiles,
        imageFileError,
        
        photoChangeHandler,
        photoDeleteHandler,
    }
    
}