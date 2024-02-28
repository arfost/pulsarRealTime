import base from "./base.js";

export default function (pulsarCrud) {
  return base(`
      use the forms below to save and load data
      <br/>
      <div hx-trigger="load" hx-get="/forceSave"></div>
      <br/>
      <div hx-trigger="load" hx-get="/forceLoad"></div>
      <br/>
      <br/>
      list of nodes in the system:
      <ul>
        ${Array.from(pulsarCrud.collectionList.keys()).map(collectionName => `<li><a href="/list?collection=${collectionName}">${collectionName}</a></li>`).join("")}
      </ul>`)
}