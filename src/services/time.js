export const time = (current) => {
    var hr = new Date(current).getHours();
    var min = new Date(current).getMinutes();
    if (hr > 12) {
        hr = hr - 12;
        if (min < 10) {
            return `${hr}:0${min} PM`;
        } else {
            return `${hr}:${min} PM`;
        }
    } else {
        if (min < 10) {
            return `${hr}:0${min} AM`;
        } else {
            return `${hr}:${min} AM`;
        }
    }
};
