import { useState, useEffect } from "react";
import serviceObject from "../assets/content/serviceDetailsContent";

const useBookingDetailsComp = () => {

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
      } else {

         setIncludedPhotos(2 * persons[0].outfits);
         setTotalCost(foundShootingProduct.starting + (persons[0].outfits - 1) * foundShootingProduct.increment + addPhotos * 2000 + persons[0].makeup);
      }

   }, [persons, addPhotos])

   const bookingDetails = {
      Service: serviceSelected,
      Product: productSelected,
      Details: persons,
      "Edited Photos": includedPhotos + addPhotos,
      Total: totalCost,
   }

   function proceedToBook() {
      console.log(bookingDetails);
   }

   // Format prices to local currency.
   let money = new Intl.NumberFormat('en-CM', {
      style: 'currency',
      currency: 'XAF',
   });


   return {
      bookingDetails,
      bookingDetailsRender: (
         <>
            <div className="book-question__wrap">
               <div className="book-question-title__wrap"><h3>Which Service do you need?</h3></div>
               <button className={`book-question-dropdown-bar__wrap ${serviceQuestionDropdownVisbility}`} id="book-question-service-name-dropdown-bar__id"
                  onClick={() => setServiceQuestionDropdownState(prevstate => !prevstate)}>
                  <div className="book-question-dropdown-bar__text">{serviceSelected}</div>
                  <div className="book-question-dropdown-bar__icon"><i className="fa-solid fa-chevron-down"></i></div>
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
               <button className={`book-question-dropdown-bar__wrap ${productQuestionDropdownVisbility}`} id="book-question-product-name-dropdown-bar__id"
                  onClick={() => setProductQuestionDropdownState(prevstate => !prevstate)}>
                  <div className="book-question-dropdown-bar__text">{productSelected}</div>
                  <div className="book-question-dropdown-bar__icon"><i className="fa-solid fa-chevron-down"></i></div>
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
               foundShootingProduct ?
                  <div className="book-details__wrap">
                     {persons.map((person, index) => (
                        <div className={`book-details-person book-details-person-${index + 1}`} key={index}>
                           <div className="book-details-person__header">
                              <div className="book-details-person__header-text">Person {index + 1}</div>
                              {persons.length > 3 &&
                                 <div className="book-details-person__header-icon">
                                    <button onClick={() => removePerson(index)}><i className="fa-solid fa-trash-can"></i></button>
                                 </div>
                              }
                           </div>
                           <div className="book-details-person__body">
                              <div className="book-details-person__item-wrap">
                                 <div className="book-details-person__item-label">Number of outfits</div>
                                 <div className="book-details-person__item-controls book-details-person__outfits-controls">
                                    <button onClick={() => removePersonOutfit(index)}><i className="fa-solid fa-minus"></i></button>
                                    <span>{person.outfits}</span>
                                    <button onClick={() => addPersonOutfit(index)}><i className="fa-solid fa-plus"></i></button>
                                 </div>
                              </div>
                              <div className="book-details-person__item-wrap">
                                 <div className="book-details-person__item-label">Make-up needed?</div>
                                 <div className="book-details-person__item-controls book-details-person__makeup-controls">
                                    <input type="radio" name={`book-details-person${index + 1}__makeup`} id={`book-details-person${index + 1}__makeup-no`}
                                       onChange={() => toggleMakeupNeeded(index, 0)} defaultChecked />
                                    <label htmlFor={`book-details-person${index + 1}__makeup-no`}>No</label>
                                    <input type="radio" name={`book-details-person${index + 1}__makeup`} id={`book-details-person${index + 1}__makeup-yes`}
                                       onChange={() => toggleMakeupNeeded(index, 3000)} />
                                    <label htmlFor={`book-details-person${index + 1}__makeup-yes`}>Yes</label>
                                 </div>
                              </div>
                           </div>

                        </div>
                     ))}

                     {persons.length < 10 && foundShootingProduct.name == "Group (3 or more people)" &&
                        <button className="book-details__add-person-button" onClick={addPerson}><i className="fa-solid fa-user-plus"></i> Add Person</button>
                     }

                     <div className="book-details-edphotos__wrap">
                        <div className="book-details-edphotos__text">This selection includes {includedPhotos} edited photos</div>
                        <div className="book-details-person__item-wrap">
                           <div className="book-details-person__item-label">Add more photos?</div>
                           <div className="book-details-person__item-controls book-details-person__outfits-controls">
                              <button onClick={() => addPhotos > 0 && setAddPhotos((count) => count - 1)}><i className="fa-solid fa-minus"></i></button>
                              <span>{addPhotos}</span>
                              <button onClick={() => addPhotos < 10 && setAddPhotos((count) => count + 1)}><i className="fa-solid fa-plus"></i></button>
                           </div>
                        </div>
                     </div>
                     <div className="book-details-general">
                        <div className="book-details-general__total-cost"><h3>Total Cost: {money.format(totalCost)}</h3></div>
                        <div className="book-details-general__total-photos">Total edited photos: {includedPhotos + addPhotos}</div>
                        <div className="book-details-general__btn"><button onClick={proceedToBook}>Proceed</button></div>
                     </div>
                  </div>
                  : null
            }

            {/* {<div><pre><code>{JSON.stringify(bookingDetails, null, 2)}</code></pre></div>} */}
         </>
      ),
   }
}

export default useBookingDetailsComp;