import ProfileUserCard from "./ProfileUserCard/ProfileUserCard";
import useAuth from "../../../hooks/useAuth";

import './ProfileSection.css'

export default function Profile(){
    const {
        user,
        logout,
    } = useAuth()
    
    return(
        <section className="profile-section">
            <ProfileUserCard user={user} logout={logout}/>
        </section>
    )
}