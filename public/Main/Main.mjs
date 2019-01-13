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
    this.node0Set = false;
  }

  connectedCallback() {
    this.appendChild(this.createAttributeScript());
    this.setNode0();
  }

  createAttributeScript() {
    const attributeScript = document.createElement('script');
    attributeScript.type = 'module';
    attributeScript.src = './Utility/AttributeCircle/AttributeCircle.mjs';
    return attributeScript;
  }

  setNode0() {
    const node = document.createElement('attribute-circle');
    node.id = '0'
    node.classList.add('centered');
    document.getElementById('node-zone').appendChild(node);
    node.addEventListener('click', this.handleNode0)
  }

  handleNode0() {
    const node = document.getElementById('0')
    const shadow = node.shadowRoot.children[0].children[1]
    if (!this.node0Set) {
      node.classList.add(`move-${node.id}`)
      if ([...shadow.classList].includes('backwards')) {
        shadow.classList.remove('backwards')
      }
      shadow.classList.add('small-circle')
      this.node0Set = true
    } else {
      node.classList.remove(`move-${node.id}`)
      shadow.classList.remove('small-circle')
      setTimeout(() => {
  //      shadow.classList.add('backwards')
      }, 500);
      this.node0Set = false
    }
  }

  clickCircle(incNode, num, bool) {

    if (num.length < 3) {
   //   node.shadowRoot.childNodes[0].childNodes[3].classList.add('small-circle')
      this.moveCircle(node, num)
      // node.classList.add(`move-${num}`);
      // const nodeLeft = document.createElement('attribute-circle')
      // const nodeRight = document.createElement('attribute-circle')
      // setTimeout(() => {
      //   this.setNode(nodeLeft, `${num}` + 1)
      //   this.setNode(nodeRight, `${num}` + 2)
      // }, 1000);
    }  
  }
  moveCircle(node, num) {
    node.classList.add(`move-${num}`);
    node.classList.remove('initial')
  }
}

customElements.define('main-page', mainPage);