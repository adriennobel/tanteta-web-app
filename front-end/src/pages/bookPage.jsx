import { useState } from "react";

const BookPage = () => {

    // State that controls visibiity of book category options 
    const [categoryOptionsState, setCategoryOptionsState] = useState(false);
    let categoryOptionsVisbility = categoryOptionsState ? "clicked" : "";

    window.onclick = (e) => {
        if (!document.querySelector('.book-category__dropdown-bar').contains(e.target)) {
            setCategoryOptionsState(false);
        }
    }

    return (
        <div className="book-page">
            <div className="book-category__title"><h3>Which Service do you need?</h3></div>
            <div className="book-category__dropdown-bar" onClick={() => setCategoryOptionsState(prevstate => !prevstate)}>
                <div className="book-category__dropdown-bar-text">Select One</div>
                <div className="book-category__dropdown-bar-icon"><i className="fa-solid fa-caret-down"></i></div>
            </div>
            <div className={`book-category__dropdown-options ${categoryOptionsVisbility}`}>
                <div className="book-category__container">
                    <input type="radio" name="book-category__radio-name" id="book-category-id__studio-shooting" />
                    <label className="book-category__label-container" htmlFor="book-category-id__studio-shooting">
                        <div className="book-category__option-text">Studio Shooting</div>
                        <div className="book-category__option-image"><img src="/images/TAN_2761.jpg" alt="" width="100%" /></div>
                    </label>
                </div>
                <div className="book-category__container">
                    <input type="radio" name="book-category__radio-name" id="book-category-id__outdoor-shooting" />
                    <label className="book-category__label-container" htmlFor="book-category-id__outdoor-shooting">
                        <div className="book-category__option-text">Outdoor Shooting</div>
                        <div className="book-category__option-image"><img src="/images/TAN_2761.jpg" alt="" width="100%" /></div>
                    </label>
                </div>
                <div className="book-category__container">
                    <input type="radio" name="book-category__radio-name" id="book-category-id__home-shooting" />
                    <label className="book-category__label-container" htmlFor="book-category-id__home-shooting">
                        <div className="book-category__option-text">Home Shooting</div>
                        <div className="book-category__option-image"><img src="/images/TAN_2761.jpg" alt="" width="100%" /></div>
                    </label>
                </div>
                <div className="book-category__container">
                    <input type="radio" name="book-category__radio-name" id="book-category-id__event-per-hour" />
                    <label className="book-category__label-container" htmlFor="book-category-id__event-per-hour">
                        <div className="book-category__option-text">Event Coverage Per Hour</div>
                        <div className="book-category__option-image"><img src="/images/TAN_2761.jpg" alt="" width="100%" /></div>
                    </label>
                </div>
                <div className="book-category__container">
                    <input type="radio" name="book-category__radio-name" id="book-category-id__event-per-pack" />
                    <label className="book-category__label-container" htmlFor="book-category-id__event-per-pack">
                        <div className="book-category__option-text">Event Coverage Per Package</div>
                        <div className="book-category__option-image"><img src="/images/TAN_2761.jpg" alt="" width="100%" /></div>
                    </label>
                </div>
                <div className="book-category__container">
                    <input type="radio" name="book-category__radio-name" id="book-category-id__prints-frames" />
                    <label className="book-category__label-container" htmlFor="book-category-id__prints-frames">
                        <div className="book-category__option-text">Prints & Frames</div>
                        <div className="book-category__option-image"><img src="/images/TAN_2761.jpg" alt="" width="100%" /></div>
                    </label>
                </div>
            </div>
        </div>
    );
}

export default BookPage;