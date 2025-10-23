import { photoErrorStatusInterface } from "../types/photoErrorStatusInterface";

interface photoValidatorResult{
    validFiles: File[],
    photoErrorStatus: photoErrorStatusInterface[],
}

export default function photoValidator(files:FileList):photoValidatorResult{
    const filesArr = Array.from(files);

    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    let photoErrorStatus: photoErrorStatusInterface[] = [];

    let validFiles:File[] = []

    filesArr.forEach(file => {

        if(!ALLOWED_IMAGE_TYPES.includes(file.type)){
            photoErrorStatus.push({
                fileName: file.name, 
                errorType:'invalid file type'
            })
        }else if (file.size > MAX_FILE_SIZE){
            photoErrorStatus.push({
                fileName: file.name, 
                errorType:'invalid file size'
            })
        }else{
            validFiles.push(file);
        }
    });

    return {
        
        validFiles,
        photoErrorStatus,
    }

}