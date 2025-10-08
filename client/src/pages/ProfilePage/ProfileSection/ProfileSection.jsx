import ProfileUserCard from "./ProfileUserCard/ProfileUserCard";
import useAuth from "../../../hooks/useAuth";
import useUser from "../../../hooks/useUser";

import './ProfileSection.css'

export default function Profile(){
    const {
        logout,
        sendVerifyCodeChangePassword,
    } = useAuth()
    
    return(
        <section className="profile-section">

            <div className="profile-section_container">
                <ProfileUserCard logout={logout} sendVerifyCodeChangePassword={sendVerifyCodeChangePassword}/>
            </div>

        </section>
    )
}