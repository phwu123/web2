const main = document.createElement('main');
main.innerHTML = `
<link rel="stylesheet" type="text/css" media="screen" href="./Main/Main.css" />
<div id="main-page">
<div id="upper" class="container"></div>
<div id="center" class="container">
</div>
<div id="lower" class="container"></div>
</div>
`;

class mainPage extends HTMLElement {
  constructor() {
    super();
    this.appendChild(main.cloneNode(true));
  }
}

customElements.define('main-page', mainPage)