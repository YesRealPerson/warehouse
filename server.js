const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require('crypto');
const qr = require('qrcode');
const http = require('http')
const app = express();
const server = http.createServer(app);

/*

id: {
        name: string
        instances:
            location: {
                quantity: int
            }
    }

*/

const refresh = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let funny = await JSON.stringify(data);
            console.log(JSON.stringify(funny));
            fs.writeFile(path.join(__dirname, "data.json"), funny, err => { if (err) { console.log(err) } })
            resolve("success");
        } catch (err) {
            reject(err);
        }
    })
}

const startApp = async () => {
    fs.readFile(path.join(__dirname, "data.json"), 'utf-8', async (err, x) => {
        if (err) {
            console.log(err)
        } else {
            let data = JSON.parse(x);

            app.use(express.static(path.join(__dirname, 'public')));

            // POST FUNCTIONS

            // add or edit instance to existing item in database
            app.get('/addInstance', async (req, res) => {
                // needs id, location, quantity
                try {
                    const id = req.query.id;
                    let items = Object.keys(data);
                    let index = items.indexOf(id);
                    if (index == -1) {
                        res.sendStatus(400)
                    } else {
                        let instances = data[id].instances;
                        let quantity = req.query.quantity;
                        let location = req.query.location;
                        if (quantity != 0) {
                            instances[location] = {
                                quantity: quantity
                            }
                            await refresh(data);
                            res.sendStatus(200);
                        } else {
                            delete instances[location]
                            await refresh(data);
                            res.sendStatus(200);
                        }
                    }
                } catch (err) {
                    console.log(err);
                    res.sendStatus(500);
                }
            })

            // add new item to database
            app.get('/add', async (req, res) => {
                // needs name
                // create id from hash
                try {
                    let hash = crypto.createHash("sha256")
                    const name = req.query.name;
                    const id = hash.update(name).digest('hex');
                    data[id] = {
                        name: name,
                        instances: {}
                    };
                    await refresh(data);
                    res.sendStatus(200);
                } catch (err) {
                    console.log(err);
                    res.sendStatus(500);
                }
            })

            // GET FUNCTIONS

            // return all ids in database
            app.get('/getids', async (req, res) => {
                if (req.query.debug) {
                    console.log(JSON.stringify(data))
                }
                res.send(await Object.keys(data))
            })

            // return qr code image
            app.get('/generateqr', async (req, res) => {
                try {
                    let image64 = await qr.toDataURL(req.query.test)
                    res.send(image64);
                } catch (err) {
                    console.log(err);
                    res.sendStatus(500);
                }
            })

            // return search results
            app.get('/search', async (req, res) => {
                if (req.query.query) {
                    try {
                        let query = req.query.query.toLowerCase();
                        let result = { data: [] }
                        let keys = Object.keys(data);
                        for (let i = 0; i < keys.length; i++) {
                            let key = keys[i];
                            let item = data[key];
                            if (item.name.toLowerCase().indexOf(query) != -1) {
                                result.data.push({
                                    item: item,
                                    id: key
                                });
                            }
                        }
                        res.send(result)
                    } catch {
                        res.sendStatus(500);
                    }
                }
                else if (req.query.all) {
                    try {
                        let result = { data: [] }
                        let keys = Object.keys(data);
                        for (let i = 0; i < keys.length; i++) {
                            let key = keys[i];
                            let item = data[key];
                            result.data.push({
                                item: item,
                                id: key
                            });
                        }
                        res.send(result)
                    } catch {
                        res.sendStatus(500);
                    }
                }
                else {
                    res.sendStatus(400);
                }
            })

            server.listen(80);
            console.log("Ready!");
        }
    });
}

startApp();