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
    this.nodeSelected = {};
    this.nodeZoom = {};
    this.eventListeners = [];
  }

  connectedCallback() {
    this.appendChild(this.createAttributeScript());
    this.setNode(0);
    this.setEventListener(0);
    this.children[0].children[1].addEventListener('click', this.deselectNodes)
  }

  disconnectedCallback() {
    this.children[0].children[1].removeEventListener('click', this.deselectNodes)
    for (let i = 0; i < 5; i++) {
      this.destroyEventListener(i);
    }
  }

  createAttributeScript() {
    const attributeScript = document.createElement('script');
    attributeScript.type = 'module';
    attributeScript.src = './Utility/AttributeCircle/AttributeCircle.mjs';
    return attributeScript;
  }

  setNode(num) {
    const node = document.createElement('attribute-circle');
    node.id = `${num}`
    if (!num) {
      node.classList.add('centered');
      this.nodeZoom[num] = true
    } else if (num === 1 || num === 2) {
      node.classList.add('top');
      node.toggleAttribute('small-circle', true)
    }
    document.getElementById('node-zone').appendChild(node);
    if (num) {
      setTimeout(() => {
        this.handleInitialMovement(num)
        this.setEventListener(num)
      }, 200);
    }
  }

  setEventListener(num) {
    const node = document.getElementById(num).shadowRoot.children[0].children[1]
    this.eventListeners[num] = () => {
      this.handleClicks(num);
    }
    node.addEventListener('click', this.eventListeners[num])
  }

  destroyEventListener(num) {
    const node = document.getElementById(num).shadowRoot.children[0].children[1]
    node.removeEventListener('click', this.eventListeners[num])
  }

  handleClicks(num) {
    switch (num) {
      case 0:
        this.handleNode0();
        break;
      case 1:
      case 2:
        this.handleNode1(num)
      default:
        break;
    }
  }

  handleInitialMovement(num) {
    const node = document.getElementById(num);
    node.classList.add(`move-${node.id}`);
    node.toggleAttribute('small-circle', true);
    if (!num) {
      setTimeout(() => {
        this.setNode(1);
        this.setNode(2);
      }, 1500);
    }
  }

  handleMovement(num) {
    const node = document.getElementById(num);
    switch (num) {
      case 0:
        node.classList.remove(`move-${node.id}`)
        node.toggleAttribute('small-circle', false);
        this.nodeSelected[num] = true
        break;
      case 1:
      case 2:
        if (this.nodeZoom[num]) {
          node.classList.remove('top')
          node.classList.add('centered')
        } else {
          node.classList.remove('centered')
          node.classList.add('top')
        }
        break;
      default:
        break;
    }
  }

  handleMove0() {

  }

  handleNode0() {
    if (this.nodeZoom[0]) {
      this.nodeSelected[0] = true
      this.nodeZoom[0] = false
      this.cleanUpNodes()
    } else if (!this.nodeZoom[0]) {
      this.focusNode(0)
    }
  }

  handleNode1(num) {
    this.handleMovement(num)
  }

  setNode1() {
    const node = document.createElement('attribute-circle')
  }

  cleanUpNodes() {
    if (document.getElementById(1)) {
      for (let i = 1; i < 3; i++) {
        const node = document.getElementById(i)
        this.nodeSelected[i] = false;
        node.classList.add('top')
        node.classList.remove(`move-${i}`)
        this.destroyEventListener(i)
        node.parentNode.removeChild(node);
      }
    }
    this.handleInitialMovement(0)
  }

  focusNode(num) {
    this.nodeZoom[num] = true
    const node = document.getElementById(num);
    node.classList.remove(`move-${num}`)
    node.toggleAttribute('small-circle', false)
  }

  unfocusAll() {
    console.log('hi')
    for (let i = 4; i > -1; i--) {
      if (document.getElementById(i)) {
        for (let num in this.nodeZoom) {
          if (this.nodeZoom[num]) {
            this.unfocusNode(num)
          }
        }
      }
    }
  }

  unfocusNode(num) {
    const node = document.getElementById(num);
    node.classList.add(`move-${num}`)
    node.toggleAttribute('small-circle', true)
    this.nodeZoom[num] = false
  }

  deselectNodes(e) {
    if (e.target.id === 'skill-tree') {
      this.parentNode.parentNode.unfocusAll()
    }
  }
}

customElements.define('main-page', mainPage);