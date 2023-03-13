import HeaderComp from './components/headerComp';
import './App.css';

function App() {

  return (
    <div className="App dark-mode">
      <header>
        <HeaderComp />
      </header>
      <main>
        <div className="serice-card">
          <div className="service-card__image"><a href=""><img src="/images/TAN_1894.jpg" alt="" width="100%" /></a></div>
          <div className="service-card__text">
            <div className="service-card__category"><a href=""><span>Studio Shooting</span></a></div>
            <div className="service-card__header-text">
              <div className="service-card__title"><h3>Solo Shooting Woman</h3></div>
              <div className="service-card__start-price"><span>Starting at 5,000 F</span></div>
            </div>
            <div className="service-card__desc-text">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorum, similique!</div>
            <div className="service-card__cta"><a href="">Learn More</a></div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
