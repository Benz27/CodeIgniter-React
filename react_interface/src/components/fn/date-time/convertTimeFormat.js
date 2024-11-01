export function convertTimeFormat(timeString, format) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: true };

    // Check if timeString is invalid or all zeros
    const isInvalidOrZeros = isNaN(new Date(timeString).getTime()) || /^0000-00-00 00:00:00$/.test(timeString);

    if (isInvalidOrZeros) {
        // Set timeString to current date if it's invalid or all zeros
        timeString = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    if (format === undefined) {
        // Default format when "format" parameter is not provided
        format = new Intl.DateTimeFormat('en-US', options).format;
    }

    const parsedDate = new Date(timeString);
    return format(parsedDate);
}