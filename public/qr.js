const main = async () => {
    const text = new URLSearchParams(window.location.search).get("text");
    if(text != null && text != undefined){
        let data = await (await fetch("/generateqr?test="+text)).text();
        document.getElementById("result").setAttribute("src", data);
        print()
    }else{
        document.body.innerHTML = "<p>ERROR!<br>MISSING 'text' PARAMETER!</p>"
    }
}

main();