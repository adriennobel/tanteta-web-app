import { useState, useEffect, useRef } from "react";
import useBookingDetailsComp from "../components/bookingDetailsComp";

const useBookingCalendarComp = () => {

   const { bookingDetails, bookingDetailsRender } = useBookingDetailsComp();

   // State that controls visibiity of calendar and timeslots 
   const [calendarTimeDropdownState, setCalendarTimeDropdownState] = useState(false);
   let calendarTimeDropdownTabIndex = calendarTimeDropdownState ? "0" : "-1";
   let calendarTimeHeight = "0px";

   function toggleCalendarTimedropdown() {
      setCalendarTimeDropdownState(prevstate => !prevstate);
      document.querySelector('[data-calendar-time-div]').classList.toggle("clicked");
      document.querySelector('[data-calendar-time-btn]').classList.toggle("clicked");
   }

   const timezone = "EST";
   const dateObject = new Date(); // Sat Apr 29 2023 07:13:20 GMT-0400 (Eastern Daylight Time)

   function doubleDigitOf(month) {
      const doubleDigitOf = month.toString().length < 2 ? ("0" + month) : month;
      return doubleDigitOf
   }

   const todayISOdate = dateObject.getFullYear() + "-" + doubleDigitOf(dateObject.getMonth() + 1) + "-" + dateObject.getDate(); // 2023-4-29
   const tomorrowISOdate = dateObject.getFullYear() + "-" + doubleDigitOf(dateObject.getMonth() + 1) + "-" + (dateObject.getDate() + 1); // 2023-4-29

   const [counter, setCounter] = useState(0);

   const previousMonthLastDateObject = new Date(dateObject.getFullYear(), dateObject.getMonth() + counter, 0); // new Date(2023, 3, 0)
   const previousMonthDaysArray = new Array(previousMonthLastDateObject.getDay()).join().split(','); // ['','','','',...]
   previousMonthDaysArray.map((e, i) => {
      previousMonthDaysArray[i] = previousMonthLastDateObject.getDate() - previousMonthLastDateObject.getDay() + 1 + i;
   });

   const viewedMonthLastDateObject = new Date(dateObject.getFullYear(), dateObject.getMonth() + 1 + counter, 0); // new Date(2023, 4, 0)
   const viewedMonthDaysArray = new Array(viewedMonthLastDateObject.getDate()).join().split(','); // ['','','','',...]
   viewedMonthDaysArray.map((e, i) => {
      viewedMonthDaysArray[i] = i + 1;
   });

   const nextMonthDaysArray = new Array(7 - viewedMonthLastDateObject.getDay()).join().split(','); // ['','','','',...]
   nextMonthDaysArray.map((e, i) => {
      nextMonthDaysArray[i] = i + 1;
   });

   const viewedMonthHeadline = viewedMonthLastDateObject.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }); // April 2023
   const viewedMonthISO = viewedMonthLastDateObject.getFullYear() + "-" + doubleDigitOf(viewedMonthLastDateObject.getMonth() + 1); // 2023-4

   function nextMonth() {
      setCounter(count => count + 1);
   }

   function prevMonth() {
      counter > 0 && setCounter(count => count - 1);
   }

   // Reference to all days of viewed mmonth in an array
   const daysRef = useRef([]);
   function addDaysRef(e) {
      e && !daysRef.current.includes(e) &&
         daysRef.current.push(e);
   }

   // Reference to all times for the selected day
   const timesRef = useRef([]);
   function addTimesRef(e) {
      e && !timesRef.current.includes(e) &&
      timesRef.current.push(e);
   }

   const prevBtnRef = useRef();

   const [viewedDayISO, setViewedDayISO] = useState(todayISOdate); 
   // below state is initialized by api response
   const [viewedDayTimeAvail, setViewedDayTimeAvail] = useState(["11:00", "11:30", "12:00",]);
   const [timeslotSelected, setTimeslotSelected] = useState(viewedDayTimeAvail[0]);

   function viewDayBooking(dayISO) {
      setViewedDayISO(dayISO);

      // make api call to GET timeslots of viewedDayISO and set to viewedDayTimeAvail so that it can be displayed
      // below code is a test
      dayISO === todayISOdate ? setViewedDayTimeAvail(["11:00", "11:30", "12:00",]) : setViewedDayTimeAvail(["14:00", "14:30", "15:00", "15:30", "16:00", "16:30",]);
   }

   function selectTimeslot(time) {
      setTimeslotSelected(time);
   }

   const fullBookingISO = `${viewedDayISO}T${timeslotSelected}`;
   const fullBookingString = new Date(fullBookingISO).toLocaleDateString(undefined, {minute: 'numeric', hour: 'numeric', day: 'numeric', weekday: 'long', month: 'long', year: 'numeric' });
   
   useEffect(() => {
      // runs when you swap months

      daysRef.current.map(day => (
         // check if the day is today
         day.dataset.isoDate === todayISOdate ? (day.classList.add("today"), day.querySelector('input').checked = true) : day.classList.remove("today"),
         // check if the day is either a sunday or a previous day (to disable them)
         new Date(day.dataset.isoDate + timezone).getDay() === 0 || (new Date(day.dataset.isoDate + timezone) < dateObject && day.dataset.isoDate !== todayISOdate) ?
            (day.classList.add("disabled"), day.querySelector('input').disabled = true, day.querySelector('input').checked = false) :
            (day.classList.remove("disabled"), day.querySelector('input').disabled = false),
         // check if today is a sunday, then make the next day (monday) selected
         day.dataset.isoDate === todayISOdate && new Date(day.dataset.isoDate + timezone).getDay() === 0 && 
            (document.querySelector(`[data-iso-date="${tomorrowISOdate}"] input`).checked = true),
         // handle the radio buttons stay checked as you swap through months
         day.querySelector('input').checked = day.dataset.isoDate === viewedDayISO ? true : false
      ));

      counter === 0 ? prevBtnRef.current.disabled = true : prevBtnRef.current.disabled = false;

   }, [counter]);

   useEffect(() => {
      // runs when you select a day or swap months

      timesRef.current[0].querySelector('input').checked = true;
      setTimeslotSelected(timesRef.current[0].dataset.time);
      

   }, [viewedDayISO, counter]);

   useEffect(() => {

      calendarTimeHeight = `${document.querySelector('[data-calendar-time-children-div]').offsetHeight + 2}px`;
      document.querySelector('[data-calendar-time-div]').style.setProperty('--height', calendarTimeHeight);

   });

   // const testDay = new Date("2023-10-16");
   // console.log(testDay);

   return {
      viewedDayISO,
      viewedDayTimeAvail,
      fullBookingString,
      bookingCalendarRender: (
         <div className="book-question__wrap">
            <button className={`book-question-dropdown-bar__wrap`}
               onClick={toggleCalendarTimedropdown} data-calendar-time-btn>
               <div className="book-question-dropdown-bar__text">
                  <strong>Booking:</strong> {timeslotSelected != null ? fullBookingString : "Pick a date and time"}</div>
               <div className="book-question-dropdown-bar__icon"><i className="fa-solid fa-chevron-down"></i></div>
            </button>
            <div className={`book-question-dropdown-options`} data-calendar-time-div >
               <div className="book-calendar-and-time__wrap2" data-calendar-time-children-div >
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
                              previousMonthLastDateObject.getDay() !== 0 && previousMonthDaysArray.map((day, index) => (
                                 <div className="book-calendar-day__wrap disabled" key={index}>
                                    <input type="radio" disabled />
                                    <label> {day} </label>
                                 </div>
                              ))
                           }
                           {
                              viewedMonthDaysArray.map((day, index) => (
                                 <div className="book-calendar-day__wrap" key={index} ref={addDaysRef} data-iso-date={`${viewedMonthISO}-${doubleDigitOf(day)}`}>
                                    <input type="radio" name="book-calendar-day" id={`${viewedMonthISO}-${doubleDigitOf(day)}`}
                                       onChange={() => viewDayBooking(`${viewedMonthISO}-${doubleDigitOf(day)}`)} tabIndex={calendarTimeDropdownTabIndex} />
                                    <label htmlFor={`${viewedMonthISO}-${doubleDigitOf(day)}`}>
                                       {day}
                                    </label>
                                 </div>
                              ))
                           }
                           {
                              viewedMonthLastDateObject.getDay() !== 0 && nextMonthDaysArray.map((day, index) => (
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
                           {fullBookingString}
                        </div>
                        <div className="book-timeslot-body__wrap">
                           {
                              viewedDayTimeAvail.map((time, index) => (
                                 <div className="book-timeslot-time" key={index} ref={addTimesRef} data-time={time}>
                                    <input type="radio" name="book-timeslot-time" id={time} tabIndex={calendarTimeDropdownTabIndex}
                                       onChange={() => selectTimeslot(time)} />
                                    <label htmlFor={time}>{time}</label>
                                 </div>
                              ))
                           }
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {<div><pre><code>{JSON.stringify(bookingDetails, null, 2)}</code></pre></div>}
         </div>
      ),
   }
}

export default useBookingCalendarComp;