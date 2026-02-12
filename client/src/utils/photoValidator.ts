import { photoErrorStatusInterface } from "../types/photoErrorStatusInterface";
interface photoValidatorResult{
    validFiles: File[],
    photoErrorStatus: photoErrorStatusInterface[],
}

export default function photoValidator(files:FileList):photoValidatorResult{
    const filesArr = Array.from(files);

    const ALLOWED_IMAGE_TYPES = ['image/jpeg','image/webp', 'image/png'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    let photoErrorStatus: photoErrorStatusInterface[] = [];

    let validFiles:File[] = []

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
            validFiles.push(fileData);
        }
    });


    return {
        
        validFiles,

        photoErrorStatus,
    }

}