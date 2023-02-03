export const date = (current) => {
    const monthList = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    let timestamp = new Date(current)
    let date = timestamp.getDate()
    let month = timestamp.getMonth()
    let year = timestamp.getFullYear()

    let today = new Date()

    if (`${today.getDate()}/${today.getMonth()}/${today.getFullYear()}` === `${date}/${month}/${year}`) {
        return 'Today'
    } else if (today.getDate() - date === 1 && today.getMonth() === month && today.getFullYear() === year) {
        return 'Yesterday'
    } else {
        return `${monthList[month]} ${date}, ${year}`;
    }

};
