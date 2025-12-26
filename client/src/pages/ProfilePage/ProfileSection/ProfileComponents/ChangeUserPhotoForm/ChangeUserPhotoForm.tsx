import React, {useRef, useState} from 'react';

import useUser from "../../../../../hooks/useUser"
import './ChangeUserPhotoForm.css'

import loadPhotoIcon from '../../../../../assets/img/icons/galleryIcon.svg'
import makePhotoIcon from '../../../../../assets/img/icons/photoCameraLogo.svg'

interface ChangePasswordForm{
    onClose: ()=>void,
}

export default function ChangePasswordForm({onClose}:ChangePasswordForm){
    const{
        changeUserPhoto,
    }=useUser()

    const loadPhotoRef = useRef<HTMLInputElement>(null)
    const [photoLoaded,setPhotoLoaded] = useState<null|FileList>(null)
    const [currentPhoto,setCurrentPhoto] = useState<string>(makePhotoIcon)

    function changePhotoClickHandler(){
        console.log('Проверка')
        loadPhotoRef.current?.click()
    }

    function changePhotoChangeHandler(event:React.ChangeEvent<HTMLInputElement>){
        const newPhoto = event.target.files;
        if (newPhoto && newPhoto.length == 1) {
            setCurrentPhoto(URL.createObjectURL(newPhoto[0]))
            setPhotoLoaded(newPhoto)
        }
    }

    function saveNewPhotoHandler(){
        if(!photoLoaded){return 0}
        changeUserPhoto(photoLoaded)
    }

    return(

        <>
        
            <div
                className="change-user-avatar"
            >
                <p className="change-user-avatar_description flex center">Выберите изображение</p>
                
                <div
                    className="change-user-avatar-menu_option-list flex "
                >
                    <div
                        className="change-user-avatar-menu select-photo flex center"

                        onClick={changePhotoClickHandler}
                    >
                        <input
                            className="select-photo_file-input"
                            type='file'
                            accept="image/*,.png,.jpg,.webp"
                            ref={loadPhotoRef}
                            onChange={changePhotoChangeHandler}
                        />

                        <img
                            className="change-photo load-photo-icon"
                            src={loadPhotoIcon}
                        />

                        <p className="change-photo description">
                            Загрузить фото
                        </p>
                    </div>

                    <div
                        className="change-user-avatar-menu make-photo flex center"
                    >

                        <img
                            className="user-photo"
                            src={currentPhoto}
                        />
                        {   
                            photoLoaded?
                                <button
                                    className='change-photo_save-button'
                                    onClick={saveNewPhotoHandler}
                                >
                                    Сохранить изменения
                                </button>
                            :null
                        }
                    </div>
                </div>
            </div>
            <button 
                onClick={onClose}
            >✖️</button>

        </>

    )
}