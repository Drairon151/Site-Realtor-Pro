import ProfileUserCard from "./ProfileUserCard/ProfileUserCard";
import useAuth from "../../../hooks/useAuth";

import './ProfileSection.css'

export default function Profile(){
    const {
        user,
        logout,
        sendVerifyCodeChangePassword,
    } = useAuth()
    
    return(
        <section className="profile-section">

            <div className="profile-section_container">
                <ProfileUserCard user={user} logout={logout} sendVerifyCodeChangePassword={sendVerifyCodeChangePassword}/>
            </div>

        </section>
    )
}