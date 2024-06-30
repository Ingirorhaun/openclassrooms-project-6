export function photographerTemplate(data) {
    const { name, id, portrait, city, country, tagline, price } = data;

    const picture = `assets/images/photographers/thumbnails/${portrait.substring(0, portrait.indexOf('.'))}_thumb.jpg`;
    function getUserCardDOM() {
        const article = document.createElement('article');
        article.innerHTML = `
        <a href="./photographer.html?id=${id}" title="${name}">
            <img src="${picture}"/>
            <h2>${name}</h2>
        </a>
        `
        const photographerInfo = document.createElement('div')
        photographerInfo.innerHTML = `
        <h4>${city}, ${country}</h4>
        <p class='tagline'>${tagline}</p>
        <p class='price'>${price}€</p>
        `
        article.appendChild(photographerInfo)
        return (article);
    }
    return { name, picture, getUserCardDOM }
}