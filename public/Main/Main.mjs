const main = document.createElement('main');
main.innerHTML = `
<link rel="stylesheet" type="text/css" media="screen" href="./Main/Main.css" />
<div id="main-page">

<div id="center" class="container">
  <div id="symbol-large" class="category-box"></div>
  <div id="skill-tree" class="category-box">
    <div id="node-zone"></div>
  </div>
  <div id="node-details" class="category-box"></div>
</div>

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

  connectedCallback() {
    this.appendChild(this.createAttributeScript());
    const node = document.createElement('attribute-circle');
    this.setNode(node, 0);
  }

  createAttributeScript() {
    const attributeScript = document.createElement('script');
    attributeScript.type = 'module';
    attributeScript.src = './Utility/AttributeCircle/AttributeCircle.mjs';
    return attributeScript;
  }

  setNode(node, num) {
    node.setAttribute('type', `${this.getAttribute('type')}${num}`)
    node.classList.add('centered');
    document.getElementById('node-zone').appendChild(node);
    if (num === 0) {
      node.addEventListener('click', () => {
        this.clickCircle(node, `${num}`, true)
      })
    } else if (num.length === 2) {
      this.clickCircle(node, `${num}`)
    }
  }

  clickCircle(incNode, num, bool) {
    let node
    if (bool) {
      node = incNode.cloneNode(true)
      incNode.parentNode.replaceChild(node, incNode);
    } else {
      node = incNode
    }
    if (num.length < 3) {
      node.classList.add(`move-${num}`);
      node.shadowRoot.childNodes[0].childNodes[3].classList.add('small-circle')
      const nodeLeft = document.createElement('attribute-circle')
      const nodeRight = document.createElement('attribute-circle')
      setTimeout(() => {
        this.setNode(nodeLeft, `${num}` + 1)
        this.setNode(nodeRight, `${num}` + 2)
      }, 1000);
    }  
  }
}

customElements.define('main-page', mainPage);