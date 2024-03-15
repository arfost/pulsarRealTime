export default function ({success, filename, fileList}) {
  if(filename){
    return `
    <div hx-target="this" hx-swap="outerHTML">
      load data from ${filename},
      ${success ? 
        `<h2>Success</h2>` : 
        `<h2>Failure</h2>`}
        <button hx-get="/forceSave">retour</button>
    </div>`
      
  }else{
    return `
    <form hx-get="/forceLoad" hx-target="this" hx-swap="outerHTML">
      <select name="filename">
        ${fileList.map(filename => `<option value="${filename}">${filename}</option>`).join("")}
      </select>
      <button type="submit">load in base</button>
    </form>`;
  }
}