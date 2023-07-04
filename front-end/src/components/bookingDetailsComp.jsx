import { useState, useEffect } from "react";
import serviceObject from "../assets/content/serviceDetailsContent";

const BookingDetailsComp = () => {

   // State that controls visibiity of service dropdown options 
   const [serviceQuestionDropdownState, setServiceQuestionDropdownState] = useState(true);
   let serviceQuestionDropdownVisbility = serviceQuestionDropdownState ? "clicked" : "";
   let serviceQuestionDropdownTabIndex = serviceQuestionDropdownState ? "0" : "-1";

   // State that controls visibiity of product dropdown options 
   const [productQuestionDropdownState, setProductQuestionDropdownState] = useState(false);
   let productQuestionDropdownVisbility = productQuestionDropdownState ? "clicked" : "";
   let productQuestionDropdownTabIndex = productQuestionDropdownState ? "0" : "-1";
   let productQuestionHeight = "0px";

   // State that controls visibiity of booking details 
   const [bookingDetailsDropdownState, setBookingDetailsDropdownState] = useState(false);
   let bookingDetailsDropdownVisbility = bookingDetailsDropdownState ? "clicked" : "";
   let bookingDetailsDropdownTabIndex = bookingDetailsDropdownState ? "0" : "-1";
   let bookingDetailsHeight = "0px";

   // state that controls selection of service dropdown item
   const [serviceSelected, setServiceSelected] = useState('Select One');

   // state that controls selection of product dropdown item
   const [productSelected, setProductSelected] = useState('Select One');

   function setServiceSelectedFxn(service) {
      setServiceSelected(service);
      setProductSelected('Select One');
      setProductQuestionDropdownState(true);
   }

   function setProductSelectedFxn(product) {
      setProductSelected(product);
      setBookingDetailsDropdownState(true);
   }

   function bookingDetailsProceedFxn() {
      setBookingDetailsDropdownState(false);
      !document.querySelector('[data-calendar-time-div]').classList.contains('clicked') &&
         document.querySelector('[data-calendar-time-div]').classList.add("clicked"),
         document.querySelector('[data-calendar-time-btn]').classList.add("clicked");
   }

   // variable that updates when states of service & product update and hold object of selected product
   let foundShootingProduct = (["Studio Shooting", "Outdoor Shooting", "Home Shooting"].includes(serviceSelected) && productSelected != "Select One") ?
      serviceObject.find(service => service.name == serviceSelected).products.find(product => product.name == productSelected) : "";

   // state that controls booking details
   const [includedPhotos, setIncludedPhotos] = useState(0);
   const [addPhotos, setAddPhotos] = useState(0);
   let [totalCost, setTotalCost] = useState(0);

   // person object
   const person = {
      outfits: 1,
      makeup: 0
   }

   // state for the array of person's objects in the booking
   const [persons, setPersons] = useState([person]);

   function addPerson() {
      // setPersons([...persons, person]);
      const tempPersons = [...persons];
      tempPersons.push(person);
      setPersons(tempPersons);
   }

   function removePerson(index) {
      // assign array to a temp so that the splice method won't affect it yet
      const tempPersons = [...persons];
      tempPersons.splice(index, 1);
      setPersons(tempPersons);
   }

   function addPersonOutfit(index) {
      const tempPersons = [...persons];
      if (persons[index].outfits < 10) {
         tempPersons[index].outfits++;
         setPersons(tempPersons);
      }
   }

   function removePersonOutfit(index) {
      const tempPersons = [...persons];
      if (persons[index].outfits > 1) {
         tempPersons[index].outfits--;
         setPersons(tempPersons);
      }
   }

   function toggleMakeupNeeded(index, value) {
      const tempPersons = [...persons];
      tempPersons[index].makeup = value;
      setPersons(tempPersons);
   }

   useEffect(() => {
      productQuestionHeight = `${document.querySelector('[data-product-children-div]').offsetHeight + 2}px`;
      document.querySelector('[data-product-div]').style.setProperty('--height', productQuestionHeight);
   }, [serviceSelected]);

   useEffect(() => {
      bookingDetailsHeight = `${document.querySelector('[data-breakdown-children-div]').offsetHeight + 2}px`;
      document.querySelector('[data-breakdown-div]').style.setProperty('--height', bookingDetailsHeight);
   }, [productSelected, persons]);

   useEffect(() => {
      // initialize book details states once product is selected

      if (productSelected == "Duo (2 People)") {
         setPersons([person, { outfits: 1, makeup: 0 }])
      } else if (productSelected == "Group (3 or more people)") {
         setPersons([person, { outfits: 1, makeup: 0 }, { outfits: 1, makeup: 0 }])
      } else {
         setPersons([person]);
      }

      setAddPhotos(0);
      setIncludedPhotos(foundShootingProduct.dedphotos);
      setTotalCost(foundShootingProduct.starting);

   }, [productSelected]);

   useEffect(() => {

      // calculate total cost based on product selected
      if (productSelected == "Duo (2 People)") {
         setIncludedPhotos(Math.floor(3 * (persons[0].outfits + persons[1].outfits) / 2));
         setTotalCost(foundShootingProduct.starting + (persons[0].outfits + persons[1].outfits - 2) * foundShootingProduct.increment + addPhotos * 2000 + persons[0].makeup + persons[1].makeup);
      } else if (productSelected == "Group (3 or more people)") {
         let outfits = 0, makeups = 0;
         persons.forEach(p => outfits += p.outfits);
         persons.forEach(p => makeups += p.makeup);

         setIncludedPhotos(Math.floor((persons.length + 1) * outfits / persons.length));
         setTotalCost((foundShootingProduct.starting + (persons.length - 3) * foundShootingProduct.increment) + (outfits - persons.length) * foundShootingProduct.increment + addPhotos * 2000 + makeups);
      } else if (foundShootingProduct != "") {

         setIncludedPhotos(2 * persons[0].outfits);
         setTotalCost(foundShootingProduct.starting + (persons[0].outfits - 1) * foundShootingProduct.increment + addPhotos * 2000 + persons[0].makeup);
      } else {

         setIncludedPhotos(0);
         setTotalCost(0);
      }

   }, [persons, addPhotos])

   const bookingDetails = {
      "Service": serviceSelected,
      "Product": productSelected,
      "Details": persons,
      "Edited Photos": includedPhotos + addPhotos,
      "Total Cost": totalCost,
   }

   // Format prices to local currency.
   let money = new Intl.NumberFormat('en-CM', {
      style: 'currency',
      currency: 'XAF',
   });


   return (
         <>
            <div className="book-question__wrap">
               <button className={`book-question-dropdown-bar__wrap ${serviceQuestionDropdownVisbility}`} id="book-question-service-name-dropdown-bar__id"
                  onClick={() => setServiceQuestionDropdownState(prevstate => !prevstate)}>
                  <div className="book-question-dropdown-bar__text"><strong>Service:</strong> {serviceSelected}</div>
                  <div className="book-question-dropdown-bar__icon"><i className="fa-solid fa-chevron-down"></i></div>
               </button>
               <div className={`book-question-dropdown-options book-services__wrap ${serviceQuestionDropdownVisbility}`} >
                  {
                     serviceObject.map((service, i) => (
                        <div className="book-question-dropdown-option__wrap" key={i}>
                           <input type="radio" name="book-question-service-name" id={`book-question-service-name__${service.slug}`} 
                           onChange={() => setServiceSelectedFxn(service.name)} tabIndex={serviceQuestionDropdownTabIndex} />
                           <label className="book-question-dropdown-option__label-wrap" htmlFor={`book-question-service-name__${service.slug}`}
                           onClick={() => setServiceQuestionDropdownState(false)} >
                              <div className="book-question-dropdown-option__label-text">{service.name}</div>
                              <div className="book-question-dropdown-option__label-img"><img src={service.image} alt="" width="100%" /></div>
                           </label>
                        </div>
                     ))
                  }
               </div>
            </div>
            <div className="book-question__wrap">
               <button className={`book-question-dropdown-bar__wrap ${productQuestionDropdownVisbility}`} id="book-question-product-name-dropdown-bar__id"
                  onClick={() => setProductQuestionDropdownState(prevstate => !prevstate)}>
                  <div className="book-question-dropdown-bar__text"><strong>Category:</strong> {productSelected}</div>
                  <div className="book-question-dropdown-bar__icon"><i className="fa-solid fa-chevron-down"></i></div>
               </button>
               <div className={`book-question-dropdown-options book-products__wrap ${productQuestionDropdownVisbility}`} data-product-div>
                  <div data-product-children-div>
                     {serviceSelected != "Select One" ? serviceObject.find(service => service.name == serviceSelected).products.map((product, i) => (
                        <div className="book-question-dropdown-option__wrap" key={i}>
                           <input type="radio" name="book-question-product-name" id={`book-question-product-name__${i}`}
                           onChange={() => setProductSelectedFxn(product.name)} tabIndex={productQuestionDropdownTabIndex} />
                           <label className="book-question-dropdown-option__label-wrap" htmlFor={`book-question-product-name__${i}`}
                           onClick={() => setProductQuestionDropdownState(false)} >
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
            </div>

            <div className="book-question__wrap">
               <button className={`book-question-dropdown-bar__wrap ${bookingDetailsDropdownVisbility}`} id="book-question-breakdown-dropdown-bar__id"
                  onClick={() => setBookingDetailsDropdownState(prevstate => !prevstate)}>
                  <div className="book-question-dropdown-bar__text"><strong>Breakdown:</strong> {money.format(totalCost)}</div>
                  <div className="book-question-dropdown-bar__icon"><i className="fa-solid fa-chevron-down"></i></div>
               </button>
               <div className={`book-question-dropdown-options book-details__wrap ${bookingDetailsDropdownVisbility}`}
               data-breakdown-div>
               <div className="book-details__wrap2" data-breakdown-children-div>
                  {foundShootingProduct ?
                     <>
                        {persons.map((person, index) => (
                           <div className={`book-details-person book-details-person-${index + 1}`} key={index}>
                              <div className="book-details-person__header">
                                 <div className="book-details-person__header-text">Person {index + 1}</div>
                                 {persons.length > 3 &&
                                    <div className="book-details-person__header-icon">
                                       <button onClick={() => removePerson(index)} tabIndex={bookingDetailsDropdownTabIndex} >
                                          <i className="fa-solid fa-trash-can"></i>
                                       </button>
                                    </div>
                                 }
                              </div>
                              <div className="book-details-person__body">
                                 <div className="book-details-person__item-wrap">
                                    <div className="book-details-person__item-label">Number of outfits</div>
                                    <div className="book-details-person__item-controls book-details-person__outfits-controls">
                                       <button onClick={() => removePersonOutfit(index)} tabIndex={bookingDetailsDropdownTabIndex}>
                                          <i className="fa-solid fa-minus"></i>
                                       </button>
                                       <span>{person.outfits}</span>
                                       <button onClick={() => addPersonOutfit(index)} tabIndex={bookingDetailsDropdownTabIndex}>
                                          <i className="fa-solid fa-plus"></i>
                                       </button>
                                    </div>
                                 </div>
                                 <div className="book-details-person__item-wrap">
                                    <div className="book-details-person__item-label">Make-up needed?</div>
                                    <div className="book-details-person__item-controls book-details-person__makeup-controls">
                                       <input type="radio" name={`book-details-person${index + 1}__makeup`} id={`book-details-person${index + 1}__makeup-no`}
                                          onChange={() => toggleMakeupNeeded(index, 0)} tabIndex={bookingDetailsDropdownTabIndex} defaultChecked />
                                       <label htmlFor={`book-details-person${index + 1}__makeup-no`}>No</label>
                                       <input type="radio" name={`book-details-person${index + 1}__makeup`} id={`book-details-person${index + 1}__makeup-yes`}
                                          onChange={() => toggleMakeupNeeded(index, 3000)} tabIndex={bookingDetailsDropdownTabIndex} />
                                       <label htmlFor={`book-details-person${index + 1}__makeup-yes`}>Yes</label>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))}
                        {persons.length < 10 && foundShootingProduct.name == "Group (3 or more people)" &&
                           <button className="book-details__add-person-button" onClick={addPerson} tabIndex={bookingDetailsDropdownTabIndex}>
                              <i className="fa-solid fa-user-plus"></i> Add Person
                           </button>
                        }
                        <div className="book-details-edphotos__wrap">
                           <div className="book-details-edphotos__text">This selection includes {includedPhotos} edited photos</div>
                           <div className="book-details-person__item-wrap">
                              <div className="book-details-person__item-label">Add more photos?</div>
                              <div className="book-details-person__item-controls book-details-person__outfits-controls">
                                 <button onClick={() => addPhotos > 0 && setAddPhotos((count) => count - 1)} tabIndex={bookingDetailsDropdownTabIndex}>
                                    <i className="fa-solid fa-minus"></i></button>
                                 <span>{addPhotos}</span>
                                 <button onClick={() => addPhotos < 10 && setAddPhotos((count) => count + 1)} tabIndex={bookingDetailsDropdownTabIndex}>
                                    <i className="fa-solid fa-plus"></i></button>
                              </div>
                           </div>
                        </div>
                        <div className="book-details-general">
                           <div className="book-details-general__total-cost"><strong>Total Cost: {money.format(totalCost)}</strong></div>
                           <div className="book-details-general__total-photos">Total edited photos: {includedPhotos + addPhotos}</div>
                           <div className="book-details-general__btn">
                              <button onClick={bookingDetailsProceedFxn} tabIndex={bookingDetailsDropdownTabIndex}>Proceed</button></div>
                        </div>
                     </>
                     :
                     <div>Please choose a category above to see options here.</div>
                  }
               </div>
               </div>
            </div>
            {/* {<div><pre><code>{JSON.stringify(bookingDetails, null, 2)}</code></pre></div>} */}
         </>
      );
}

export default BookingDetailsComp;