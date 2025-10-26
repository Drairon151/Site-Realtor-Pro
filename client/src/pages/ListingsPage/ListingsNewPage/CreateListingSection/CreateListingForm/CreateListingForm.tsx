import { useEffect,useState } from "react"

import useListingForm from "../../../../../hooks/useListingForm"
import useListingFormField from "../../../../../hooks/useListingFormField"
import useListingFormPhoto from "../../../../../hooks/useListingFormPhoto"

import "./CreateListingForm.css"

export default function CreateListingForm(){
    const {
        listingOnError,

        createListing,
    } = useListingForm()

    const {
        selectedFiles,
        imageFileError,
        
        photoChangeHandler,
        photoDeleteHandler,
    } = useListingFormPhoto()
    
    const {
        listingFormData,
        formatPrice,

        listingInputValidator,
    } = useListingFormField()

    return (
        <form className="create-listing-form form" onSubmit={event=>createListing(event,listingFormData,selectedFiles)}>
            <label className="create-listing-form_lable" htmlFor="listing-input-title">Название обьявления</label>
            <input
                className="create-listing-form_input"
                id="listing-input-title"
                name="title" 
                type="text"
                value={listingFormData.title}
                onChange={listingInputValidator}
                placeholder="Большой дом в селе Шишкино"
            />

            <label className="create-listing-form_lable" htmlFor="listing-input-price">Цена</label>
            
            <div>
                <input
                    className="create-listing-form_input create-listing-form_input-price"
                    id="listing-input-price"
                    name="price"
                    type="text"
                    value={`${formatPrice}`}
                    onChange={listingInputValidator}
                    placeholder="10 000 000"
                />
                <span className="create-listing-form_currency">₽</span>
            </div>
            <label className="create-listing-form_lable" htmlFor="listing-input-address">Адрес</label>
            <input
                className="create-listing-form_input"
                id="listing-input-address"
                name="address"
                type="text"
                value={listingFormData.address}
                onChange={listingInputValidator}
                placeholder="Г. Смоленск С. Шишкино Ул. Капиталистическая Д. 123"
            />

            <label className="create-listing-form_lable" htmlFor="listing-input-city">Город</label>
            <input
                className="create-listing-form_input"
                id="listing-input-city"
                name="city"
                type="text"
                value={listingFormData.city}
                onChange={listingInputValidator}
                placeholder="Смоленск"
            />
            
            <label className="create-listing-form_lable" htmlFor="listing-input-specs">Характеристики дома</label>
            <input
                className="create-listing-form_input"
                id="listing-input-specs"
                name="specs"
                type="text"
                value={listingFormData.specs}
                onChange={listingInputValidator}
                placeholder="2-этаж 2-ком 22м² 10сот "
            />

            <label className="create-listing-form_lable" htmlFor="listing-input-description">Описание обьявления</label>
            <textarea
                className="create-listing-form_textarea"
                id="listing-input-description"
                name="description"
                value={listingFormData.description}
                onChange={listingInputValidator}
                maxLength={5000}
                rows={6}
                placeholder="Уютный двухэтажный дом с двумя комнатами и прекрасным видом на озеро 'Болото'. Возможен небольшой торг. Качество материалов как и ремонта - Советское."
            />

            <div>
                <label 
                    className="create-listing-form_lable create-listing-form_lable--photos" 
                    htmlFor="listing-input-photos"
                >
                    Фотографии обьявления
                </label>
                
                <input
                    className="create-listing-form_input create-listing-form_input--photos"
                    id="listing-input-photos"
                    name="photos"
                    type="file"
                    accept="image/*,.png,.jpg,.webp"
                    multiple

                    onChange={photoChangeHandler}
                />
            </div>

            {!imageFileError ? null: 
            
            <div className="photos-error">
                <p>Произошла ошибка загрузки данных файлов:</p>
                {imageFileError.map(fileError=>{
                    return <p className="photos-error-message">
                        {`Имя файла: ${fileError.fileName}, ошибка:${fileError.errorType}\n`}
                        </p>
                })}
            </div>

            }

            <div className="user-photos flex">
                {
                !selectedFiles ? null 
                    : selectedFiles.map(fileData=>
                    <div className="user-photos_item">
                        <button className="user-photos_button" onClick={()=>photoDeleteHandler(fileData)}>❌</button>
                        <img className="user-photos_img" src={fileData.fileURL} alt=""/>
                    </div>
                )
                }
            </div>

            <button type="submit" className="create-listing-form_button form_button">Отправить</button>

            {!listingOnError ? null:
                <p className="create-listing-form--error">
                    {listingOnError}
                </p>
            }

        </form>
    )
}