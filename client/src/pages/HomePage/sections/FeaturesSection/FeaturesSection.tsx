import './FeaturesSection.css'
import { featuresItems } from '../../../../data/featureItems'
import FeaturesCard from '../../../../components/FeaturesCard/FeaturesCard'

export default function FeaturesSection(){

    return(
        <section className='features-section'>
            <h3 className='features-section_title flex center'>Легко найдите своего клиента или риэлтора благодаря удобному поиску</h3>
            <ul className='features flex'>
                {featuresItems.map(
                    (featuresItem, index) => <FeaturesCard
                        {...featuresItem}
                        key={index}
                    />
                    )}
            </ul>
        </section>
    )

}