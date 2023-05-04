import { useState, useEffect, useRef } from "react";
import useBookingDetailsComp from "../components/bookingDetailsComp";

const BookPage = () => {

   const { bookingDetails, bookingDetailsRender } = useBookingDetailsComp();


   const dateObject = new Date(); // Sat Apr 29 2023 07:13:20 GMT-0400 (Eastern Daylight Time)
   const todayISOdate = dateObject.getFullYear() + "-" + (dateObject.getMonth() + 1) + "-" + dateObject.getDate(); // 2023-4-29

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
   const viewedMonthISO = viewedMonthLastDateObject.getFullYear() + "-" + (viewedMonthLastDateObject.getMonth() + 1); // 2023-4
   const previousMonthISO = previousMonthLastDateObject.getFullYear() + "-" + (previousMonthLastDateObject.getMonth() + 1); // 2023-3

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

   useEffect(() => {
      daysRef.current.map(day => (
         day.dataset.isoDate === todayISOdate ? (day.classList.add("today"), day.querySelector('input').checked = true) : day.classList.remove("today"),
         new Date(day.dataset.isoDate).getDay() === 0 || (new Date(day.dataset.isoDate) < dateObject && day.dataset.isoDate !== todayISOdate) ?
            (day.classList.add("disabled"), day.querySelector('input').disabled = true, day.querySelector('input').checked = false) :
            (day.classList.remove("disabled"), day.querySelector('input').disabled = false),
         day.querySelector('input').checked === true && viewDayBooking(day.dataset.isoDate)
      ));

   }, [counter])

   const [viewedDayISO, setViewedDayISO] = useState(todayISOdate);

   function viewDayBooking(dayISO) {
      setViewedDayISO(dayISO);
   }

   const viewedDayString = new Date(`${viewedDayISO} EST`).toLocaleDateString(undefined, { day: 'numeric', weekday: 'long', month: 'long', year: 'numeric' });

   const testDay = new Date("2023-11-12 EST");
   // console.log(viewedDayString);

   return (
      <div className="book-page">

         {bookingDetailsRender}

         <div className="book-calendar-and-time__wrap">
            <div className="book-calendar__wrap">
               <div className="book-calendar-head__wrap">
                  <button onClick={prevMonth}><i className="fa-solid fa-arrow-left"></i></button>
                  <div className="book-calendar-head__current-month">{viewedMonthHeadline}</div>
                  <button onClick={nextMonth}><i className="fa-solid fa-arrow-right"></i></button>
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
                        <div className="book-calendar-day__wrap" key={index} ref={addDaysRef} data-iso-date={`${viewedMonthISO}-${day}`}>
                           <input type="radio" name="book-calendar-day" id={`${viewedMonthISO}-${day}`} onChange={() => viewDayBooking(`${viewedMonthISO}-${day}`)} />
                           <label htmlFor={`${viewedMonthISO}-${day}`}>
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

            <div className="book-timeslot__wrap">
               {viewedDayString}
            </div>
         </div>
      </div>
   );
}

export default BookPage;