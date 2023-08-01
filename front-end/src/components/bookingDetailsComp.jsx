import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from 'axios';
import serviceObject from "../assets/content/serviceDetailsContent";

const BookingDetailsComp = () => {

	// GLOBAL CONSTANTS
	//**********************************
	const person = { outfits: 1, makeup: 0 }
	const contactObject = { fname: "", lname: "", phone: "", email: "", address: "" }
	const timezone = "T00:00-04:00";
	const dateObject = new Date(); // Sat Apr 29 2023 07:13:20 GMT-0400 (Eastern Daylight Time)

	// HELPER FUNCTIONS
	//**********************************
	function doubleDigitOf(month) {
		const doubleDigitOf = month.toString().length < 2 ? ("0" + month) : month;
		return doubleDigitOf
	}
	// Format prices to local currency.
	let money = new Intl.NumberFormat('en-CM', {
		style: 'currency',
		currency: 'XAF',
	});

	// CHECK SEARCH PARAMS FIRTS
	//**********************************
	let [searchParams, setSearchParams] = useSearchParams();
	const serviceParam = searchParams.get('service');
	const productParam = searchParams.get('product');
	
	// STATES FOR SERVICE DROPDOWN
	//**********************************
	const [serviceSelected, setServiceSelected] = useState('Select One');
	const [serviceQuestionDropdownState, setServiceQuestionDropdownState] = useState(true);
	let serviceQuestionDropdownVisbility = serviceQuestionDropdownState ? "clicked" : "";
	let serviceQuestionDropdownTabIndex = serviceQuestionDropdownState ? "0" : "-1";

	// STATES FOR CATEGORY DROPDOWN
	//**********************************
	const [productSelected, setProductSelected] = useState('Select One');
	const [productQuestionDropdownState, setProductQuestionDropdownState] = useState(false);
	let productQuestionDropdownVisbility = productQuestionDropdownState ? "clicked" : "";
	let productQuestionDropdownTabIndex = productQuestionDropdownState ? "0" : "-1";
	let productQuestionHeight = "0px";
	let foundShootingProduct = (["Studio Shooting", "Outdoor Shooting", "Home Shooting"].includes(serviceSelected) && productSelected != "Select One") ?
		serviceObject.find(service => service.name == serviceSelected).products.find(product => product.name == productSelected) : "";


	// STATES FOR BREAKDOWN DROPDOWN (BOOKING DETAILS)
	//**********************************
	const [bookingDetailsDropdownState, setBookingDetailsDropdownState] = useState(false);
	const [isBookingDetailsValid, setIsBookingDetailsValid] = useState(false);
	let bookingDetailsDropdownVisbility = bookingDetailsDropdownState ? "clicked" : "";
	let bookingDetailsDropdownTabIndex = bookingDetailsDropdownState ? "0" : "-1";
	let bookingDetailsHeight = "0px";
	const [includedPhotos, setIncludedPhotos] = useState(0);
	const [addPhotos, setAddPhotos] = useState(0);
	let [totalCost, setTotalCost] = useState(0);
	const [persons, setPersons] = useState([person]);

	// STATES FOR BOOKING DROPDOWN (CALENDAR AND TIME)
	//**********************************
	const [calendarTimeDropdownState, setCalendarTimeDropdownState] = useState(false);
	const [isCalendarTimeValid, setIsCalendarTimeValid] = useState(false);
	let calendarTimeDropdownVisbility = calendarTimeDropdownState ? "clicked" : "";
	let calendarTimeDropdownTabIndex = calendarTimeDropdownState ? "0" : "-1";
	let calendarTimeHeight = "0px";

	const todayISOdate = dateObject.getFullYear() + "-" + doubleDigitOf(dateObject.getMonth() + 1) + "-" + doubleDigitOf(dateObject.getDate()); // 2023-4-29
	const tomorrowISOdate = dateObject.getFullYear() + "-" + doubleDigitOf(dateObject.getMonth() + 1) + "-" + doubleDigitOf(dateObject.getDate() + 1);
	const [counter, setCounter] = useState(0);
	const [viewedDayISO, setViewedDayISO] = useState(new Date(todayISOdate + timezone).getDay() !== 0 ? todayISOdate : tomorrowISOdate);
	const viewedDayString = new Date(viewedDayISO + timezone).toLocaleDateString(undefined, { day: 'numeric', weekday: 'long', month: 'long', year: 'numeric' });
	const previousMonthLastDateObject = new Date(dateObject.getFullYear(), dateObject.getMonth() + counter, 0); // new Date(2023, 3, 0)
	const viewedMonthLastDateObject = new Date(dateObject.getFullYear(), dateObject.getMonth() + 1 + counter, 0); // new Date(2023, 4, 0)
	const previousMonthDays = new Array(previousMonthLastDateObject.getDay()).join().split(','); // ['','','','',...]
	previousMonthDays.map((e, i) => {
		previousMonthDays[i] = previousMonthLastDateObject.getDate() - previousMonthLastDateObject.getDay() + 1 + i;
	});
	const viewedMonthDays = new Array(viewedMonthLastDateObject.getDate()).join().split(','); // ['','','','',...]
	viewedMonthDays.map((e, i) => {
		viewedMonthDays[i] = i + 1;
	});
	const nextMonthDays = new Array(7 - viewedMonthLastDateObject.getDay()).join().split(','); // ['','','','',...]
	nextMonthDays.map((e, i) => {
		nextMonthDays[i] = i + 1;
	});
	const viewedMonthHeadline = viewedMonthLastDateObject.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }); // April 2023
	const viewedMonthISO = viewedMonthLastDateObject.getFullYear() + "-" + doubleDigitOf(viewedMonthLastDateObject.getMonth() + 1); // 2023-4

	// below state is initialized by api response
	const [viewedDayTimesAvail, setViewedDayTimesAvail] = useState([]);
	const [timeslotSelected, setTimeslotSelected] = useState('00:00');
	const fullBookingISO = viewedDayISO + "T" + timeslotSelected;
	const fullBookingString = new Date(fullBookingISO).toLocaleDateString(undefined, { minute: 'numeric', hour: 'numeric', day: 'numeric', weekday: 'short', month: 'numeric', year: '2-digit' });

	const prevBtnRef = useRef();
	const viewedMonthDaysRef = useRef([]);
	const viewedDayTimesAvailRef = useRef([]);

	// STATES FOR CONTACT INFO DROPDOWN
	//**********************************
	const [contactDetailsDropdownState, setContactDetailsDropdownState] = useState(false);
	let contactDetailsDropdownVisbility = contactDetailsDropdownState ? "clicked" : "";
	let contactDetailsDropdownTabIndex = contactDetailsDropdownState ? "0" : "-1";
	let contactDetailsHeight = "0px";
	const [contactDetails, setContactDetails] = useState(contactObject);

	const contactFnameRef = useRef();
	const contactLnameRef = useRef();
	const contactPhoneRef = useRef();
	const contactEmailRef = useRef();
	const contactAddressRef = useRef();

	// FUNCTIONS FOR SERVICE DROPDOWN
	//**********************************
	function setServiceSelectedFxn(serviceName) {
		setServiceSelected(serviceName);
		setProductSelected('Select One');
		setProductQuestionDropdownState(true);
		setBookingDetailsDropdownState(false);
		setIsBookingDetailsValid(false);
		setCalendarTimeDropdownState(false);
		setIsCalendarTimeValid(false);
		setContactDetailsDropdownState(false);
	}

	// FUNCTIONS FOR CATEGORY DROPDOWN
	//**********************************
	function setProductSelectedFxn(productName) {
		setProductSelected(productName);
		setServiceQuestionDropdownState(false);
		setBookingDetailsDropdownState(true);
		setIsBookingDetailsValid(false);
		setCalendarTimeDropdownState(false);
		setIsCalendarTimeValid(false);
		setContactDetailsDropdownState(false);
	}

	// FUNCTIONS FOR BREAKDOWN DROPDOWN (BOOKING DETAILS)
	//********************************** 
	function bookingDetailsProceedFxn() {
		setBookingDetailsDropdownState(false);
		setServiceQuestionDropdownState(false);
		setProductQuestionDropdownState(false);
		setIsBookingDetailsValid(true);
		setCalendarTimeDropdownState(true);
		setIsCalendarTimeValid(false);
		setContactDetailsDropdownState(false);
	}
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

	// FUNCTIONS FOR BOOKING DROPDOWN (CALENDAR AND TIME)
	//**********************************
	function calendarTimeProceedFxn() {
		setServiceQuestionDropdownState(false);
		setProductQuestionDropdownState(false);
		setBookingDetailsDropdownState(false);
		setCalendarTimeDropdownState(false);
		setIsCalendarTimeValid(true);
		setContactDetailsDropdownState(true);
	}
	function nextMonth() {
		setCounter(count => count + 1);
	}
	function prevMonth() {
		counter > 0 && setCounter(count => count - 1);
	}
	async function viewDayBooking(dayISO) {
		const response = await axios.get(`/api/availability/${dayISO}`);
		setViewedDayTimesAvail(response.data);
		setViewedDayISO(dayISO);
	}
	function selectTimeslot(time) {
		setTimeslotSelected(time);
	}
	function addViewedMonthDaysRef(e) {
		e && !viewedMonthDaysRef.current.includes(e) ?
			viewedMonthDaysRef.current.push(e) : viewedMonthDaysRef.current.pop(e);
	}
	function addViewedDayTimeAvailRef(e) {
		e && !viewedDayTimesAvailRef.current.includes(e) ?
			viewedDayTimesAvailRef.current.push(e) : viewedDayTimesAvailRef.current.pop(e);
	}

	// FUNCTIONS FOR CONTACT DROPDOWN
	//**********************************

	function contactDetailsProceedFxn() {
		setContactDetails({
			fname: contactFnameRef.current.value,
			lname: contactLnameRef.current.value,
			phone: contactPhoneRef.current.value,
			email: contactEmailRef.current.value,
			address: contactAddressRef.current.value
		})
	}

	// USEEFFECTS
	//**********************************
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

	useEffect(() => {
		// runs when you swap months
		if (isBookingDetailsValid) {
			viewedMonthDaysRef.current.map(day => (
				// check if the day is today but not a sunday
				day.dataset.isoDate === todayISOdate && new Date(day.dataset.isoDate + timezone).getDay() !== 0 ? (day.classList.add("today"), day.querySelector('input').checked = true) : day.classList.remove("today"),
				// check if the day is today and is a sunday, then make the next day (monday) selected
				(day.dataset.isoDate === todayISOdate && new Date(day.dataset.isoDate + timezone).getDay() === 0) ?
					(document.querySelector(`[data-iso-date="${tomorrowISOdate}"] input`).checked = true, day.classList.add("today")) : day.classList.remove("today"),
				// check if the day is either a sunday or a previous day (to disable them)
				new Date(day.dataset.isoDate + timezone).getDay() === 0 || (new Date(day.dataset.isoDate + timezone) < dateObject && day.dataset.isoDate !== todayISOdate) ?
					(day.classList.add("disabled"), day.querySelector('input').disabled = true, day.querySelector('input').checked = false) :
					(day.classList.remove("disabled"), day.querySelector('input').disabled = false),
				// handle the radio buttons stay checked as you swap through months
				new Date(day.dataset.isoDate + timezone).getDay() !== 0 && (day.querySelector('input').checked = day.dataset.isoDate === viewedDayISO ? true : false)
			));
			counter === 0 ? prevBtnRef.current.disabled = true : prevBtnRef.current.disabled = false;
		}
	}, [counter, isBookingDetailsValid]);

	useEffect(() => {
		// runs when you select a day or swap months
		if (isBookingDetailsValid && viewedDayTimesAvail.length > 0) {
			viewedDayTimesAvailRef.current[0].querySelector('input').checked = true;
			setTimeslotSelected(viewedDayTimesAvailRef.current[0].dataset.time);
		}
	}, [viewedDayISO, counter, isBookingDetailsValid]);

	useEffect(() => {
		calendarTimeHeight = `${document.querySelector('[data-calendar-time-children-div]').offsetHeight + 4}px`;
		document.querySelector('[data-calendar-time-div]').style.setProperty('--height', calendarTimeHeight);
	}, [isBookingDetailsValid, counter, viewedDayTimesAvail]);

	useEffect(() => {
		contactDetailsHeight = `${document.querySelector('[data-contact-details-children-div]').offsetHeight + 2}px`;
		document.querySelector('[data-contact-details-div]').style.setProperty('--height', contactDetailsHeight);
	}, [isCalendarTimeValid]);

	// BACKEND COMMUNICATION
	//**********************************

	useEffect(() => {
		serviceParam && serviceObject.forEach(service => {
			if (service.name === serviceParam) {
				setServiceQuestionDropdownState(false);
				setProductQuestionDropdownState(true);
				setServiceSelected(service.name);
				document.querySelector('#book-question-service-name__' + service.slug).checked = true;

				service.products.forEach((product, index) => {
					if (product.name === productParam) {
						setProductQuestionDropdownState(false);
						setBookingDetailsDropdownState(true);
						setProductSelected(product.name);
						setTimeout(() => {
							const input = document.querySelector('#book-question-product-name__' + index);
							input && (input.checked = true);
						}, 1000)
					}
				})
			}
		});

		async function initViewDayBooking() {
			const response = await axios.get(`/api/availability/${viewedDayISO}`);
			setViewedDayTimesAvail(response.data);
		}
		initViewDayBooking();
	}, []);

	const bookingPacket = {
		Time: timeslotSelected,
		Service: serviceSelected,
		Product: productSelected,
		Details: persons,
		Edited_Photos: {
			Total: includedPhotos + addPhotos,
			Included: includedPhotos,
			Extra: addPhotos
		},
		Total_Cost: totalCost,
		Contact: contactDetails
	}

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
									onClick={() => { setServiceQuestionDropdownState(false); setServiceSelectedFxn(service.name) }} >
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
									onClick={() => { setProductQuestionDropdownState(false); setProductSelectedFxn(product.name) }} >
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
									<div className="book-details-general__btn button-btn-primary__wrap">
										<button onClick={bookingDetailsProceedFxn} tabIndex={bookingDetailsDropdownTabIndex}>Proceed</button></div>
								</div>
							</>
							:
							<div>Please choose a category above to see options here.</div>
						}
					</div>
				</div>
			</div>
			<div className="book-question__wrap">
				<button className={`book-question-dropdown-bar__wrap ${calendarTimeDropdownVisbility}`}
					onClick={() => setCalendarTimeDropdownState(prevstate => !prevstate)} data-calendar-time-btn>
					<div className="book-question-dropdown-bar__text">
						<strong>Booking:</strong> {isBookingDetailsValid && viewedDayTimesAvail.length > 0 ? fullBookingString : "No date selected"}</div>
					<div className="book-question-dropdown-bar__icon"><i className="fa-solid fa-chevron-down"></i></div>
				</button>
				<div className={`book-question-dropdown-options ${calendarTimeDropdownVisbility}`} data-calendar-time-div >
					<div className="book-calendar-and-time__wrap2" data-calendar-time-children-div >
						{isBookingDetailsValid ?
							<>
								<div className="book-calendar__wrap">
									<div >
										<div className="book-calendar-head__wrap">
											<button ref={prevBtnRef} onClick={prevMonth} tabIndex={calendarTimeDropdownTabIndex}>
												<i className="fa-solid fa-arrow-left"></i></button>
											<div className="book-calendar-head__current-month">{viewedMonthHeadline}</div>
											<button onClick={nextMonth} tabIndex={calendarTimeDropdownTabIndex}>
												<i className="fa-solid fa-arrow-right"></i></button>
										</div>
										<div className="book-calendar-weekdays__wrap">
											<div className="book-calendar-weekday">Mon</div>
											<div className="book-calendar-weekday">Tue</div>
											<div className="book-calendar-weekday">Wed</div>
											<div className="book-calendar-weekday">Thu</div>
											<div className="book-calendar-weekday">Fri</div>
											<div className="book-calendar-weekday">Sat</div>
											<div className="book-calendar-weekday">Sun</div>
										</div>
										<div className="book-calendar-days__wrap">
											{
												previousMonthLastDateObject.getDay() !== 0 && previousMonthDays.map((day, index) => (
													<div className="book-calendar-day__wrap disabled" key={index}>
														<input type="radio" disabled />
														<label> {day} </label>
													</div>
												))
											}
											{
												viewedMonthDays.map((day, index) => (
													<div className="book-calendar-day__wrap" key={index} ref={addViewedMonthDaysRef} data-iso-date={`${viewedMonthISO}-${doubleDigitOf(day)}`}>
														<input type="radio" name="book-calendar-day" id={`${viewedMonthISO}-${doubleDigitOf(day)}`}
															onChange={() => viewDayBooking(`${viewedMonthISO}-${doubleDigitOf(day)}`)} tabIndex={calendarTimeDropdownTabIndex} />
														<label htmlFor={`${viewedMonthISO}-${doubleDigitOf(day)}`}>
															{day}
														</label>
													</div>
												))
											}
											{
												viewedMonthLastDateObject.getDay() !== 0 && nextMonthDays.map((day, index) => (
													<div className="book-calendar-day__wrap disabled" key={index}>
														<input type="radio" disabled />
														<label>{day}</label>
													</div>
												))
											}
										</div>
									</div>
								</div>
								<div className="book-timeslot__wrap">
									<div>
										<div className="book-timeslot-head__wrap">
											{viewedDayString}
										</div>
										<div className="book-timeslot-body__wrap">
											{ viewedDayTimesAvail.length > 0 ?											
												<>
													<div className="book-timeslots__wrap">
															{viewedDayTimesAvail.map((time, index) => (
																<div className="book-timeslot-time" key={index} ref={addViewedDayTimeAvailRef} data-time={time}>
																	<input type="radio" name="book-timeslot-time" id={time} tabIndex={calendarTimeDropdownTabIndex}
																		onChange={() => selectTimeslot(time)} />
																	<label htmlFor={time}>{time}</label>
																</div>
															))}
													</div>
													<div className="book-timeslot-btn__wrap button-btn-primary__wrap">
														<button onClick={calendarTimeProceedFxn}>Proceed</button>
													</div>
												</>
												:
												<div>There is no available time to book on this day. Please chose a different day.</div>
											}
										</div>
									</div>
								</div>
							</>
							:
							<div>Select options above to book a date and time</div>
						}
					</div>
				</div>
			</div>
			<div className="book-question__wrap">
				<button className={`book-question-dropdown-bar__wrap ${contactDetailsDropdownVisbility}`}
					onClick={() => setContactDetailsDropdownState(prevstate => !prevstate)} data-contact-details-btn>
					<div className="book-question-dropdown-bar__text">
						<strong>Contact:</strong></div>
					<div className="book-question-dropdown-bar__icon"><i className="fa-solid fa-chevron-down"></i></div>
				</button>
				<div className={`book-question-dropdown-options ${contactDetailsDropdownVisbility}`} data-contact-details-div >
					<div className="book-contact-details__wrap2" data-contact-details-children-div >

						{isCalendarTimeValid ?
							<>
								<div className="book-contact-input__wrap">
									<label>First name:</label>
									<input type="text" name="contact-fname" ref={contactFnameRef} />
								</div>
								<div className="book-contact-input__wrap">
									<label>Last name:</label>
									<input type="text" name="contact-lname" ref={contactLnameRef} />
								</div>
								<div className="book-contact-input__wrap">
									<label>Phone:</label>
									<input type="tel" name="contact-phone" ref={contactPhoneRef} />
								</div>
								<div className="book-contact-input__wrap">
									<label>Email:</label>
									<input type="email" name="contact-email" ref={contactEmailRef} />
								</div>
								<div className="book-contact-input__wrap">
									<label>Address:</label>
									<input type="text" name="contact-address" ref={contactAddressRef} placeholder="Ex: Rond Point Express" />
								</div>
								<div className="book-contact-input__wrap flex-gap-8">
									<div className="book-contact-input-conscent__wrap">
										<input type="checkbox" id="book-contact-conscent-1__checkbox" />
										<label htmlFor="book-contact-conscent-1__checkbox">I agree to Tanteta's privacy policy</label>
									</div>
									<div className="book-contact-input-conscent__wrap">
										<input type="checkbox" id="book-contact-conscent-2__checkbox" />
										<label htmlFor="book-contact-conscent-2__checkbox">I conscent to Tanteta's photo release policy</label>
									</div>
								</div>
								<div className="book-contact-btn__wrap button-btn-primary__wrap">
									<button onClick={contactDetailsProceedFxn}>Proceed to Review</button>
								</div>
							</>
							:
							<div>Chose options from the steps above to complete your booking.</div>
						}

					</div>
				</div>
			</div>
			{<div><pre><code>{JSON.stringify(bookingPacket, null, 2)}</code></pre></div>}
		</>
	);
}

export default BookingDetailsComp;