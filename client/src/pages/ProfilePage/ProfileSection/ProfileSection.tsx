import ProfileUserCard from "./ProfileUserCard/ProfileUserCard";


import './ProfileSection.css'

import useUser from '../../../hooks/useUser'
import useAuth from '../../../hooks/useAuth'


export default function Profile(){


    const {
        user,
        updateUserField,
        sendVerifyCodeChangePassword,
    } = useUser()
    
    const {
        logout,
    } = useAuth()
    
    if(!user){
        return null
    }

    return(
        <section className="profile-section">

            <div className="profile-section_container">
                <ProfileUserCard
                    user={user}
                    updateUserField={updateUserField}
                    sendVerifyCodeChangePassword={sendVerifyCodeChangePassword}

                    logout={logout}
                />
            </div>

        </section>
    )
}