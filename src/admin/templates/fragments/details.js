export default function (pulsarCrud, collection, id, edit = false) {
  const element = pulsarCrud.collectionList.get(collection).get(id);
  return `<h2>${id}</h2>
  <pre>${element ? JSON.stringify(element, null, 2) : "not found"}</pre>`;
}