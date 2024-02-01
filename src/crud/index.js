import { generateNewId } from '../utils.js';

export function getNewStore() {
  return {
    collectionList: new Map(),

    load(data) {
      console.log("loading data : ", data);
      for (let collectionName in data) {
        this.collectionList.set(collectionName, new Map());
        for (let [id, doc] of data[collectionName]) {
          this.collectionList.get(collectionName).set(id, doc);
        }
      }
      console.log("loaded data : ", this.collectionList);
    },
    save() {
      let save = {};
      for (let collectionName of this.collectionList.keys()) {
        save[collectionName] = Array.from(this.collectionList.get(collectionName).entries());
      }
      return save;
    },

    asCollection(collectionName) {
      return this.collectionList.has(collectionName);
    },

    getCollection(collectionName) {
      return this.collectionList.get(collectionName);
    },

    getDocument(collectionName, documentId) {
      const collection = this.collectionList.get(collectionName);
      return collection.get(documentId);
    },

    deleteDocumentInCollection(collectionName, documentId) {
      const collection = this.collectionList.get(collectionName);
      collection.delete(documentId);
    },

    deleteCollection(collectionName) {
      this.collectionList.delete(collectionName);
    },

    updateDocumentInCollection(collectionName, documentId, documentData) {
      const collection = this.collectionList.get(collectionName);
      collection.set(documentId, documentData);
    },

    createDocumentInCollection(collectionName, documentData) {
      const collection = this.collectionList.get(collectionName);
      const id = generateNewId();
      collection.set(id, documentData);
      return id;
    },

    createCollection(collectionName) {
      this.collectionList.set(collectionName, new Map());
    },
  }
}