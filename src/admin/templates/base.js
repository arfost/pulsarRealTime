import style from './css/style.js';
import script from './script/base.js';

export default function (content) {
  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <script src="https://unpkg.com/htmx.org@1.9.10" integrity="sha384-D1Kt99CQMDuVetoL1lrYwg5t+9QdHe7NLX/SoJYkXDFfX37iInKRy5xLSi8nO7UC" crossorigin="anonymous"></script>
      <title>Admin</title>
      ${style()}
      ${script()}
    </head>
    <body>
      <h1>Admin</h1>
      <div class="content">
        ${content}
      </div>
      <a href="/main">Main</a>
    </body>`
}