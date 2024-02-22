export default function ({success, filename}) {
  if(filename){
    return `
    <div hx-target="this" hx-swap="outerHTML">
      save data to ${filename},
      ${success ? 
        `<div>Success</div>` : 
        `<div>Failure</div>`
      }
      <button hx-get="/forceSave">retour</button>
    </div>
    `
  }else{
    return `
    <form hx-get="/forceSave" hx-target="this" hx-swap="outerHTML">
      <input type="text" name="filename" value="data" />
      <button type="submit">Save</button>
    </form>`;
  }
}