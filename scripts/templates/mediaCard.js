/**
 * 
 * @typedef {Object} MediaElement
 * @property {Number} id
 * @property {Number} photographerId
 * @property {String} title
 * @property {String} image
 * @property {Number} likes
 * @property {String} date
 * @property {Number} price
 * @property {Boolean} isLiked
 */

/**
 * Creates a div element containing the image thumbnail, title, likes counter, and a link to open it in the lightbox
 * @param {MediaElement} mediaElement 
 * @returns {HTMLElement}
 */
export const generateImageCard = (mediaElement) => {
    const { title, image, likes, id } = mediaElement;
    const card = document.createElement("div");
    card.classList.add("media-card");
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
    `;
    return card;
};

/**
 * Creates a div element containing the video thumbnail, title, likes counter, and a link to open it in the lightbox
 * @param {MediaElement} mediaElement 
 * @returns {HTMLElement}
 */
export const generateVideoCard = (mediaElement) => {
    const { title, video, likes, id } = mediaElement;
    const card = document.createElement("div");
    card.classList.add("media-card");
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
    `;
    return card;
};