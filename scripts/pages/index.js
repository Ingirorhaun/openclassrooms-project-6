import { getPhotographers } from "../utils/fetchData.js";

const displayData = (photographers) => {
    const photographersSection = document.querySelector(".photographer_section");

    photographers.forEach((photographer) => {
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
}

const init = async () => {
    // Fetch photographers data
    const { photographers } = await getPhotographers();
    displayData(photographers);
}

init();

