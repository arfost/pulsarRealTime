export default function (pulsarCrud, type) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Admin</title>
    </head>
    <body>
      <h1>Admin</h1>
      list of ${type} in the system:,

      ${Array.from(pulsarCrud.collectionList.get(type)).map(element => `<pre>${JSON.stringify(element, null, 4)}</pre>`).join("")}
      
      <a href="/main">Main</a>
    </body>`
}