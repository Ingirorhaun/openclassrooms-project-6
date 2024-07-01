/**
 * Fetches all photographers data
 * @returns {import("../templates/photographer").Photographer[]} an array of Photographer objects
 */
export const getPhotographers = async () => {
    try {
        const response = await fetch('data/photographers.json');
        if (!response.ok) {
            throw new Error(response.status);
        } else {
            const jsonDump = await response.json();
            return ({
                photographers: jsonDump.photographers
            });
        }
    } catch (error) {
        console.error(error.message);
    }
};

/**
 * Fetches all data for the photographer with a specific id
 * @param {Number} photographerId 
 * @returns {import("../templates/photographer").Photographer}
 */
export const getPhotographerById = async (photographerId) => {
    try {
        const response = await fetch('data/photographers.json');
        if (!response.ok) {
            throw new Error(response.status);
        } else {
            const jsonDump = await response.json();
            return jsonDump.photographers?.find(photographer => photographer.id == photographerId);
        }
    } catch (error) {
        console.error(error.message);
    }
};

/**
 * Fetches all media belonging to the photographer with a specific id
 * @param {Number} photographerId 
 * @returns {import("../templates/mediaCard").MediaElement[]} an array of MediaElement objects
 */
export const getMediaByPhotographerId = async (photographerId) => {
    try {
        const response = await fetch('data/photographers.json');
        if (!response.ok) {
            throw new Error(response.status);
        } else {
            const jsonDump = await response.json();
            return jsonDump.media?.filter(item => item.photographerId == photographerId);
        }
    } catch (error) {
        console.error(error.message);
    }
};