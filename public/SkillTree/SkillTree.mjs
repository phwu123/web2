const skillTreeTemplate = `
  <link rel="stylesheet" type="text/css" media="screen" href="./SkillTree/SkillTree.css" />
  <node-line position="line1"></node-line>
  <node-line position="line2"></node-line>
  <node-line position="line3"></node-line>
  <node-line position="line4"></node-line>
  <node-line position="line5"></node-line>
  <node-line position="line6"></node-line>
`
class skillTree extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'reset'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = skillTreeTemplate;
    this.nodeZoom = {};
    this.nodeBlock = {};
    this.eventListeners = [];
    this.CLASS_POINTS_ALLOWED = null;
    this.classesSelected = {};
    this.treeSelected = {};
    this.classToParent = null;
    this.proxyClasses = null
  }

  connectedCallback() {
    this.skillPoints = this.MAX_SKILL_POINTS
    this.shadowRoot.appendChild(this.createAttributeScript());
    this.shadowRoot.appendChild(this.createLineScript());
    this.setNode(0);
    this.setEventListener(0);
    this.unblockAll()
    this.classToParent = new CustomEvent('updateClasses',
    { 
      bubbles: true,
      detail: {
        type: this.getAttribute('type'),
        classes: this.classesSelected
      }
    })
    this.setUpProxyClasses()
  }

  disconnectedCallback() {
    for (let i = 0; i < 5; i++) {
      this.destroyEventListener(i);
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    switch (name) {
      case 'reset':
        if (this.hasAttribute('reset')) {
          this.deselectNodes()
        }
        break;
      default:
        break;
    }
  }

  setUpProxyClasses() {
    const proxy = new Proxy(this.classesSelected, {
      set: (target, prop, value) => {
        target[prop] = value
        this.dispatchEvent(this.classToParent)
        return true
      }
    })
    this.proxyClasses = proxy
  }

  createAttributeScript() {
    const attributeScript = document.createElement('script');
    attributeScript.type = 'module';
    attributeScript.src = './Utility/AttributeCircle/AttributeCircle.mjs';
    return attributeScript;
  }

  createLineScript() {
    const lineScript = document.createElement('script');
    lineScript.type = 'module';
    lineScript.src = './Utility/NodeLine/NodeLine.mjs';
    return lineScript;
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
      this.shadowRoot.children[num].toggleAttribute('reveal', true)
    } else if (num < 5) {
      node.classList.add('left');
      node.toggleAttribute('small-circle', true)
      this.shadowRoot.children[num].toggleAttribute('reveal', true)
    } else if (num < 7) {
      node.classList.add('right');
      node.toggleAttribute('small-circle', true);
      this.shadowRoot.children[num].toggleAttribute('reveal', true)
    }
    this.shadowRoot.appendChild(node);
    if (num) {
      setTimeout(() => {
        this.handleInitialMovement(num)
        this.setEventListener(num)
      }, 200);
    }
  }

  setEventListener(num) {
    const node = this.shadowRoot.getElementById(num).shadowRoot.children[1]
    this.eventListeners[num] = () => {
      this.handleClicks(num);
    }
    node.addEventListener('click', this.eventListeners[num])
  }

  destroyEventListener(num) {
    const node = this.shadowRoot.getElementById(num).shadowRoot.children[1]
    node.removeEventListener('click', this.eventListeners[num])
  }

  selectNode(num) {
    const node = this.shadowRoot.getElementById(num);
    const line = this.shadowRoot.children[num]
    node.toggleAttribute('selected', true);
    line.toggleAttribute('selected', true);
    this.proxyClasses[num] = true
  }

  deselectNode(num) {
    const node = this.shadowRoot.getElementById(num);
    const line = this.shadowRoot.children[num];
    node.toggleAttribute('selected', false);
    line.toggleAttribute('selected', false);
    this.proxyClasses[num] = false
    this.treeSelected[num] = false;
    if (num === 0) {
      this.cleanUpNodesSet1()
    } else if (num == 1) {
      this.cleanUpNodesSet2()
    } else if (num == 2) {
      this.cleanUpNodesSet3()
    }
  }

  handleClicks(num) {
    if (!this.nodeBlock[num]) {
      this.nodeBlock[num] = true
      if (!num) {
        this.handleNode0()
      } else {
        this.handleMovement(num)
      }
      setTimeout(() => {
        if (this.nodeBlock) {
          this.nodeBlock[num] = false
        }
      }, 1500);
    }
  }

  handleInitialMovement(num) {
    const node = this.shadowRoot.getElementById(num);
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
    const node = this.shadowRoot.getElementById(num);
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
    }
  }

  handleNode0() {
    if (this.nodeZoom[0]) {
      this.handleInitialMovement(0)
      this.selectNode(0)
    } else if (!this.nodeZoom[0]) {
      this.deselectAll()
      this.focusNode(0)
    }
  }

  cleanUpNodesSet1() {
    for (let i = 1; i < 3; i++) {
      const node = this.shadowRoot.getElementById(i)
      if (node) {
        this.destroyEventListener(i)
        node.toggleAttribute('hide', true)
        setTimeout(() => {   
          node.parentNode.removeChild(node);
        }, 1500);
      }
      const line = this.shadowRoot.children[i];
      if (line.hasAttribute('reveal')) {
        line.toggleAttribute('hide', true);
        setTimeout(() => {
          line.toggleAttribute('reveal', false);
        }, 1500);
      }
    }
  }

  cleanUpNodesSet2() {
    for (let i = 3; i < 5; i++) {
      const node = this.shadowRoot.getElementById(i)
      if (node) {
        this.destroyEventListener(i)
        node.toggleAttribute('hide', true)
        setTimeout(() => {   
          node.parentNode.removeChild(node);
        }, 1500);
      }
      const line = this.shadowRoot.children[i];
      if (line.hasAttribute('reveal')) {
        line.toggleAttribute('hide', true);
        setTimeout(() => {
          line.toggleAttribute('reveal', false);
        }, 1500);
      }
    }
  }

  cleanUpNodesSet3() {
    for (let i = 5; i < 7; i++) {
      const node = this.shadowRoot.getElementById(i)
      if (node) {
        this.destroyEventListener(i)
        node.toggleAttribute('hide', true)
        setTimeout(() => {   
          node.parentNode.removeChild(node);
        }, 1500);
      }
      const line = this.shadowRoot.children[i];
      if (line.hasAttribute('reveal')) {
        line.toggleAttribute('hide', true);
        setTimeout(() => {
          line.toggleAttribute('reveal', false);
        }, 1500);
      }
    }
  }

  focusNode(num) {
    const node = this.shadowRoot.getElementById(num);
    if (node.hasAttribute('selected')) {
      this.deselectNode(num)
      return
    }
    this.nodeZoom[num] = true;
    node.classList.remove(`move-${num}`)
    if (num === 1 || num === 2) {
      node.classList.remove('top');
    } else if (num === 3 || num === 4) {
      node.classList.remove('left')
    } else if (num === 5 || num === 6) {
      node.classList.remove('right');
    }
    if (num) {
      node.classList.add('centered');
    }
    node.toggleAttribute('small-circle', false)
    for (let block in this.nodeBlock) {
      if (this.shadowRoot.getElementById(block) && block != num) {
        this.nodeBlock[block] = true;
        this.shadowRoot.getElementById(block).toggleAttribute('hide', true);
      };
    };
    this.hideLines()
  }

  unfocusNode(num) {
    const node = this.shadowRoot.getElementById(num);
    node.classList.add(`move-${num}`)
    if (num > 0) {
      node.classList.remove('centered');
    }
    if (num == 1 || num == 2) {
      node.classList.add('top');
    } else if (num == 3 || num == 4) {
      node.classList.add('left')
    } else if (num == 5 || num == 6) {
      node.classList.add('right')
    }
    node.toggleAttribute('small-circle', true)
    this.nodeZoom[num] = false
    for (let block in this.nodeBlock) {
      if (block !== num) {
        this.nodeBlock[block] = false;
        if (this.shadowRoot.getElementById(block)) {
          this.shadowRoot.getElementById(block).toggleAttribute('hide', false);
        };
      };
    };
    this.unhideLines()
  }

  unfocusAll() {
    for (let i = 7; i > -1; i--) {
      if (this.shadowRoot.getElementById(i)) {
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
      if (this.shadowRoot.getElementById(i)) {
        this.deselectNode(i)
      }
    }
  }

  deselectNodes() {
    if (!this.nodeZoom[0]) {
      this.unfocusAll()
    }
    this.toggleAttribute('reset', false)
  }

  unblockAll() {
    for (let i = 0; i < 7; i++) {
      this.nodeBlock[i] = false
    }
  }

  hideLines() {
    for (let i = 1; i < 7; i++) {
      const line = this.shadowRoot.children[i];
      if (line.hasAttribute('reveal')) {
        line.toggleAttribute('hide', true);
      }
    }
  }

  unhideLines() {
    for (let i = 1; i < 7; i++) {
      const line = this.shadowRoot.children[i];
      if (line.hasAttribute('reveal')) {
        line.toggleAttribute('hide', false);
      }
    }
  }
}

customElements.define('skill-tree', skillTree);