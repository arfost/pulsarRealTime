import { generateNewId } from '../utils.js';

export function getNewStore(){
  return {
    collectionList: new Map(),

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