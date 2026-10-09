const Dice = ({ number, count }) => {
    const arr = [];
    for (let i = 0; i < count; i++) {
        arr.push("[" + number + "]");
    }
    return arr;
    
};

export default Dice;
