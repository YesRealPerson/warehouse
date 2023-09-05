const add = async () => {
    document.getElementById('overlay').style.visibility='visible';
    document.getElementById("content").innerHTML=`<input id="nameInput" type="text" autocomplete="off" placeholder="Enter name" onkeypress="addDBCall(event, this.value)"><br>`
}

const addDBCall = async (event, name) => {
    if(event.key == "Enter"){
        await fetch("/add?name="+name);
        search(" ");
        document.getElementById("nameInput").value = "";
    }
}

const addInstance = async (id) => {
    document.getElementById('overlay').style.visibility='visible';
    document.getElementById("content").innerHTML=`<form onsubmit="return false"><input id="location" onblur="checkRegex(this.value, this.id, '[A-Za-z][A-Za-z][0-9]+');" type="text" autocomplete="off" placeholder="Enter location""><br><input id="quantity" oninput="checkRegex(this.value, this.id, '\\\\b([0-9]|[1-9][0-9])\\\\b');" type="text" autocomplete="off" placeholder="Enter quantity"><br><input value="Submit" type="submit" onclick="addInstanceCall('${id}')"></form>`
}

const addInstanceCall = async (id) => {
    let quantity = document.getElementById("quantity").value;
    let location = document.getElementById("location").value;
    await fetch(`/addinstance?id=${id}&quantity=${quantity}&location=${location}`)
    search(" ");
    document.getElementById("quantity").value = "";
    document.getElementById("location").value = "";
}

const editQuantity = async (id, location) => {
    document.getElementById('overlay').style.visibility='visible';
    document.getElementById("content").innerHTML=`<input id="editQuantityInput" type="text" autocomplete="off" placeholder="Enter quantity" oninput="checkRegex(this.value, this.id, '\\\\b([0-9]|[1-9][0-9])\\\\b');" onkeypress="editQuantityCall(event, this.value, '${id}', '${location}')">`
}

const editQuantityCall = async (event, quantity, id, location) => {
    if(event.key == "Enter"){
        await fetch(`/addinstance?id=${id}&quantity=${quantity}&location=${location}`)
        search(" ");
        document.getElementById('overlay').style.visibility='hidden';
    }
}