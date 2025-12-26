import ProfileUserCard from "./ProfileUserCard/ProfileUserCard";


import './ProfileSection.css'

import useUser from '../../../hooks/useUser'
import useAuth from '../../../hooks/useAuth'
import { useUserContext } from "../../../context/UserContext";
import ProfileRealtorCard from "./ProfileRealtorCard/ProfileRealtorCard";
import { Realtor } from "../../../types/realtor";
import useRealtor from "../../../hooks/useRealtor";
import { useEffect } from "react";


export default function Profile(){

    const{user} = useUserContext()

    const {
        updateUserField,
        sendVerifyCodeChangePassword,
    } = useUser()

    const{
        getRealtorData,
        changeRealtorData,

        realtor,
    } = useRealtor()
    
    const {
        logout,
    } = useAuth()
    
    if(!user){
        return null
    }

    useEffect(()=>{
        getRealtorData()
    },[])

    const testData:Realtor  = {
        name: 'Антон',
        surname: 'Штукатуркович',
        patronymic: 'Красочник',

        numberPhone: '+8 923 456 09 06',

        workExp: 'Более 3 лет',
        city: 'Смоленск',
        priceList: 'От 10 000 $',
        realtorDescription: 'Имею богатый опыт работы Риелтором. Бабушка мне всегда говорила что у меня талант продавать барахло. Так что я могу продать любой дом. На индейском кладбище, биолаборотории, ядерном полигоне и тд.',

        avatarUrl: null,
    }

    return(
        <section className="profile-section">

            <div className="profile-section_container flex center">
                <ProfileUserCard
                    user={user}
                    updateUserField={updateUserField}
                    sendVerifyCodeChangePassword={sendVerifyCodeChangePassword}

                    logout={logout}
                />
            
                {
                user.role != 'realtor' || !realtor 
                ? null
                :
                    <ProfileRealtorCard
                        changeRealtorData={changeRealtorData}
                        realtor={realtor}
                    />
                }

            </div>

        </section>
    )
}