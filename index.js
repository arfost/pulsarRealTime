"use strict"
import { writeFileSync } from "fs";
import { WebSocketServer } from 'ws';
import initAdmin from './src/admin/index.js';
import createServer from './src/createServer.js';
import { getNewStore } from './src/crud/index.js';
import pulsar from './src/pulsar/index.js';
import { createCrudServer } from './src/server.js';

const SAVE_NAME = "data";

const server = createServer(process.argv);
const wss = new WebSocketServer({
  server
});

const pulServ = pulsar.initServer(wss);

const store = getNewStore();

const crudServ = createCrudServer(store, pulServ);

crudServ.loadFromFile(SAVE_NAME);

initAdmin(server, crudServ);

server.listen(8080, (err) => {
  if (err) {
    console.error("couldn't start server", err);
  }else{
    console.log('Server started on port 8080');
  }
});

function writeSaveSync(name){
  let data = crudServ.save();
  writeFileSync(`./saves/${name ? name : "data"}.json`, JSON.stringify(data, null, 4), (err) => {
    if (err) {
      console.error("couldn't save datas", err);
    } else {
      console.log('Save done');
    }
  });
}

function cleanUpServer(eventType){
  console.log(`cleaning up server on event : ${eventType}`);
  writeSaveSync(SAVE_NAME);
  process.exit();
}

[`SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
  process.on(eventType, cleanUpServer.bind(null, eventType));
})
