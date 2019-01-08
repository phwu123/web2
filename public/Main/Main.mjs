const main = document.createElement('main');
main.innerHTML = `
<link rel="stylesheet" type="text/css" media="screen" href="./Main/Main.css" />
<div id="main-page">
<div id="upper" class="container"></div>
<div id="center" class="container">
  <div id="symbol-large" class="category-box"></div>
  <div id="skill-tree" class="category-box"></div>
  <div id="node-details" class="category-box"></div>
</div>
<div id="lower" class="container"></div>
</div>
`;

class mainPage extends HTMLElement {
  static get observedAttributes() {
    return ['type'];
  }
  constructor() {
    super();
    this.appendChild(main.cloneNode(true));
  }
}

customElements.define('main-page', mainPage);