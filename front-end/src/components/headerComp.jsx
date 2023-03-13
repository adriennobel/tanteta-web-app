import { useState } from "react";

const HeaderComp = () => {

    const [navmenuState, setNavmenuState] = useState(false);
    let nmVisbility = navmenuState ? "visible" : "";

    function toggleNavmenuState() {
        setNavmenuState(prevstate => !prevstate);
        console.log(navmenuState);
    }

    return (
        <div className="header-component">
            <div className="header-container">
                <div className="header-logo-container">
                    <div className="header-logo">Tanteta'</div>
                </div>
                <div className="header-icons-container">
                    <div className="account-icon"><i className="fa-regular fa-circle-user"></i></div>
                    <div onClick={toggleNavmenuState} className="nav-trigger-icon"><i className="fa-solid fa-bars"></i></div>
                </div>
            </div>
            <div className={`hidden-header ${nmVisbility}`}>
                <div className="nav-container">
                    <div className="nav-menu-container">
                        <nav>
                            <ul>
                                <li>Home</li>
                                <li>Services</li>
                                <li>Blog</li>
                                <li>Contact US</li>
                            </ul>
                        </nav>
                    </div>
                    <div className="darkmode-toggle-container">
                        <input type="radio" name="darkmode-toggle" id="darkmode-toggle-dark" />
                        <label htmlFor="darkmode-toggle-dark">Dark</label>
                        <input type="radio" name="darkmode-toggle" id="darkmode-toggle-light" />
                        <label htmlFor="darkmode-toggle-light">Light</label>
                    </div>
                    <div className="language-toggle-container">
                        <select name="language-toggle">
                            <option value="English">English</option>
                            <option value="French">French</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeaderComp;