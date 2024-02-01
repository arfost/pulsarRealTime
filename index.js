"use strict"
import { readFile, writeFile } from "fs";
import { createServer } from 'http';
import { parse } from 'url';
import { WebSocketServer } from 'ws';
import { getNewStore } from './src/crud/index.js';
import pulsar from './src/pulsar/index.js';
import { createCrudServer } from './src/server.js';

const serverPort = 8080;
const wss = new WebSocketServer({
  port: serverPort
});

pulsar.initServer(wss);

const store = getNewStore();

const crudServ = createCrudServer(store, pulsar);

createServer(function (req, res) {
  try {
    let parsed = parse(req.url);
    console.log("admin request : ", req.url);
    switch (parsed.pathname) {
      case "/save":
        writeSave(parsed.query);
        break;
      case "/load":
        loadSave(parsed.query);
        break;
      default:
        console.warn(`Unknown admin action : ${req.url}`);
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write("ok");
  } catch (e) {
    console.error(e);
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.write("error");
  }
  res.end();
}).listen(8081);


function writeSave(name){
  let data = crudServ.save();
  writeFile(`./saves/${name ? name : "data"}.json`, JSON.stringify(data, null, 4), (err) => {
    if (err) {
      console.error("couldn't save datas", err);
    } else {
      console.log('Save done');
    }
  });

}

function loadSave(saveName){
  readFile(`./saves/${saveName ? saveName : "data"}.json`, (err, data) => {
    if (err) {
      console.error("couldn't read data", err);
    }else{
      let datas = JSON.parse(data);
      crudServ.load(datas);
    }
  });
}