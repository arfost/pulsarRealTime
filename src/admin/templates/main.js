export default function (pulsarCrud) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Admin</title>
    </head>
    <body>
      <h1>Admin</h1>
      admin page,
      use the forms below to save and load data

      <form action="/forceSave" method="get">
        <input type="text" name="filename" />
        <button type="submit">Save</button>
      </form>
      <form action="/forceLoad" method="get">
        <input type="text" name="filename" />
        <button type="submit">Load</button>
      </form>

      <br>
      <br>
      list of nodes in the system:
      <ul>
        ${Array.from(pulsarCrud.collectionList.keys()).map(collectionName => `<li>${collectionName}</li>`).join("")}
      </ul>
    </body>`
}