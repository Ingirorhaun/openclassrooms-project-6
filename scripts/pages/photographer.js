import { closeContactModal, displayContactModal, handleFormSubmit } from "../utils/contactForm.js";
import { getPhotographerById, getMediaByPhotographerId } from "../utils/fetchData.js";
import { initLightbox, openLightbox } from "../utils/lightbox.js";
import { readLikedMediaLocalStorage, updateLikedMediaLocalStorage } from "../utils/localStorage.js";

let media

const init = async () => {
    const photographerId = new URL(window.location.href).searchParams.get('id')

    // Fetch photographer info and photos
    const photographer = await getPhotographerById(photographerId);
    media = await getMediaByPhotographerId(photographer.id);

    //(temporary) get list of liked media from local storage and update the number of likes
    const likedMedia = readLikedMediaLocalStorage()
    media.forEach(el => {
        el.isLiked = likedMedia?.includes(String(el.id)) || false
        //add 1 if liked===true
        el.likes += el.isLiked
    })

    populatePhotographerInfoSection(photographer);
    populateLikesCounter(photographer.price, media)
    populateMediaSection(media)
    createSortMenuEventListeners()

    document.getElementsByClassName('contact_button')[0].addEventListener('click', displayContactModal)
    initLightbox(media)
    document.getElementById('contact_modal').getElementsByClassName('close-btn')[0].addEventListener('click', closeContactModal)
    document.getElementsByTagName('form')[0].addEventListener('submit', handleFormSubmit)
}

const populatePhotographerInfoSection = (photographer) => {
    const { name, city, country, tagline, portrait } = photographer;
    const photographerInfoDiv = document.getElementsByClassName('photographer-info')[0]
    const photographerPhoto = document.getElementsByClassName('photographer-photo')[0]

    photographerInfoDiv.innerHTML = `
    <h2>${name}</h2>
    <h3>${city}, ${country}</h3>
    <p class='tagline'>${tagline}</p>
    `
    photographerPhoto.setAttribute('src', `assets/images/photographers/thumbnails/${portrait.substring(0, portrait.indexOf('.'))}_thumb.jpg`)
    photographerPhoto.setAttribute('alt', `${name}`)

    //insert the photographer name in the contact modal as well
    document.getElementById('contact_modal').querySelector('h1').innerHTML += `<br/>${name}`
}

const populateMediaSection = (media, sortMode) => {
    switch (sortMode) {
        case 'likes':
            media.sort((a, b) => b.likes - a.likes)
            break;
        case 'date':
            media.sort((a, b) => new Date(a.date) - new Date(b.date))
            break;
        case 'title':
            media.sort((a, b) => a.title.localeCompare(b.title))
            break;
        default:
            break;
    }
    document.getElementById('media-gallery')?.remove()
    const mediaGallery = document.createElement("div")
    mediaGallery.setAttribute("id", "media-gallery")

    media.forEach(el => {
        if (el.image) {
            const imageCard = generateImageCard(el)
            mediaGallery.appendChild(imageCard)
        } else {
            const videoCard = generateVideoCard(el)
            mediaGallery.appendChild(videoCard)
        }
    });

    document.getElementById("media-section")?.appendChild(mediaGallery)
    createCardsEventListeners()
    createLikeEventListeners()
}

const generateImageCard = (mediaElement) => {
    const { title, image, likes, id } = mediaElement
    const card = document.createElement("div")
    card.classList.add("media-card")
    card.dataset.id = id;
    card.innerHTML = `
        <a href="#" title="${title}">
            <figure>
                <img src="assets/images/media/thumbnail_${image}" alt="${title}"/>
            </figure>
        </a>
        <div>
            <p>${title}</p>
            <span><p aria-label="likes">${likes}</p><button class="like-btn" aria-label="like">❤︎</button></span>
        </div>
    `
    return card
}

const generateVideoCard = (mediaElement) => {
    const { title, video, likes, id } = mediaElement
    const card = document.createElement("div")
    card.classList.add("media-card")
    card.dataset.id = id;
    card.innerHTML = `
        <a href="#" title="${title}">
            <figure>
                <video src="assets/images/media/${video}" title="${title}"/>
            </figure>
        </a>
        <div>
            <p>${title}</p>
            <span><p aria-label="likes">${likes}</p><button class="like-btn" aria-label="like">❤︎</button></span>
        </div>
    `
    return card
}

const populateLikesCounter = (price, media) => {
    const likesCounter = document.getElementById("likes-counter")
    let totalLikes = media.reduce((sum, el) => sum + el.likes, 0)

    likesCounter.innerHTML = `
    <p class="totalLikes" aria-label="Nombre total de likes">${totalLikes}❤︎</p>
    <p>${price}€/jour</p>
    `
}

const createLikeEventListeners = () => {
    const likeButtons = document.getElementsByClassName('like-btn')
    Array.from(likeButtons).forEach(btn =>
        btn.addEventListener('click', addRemoveLike)
    )

}

const createCardsEventListeners = () => {
    const cards = document.getElementsByClassName('media-card')
    Array.from(cards).forEach(card => {
        const link = card.children[0]
        link.addEventListener('click', () => {
            openLightbox(card.dataset.id)
        })
    })
}

const createSortMenuEventListeners = () => {
    const sortButton = document.getElementsByClassName('dropbtn')[0]
    const sortMenu = document.getElementsByClassName('dropdown-items')[0]
    const sortOptionsList = {
        title: "Titre",
        date: "Date",
        likes: "Popularité"
    }
    sortButton.addEventListener('click', () => {
        sortMenu.style.display = 'flex'
    })

    //close the sort menu if the user clicks outside of it
    window.addEventListener('click', (e) => {
        if (e.target != sortMenu && e.target != sortButton && sortMenu.style.display == 'flex') {
            sortMenu.style.display = 'none'
        }
    })

    const menuItems = sortMenu.children
    for (let i = 0; i < menuItems.length; i++) {
        const el = menuItems[i];
        el.addEventListener('click', () => {
            sortMenu.style.display = 'none'
            populateMediaSection(media, el.dataset.sort)
            sortButton.innerText = sortOptionsList[el.dataset.sort]
        })
    }
}

const addRemoveLike = (event) => {
    const card = event.target.closest(".media-card")
    const mediaId = card.dataset.id
    const isLiked = media.find(item => item.id == mediaId)?.isLiked

    if (!isLiked) {
        updateLikesCounter(card, 1)
    } else {
        updateLikesCounter(card, -1)
    }

    //temporary
    updateLikedMediaLocalStorage(mediaId)
}

const updateLikesCounter = (card, value) => {
    //TODO make api call, increase local counter only if successful

    //increase likes counter in media array
    const mediaIndex = media.findIndex(item => item.id == card.dataset.id)
    media[mediaIndex].likes += value
    media[mediaIndex].isLiked = value == 1

    //increase like counter in media card
    const currentLikes = Number(card.querySelector('[aria-label="likes"]').innerText)
    card.querySelector('[aria-label="likes"]').innerText = currentLikes + value

    //increase total likes counter
    const totalLikesCounter = document.getElementsByClassName('totalLikes')[0]
    totalLikesCounter.innerText = Number(totalLikesCounter.innerText.substring(0, totalLikesCounter.innerText.indexOf("❤︎"))) + value + "❤︎"
}

init();