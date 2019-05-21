export const getFormattedDate = (dateStr, includeTime) => {
    let months = 'January February March April May June July August September October November December'.split(' ');
    let dateObj = new Date(dateStr);
    let month = months[dateObj.getMonth()];
    let date = dateObj.getDate();
    let year = dateObj.getFullYear();
    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes() > 10 ? dateObj.getMinutes() : '0' + dateObj.getMinutes();
    let amPm = 'AM';

    if (hours > 11) {
        amPm = 'PM';
        hours = hours - 12;
        hours = hours === 0 ? 12 : hours;
    }

    let time = `${hours}:${minutes} ${amPm}`;

    return `${month} ${date}, ${year} ${includeTime ? time : ''}`;
}