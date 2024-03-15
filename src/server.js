import { promises as fs } from 'fs';

function getCollection(store, path) {
  let [collectionName, documentId, ...nodes] = path.split("/");
  let coll = store.getCollection(collectionName);
  if (documentId) {
    coll = coll.get(documentId);
    return coll;
  }
  if (nodes && nodes.length > 0) {
    for (let node of nodes) {
      coll = coll[node];
    }
    return coll;
  }

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
    // console.log("users for data point : ", usersForDataPoint);
  });

  const getRegistredUsersForCollection = (collectionName) => {
    // console.log("users for data point : ", Array.from(usersForDataPoint[collectionName] || []));
    return Array.from(usersForDataPoint[collectionName] || []);
  }

  for (let collectionName of store.collectionList.keys()) {
    dataPoints[collectionName] = (userId, path) => {
      return getCollection(store, path);
    }
  }

  pulsar.registerDataPoints(dataPoints);

  let actions = {
    createCollection(userId, collectionName) {
      if (store.asCollection(collectionName)) {
        throw new Error("Collection already exist");
      }
      store.createCollection(collectionName);
      pulsar.registerDataPoints({
        [collectionName]: (userId, path) => {
          return getCollection(store, path);
        }
      });
      return { collectionName };
    },
    updateDoc(userId, { collectionName, documentId, documentData }) {
      if (!store.asCollection(collectionName)) {
        this.createCollection(userId, collectionName);
      }
      store.updateDocumentInCollection(collectionName, documentId, documentData);
      pulsar.broadcastDataPoint(getRegistredUsersForCollection(collectionName), collectionName);
      pulsar.broadcastDataPoint(getRegistredUsersForCollection([collectionName, documentId].join("/")), [collectionName, documentId].join("/"));
      return { collectionName, id: documentId }
    },
    deleteDoc(userId, { collectionName, documentId }) {
      if (!store.asCollection(collectionName)) {
        this.createCollection(userId, collectionName);
      }
      store.deleteDocumentInCollection(collectionName, documentId);
      pulsar.broadcastDataPoint(getRegistredUsersForCollection(collectionName), collectionName);
      pulsar.broadcastDataPoint(getRegistredUsersForCollection([collectionName, documentId].join("/")), [collectionName, documentId].join("/"));
      return { collectionName, id: documentId }
    },
    createDoc(userId, { collectionName, documentData }) {
      if (!store.asCollection(collectionName)) {
        this.createCollection(userId, collectionName);
      }
      let id = store.createDocumentInCollection(collectionName, documentData);
      pulsar.broadcastDataPoint(getRegistredUsersForCollection(collectionName), collectionName);
      return { collectionName, id }
    },
    deleteCollection(userId, collectionName) {
      if (!store.asCollection(collectionName)) {
        throw new Error("Collection doesn't exist");
      }
      store.deleteCollection(collectionName);
      pulsar.broadcastDataPoint(getRegistredUsersForCollection(collectionName), collectionName);
      return { collectionName };
    },
  }

  pulsar.registerAction(actions);

  return {
    collectionList: store.collectionList,
    save() {
      return store.save();
    },
    load(data) {
      store.load(data);
      for (let collectionName in data) {
        if (!pulsar.dataSources[collectionName]) {
          pulsar.registerDataPoints({
            [collectionName]: (userId, path) => {
              return getCollection(store, path);
            }
          });
        }
      }
    },
    async saveToFile(fileName) {
      let data = store.save();
      await fs.writeFile(`./saves/${fileName ? fileName : "data"}.json`, JSON.stringify(data, null, 4));
      console.log('Save done');
    },
    async loadFromFile(fileName) {
      const data = await fs.readFile(`./saves/${fileName ? fileName : "data.json"}`)
      let datas = JSON.parse(data);
      this.load(datas);
    },
    async fileList() {
      const files = await fs.readdir("./saves");
      return files;
    }
  }
}