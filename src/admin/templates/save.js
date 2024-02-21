export default function ({success, filename}) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Admin</title>
    </head>
    <body>
      <h1>Admin</h1>
      save data to ${filename},
      ${success ? 
        `<h2>Success</h2>` : 
        `<h2>Failure</h2>`}

      <a href="/main">Main</a>
    </body>`
}