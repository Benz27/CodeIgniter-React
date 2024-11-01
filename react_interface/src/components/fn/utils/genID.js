export const genId = () => {
    return uniqueId();
}

const uniqueId = () => {
    const timestamp = new Date().getTime(); // Get current timestamp in milliseconds
    const randomChars = randomeChars(5); // Specify the number of random alphabet characters
    const uniqueId = `${timestamp}${randomChars}`;
    return uniqueId;
}

const randomeChars = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}