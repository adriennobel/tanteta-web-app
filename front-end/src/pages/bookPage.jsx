import { useState, useEffect, useRef } from "react";
import useBookingDetailsComp from "../components/bookingDetailsComp";
import useBookingCalendarComp from "../components/bookingCalendarComp";

const BookPage = () => {

   const { bookingDetails, bookingDetailsRender } = useBookingDetailsComp();
   const { viewedDayISO, viewedDayTimeAvail, viewedDayString, bookingCalendarRender } = useBookingCalendarComp();

   // NEXT STEPS: 
   // 1. create a state to store the selected timeslot.
   // 2. Make that selected timeslot display in .book-timeslot-head__wrap
   // 3. Remove the selected timeslot from viewedDayTimeAvail array and store in new array that will be sent to Database
   // 4. Use viewedDayISO to PUT updated timeslots (after removing the selected time) in the database object of that day

   return (
      <div className="book-page">

         {bookingDetailsRender}

         <div className="book-calendar-and-time__wrap">
            {bookingCalendarRender}

            <div className="book-timeslot__wrap">
               <div>
                  <div className="book-timeslot-head__wrap">
                     {viewedDayString}
                  </div>
                  <div className="book-timeslot-body__wrap">
                     {
                        viewedDayTimeAvail.map((time, index) => (
                           <div className="book-timeslot-time" key={index}>
                              <input type="radio" name="book-timeslot-time" id={time} />
                              <label htmlFor={time}>{time}</label>
                           </div>
                        ))
                     }
                  </div>
               </div>

            </div>
         </div>

      </div>
   );
}

export default BookPage;