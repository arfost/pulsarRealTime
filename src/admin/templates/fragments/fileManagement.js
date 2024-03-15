export default function ({ fileList }) {

  return `
  <div>
    <div>
      ${fileList.map(filename => `<a href="/download?filename=${filename}" download>${filename}</a>`).join("")}
    </div>
    <form id='form' hx-encoding='multipart/form-data' hx-post='/upload'>
        <input type='file' name='file'>
        <button>
            Upload
        </button>
    </form>
  </div>
  `;
}