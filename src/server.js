
function getCollection(store, path) {
  let [collectionName, documentId, ...nodes] = path.split("/");
  console.log("getReq : ", collectionName, documentId, nodes);
  let coll = store.getCollection(collectionName);
  if (documentId) {
    coll = coll.get(documentId);
    console.log("sending document : ", coll);
    return coll;
  }
  if (nodes && nodes.length > 0) {
    for (let node of nodes) {
      coll = coll[node];
    }
    console.log("sending sub node : ", coll);
    return coll;
  }
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
          [collectionName]: (userId, path) => {
            return getCollection(store, path);
          }
        });
      }
      store.updateDocumentInCollection(collectionName, documentId, documentData);
      pulsar.broadcastDataPoint(getRegistredUsersForCollection(collectionName), collectionName);
      return { collectionName, id: documentId}
    },
    deleteDoc(userId, { collectionName, documentId }) {
      if (!store.asCollection(collectionName)) {
        store.createCollection(collectionName);
        pulsar.registerDataPoints({
          [collectionName]: (userId, path) => {
            return getCollection(store, path);
          }
        });
      }
      store.deleteDocumentInCollection(collectionName, documentId);
      pulsar.broadcastDataPoint(getRegistredUsersForCollection(collectionName), collectionName);
      return { collectionName, id: documentId}
    },
    createDoc(userId, { collectionName, documentData }) {
      if (!store.asCollection(collectionName)) {
        store.createCollection(collectionName);
        pulsar.registerDataPoints({
          [collectionName]: (userId, path) => {
            return getCollection(store, path);
          }
        });
      }
      let id = store.createDocumentInCollection(collectionName, documentData);
      pulsar.broadcastDataPoint(getRegistredUsersForCollection(collectionName), collectionName);
      return { collectionName, id}
    },
    deleteCollection(userId, collectionName) {
      if (!store.asCollection(collectionName)) {
        store.createCollection(collectionName);
        pulsar.registerDataPoints({
          [collectionName]: (userId, path) => {
            return getCollection(store, path);
          }
        });
      }
      store.deleteCollection(collectionName);
      pulsar.broadcastDataPoint(getRegistredUsersForCollection(collectionName), collectionName);
      return { collectionName };
    },
  }

  pulsar.registerAction(actions);

  return {
    save() {
      return store.save();
    },
    load(data) {
      store.load(data);
      for (let collectionName in data) {
        if (!pulsar.dataSources[collectionName]) {
          pulsar.registerDataPoints({
            [collectionName]: (userId) => {
              return getCollection(store, collectionName);
            }
          });
        }
      }
    }
  }
}