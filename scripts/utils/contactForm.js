export function displayContactModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "flex";
    modal.querySelector('input').focus()
    document.addEventListener(`keydown`, initTrapFocus);
    document.addEventListener(`keydown`, handleKeyboard);
}

export function closeContactModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
    document.removeEventListener(`keydown`, initTrapFocus);
    document.removeEventListener(`keydown`, handleKeyboard);
}

export const handleFormSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target);
    for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
    }
}

const handleKeyboard = (e) => {
    if (e.key === 'Escape') {
        closeContactModal()
    }
}

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
}

const initTrapFocus = (e) => {
    return trapFocus(e, 'contact_modal')
}