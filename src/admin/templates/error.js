export default function (error) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Admin</title>
    </head>
    <body>
      <h1>Admin</h1>
      <h2>Error</h2>
      it seems something went wrong...
      <pre>${error}</pre>

      <a href="/main">Main</a>
    </body>`
}