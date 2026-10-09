const Dice = ({ number = 0, count = 0, inputarr = [] }) => {
    function getDiceFace(num) {
        return String.fromCharCode(9855 + num)
    }
    let arr = []
    if (inputarr.length == 0) {
        inputarr = Array(count).fill(number)
    } 
    for (let i = 0; i < inputarr.length; i++) {
        arr.push(getDiceFace(inputarr[i]))
    }
    return <p style={{"font-size": "200%"}}>{arr}</p>;
    
};

export default Dice;
