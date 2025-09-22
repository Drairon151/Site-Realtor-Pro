import businessMan from '../../../../assets/img/homePage/businessMan.png'
import './HeroSection.css';

export default function HeroSection(){
    return(
        <section className='hero flex'>
            <div className='hero_text'>
                <h1 className='hero_text-h1'>Realtor Profi</h1>
                <p className='hero_text-p'>Лучший сервис для Риэлторов и их клиентов</p>
            </div>

            <img className='hero_img' src={businessMan}/>
        </section>
    )
}