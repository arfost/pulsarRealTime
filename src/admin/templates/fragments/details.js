export default function (pulsarCrud, collection, id, edit = false) {
  const element = pulsarCrud.collectionList.get(collection).get(id);

  return `
      <div class="element-subtitle">${id}</div>
      <pre>${element ? JSON.stringify(element, null, 2) : "not found"}</pre>
      <span id="content-${id}" onClick="javascript:pulsarContext.changeInnerHtml('div[data-${id}]', '${replaceOnClose(element)}')">close</span>
    `;
}

const replaceOnClose = (element) => {
  return `${Object.keys(element).length} attributs...`;
};