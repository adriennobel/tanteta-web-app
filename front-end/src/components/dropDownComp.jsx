import { useState, useEffect, useRef } from "react";

const DropDownComp = ({children}) => {

   // States that control service dropdown 
   const [serviceSelected, setServiceSelected] = useState('Select One');
   const [serviceQuestionDropdownState, setServiceQuestionDropdownState] = useState(true);
   let serviceQuestionDropdownVisbility = serviceQuestionDropdownState ? "clicked" : "";
   let serviceQuestionDropdownTabIndex = serviceQuestionDropdownState ? "0" : "-1";

   return (
      <div className="book-question__wrap drop-down-component">
         <button className={`book-question-dropdown-bar__wrap ${serviceQuestionDropdownVisbility}`} id="book-question-service-name-dropdown-bar__id"
            onClick={() => setServiceQuestionDropdownState(prevstate => !prevstate)}>
            <div className="book-question-dropdown-bar__text"><strong>Service:</strong> {serviceSelected}</div>
            <div className="book-question-dropdown-bar__icon"><i className="fa-solid fa-chevron-down"></i></div>
         </button>
         <div className={`book-question-dropdown-options dropdown-children__wrap ${serviceQuestionDropdownVisbility}`} >
            {children}
         </div>
      </div>
   );
}

export default DropDownComp;