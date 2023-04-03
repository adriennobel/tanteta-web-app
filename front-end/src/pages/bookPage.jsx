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
    let [productSelected, setProductSelected] = useState('Select One');

    // variable that updates when states of service & product update and hold object of selected product
    let pdtSeldObject = (serviceSelected != "Select One" && productSelected != "Select One") ?
        serviceObject.find(service => service.name == serviceSelected).products.find(product => product.name == productSelected) : "";

    // State that controls visibiity of each person's book detail 
    const [personDetailsDropdownState, setPersonDetailsDropdownState] = useState(true);
    let personDetailsDropdownVisbility = personDetailsDropdownState ? "" : "hidden";

    // state that controls booking details
    const [outfits1, setOutfits1] = useState(1);
    const [needsMakeup1, setNeedsMakeup1] = useState(false);
    let makeupcost = needsMakeup1 ? 3000 : 0;
    const [inclPhotos, setInclPhotos] = useState(0);
    const [addPhotos, setAddPhotos] = useState(0);
    let [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        // initialize book details states once selected product exists and object is found
        if (pdtSeldObject) {
            setInclPhotos(pdtSeldObject.dedphotos);
            setTotalCost(pdtSeldObject.starting);
        }
        setOutfits1(1);
        setNeedsMakeup1(false);
        setAddPhotos(0);
    }, [productSelected]);

    useEffect(() => {
        // calculate total cost based on product selected
        if (pdtSeldObject) {
            if (productSelected == "Solo (1 Person)") {
                setInclPhotos(3 * outfits1 - 1);
                setTotalCost(pdtSeldObject.starting * outfits1 + addPhotos * 2000 + makeupcost);
            }
        }
    }, [outfits1, needsMakeup1, addPhotos])

    // Format prices to local currency.
    let money = new Intl.NumberFormat('en-CM', {
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
                                        <button onClick={() => outfits1 > 1 && setOutfits1((count) => count - 1)}>-</button>
                                        <span>{outfits1}</span>
                                        <button onClick={() => outfits1 < 10 && setOutfits1((count) => count + 1)}>+</button>
                                    </div>
                                </div>
                                <div className="book-details-person__item-wrap">
                                    <div className="book-details-person__item-label">Make-up needed?</div>
                                    <div className="book-details-person__item-controls">
                                        <input type="radio" name="book-details-person__makeup" id="book-details-person__makeup-no"
                                            onChange={() => setNeedsMakeup1(false)} defaultChecked />
                                        <label htmlFor="book-details-person__makeup-no">No</label>
                                        <input type="radio" name="book-details-person__makeup" id="book-details-person__makeup-yes"
                                            onChange={() => setNeedsMakeup1(true)} />
                                        <label htmlFor="book-details-person__makeup-yes">Yes</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="book-details-edphotos__wrap">
                            <div className="book-details-edphotos__text">Includes {inclPhotos} edited photos</div>
                            <div className="book-details-person__item-wrap">
                                <div className="book-details-person__item-label">Add?</div>
                                <div className="book-details-person__item-controls">
                                    <button onClick={() => addPhotos > 0 && setAddPhotos((count) => count - 1)}>-</button>
                                    <span>{addPhotos}</span>
                                    <button onClick={() => addPhotos < 10 && setAddPhotos((count) => count + 1)}>+</button>
                                </div>
                            </div>
                        </div>
                        <div className="book-details-general">
                            <div className="book-details-general__total-cost">Total Cost: {money.format(totalCost)}</div>
                            <div className="book-details-general__total-photos">Total edited photos: {inclPhotos + addPhotos}</div>
                            <div className="book-details-general__btn"><button>Proceed</button></div>
                        </div>
                    </div>
                    : null
            }
        </div>
    );
}

export default BookPage;