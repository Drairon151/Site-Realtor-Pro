import ProfileUserCard from "./ProfileUserCard/ProfileUserCard";


import './ProfileSection.css'

import useAuth from '../../../hooks/useAuth'
import { useUserContext } from "../../../context/UserContext";
import ProfileRealtorCard from "./ProfileRealtorCard/ProfileRealtorCard";
import { Realtor } from "../../../types/realtor";
import useRealtor from "../../../hooks/useRealtor";
import { useEffect } from "react";


export default function Profile(){

    const {
        user,
        updateUserField,
        sendVerifyCodeChangePassword,
    } = useUserContext()

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