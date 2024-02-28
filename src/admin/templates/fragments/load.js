export default function ({success, filename}) {
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
      <input type="text" name="filename" value="data" />
      <button type="submit">Load</button>
    </form>`;
  }
}