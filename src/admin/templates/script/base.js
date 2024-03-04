export default function () {
  return `
    <script>
      ${jsToHtmlString(pulsarContext)}
    </script>
      `;
}

const jsToHtmlString = function(base){
  let retour = "const pulsarContext = {};"
  for (const [key, value] of Object.entries(base)) {
    retour += `pulsarContext.${key} = ${value.toString()};`;
  }
  return retour;
}

const pulsarContext = {
  removeElement: (elementSelector) => {
    const element = document.querySelector(elementSelector);
    element.remove();
  },
  changeInnerHtml: (elementSelector, newHtml) => {
    const element = document.querySelector(elementSelector);
    element.innerHTML = newHtml;
  },
  changeOuterHtml: (elementSelector, newHtml) => {
    const element = document.querySelector(elementSelector);
    console.log("element", element, elementSelector, newHtml);
    element.outerHTML = newHtml;
  },
}