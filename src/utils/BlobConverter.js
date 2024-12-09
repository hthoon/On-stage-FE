export const base64ToBlob = (base64String, contentType) => {
    const byteCharacters = atob(base64String.split(",")[1]);
    const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
};