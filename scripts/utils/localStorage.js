/**
 * Reads the liked media ids from local storage
 * @returns {number[]} an array of media ids
 */
export const readLikedMediaLocalStorage = () => {
    return localStorage.getItem('likedMedia')?.split(',') || [];
};


/**
 * Updates the liked media ids array on local storage
 * @param {number} id A media id
 */
export const updateLikedMediaLocalStorage = (id) => {
    const likedMedia = readLikedMediaLocalStorage();
    if (likedMedia.includes(id)) {
        likedMedia.splice(likedMedia.indexOf(id), 1);
    } else {
        likedMedia.push(id);
    }
    localStorage.setItem('likedMedia', likedMedia);
};