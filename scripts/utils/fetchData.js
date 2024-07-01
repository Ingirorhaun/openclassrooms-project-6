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