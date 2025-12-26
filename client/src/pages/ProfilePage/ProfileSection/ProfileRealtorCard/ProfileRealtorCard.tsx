import React, {useState,useEffect} from 'react';

import './ProfileRealtorCard.css'

import { RealtorData } from "../../../../types/realtorData"

interface ProfileRealtorCard{
    changeRealtorData:(event:React.FormEvent<HTMLFormElement>,changedRealtorData:RealtorData)=>void,
    realtor:RealtorData
}

export default function ProfileRealtorCard({changeRealtorData, realtor}:ProfileRealtorCard){
    
    
        const [editRealtor, setEditRealtor] = useState<RealtorData>(realtor)
    
        useEffect(() => {
            setEditRealtor(realtor);
        }, [realtor]);
    
        function editRealtorHandler(event:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>){
            const target = event.currentTarget
            setEditRealtor(prev=>{
                return {
                    ...prev,
                    [target.name]:target.value
                }
            })
        }

    return(
        <div
            className='user-realtor-info'
        >
            <p
                className='flex center'
            >Риелторская информация</p>

            <form
                className='user-realtor-info_form-edit'
                onSubmit={event=>{
                    changeRealtorData(event,editRealtor)
                }}
            >


                <div
                    className='realtor-info_edit'
                >
                    <label
                        className='realtor-info_edit--lable'
                        htmlFor='realtor-info_price-list'
                    >Стоимость услуг ₽:</label>
                    <input
                        id="realtor-info_price-list"
                        className='realtor-info_edit--input'
                        value={editRealtor.priceList}
                        name='priceList'
                        type='number'
                        onChange={editRealtorHandler}
                    ></input>
                </div>

                <div
                    className='realtor-info_edit'
                >
                    <label
                        className='realtor-info_edit--lable'
                        htmlFor='realtor-info_city'
                    >Город:</label>
                    <input
                        id="realtor-info_city"
                        className='realtor-info_edit--input'
                        value={editRealtor.city}
                        name='city'
                        type='text'
                        onChange={editRealtorHandler}
                    ></input>
                </div>

                <div
                    className='realtor-info_edit'
                >
                    <label
                        className='realtor-info_edit--lable'
                        htmlFor='realtor-info_description'
                    >О себе:</label>

                    <textarea
                        className="realtor-info_edit--text-area"
                        id="realtor-info_description"
                        name="realtorDescription"
                        value={editRealtor.realtorDescription}
                        onChange={editRealtorHandler}
                        maxLength={5000}
                        rows={6}
                        placeholder="Лучше звоните Солу снимали на моём примере. Авторы вдохновлялись мной хоть и не признаются"
                    />

                </div>

                <div
                    className='realtor-info_edit flex center'
                >
                    <button
                        className='realtor-info_change-save-button'
                        type='submit'
                    >
                        Сохранить изменения
                    </button>
                </div>
            </form>
        </div>
    )
}