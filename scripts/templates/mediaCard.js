/**
 * 
 * @typedef {Object} MediaElement
 * @property {Number} id
 * @property {Number} photographerId
 * @property {String} title
 * @property {String} [image]
 * @property {String} [video]
 * @property {Number} likes
 * @property {String} date
 * @property {Number} price
 * @property {Boolean} [isLiked]
 */

/**
 * Creates a div element containing the image/video thumbnail, title, likes counter, and a link to open it in the lightbox
 * @param {MediaElement} mediaElement 
 */
export const generateMediaCard = (mediaElement) => {
    const { title, image, video, likes, id } = mediaElement;
    const cardType = video ? "video" : "img";
    const card = document.createElement("div");
    card.classList.add("media-card");
    card.dataset.id = id;
    card.innerHTML = `
        <a href="#" title="${title}">
            <figure>
                <${cardType} src="assets/images/media/${cardType == 'video' ? video : 'thumbnail_' + image}" alt="${title}"/>
            </figure>
        </a>
        <div>
            <p>${title}</p>
            <span><p aria-label="likes">${likes}</p><button class="like-btn" aria-label="like">❤︎</button></span>
        </div>
    `;
    return card;
};