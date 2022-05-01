const solution = (array) => {
    array.sort((a, b) => b.length - a.length)
    let ansArray = []
    for (let index = 0; index < array.length; index++) {
        if(array[index].length === array[0].length){
            ansArray.push(array[index])
        }
    }
    return ansArray
}

inputArray = ["aba", "aa", "ad", "vcd", "aba"]
console.log(solution(inputArray))