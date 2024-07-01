import { trapFocus } from "./../utils/contactForm.js";

let lightbox;
let currentlyShownMediaIndex;
let media;

/**
 * Function used to call trapFocus, so that it can be added as an event listener when the modal is opened and removed when it's closed
 * @param {FocusEvent} e 
 * @returns {Function}
 */
const initTrapFocus = (e) => {
    return trapFocus(e, 'lightbox-modal');
};

/**
 * Store media items to global variable and create event listeners for lightbox buttons
 * @param {import("../templates/mediaCard.js").MediaElement[]} m 
 */
export const initLightbox = (m) => {
    media = m;
    lightbox = document.getElementById('lightbox-modal');
    lightbox.getElementsByClassName('close-btn')[0].addEventListener('click', closeLightbox);
    createPreviousNextButtonsEventListeners();
};

/**
 * Changes the lightbox display to "none" and removes existing event listeners
 */
const closeLightbox = () => {
    lightbox.style.display = 'none';
    document.removeEventListener('keydown', handleKeyPress);
    document.removeEventListener('keydown', initTrapFocus);
};

/**
 * Changes the lightbox display from "none" to "block", loads the selected media item and creates event listeners for lighbox buttons
 * @param {Number} mediaId 
 */
export const openLightbox = (mediaId) => {
    if (mediaId) {
        setLightboxShownMedia(mediaId);
    }
    lightbox.style.display = 'block';
    lightbox.querySelector('.close-btn').focus();
    document.addEventListener('keydown', initTrapFocus);
    document.addEventListener('keydown', handleKeyPress);
};

/**
 * Handles keyboard navigation within the lightbox
 * @param {KeyboardEvent} event 
 */
const handleKeyPress = (event) => {
    const previousButton = document.getElementById('previous-btn');
    const nextButton = document.getElementById('next-btn');

    switch (event.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            if (previousButton.style.visibility != 'hidden') {
                showPreviousMedia();
            }
            break;
        case 'ArrowRight':
            if (nextButton.style.visibility != 'hidden') {
                showNextMedia();
            }
            break;
        default:
            break;
    }
};

/**
 * Updates the media shown in the lightbox and removes previous/next buttons if necessary
 * @param {Number} mediaId 
 */
const setLightboxShownMedia = (mediaId) => {
    const mediaElement = media.find(el => el.id == mediaId);
    currentlyShownMediaIndex = media.findIndex(el => el.id == mediaId);
    const mediaItemPlaceholder = document.getElementById('media-item');
    if (mediaElement.image) {
        mediaItemPlaceholder.innerHTML = `
            <img src='assets/images/media/${mediaElement.image}' alt='${mediaElement.title}'/>
            <div class="media-title">${mediaElement.title}</div>
         `;
    } else {
        mediaItemPlaceholder.innerHTML = `
        <video controls src='assets/images/media/${mediaElement.video}' alt='${mediaElement.title}'></video>
        <div class="media-title">${mediaElement.title}</div>
     `;
    }
    //dialog element loses focus after the update
    lightbox.focus();

    //hide previous/next buttons if we are at the beginning/end of the array
    if (currentlyShownMediaIndex == 0) {
        document.getElementById('previous-btn').style.visibility = 'hidden';
    } else if (currentlyShownMediaIndex == (media.length - 1)) {
        document.getElementById('next-btn').style.visibility = 'hidden';
    } else {
        document.getElementById('previous-btn').style.visibility = 'visible';
        document.getElementById('next-btn').style.visibility = 'visible';
    }
};

/**
 * Shows the previous media in the lightbox
 */
const showPreviousMedia = () => {
    setLightboxShownMedia(media[currentlyShownMediaIndex - 1].id);
};

/**
 * Shows the next media in the lightbox
 */
const showNextMedia = () => {
    setLightboxShownMedia(media[currentlyShownMediaIndex + 1].id);
};

/**
 * Creates event listeners for lightbox navigation buttons
 */
const createPreviousNextButtonsEventListeners = () => {
    const previousButton = document.getElementById('previous-btn');
    const nextButton = document.getElementById('next-btn');

    previousButton.addEventListener('click', showPreviousMedia);
    nextButton.addEventListener('click', showNextMedia);
};