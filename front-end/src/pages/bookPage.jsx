import { useState, useEffect, useRef } from "react";
import BookingDetailsComp from "../components/bookingDetailsComp";
import useBookingCalendarComp from "../components/bookingCalendarComp";

const BookPage = () => {

   const { viewedDayISO, viewedDayTimeAvail, bookingCalendarRender } = useBookingCalendarComp();

   // NEXT STEPS: 
   // 1. create a state to store the selected timeslot.
   // 2. Make that selected timeslot display in .book-timeslot-head__wrap
   // 3. Remove the selected timeslot from viewedDayTimeAvail array and store in new array that will be sent to Database
   // 4. Use viewedDayISO to PUT updated timeslots (after removing the selected time) in the database object of that day

   return (
      <div className="book-page">

         <BookingDetailsComp />
         {bookingCalendarRender}

         
      </div>
   );
}

export default BookPage;