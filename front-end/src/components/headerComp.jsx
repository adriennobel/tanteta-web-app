import { useState } from "react";
import { Link } from "react-router-dom";

const HeaderComp = ({ toggleDarkmodeState }) => {

    // State that controls visibiity of hidden header menu 
    const [navmenuState, setNavmenuState] = useState(false);
    let nmVisbility = navmenuState ? "visible" : "";

    function toggleNavmenuState() {
        setNavmenuState(prevstate => !prevstate);
    }

    // detect clicks on the whole app when hidden header menu is viible and close it when click is out of it
    window.onclick = function (e) {
        document.querySelectorAll('.nav-menu-container a').forEach(element => {
            if (e.target == element) {
                setNavmenuState(false);
            }
        });
        if (!document.getElementById('hidden-header-id').contains(e.target)
            && !document.getElementById('nav-trigger-icon-id').contains(e.target)) {
            setNavmenuState(false);
        }
    };

    return (
        <div className={`header-component ${nmVisbility}`}>
            <div className="header-container">
                <div className="header-logo-container">
                    <div className="header-logo">Tanteta'</div>
                </div>
                <div className="header-icons-container">
                    <div className="account-icon"><i className="fa-regular fa-circle-user"></i></div>
                    <div onClick={toggleNavmenuState} className="nav-trigger-icon" id="nav-trigger-icon-id">
                        <button className="header-icons__btn"><span className="header-icons__btn-content"></span></button>
                    </div>
                </div>
            </div>
            <div className="hidden-header" id="hidden-header-id" >
                <div className="nav-container">
                    <div className="nav-menu-container">
                        <nav>
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/">Services</Link></li>
                                <li><Link to="/">Blog</Link></li>
                                <li><Link to="/">Contact US</Link></li>
                            </ul>
                        </nav>
                    </div>
                    <div className="darkmode-toggle-container">
                        <input type="radio" name="darkmode-toggle" id="darkmode-toggle-dark" />
                        <label htmlFor="darkmode-toggle-dark" className="darkmode-toggle__label" onClick={toggleDarkmodeState}><img className="darkmode-toggle__img-icon" src="/icons/moon.png" alt="dark mode icon" /></label>
                        <input type="radio" name="darkmode-toggle" id="darkmode-toggle-light" />
                        <label htmlFor="darkmode-toggle-light" className="darkmode-toggle__label" onClick={toggleDarkmodeState}><img className="darkmode-toggle__img-icon" src="/icons/brightness.png" alt="light mode icon" /></label>
                    </div>
                    <div className="language-toggle-container">
                        <select name="language-toggle">
                            <option value="English">&#127468;&#127463; English</option>
                            <option value="French">&#127467;&#127479; Fançais</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeaderComp;