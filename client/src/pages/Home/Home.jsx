import businessMan from '../../assets/businessMan.png'
import './Home.css'

export default function Home(){
    return(
        
        <div className="Home-page">
            <section className='hero flex'>
                <div className='hero_text'>
                    <h1 className='hero_text-h1'>Realtor Profi</h1>
                    <h2 className='hero_text-h2'>Лучший сервис для Риэлторов и их клиентов</h2>
                </div>

                <img className='hero_img' src={businessMan}/>
            </section>
        </div>
        
    )
}