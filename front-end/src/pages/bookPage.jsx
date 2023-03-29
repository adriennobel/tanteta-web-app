import { useState } from "react";
import serviceObject from "../assets/content/serviceDetailsContent";

const BookPage = () => {

    // State that controls visibiity of service dropdown options 
    const [serviceQuestionDropdownState, setServiceQuestionDropdownState] = useState(false);
    let serviceQuestionDropdownVisbility = serviceQuestionDropdownState ? "clicked" : "";

    // state that controls selection of service dropdown item
    const [serviceSelected, setServiceSelected] = useState('Select One');


    // State that controls visibiity of product dropdown options 
    const [productQuestionDropdownState, setProductQuestionDropdownState] = useState(false);
    let productQuestionDropdownVisbility = productQuestionDropdownState ? "clicked" : "";

    // state that controls selection of product dropdown item
    const [productSelected, setProductSelected] = useState('Select One');

    function setServiceSelectedFxn(service) {
        setServiceSelected(service);
        setProductSelected('Select One');

    }

    // detect clicks on the whole app when hidden dropdown for a question is viible and close it when click is out of it
    window.onclick = (e) => {
        if (!document.querySelector('#book-question-service-name-dropdown-bar__id').contains(e.target)) {
            setServiceQuestionDropdownState(false);
        }
        if (!document.querySelector('#book-question-product-name-dropdown-bar__id').contains(e.target)) {
            setProductQuestionDropdownState(false);
        }
    }

    // State that controls visibiity of each person's book detail 
    const [personDetailsDropdownState, setPersonDetailsDropdownState] = useState(true);
    let personDetailsDropdownVisbility = personDetailsDropdownState ? "" : "hidden";

    const sericesObject = {
        "Studio Shooting": [
            { name: "Solo (1 Person)", image: "/images/TAN_9628.jpg", starting: "5,000 F" },
            { name: "Duo (2 People)", image: "/images/TAN_9628.jpg", starting: "10,000 F" },
            { name: "Group (3 or more people)", image: "/images/TAN_9628.jpg", starting: "15,000 F" },
            { name: "Baby (Less than 6 y-o)", image: "/images/TAN_9628.jpg", starting: "10,000 F" },
            { name: "Pregnancy (1 person)", image: "/images/TAN_9628.jpg", starting: "5,000 F" },
        ],
        "Outdoor Shooting": [
            { name: "Solo Shooting (On Person)", image: "/images/TAN_9628.jpg", starting: "15,000 F" },
            { name: "Duo (2 People)", image: "/images/TAN_9628.jpg", starting: "25,000 F" },
            { name: "Group (3 or more people)", image: "/images/TAN_9628.jpg", starting: "30,000 F" },
            { name: "Baby (Less than 6 y-o)", image: "/images/TAN_9628.jpg", starting: "20,000 F" },
            { name: "Pregnancy (1 person)", image: "/images/TAN_9628.jpg", starting: "15,000 F" },
        ],
        "Home Shooting": [
            { name: "Solo Shooting (On Person)", image: "/images/TAN_9628.jpg", starting: "15,000 F", "Solo Shooting": { min: 50, max: "maximum" } },
            { name: "Duo (2 People)", image: "/images/TAN_9628.jpg", starting: "25,000 F" },
            { name: "Group (3 or more people)", image: "/images/TAN_9628.jpg", starting: "30,000 F" },
            { name: "Baby (Less than 6 y-o)", image: "/images/TAN_9628.jpg", starting: "20,000 F" },
            { name: "Pregnancy (1 person)", image: "/images/TAN_9628.jpg", starting: "15,000 F" },
        ],

    }

    // console.log(antherObject[0].products[0].name);
    // console.log(Object.keys(sericesObject["LEVEL1"]));
    // console.log(sericesObject["Service"]["Product"].name);


    return (
        <div className="book-page">
            <div className="book-question__wrap">
                <div className="book-question-title__wrap"><h3>Which Service do you need?</h3></div>
                <div className="book-question-dropdown-bar__wrap" id="book-question-service-name-dropdown-bar__id"
                    onClick={() => setServiceQuestionDropdownState(prevstate => !prevstate)}>
                    <div className="book-question-dropdown-bar__text">{serviceSelected}</div>
                    <div className="book-question-dropdown-bar__icon"><i className="fa-solid fa-caret-down"></i></div>
                </div>
                <div className={`book-question-dropdown-options ${serviceQuestionDropdownVisbility}`}>
                    <div className="book-question-dropdown-option__wrap">
                        <input type="radio" name="book-question-service-name" id="book-question-service-name__studio-shooting" />
                        <label className="book-question-dropdown-option__label-wrap" htmlFor="book-question-service-name__studio-shooting" onClick={() => setServiceSelectedFxn('Studio Shooting')}>
                            <div className="book-question-dropdown-option__label-text">Studio Shooting</div>
                            <div className="book-question-dropdown-option__label-img"><img src="/images/TAN_2761.jpg" alt="" width="100%" /></div>
                        </label>
                    </div>
                    <div className="book-question-dropdown-option__wrap">
                        <input type="radio" name="book-question-service-name" id="book-question-service-name__outdoor-shooting" />
                        <label className="book-question-dropdown-option__label-wrap" htmlFor="book-question-service-name__outdoor-shooting" onClick={() => setServiceSelectedFxn('Outdoor Shooting')}>
                            <div className="book-question-dropdown-option__label-text">Outdoor Shooting</div>
                            <div className="book-question-dropdown-option__label-img"><img src="/images/TAN_2761.jpg" alt="" width="100%" /></div>
                        </label>
                    </div>
                    <div className="book-question-dropdown-option__wrap">
                        <input type="radio" name="book-question-service-name" id="book-question-service-name__home-shooting" />
                        <label className="book-question-dropdown-option__label-wrap" htmlFor="book-question-service-name__home-shooting" onClick={() => setServiceSelectedFxn('Home Shooting')}>
                            <div className="book-question-dropdown-option__label-text">Home Shooting</div>
                            <div className="book-question-dropdown-option__label-img"><img src="/images/TAN_2761.jpg" alt="" width="100%" /></div>
                        </label>
                    </div>
                    <div className="book-question-dropdown-option__wrap">
                        <input type="radio" name="book-question-service-name" id="book-question-service-name__event-per-hour" />
                        <label className="book-question-dropdown-option__label-wrap" htmlFor="book-question-service-name__event-per-hour" onClick={() => setServiceSelectedFxn('Event Coverage Per Hour')}>
                            <div className="book-question-dropdown-option__label-text">Event Coverage Per Hour</div>
                            <div className="book-question-dropdown-option__label-img"><img src="/images/TAN_2761.jpg" alt="" width="100%" /></div>
                        </label>
                    </div>
                    <div className="book-question-dropdown-option__wrap">
                        <input type="radio" name="book-question-service-name" id="book-question-service-name__event-per-pack" />
                        <label className="book-question-dropdown-option__label-wrap" htmlFor="book-question-service-name__event-per-pack" onClick={() => setServiceSelectedFxn('Event Coverage Per Package')}>
                            <div className="book-question-dropdown-option__label-text">Event Coverage Per Package</div>
                            <div className="book-question-dropdown-option__label-img"><img src="/images/TAN_2761.jpg" alt="" width="100%" /></div>
                        </label>
                    </div>
                    <div className="book-question-dropdown-option__wrap">
                        <input type="radio" name="book-question-service-name" id="book-question-service-name__prints-frames" />
                        <label className="book-question-dropdown-option__label-wrap" htmlFor="book-question-service-name__prints-frames" onClick={() => setServiceSelectedFxn('Prints & Frames')}>
                            <div className="book-question-dropdown-option__label-text">Prints & Frames</div>
                            <div className="book-question-dropdown-option__label-img"><img src="/images/TAN_2761.jpg" alt="" width="100%" /></div>
                        </label>
                    </div>
                </div>
            </div>
            <div className="book-question__wrap">
                <div className="book-question-title__container"><h3></h3></div>
                <div className="book-question-dropdown-bar__wrap" id="book-question-product-name-dropdown-bar__id"
                    onClick={() => setProductQuestionDropdownState(prevstate => !prevstate)}>
                    <div className="book-question-dropdown-bar__text">{productSelected}</div>
                    <div className="book-question-dropdown-bar__icon"><i className="fa-solid fa-caret-down"></i></div>
                </div>
                <div className={`book-question-dropdown-options ${productQuestionDropdownVisbility}`}>
                    {
                        sericesObject[`${serviceSelected}`] ? sericesObject[`${serviceSelected}`].map((product, i) => (
                            <div className="book-question-dropdown-option__wrap" key={i}>
                                <input type="radio" name="book-question-product-name" id="book-question-product-name__solo-shooting" />
                                <label className="book-question-dropdown-option__label-wrap" htmlFor="book-question-product-name__solo-shooting"
                                    onClick={() => setProductSelected(product.name)}>
                                    <div className="book-question-dropdown-option__label-text">
                                        {product.name}<br /><small><em>Starting at {product.starting}</em></small>
                                    </div>
                                    <div className="book-question-dropdown-option__label-img"><img src={product.image} alt="" width="100%" /></div>
                                </label>
                            </div>
                        ))
                            :
                            <div className="book-question-dropdown-option__wrap disabled-option">
                                <label className="book-question-dropdown-option__label-wrap" >
                                    <div className="book-question-dropdown-option__label-text">Please choose a service above to see options here</div>
                                </label>
                            </div>
                    }
                </div>
            </div>
            <div className="book-details__wrap">
                <div className={`book-details-person ${personDetailsDropdownVisbility}`}>
                    <div className="book-details-person__header" onClick={() => setPersonDetailsDropdownState(prevstate => !prevstate)}>
                        <div className="book-details-person__header-text">Person 1</div>
                        <div className="book-details-person__header-icon"></div>
                    </div>
                    <div className="book-details-person__body">
                        <div className="book-details-person__text">
                            <ul>
                                <li>[number] outfit</li>
                                <li>[number] edited photos</li>
                                <li>[No] make-up</li>
                            </ul>
                        </div>
                        <div className="book-details-person__edit-btn"><button>Edit</button></div>
                    </div>
                </div>
                <div className="book-details-total-cost">
                    <div className="book-details-total-cost__text">Total Cost: 5000F</div>
                    <div className="book-details-total-cost__btn"><button>Proceed</button></div>
                </div>
            </div>
        </div>
    );
}

export default BookPage;