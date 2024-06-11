export function displayContactModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "block";
}

export function closeContactModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}

export const handleFormSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target);
    for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
    }
}