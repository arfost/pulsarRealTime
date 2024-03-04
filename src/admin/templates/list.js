import base from "./base.js";

export default function (pulsarCrud, collection) {
  return base(`
    list of ${collection} in the system :

    <ul>
    ${Array.from(pulsarCrud.collectionList.get(collection)).map(
      element => 
        `<li>
          <div hx-get='/details?collection=${collection}&id=${element[0]}' hx-target="div[data-${element[0]}]">${element[1].libelle || element[1].name || element[1].title || element[1].id || element[0]}</div>
          <div data-${element[0]}>${Object.keys(element[1]).length} attributs...</div>
        </li>`).join("")}
    </ul>`)
}