import base from "./base.js";

export default function (pulsarCrud, collection) {
  return base(`
    list of ${collection} in the system:,

    ${Array.from(pulsarCrud.collectionList.get(collection)).map(element => `<div id="${element[0]}">
                                                                        ${element[0]}
                                                                        <span hx-get='/details?collection=${collection}&id=${element[0]}' hx-target='#${element[0]}'>open</span>
                                                                      </div>`).join("")}
  `)
}