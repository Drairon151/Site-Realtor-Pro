import { photoErrorStatusInterface } from "../types/photoErrorStatusInterface";
import {fileData} from "../types/fileData"

interface photoValidatorResult{
    validFiles: {file:File, fileURL:string }[],
    photoErrorStatus: photoErrorStatusInterface[],
}

export default function photoValidator(files:FileList):photoValidatorResult{
    const filesArr = Array.from(files);

    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    let photoErrorStatus: photoErrorStatusInterface[] = [];

    let validFiles:fileData[] = []

    filesArr.forEach(fileData => {

        if(!ALLOWED_IMAGE_TYPES.includes(fileData.type)){
            photoErrorStatus.push({
                fileName: fileData.name, 
                errorType:'invalid file type'
            })
        }else if (fileData.size > MAX_FILE_SIZE){
            photoErrorStatus.push({
                fileName: fileData.name, 
                errorType:'invalid file size'
            })
        }else{
            
            validFiles.push({file:fileData, fileURL: URL.createObjectURL(fileData)});
        }
    });


    return {
        
        validFiles,

        photoErrorStatus,
    }

}