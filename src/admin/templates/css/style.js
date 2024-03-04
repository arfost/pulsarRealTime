export default function () {
  return `
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      h1 {
        background-color: #f4f4f4;
        padding: 10px;
        margin: 0;
      }
      a {
        color: blue;
        text-decoration: none;
        margin: 10px;
      }
      a:hover {
        text-decoration: underline;
      }
      ul {
        list-style: none;
        padding: 0;
      }
      li {
        padding: 10px;
        border-bottom: 1px solid #f4f4f4;
      }
      li:hover {
        background-color: #f4f4f4;
      }
      input[type="text"] {
        padding: 10px;
        margin: 10px;
      }
      button {
        padding: 10px;
        margin: 10px;
      }
      button:hover {
        cursor: pointer;
      }
      form {
        margin: 10px;
      }
      .content{
        margin: 10px;
      }
      .element-title {
        font-size: 2em;
        font-weight: bold;
      }
      .element-subtitle {
        font-size: 1.5em;
        font-weight: bold;
      }
      pre {
        background-color: #f0f0f0;
        padding: 10px;
      } 
    </style>`;
}