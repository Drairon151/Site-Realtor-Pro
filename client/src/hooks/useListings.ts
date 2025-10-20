import { useState, useEffect} from "react";

export default function useListings(){
    const [
        listingOnLoading, 
        setListingOnLoading
    ] = useState(false) 

    const [
        imageFileError,
        setImageFileError
    ] = useState('not-error')

    const [
        
        selectedFiles, 
        setSelectedFiles

    ] = useState<File[]>([]);

    const createListing = async (event: React.FormEvent<HTMLFormElement>) => {


        event.preventDefault()
        setListingOnLoading(true)

        const formData = new FormData(event.currentTarget);
        const files = formData.getAll('photos')  as File[];;
        const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
        const MAX_FILE_SIZE = 5 * 1024 * 1024;

        console.log('Файлы типа', files)

        const validFiles = files.map(file => {

            if(!ALLOWED_IMAGE_TYPES.includes(file.type)){
                setImageFileError('invalid file type')    
            }else if (file.size > MAX_FILE_SIZE){
                setImageFileError('invalid file size')
            }
            
        });

        const listingData = {
            title: formData.get('title'),
            price: formData.get('price'),
            adress: formData.get('adress'),
            sity: formData.get('sity'),
            specs: formData.get('specs'),
            description: formData.get('description'),
            photos: formData.get('photos'),
        }

    }

    return{
        listingOnLoading,
        selectedFiles,
        
        createListing,
    }
}