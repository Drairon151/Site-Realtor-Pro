import useListings from "../../../../../hooks/useListingForm"
import { useEffect,useState } from "react"

import "./CreateListingForm.css"

export default function CreateListingForm(){
    const {
        selectedFiles,

        createListing,
        photoChangeHandler,
        photoDeleteHandler,

    } = useListings()
    

    return (
        <form className="create-listing-form form" onSubmit={createListing}>
            <label className="create-listing-form_lable" htmlFor="listing-input-title">Название обьявления</label>
            <input
                className="create-listing-form_input"
                id="listing-input-title"
                name="title" 
                type="text" 

            />

            <label className="create-listing-form_lable" htmlFor="listing-input-price">Цена</label>
            <input
                className="create-listing-form_input"
                id="listing-input-price"
                name="price"
                type="number"

            />
            
            <label className="create-listing-form_lable" htmlFor="listing-input-address">Адрес</label>
            <input
                className="create-listing-form_input"
                id="listing-input-address"
                name="address"
                type="text"

            />

            <label className="create-listing-form_lable" htmlFor="listing-input-city">Город</label>
            <input
                className="create-listing-form_input"
                id="listing-input-city"
                name="city"
                type="text"

            />
            
            <label className="create-listing-form_lable" htmlFor="listing-input-specs">Характеристики дома</label>
            <input
                className="create-listing-form_input"
                id="listing-input-specs"
                name="specs"
                type="text"

            />

            <label className="create-listing-form_lable" htmlFor="listing-input-description">Описание обьявления</label>
            <textarea
                className="create-listing-form_textarea"
                id="listing-input-description"
                name="description"
                maxLength={5000}
                rows={6}
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

        </form>
    )
}