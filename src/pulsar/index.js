import { endTiming, startTiming } from "../utils.js";
import { connectionManager } from "./connectionManager.js";

export default {
  initServer(wss) {
    const server = newServer();
    server.init(wss);
    return server;
  }
}

function newServer() {
  return {

    serverActions: {},
    dataSources: {},

    init(wss) {
      wss.on('connection', (socket) => {
        socket.on('message', (message) => {
          this._receiveMessageAndDispatch(message, socket)
        });
        socket.on('close', () => {
          this._closeConnection(socket);
        });
      });
    },

    registerAction(actions) {
      for (let action in actions) {
        this.serverActions[action] = actions[action];
      }
    },

    registerDataPoints(newDataSources) {
      for (let dataSource in newDataSources) {
        this.dataSources[dataSource] = newDataSources[dataSource];
      }
    },

    broadcastDataPoint(userList, path) {
      let pointName = path.split("/").shift();
      if (!this.dataSources[pointName]) {
        throw new Error(`No datasource for data point "${pointName}"`);
      }
      if (!Array.isArray(userList)) {
        userList = [userList];
      }
      for (let userId of userList) {
        let datas = this.dataSources[pointName](userId, path);
        connectionManager.getConnection(userId).send(JSON.stringify({
          type: path,
          data: datas
        }));
      }
    },

    _closeConnection(socket) {
      connectionManager.removeConnection(socket);
    },

    _receiveMessageAndDispatch(message, socket) {

      try {
        const parsedMessage = JSON.parse(message)
        console.log("parsed message : ", parsedMessage);

        let timeInfos = startTiming("Socket message : " + parsedMessage.type);
        switch (parsedMessage.type) {
          case "action":
            this._actionConsummer(parsedMessage, socket);
            break;
          case "handshake":
            this._handshakeConsummer(parsedMessage, socket);
            break;
          default:
            this._dataConsummer(parsedMessage, socket);
        }
        endTiming(timeInfos);
      } catch (e) {
        console.error(e);
      }
    },

    _actionConsummer(message, socket) {
      let userId = connectionManager.getUserId(socket);
      try {
        if (!this.serverActions[message.name]) {
          throw new Error(`no server action named "${message.name}"`)
        }
        let response = {
          type: "actionResponse",
          data: this.serverActions[message.name](userId, message.params),
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
    },

    registerDataConsummerAddon(dataConsummerAddon) {
      this._dataConsummerAddon = dataConsummerAddon;
    },

    _dataConsummer(message, socket) {
      let userId = connectionManager.getUserId(socket);
      if (this._dataConsummerAddon) {
        this._dataConsummerAddon(userId, message.type);
      }
      this.broadcastDataPoint(userId, message.type);
    },

    _handshakeConsummer(message, socket) {
      let userId = message.params;
      if (!userId) {
        throw new Error(`handshake without userId`)
      }
      connectionManager.addConnection(socket, userId);
    },
  }
}