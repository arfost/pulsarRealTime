import { endTiming, startTiming } from "../utils.js";
import { connectionManager } from "./connectionManager.js";

const serverActions = {};
const dataSources = {};

export function initServer(wss) {
  wss.on('connection', (socket) => {
    socket.on('message', (message) => {
      receiveMessageAndDispatch(message, socket)
    });
    socket.on('close', () => {
      closeConnection(socket);
    });
  });
}

export function registerAction(actions) {
  for (let action in actions) {
    serverActions[action] = actions[action];
  }
}

export function registerDataPoints(newDataSources) {
  for (let dataSource in newDataSources) {
    dataSources[dataSource] = newDataSources[dataSource];
  }
}

export function broadcastDataPoint(userList, pointName) {
  if (!dataSources[pointName]) {
    throw new Error(`No datasource for data point "${pointName}"`);
  }
  if(!Array.isArray(userList)){
    userList = [userList];
  }
  for (let userId of userList) {
    let datas = dataSources[pointName](userId);
    connectionManager.getConnection(userId).send(JSON.stringify({
      type: pointName,
      data: datas
    }));
  }
}

function closeConnection(socket) {
  connectionManager.removeConnection(socket);
}

function receiveMessageAndDispatch(message, socket) {

  try {
    const parsedMessage = JSON.parse(message)
    console.log("parsed message : ", parsedMessage);

    let timeInfos = startTiming("Socket message : "+parsedMessage.type);
    switch (parsedMessage.type) {
      case "action":
        actionConsummer(parsedMessage, socket);
        break;
      case "handshake":
        handshakeConsummer(parsedMessage, socket);
        break;
      default:
        dataConsummer(parsedMessage, socket);
    }
    endTiming(timeInfos);
  } catch (e) {
    console.error(e);
  }
}

function actionConsummer(message, socket) {
  let userId = connectionManager.getUserId(socket);
  try {
    if(!serverActions[message.name]){
      throw new Error(`no server action named "${message.name}"`)
    }
    let response = {
      type: "actionResponse",
      data: serverActions[message.name](userId, message.params),
      actionId: message.actionId
    }
    socket.send(JSON.stringify(response));
  } catch (e) {
    console.warn('action erreur : ', e);
    let response = {
      type: "actionResponse",
      data: "error",
      actionId: message.actionId
    }
    socket.send(JSON.stringify(response));
  }
}

function dataConsummer(message, socket) {
  let userId = connectionManager.getUserId(socket);
  broadcastDataPoint(userId, message.type)
}

function handshakeConsummer(message, socket) {
  let userId = message.params;
  if (!userId) {
    throw new Error(`handshake without userId`)
  }
  connectionManager.addConnection(socket, userId);
}