
function getCollection(store, collectionName) {
  let coll = store.getCollection(collectionName);
  console.log("sending collection : ", Array.from(coll.entries()));

  return Array.from(coll.entries()).map(([id, data]) => {
    return {
      id,
      data
    }
  });
}


export function createCrudServer(store, pulsar) {

  let dataPoints = {};
  let usersForDataPoint = {};

  pulsar.registerDataConsummerAddon((userId, dataPointName) => {
    if (!usersForDataPoint[dataPointName]) {
      usersForDataPoint[dataPointName] = new Set();
    }
    usersForDataPoint[dataPointName].add(userId);
    console.log("users for data point : ", usersForDataPoint);
  });

  const getRegistredUsersForCollection = (collectionName) => {
    console.log("users for data point : ", Array.from(usersForDataPoint[collectionName] || []));
    return Array.from(usersForDataPoint[collectionName] || []);
  }

  for (let collectionName of store.collectionList.keys()) {
    dataPoints[collectionName] = (userId) => {
      return getCollection(store, collectionName);
    }
  }

  pulsar.registerDataPoints(dataPoints);

  let actions = {
    updateDoc(userId, { collectionName, documentId, documentData }) {
      if (!store.asCollection(collectionName)) {
        store.createCollection(collectionName);
        pulsar.registerDataPoints({
          [collectionName]: (userId) => {
            return getCollection(store, collectionName);
          }
        });
      }
      store.updateDocumentInCollection(collectionName, documentId, documentData);
      pulsar.broadcastDataPoint(getRegistredUsersForCollection(collectionName), collectionName);
    },
    deleteDoc(userId, { collectionName, documentId }) {
      if (!store.asCollection(collectionName)) {
        store.createCollection(collectionName);
        pulsar.registerDataPoints({
          [collectionName]: (userId) => {
            return getCollection(store, collectionName);
          }
        });
      }
      store.deleteDocumentInCollection(collectionName, documentId);
      pulsar.broadcastDataPoint(getRegistredUsersForCollection(collectionName), collectionName);
    },
    createDoc(userId, { collectionName, documentData }) {
      if (!store.asCollection(collectionName)) {
        store.createCollection(collectionName);
        pulsar.registerDataPoints({
          [collectionName]: (userId) => {
            return getCollection(store, collectionName);
          }
        });
      }
      store.createDocumentInCollection(collectionName, documentData);
      pulsar.broadcastDataPoint(getRegistredUsersForCollection(collectionName), collectionName);
    },
    deleteCollection(userId, collectionName) {
      if (!store.asCollection(collectionName)) {
        store.createCollection(collectionName);
        pulsar.registerDataPoints({
          [collectionName]: (userId) => {
            return getCollection(store, collectionName);
          }
        });
      }
      store.deleteCollection(collectionName);
      pulsar.broadcastDataPoint(getRegistredUsersForCollection(collectionName), collectionName);
    },
  }

  pulsar.registerAction(actions);
}