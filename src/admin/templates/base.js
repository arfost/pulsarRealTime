export default function (content) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <script src="https://unpkg.com/htmx.org@1.9.10" integrity="sha384-D1Kt99CQMDuVetoL1lrYwg5t+9QdHe7NLX/SoJYkXDFfX37iInKRy5xLSi8nO7UC" crossorigin="anonymous"></script>
      <title>Admin</title>
    </head>
    <body>
      <h1>Admin</h1>
      ${content}
      <a href="/main">Main</a>
    </body>`
}