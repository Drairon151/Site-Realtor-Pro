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





    const fileToBase64 = (file:File): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {

                if(typeof reader.result == 'string'){
                    resolve(reader.result.split(',')[1])
                }else{
                    reject(new Error('Incorrect data'))
                }

            };
            reader.onerror = reject;
        });
    };

    const photosBase64 = async (files: fileData[]): Promise<string[]> => {
        const results = await Promise.allSettled(files.map(files=>fileToBase64(files.file)));
        return results
            .filter((res): res is PromiseFulfilledResult<string> => res.status === 'fulfilled')
            .map(res => res.value);
    };

    return{
        selectedFiles,
        imageFileError,
        
        photoChangeHandler,
        photoDeleteHandler,

        photosBase64,
    }
    
}