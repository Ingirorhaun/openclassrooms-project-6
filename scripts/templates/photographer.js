/**
 * 
 * @typedef {Object} Photographer
 * @property {String} name
 * @property {Number} id
 * @property {String} city
 * @property {String} country
 * @property {String} tagline
 * @property {Number} price
 * @property {String} portrait
 */

/**
 * Creates and returns a photographer's info card
 * @param {Photographer} data 
 * @returns {Object}
 */
export function photographerTemplate(data) {
    const { name, id, portrait, city, country, tagline, price } = data;

    const picture = `assets/images/photographers/thumbnails/${portrait.substring(0, portrait.indexOf('.'))}_thumb.jpg`;
    function getUserCardDOM() {
        const article = document.createElement('article');
        article.innerHTML = `
        <a href="./photographer.html?id=${id}" title="${name}">
            <figure>
                <img src="${picture}" alt="${name}"/>
                <div class="inset-box-shadow"></div>
            </figure>
            <h2>${name}</h2>
        </a>
        `;
        const photographerInfo = document.createElement('div');
        photographerInfo.innerHTML = `
        <h3>${city}, ${country}</h3>
        <p class='tagline'>${tagline}</p>
        <p class='price'>${price}€</p>
        `;
        article.appendChild(photographerInfo);
        return (article);
    }
    return { name, picture, getUserCardDOM };
}