import ProfileUserCard from "./ProfileUserCard/ProfileUserCard";

import './ProfileSection.css'

export default function Profile(){
    
    return(
        <section className="profile-section">

            <div className="profile-section_container">
                <ProfileUserCard/>
            </div>

        </section>
    )
}