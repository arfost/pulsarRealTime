

export function createCrudServer(store, pulsar){
  
  let dataPoints = {};

  for(let collectionName of store.collectionList.keys()){
    dataPoints[collectionName] = (userId) => {
      return store.getCollection(collectionName);
    }
  }

  pulsar.registerDataPoints(dataPoints);

  let actions = {
    updateDoc(userId, {collectionName, documentId, documentData}) {
      if(!store.asCollection(collectionName)){
        store.createCollection(collectionName);
        pulsar.registerDataPoints({
          [collectionName]: (userId) => {
            return store.getCollection(collectionName);
          }
        });
      }
      store.updateDocumentInCollection(collectionName, documentId, documentData);
      pulsar.broadcastDataPoint(userId, collectionName);
    },
    deleteDoc(userId, {collectionName, documentId}) {
      if(!store.asCollection(collectionName)){
        store.createCollection(collectionName);
        pulsar.registerDataPoints({
          [collectionName]: (userId) => {
            return store.getCollection(collectionName);
          }
        });
      }
      store.deleteDocumentInCollection(collectionName, documentId);
      pulsar.broadcastDataPoint(userId, collectionName);
    },
    createDoc(userId, {collectionName, documentData}) {
      if(!store.asCollection(collectionName)){
        store.createCollection(collectionName);
        pulsar.registerDataPoints({
          [collectionName]: (userId) => {
            return store.getCollection(collectionName);
          }
        });
      }
      store.createDocumentInCollection(collectionName, documentData);
      pulsar.broadcastDataPoint(userId, collectionName);
    },
    deleteCollection(userId, collectionName) {
      if(!store.asCollection(collectionName)){
        store.createCollection(collectionName);
        pulsar.registerDataPoints({
          [collectionName]: (userId) => {
            return store.getCollection(collectionName);
          }
        });
      }
      store.deleteCollection(collectionName);
      pulsar.broadcastDataPoint(userId, collectionName);
    },
  }

  pulsar.registerAction(actions);
}