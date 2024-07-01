import { getPhotographers } from "../utils/fetchData.js";
import { photographerTemplate } from "../templates/photographer.js";


/**
 * Creates and adds to the DOM a card for each photographer
 * @param {import("../templates/photographer.js").Photographer[]} photographers an array of Photographer objects
 */
const displayData = (photographers) => {
    const photographersSection = document.querySelector(".photographer_section");

    photographers.forEach((photographer) => {
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
};

/**
 * Loads photographers data and displays it
 */
const init = async () => {
    const { photographers } = await getPhotographers();
    displayData(photographers);
};

init();

