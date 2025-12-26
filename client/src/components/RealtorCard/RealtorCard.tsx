import './RealtorCard.css'

import {Realtor} from '../../types/realtor'

import plug from '../../assets/img/icons/plug.png'

interface RealtorCard{
    realtor:Realtor
} 

export default function RealtorCard({realtor}:RealtorCard){
    return (

        <div
            className="realtor-card"
        >
            <div
                className='flex center'
            >
                <div
                    className="realtor-card_realtor-info"
                >

                    <img 
                        className="realtor-info_avatar"
                        src={realtor.avatarUrl??plug}
                    />

                    <div
                        className='realtor-info_full-name'
                    >
                        <p>{realtor.name}</p>
                        <p>{realtor.surname}</p>
                        <p>{realtor.patronymic}</p>
                    </div>

                </div>

                <div
                    className='realtor-card_realtor-description'
                >

                    <p
                        className='realtor-description_text'
                    ><span>Успешных сделок: </span>{realtor.successfulTransactions}</p>
                    <p
                        className='realtor-description_text'
                    ><span>Стоимость услуг: </span>{realtor.priceList}</p>
                    <p
                        className='realtor-description_text'
                    ><span>Город: </span>{realtor.city}</p>
                    <p
                        className='realtor-description_text'
                    ><span>О себе:</span>{realtor.realtorDescription}</p>

                </div>
            </div>

            <div
                className='realtor-card_buttons flex center'
            >

                <button
                    className='realtor-card_button realtor-card_button--numberPhone'
                >Узнать номер</button>

                <button
                    className='realtor-card_button realtor-card_button--writeSeller'
                >Написать</button>

            </div>

        </div>

    )
}