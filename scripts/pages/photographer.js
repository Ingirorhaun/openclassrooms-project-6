import { closeContactModal, displayContactModal, handleFormSubmit } from "../utils/contactForm.js";
import { getPhotographerById, getMediaByPhotographerId } from "../utils/fetchData.js";
import { initLightbox, openLightbox } from "../utils/lightbox.js";
import { readLikedMediaLocalStorage, updateLikedMediaLocalStorage } from "../utils/localStorage.js";
import { generateMediaCard } from "../templates/mediaCard.js";

let media;

/**
 * Populates the page with information about a specific photographer, based on the id in the url search parameters
 */
const init = async () => {
    const photographerId = new URL(window.location.href).searchParams.get('id');

    // Fetch photographer info and photos
    const photographer = await getPhotographerById(photographerId);
    media = await getMediaByPhotographerId(photographer.id);

    //update page title
    document.title = `Fisheye - ${photographer.name}`;

    //get list of liked media from local storage and update the number of likes
    const likedMedia = readLikedMediaLocalStorage();
    media.forEach(el => {
        el.isLiked = likedMedia?.includes(String(el.id)) || false;
        //add 1 if liked===true
        el.likes += el.isLiked;
    });

    populatePhotographerInfoSection(photographer);
    populateLikesCounter(photographer.price, media);
    populateMediaSection(media);
    initLightbox(media);

    //create event listeners
    createSortMenuEventListeners();
    document.getElementsByClassName('contact_button')[0].addEventListener('click', displayContactModal);
    document.getElementById('contact_modal').getElementsByClassName('close-btn')[0].addEventListener('click', closeContactModal);
    document.getElementsByTagName('form')[0].addEventListener('submit', handleFormSubmit);
};

/**
 * Adds photographer information and profile photo to the page
 * @param {import("../templates/photographer.js").Photographer} photographer 
 */
const populatePhotographerInfoSection = (photographer) => {
    const { name, city, country, tagline, portrait } = photographer;
    const photographerInfoDiv = document.getElementsByClassName('photographer-info')[0];
    const photographerPhoto = document.getElementsByClassName('photographer-photo')[0];

    photographerInfoDiv.innerHTML = `
    <h2>${name}</h2>
    <h3>${city}, ${country}</h3>
    <p class='tagline'>${tagline}</p>
    `;
    photographerPhoto.setAttribute('src', `assets/images/photographers/thumbnails/${portrait.substring(0, portrait.indexOf('.'))}_thumb.jpg`);
    photographerPhoto.setAttribute('alt', `${name}`);

    //insert the photographer name in the contact modal as well
    document.getElementById('contact_modal').querySelector('h1').innerHTML += `<br/>${name}`;
};

/**
 * Adds all the photographer's media to the page, optionally sorting them
 * @param {import("../templates/mediaCard.js").MediaElement[]} media 
 * @param {('likes'|'date'|'title')} sortMode 
 */
const populateMediaSection = (media, sortMode) => {
    switch (sortMode) {
        case 'likes':
            media.sort((a, b) => b.likes - a.likes);
            break;
        case 'date':
            media.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'title':
            media.sort((a, b) => a.title.localeCompare(b.title));
            break;
        default:
            break;
    }
    //remove exisiting media gallery (in case the function is called again to change the sorting type)
    document.getElementById('media-gallery')?.remove();

    //create new media gallery and add cards for each media element
    const mediaGallery = document.createElement("div");
    mediaGallery.setAttribute("id", "media-gallery");

    media.forEach(el => {
        const mediaCard = generateMediaCard(el);
        mediaGallery.appendChild(mediaCard);
    });

    document.getElementById("media-section")?.appendChild(mediaGallery);

    //add event listeners
    createCardsEventListeners();
    createLikeEventListeners();
};

/**
 * Shows the total number of likes across all media belonging to the same photographer, as well as the photographer's price
 * @param {Number} price 
 * @param {import("../templates/mediaCard.js").MediaElement[]} media 
 */
const populateLikesCounter = (price, media) => {
    const likesCounter = document.getElementById("likes-counter");
    const totalLikes = media.reduce((sum, el) => sum + el.likes, 0);

    likesCounter.innerHTML = `
    <p class="totalLikes" aria-label="Nombre total de likes">${totalLikes}❤︎</p>
    <p>${price}€/jour</p>
    `;
};


/* EVENT LISTENERS */

/**
 * Creates event listeners for cliks on like buttons
 */
const createLikeEventListeners = () => {
    const likeButtons = document.getElementsByClassName('like-btn');
    Array.from(likeButtons).forEach(btn =>
        btn.addEventListener('click', addRemoveLike)
    );

};

/**
 * Creates event listeners to open the lightbox when clicking on a media card
 */
const createCardsEventListeners = () => {
    const cards = document.getElementsByClassName('media-card');
    Array.from(cards).forEach(card => {
        const link = card.children[0];
        link.addEventListener('click', () => {
            openLightbox(card.dataset.id);
        });
    });
};

/**
 * Creates event listeners for mouse interactions with the sort menu
 */
const createSortMenuEventListeners = () => {
    const sortButton = document.getElementsByClassName('dropbtn')[0];
    const sortMenu = document.getElementsByClassName('dropdown-items')[0];
    const sortOptionsList = {
        title: "Titre",
        date: "Date",
        likes: "Popularité"
    };
    sortButton.addEventListener('click', () => {
        sortMenu.style.display = 'flex';
    });

    //close the sort menu if the user clicks outside of it
    window.addEventListener('click', (e) => {
        if (e.target != sortMenu && e.target != sortButton && sortMenu.style.display == 'flex') {
            sortMenu.style.display = 'none';
        }
    });

    const menuItems = sortMenu.children;
    for (let i = 0; i < menuItems.length; i++) {
        const el = menuItems[i];
        el.addEventListener('click', () => {
            sortMenu.style.display = 'none';
            populateMediaSection(media, el.dataset.sort);
            sortButton.innerText = sortOptionsList[el.dataset.sort];
        });
    }
};


/* LIKES UPDATE */

/**
 * Adds or removes a like from a media element
 * @param {MouseEvent} event 
 */
const addRemoveLike = (event) => {
    const card = event.target.closest(".media-card");
    const mediaId = card.dataset.id;
    const isLiked = media.find(item => item.id == mediaId)?.isLiked;

    if (!isLiked)
        updateLikesCounter(card, 1);
    else
        updateLikesCounter(card, -1);

    updateLikedMediaLocalStorage(mediaId);
};

/**
 * Updates the likes counter of a media item in the media array, on the media card and on the total likes counter
 * @param {HTMLElement} card 
 * @param {Number} value 
 */
const updateLikesCounter = (card, value) => {
    //increase likes counter in media array
    const mediaIndex = media.findIndex(item => item.id == card.dataset.id);
    media[mediaIndex].likes += value;
    media[mediaIndex].isLiked = value == 1;

    //increase like counter in media card
    const currentLikes = Number(card.querySelector('[aria-label="likes"]').innerText);
    card.querySelector('[aria-label="likes"]').innerText = currentLikes + value;

    //increase total likes counter
    const totalLikesCounter = document.getElementsByClassName('totalLikes')[0];
    totalLikesCounter.innerText = Number(totalLikesCounter.innerText.substring(0, totalLikesCounter.innerText.indexOf("❤︎"))) + value + "❤︎";
};

init();