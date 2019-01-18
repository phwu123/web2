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
    this.nodeZoom = {};
    this.nodeBlock = {};
    this.eventListeners = [];
    this.MAX_SKILL_POINTS = 4;
    this.skillPoints = null;
    this.treeSelected = {};
  }

  connectedCallback() {
    this.skillPoints = this.MAX_SKILL_POINTS
    this.appendChild(this.createAttributeScript());
    this.setNode(0);
    this.setEventListener(0);
    this.children[0].children[1].addEventListener('click', this.deselectNodes)
    this.unblockAll()
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
    } else if (num < 3) {
      node.classList.add('top');
      node.toggleAttribute('small-circle', true)
    } else if (num < 5) {
      node.classList.add('left');
      node.toggleAttribute('small-circle', true)
    } else if (num < 7) {
      node.classList.add('right');
      node.toggleAttribute('small-circle', true);
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

  selectNode(num) {
    const node = document.getElementById(num);
    node.toggleAttribute('selected', true);
  }

  deselectNode(num) {
    const node = document.getElementById(num);
    node.toggleAttribute('selected', false);
    this.treeSelected[num] = false;
  }

  handleClicks(num) {
    switch (num) {
      case 0:
        if (this.nodeBlock[0]) break;
        this.handleNode0();
        break;
      case 1:
        if (this.nodeBlock[1]) break;
        this.handleMovement(num)
        break
      case 2:
        if (this.nodeBlock[2]) break;
        this.handleMovement(num)
        break
      default:
        break;
    }
  }

  handleInitialMovement(num) {
    const node = document.getElementById(num);
    node.classList.add(`move-${node.id}`);
    this.nodeZoom[num] = false
    node.toggleAttribute('small-circle', true);
    if (!num) {
      setTimeout(() => {
        this.setNode(1);
        this.setNode(2);
      }, 1500);
    }
    this.unblockAll()
  }

  handleMovement(num) {
    const node = document.getElementById(num);
    if (!this.nodeZoom[num]) {
      this.focusNode(num);
    } else if (this.nodeZoom[num]) {
      this.selectNode(num);
      this.unfocusNode(num);
      if (num === 0 || (num === 1 && !this.treeSelected[2]) || (num === 2 && !this.treeSelected[1])) {
        this.treeSelected[num] = true
        setTimeout(() => {
          this.setNode(num * 2 + 1);
          this.setNode(num * 2 + 2);
        }, 1500);
      }
    } else if (node.getAttribute('selected')) {

    }
  }

  handleNode0() {
    if (this.nodeZoom[0]) {
      this.deselectAll()
      this.cleanUpNodes()
      this.selectNode(0)
    } else if (!this.nodeZoom[0]) {
      this.deselectNode(0)
      this.focusNode(0)
    }
  }

  cleanUpNodes() {
    for (let i = 5; i < 7; i++) {
      const node = document.getElementById(i)
      if (node) {
        node.classList.add('right')
        node.classList.remove(`move-${i}`)
        this.destroyEventListener(i)
        node.parentNode.removeChild(node);
      }
    }
    for (let i = 3; i < 5; i++) {
      const node = document.getElementById(i)
      if (node) {
        node.classList.add('left')
        node.classList.remove(`move-${i}`)
        this.destroyEventListener(i)
        node.parentNode.removeChild(node);
      }
    }
    for (let i = 1; i < 3; i++) {
      const node = document.getElementById(i)
      if (node) {
        node.classList.add('top')
        node.classList.remove(`move-${i}`)
        this.destroyEventListener(i)
        node.parentNode.removeChild(node);
      }
    }
    this.handleInitialMovement(0)
  }

  focusNode(num) {
    const node = document.getElementById(num);
    if (node.hasAttribute('selected')) {
      this.deselectNode(num)
      return
    }
    this.nodeZoom[num] = true;
    node.classList.remove(`move-${num}`)
    if (num === 1 || num === 2) {
      node.classList.remove('top');
    }
    if (num) {
      node.classList.add('centered');
    }
    node.toggleAttribute('small-circle', false)
    for (let block in this.nodeBlock) {
      if (document.getElementById(block) && block != num) {
        this.nodeBlock[block] = true;
        document.getElementById(block).toggleAttribute('hide', true);
      };
    };
  }

  unfocusNode(num) {
    const node = document.getElementById(num);
    node.classList.add(`move-${num}`)
    if (num > 0) {
      node.classList.remove('centered');
    }
    if (num == 1 || num == 2) {
      node.classList.add('top');
    }
    node.toggleAttribute('small-circle', true)
    this.nodeZoom[num] = false
    for (let block in this.nodeBlock) {
      if (block !== num) {
        this.nodeBlock[block] = false;
        if (document.getElementById(block)) {
          document.getElementById(block).toggleAttribute('hide', false);
        };
      };
    };
  }

  unfocusAll() {
    for (let i = 7; i > -1; i--) {
      if (document.getElementById(i)) {
        for (let num in this.nodeZoom) {
          if (this.nodeZoom[num]) {
            this.unfocusNode(num);
          };
        };
      };
    };
  }

  deselectAll() {
    for (let i = 7; i > -1; i--) {
      if (document.getElementById(i)) {
        this.deselectNode(i)
      }
    }
  }

  deselectNodes(e) {
    e.stopPropagation();
    if (this.parentNode.parentNode.nodeZoom[0]) {
      return
    }
    if (e.target.id === 'skill-tree') {
      this.parentNode.parentNode.unfocusAll()
    }
  }

  unblockAll() {
    for (let i = 0; i < 7; i++) {
      this.nodeBlock[i] = false
    }
  }
}

customElements.define('main-page', mainPage);