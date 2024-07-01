/**
 * Changes the display property of the contact form from "none" to "flex" and adds event listeners for keyboard usage
 */
export function displayContactModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "flex";
    modal.querySelector('input').focus();
    document.addEventListener(`keydown`, initTrapFocus);
    document.addEventListener(`keydown`, handleKeyboard);
}

/**
 * Changes the display property of the contact form from "flex" to "none" and removes existing event listeners
 */
export function closeContactModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
    document.removeEventListener(`keydown`, initTrapFocus);
    document.removeEventListener(`keydown`, handleKeyboard);
}

/**
 * Logs the form data to the console
 * @param {SubmitEvent} e 
 */
export const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
    }
};

/**
 * Closes contact form on "esc" key press
 * @param {KeyboardEvent} e 
 */
const handleKeyboard = (e) => {
    if (e.key === 'Escape') {
        closeContactModal();
    }
};

/**
 * Prevents tab key focus from moving to elements outside of the modal
 * @param {FocusEvent} e 
 * @param {String} modal_id The id of the html modal element
 */
export const trapFocus = (e, modal_id) => {
    const isTabPressed = e.key === 'Tab';

    if (!isTabPressed) {
        return;
    }
    const focusableElements = `button, a, input, textarea, video`;
    const modal = document.getElementById(modal_id);
    // get focusable elements in modal
    const focusableContent = modal.querySelectorAll(focusableElements);
    const firstFocusableElement = focusableContent[0];
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    //prevent focus from moving away from the modal
    if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
        }
    }
    else if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        e.preventDefault();
    }
};

/**
 * Function used to call trapFocus, so that it can be added as an event listener when the modal is opened and removed when it's closed
 * @param {FocusEvent} e 
 * @returns {Function}
 */
const initTrapFocus = (e) => {
    return trapFocus(e, 'contact_modal');
};