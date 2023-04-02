import { useState, useEffect } from "react";
import serviceObject from "../assets/content/serviceDetailsContent";

const BookPage = () => {

    // detect clicks on the whole app when hidden dropdown for a question is viible and close it when click is out of it
    window.onclick = function (e) {
        if (!document.querySelector('#book-question-service-name-dropdown-bar__id').contains(e.target)) {
            setServiceQuestionDropdownState(false);
        }
        if (!document.querySelector('#book-question-product-name-dropdown-bar__id').contains(e.target)) {
            setProductQuestionDropdownState(false);
        }
    }

    // State that controls visibiity of service dropdown options 
    const [serviceQuestionDropdownState, setServiceQuestionDropdownState] = useState(false);
    let serviceQuestionDropdownVisbility = serviceQuestionDropdownState ? "clicked" : "";

    // state that controls selection of service dropdown item
    const [serviceSelected, setServiceSelected] = useState('Select One');

    function setServiceSelectedFxn(service) {
        setServiceSelected(service);
        setProductSelected('Select One');
    }

    // State that controls visibiity of product dropdown options 
    const [productQuestionDropdownState, setProductQuestionDropdownState] = useState(false);
    let productQuestionDropdownVisbility = productQuestionDropdownState ? "clicked" : "";

    // state that controls selection of product dropdown item
    const [productSelected, setProductSelected] = useState('Select One');

    // variable that updates when states of service & product update and hold object of selected product
    let pdtSeldObject = (serviceSelected != "Select One" && productSelected != "Select One") ?
        serviceObject.find(service => service.name == serviceSelected).products.find(product => product.name == productSelected) : "";

    // State that controls visibiity of each person's book detail 
    const [personDetailsDropdownState, setPersonDetailsDropdownState] = useState(true);
    let personDetailsDropdownVisbility = personDetailsDropdownState ? "" : "hidden";

    // state that controls booking details
    const [edphotos, setEdphotos] = useState(null);
    const [outfits1, setOutfits1] = useState(1);
    const [needsMakeup1, setNeedsMakeup1] = useState(false);
    const [totalCost, setTotalCost] = useState(null);

    useEffect(() => {
        // initialize book details states once selected product exists
        pdtSeldObject && setTotalCost(pdtSeldObject.starting);
    })

    // Format prices to local currency.
    let money = new Intl.NumberFormat('fr-CM', {
        style: 'currency',
        currency: 'XAF',
    });

    // console.log(serviceObject[0].products[0].name);
    // console.log(pdtSeldObject.dedphotos);
    // console.log(sericesObject["Service"]["Product"].name);


    return (
        <div className="book-page">
            <div className="book-question__wrap">
                <div className="book-question-title__wrap"><h3>Which Service do you need?</h3></div>
                <button className="book-question-dropdown-bar__wrap" id="book-question-service-name-dropdown-bar__id"
                    onClick={() => setServiceQuestionDropdownState(prevstate => !prevstate)}>
                    <div className="book-question-dropdown-bar__text">{serviceSelected}</div>
                    <div className="book-question-dropdown-bar__icon"><i className="fa-solid fa-caret-down"></i></div>
                </button>
                <div className={`book-question-dropdown-options ${serviceQuestionDropdownVisbility}`}>
                    {
                        serviceObject.map((service, i) => (
                            <div className="book-question-dropdown-option__wrap" key={i}>
                                <input type="radio" name="book-question-service-name" id={`book-question-service-name__${service.slug}`} />
                                <label className="book-question-dropdown-option__label-wrap" htmlFor={`book-question-service-name__${service.slug}`}
                                    onClick={() => setServiceSelectedFxn(service.name)}>
                                    <div className="book-question-dropdown-option__label-text">{service.name}</div>
                                    <div className="book-question-dropdown-option__label-img"><img src={service.image} alt="" width="100%" /></div>
                                </label>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="book-question__wrap">
                <div className="book-question-title__container"><h3></h3></div>
                <button className="book-question-dropdown-bar__wrap" id="book-question-product-name-dropdown-bar__id"
                    onClick={() => setProductQuestionDropdownState(prevstate => !prevstate)}>
                    <div className="book-question-dropdown-bar__text">{productSelected}</div>
                    <div className="book-question-dropdown-bar__icon"><i className="fa-solid fa-caret-down"></i></div>
                </button>
                <div className={`book-question-dropdown-options ${productQuestionDropdownVisbility}`}>
                    {
                        serviceSelected != "Select One" ? serviceObject.find(service => service.name == serviceSelected).products.map((product, i) => (
                            <div className="book-question-dropdown-option__wrap" key={i}>
                                <input type="radio" name="book-question-product-name" id="book-question-product-name__solo-shooting" />
                                <label className="book-question-dropdown-option__label-wrap" htmlFor="book-question-product-name__solo-shooting"
                                    onClick={() => setProductSelected(product.name)}>
                                    <div className="book-question-dropdown-option__label-text">
                                        {product.name}<br /><small><em>Starting at {money.format(product.starting)}</em></small>
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
            {
                pdtSeldObject ?
                    <div className="book-details__wrap">
                        <div className={`book-details-person ${personDetailsDropdownVisbility}`}>
                            <div className="book-details-person__header" onClick={() => setPersonDetailsDropdownState(prevstate => !prevstate)}>
                                <div className="book-details-person__header-text">Person 1</div>
                                <div className="book-details-person__header-icon"></div>
                            </div>
                            <div className="book-details-person__body">
                                <div className="book-details-person__item-wrap">
                                    <div className="book-details-person__item-label">Number of outfits</div>
                                    <div className="book-details-person__item-controls">
                                        <button>-</button>
                                        <span>1</span>
                                        <button>+</button>
                                    </div>
                                </div>
                                <div className="book-details-person__item-wrap">
                                    <div className="book-details-person__item-label">Make-up needed?</div>
                                    <div className="book-details-person__item-controls">
                                        <input type="radio" name="book-details-person__makeup" id="book-details-person__makeup-no" /><label htmlFor="book-details-person__makeup-no">No</label>
                                        <input type="radio" name="book-details-person__makeup" id="book-details-person__makeup-yes" /><label htmlFor="book-details-person__makeup-yes">Yes</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="book-details-edphotos__wrap">
                            <div className="book-details-edphotos__text">Includes {pdtSeldObject.dedphotos} edited photos</div>
                            <div className="book-details-person__item-wrap">
                                <div className="book-details-person__item-label">Add?</div>
                                <div className="book-details-person__item-controls">
                                    <button>-</button>
                                    <span>1</span>
                                    <button>+</button>
                                </div>
                            </div>
                        </div>
                        <div className="book-details-general">
                            <div className="book-details-general__total-cost">Total Cost: {money.format(totalCost)}</div>
                            <div className="book-details-general__btn"><button>Proceed</button></div>
                        </div>
                    </div>
                    : null
            }
        </div>
    );
}

export default BookPage;