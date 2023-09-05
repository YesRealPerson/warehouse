const search = async (query) => {
    let data = {}
    try {
        data = await fetch("/search?query=" + query);
        data = JSON.parse(await data.text()).data;
    } catch {
        data = await fetch("/search?all=funny");
        data = JSON.parse(await data.text()).data;
    }
    let element = document.getElementById("info");
    element.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        let thing = data[i];
        let result = `<div>ID: ${thing.id}<br>Name: ${thing.item.name}<br><button id="add" onclick="addInstance('${thing.id}')">Add Instance</button><br>Instances:<br>`;
        let instances = thing.item.instances;
        let keys = Object.keys(instances);
        for (let j = 0; j < keys.length; j++) {
            let thing2 = instances[keys[j]];
            let quantity = thing2.quantity;
            result += `&emsp;Location: ${keys[j]}<br>&emsp;Quantity: ${quantity}<br>&emsp;<button id="add" onclick="editQuantity('${thing.id}', '${keys[j]}')">Edit quantity</button>`;
            if(j < keys.length-1){
                result+="<br>"
            }
        }
        result += "<hr>"
        element.innerHTML += result;
    }
}