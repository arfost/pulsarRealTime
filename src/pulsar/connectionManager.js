const connectionMap = new WeakMap();
const userIdMap = {};

export const connectionManager = {
  getConnection(userId){
    return userIdMap[userId];
  },
  getUserId(socket){
    return connectionMap.get(socket);
  },
  addConnection(socket, userId){
    connectionMap.set(socket, userId);
    userIdMap[userId] = socket;
  },
  removeConnection(socket){
    let userId = connectionMap.get(socket);
    console.log("deconnetion for user ", userId);
    connectionMap.delete(socket);
    userIdMap[userId] = undefined;
  }
}