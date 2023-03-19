import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div className="home-page">
            <div className="serice-card">
                <div className="service-card__image"><Link to="/"><img src="/images/TAN_1894.jpg" alt="" width="100%" /></Link></div>
                <div className="service-card__text">
                    <div className="service-card__category"><Link to="/"><span>Studio Shooting</span></Link></div>
                    <div className="service-card__header-text">
                        <div className="service-card__title"><h3>Solo Shooting Woman</h3></div>
                        <div className="service-card__start-price"><span>Starting at 5,000 F</span></div>
                    </div>
                    <div className="service-card__desc-text">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorum, similique!</div>
                    <div className="service-card__cta"><Link to="/" className="primary-cta-btn">Book Now</Link><Link to="/" className="secondaary-cta-btn">Learn More</Link></div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;