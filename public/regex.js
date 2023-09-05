const checkRegex = (input, id, pattern) => {
    console.log(pattern)
    let regex = new RegExp(pattern)
    console.log(regex.test(input))
    if(!regex.test(input)){
        document.getElementById(id).value = "";
    }
}