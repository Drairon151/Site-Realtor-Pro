import './HomePage.css'
import FeaturesSection from './sections/FeaturesSection/FeaturesSection'
import HeroSection from './sections/HeroSection/HeroSection'

export default function Home(){
    return(
        
        <div className="home-page">
            <HeroSection/>
            <FeaturesSection/>
        </div>
        
    )
}