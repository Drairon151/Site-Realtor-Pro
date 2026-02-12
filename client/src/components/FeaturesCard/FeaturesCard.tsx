import './FeaturesCard.css'

interface FeaturesCardProps{
    cardImg: string,
    cardTitle: string,
    cardText: string,
}

export default function FeaturesCard({cardImg , cardTitle, cardText}:FeaturesCardProps){
    return(
        <li className="features_cards-card flex">
            <img className="features_cards-icon" src={cardImg}/>
            <div className="features_cards-description">
                <p className="features_cards-title">{cardTitle}</p>
                <p className="features_cards-text">{cardText}</p>
            </div>
        </li>
    )
}