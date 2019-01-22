const lineTemplate = `
  <link rel="stylesheet" type="text/css" media="screen" href="./Utility/NodeLine/NodeLine.css" />
  <div class="node-line">
    <span class="length"></span>
  </div>
`

class nodeLine extends HTMLElement {
  static get observedAttributes() {
    return ['position', 'hide', 'reveal', 'selected']
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = lineTemplate
    this.classList.add('node-lines')
  }

  attributeChangedCallback(name, oldVal, newVal) {
    const node = this.shadowRoot.children[1]
    switch (name) {
      case 'position':
        node.classList.add(newVal)
        break;
      case 'reveal':
        if (this.hasAttribute('reveal')) {
          node.classList.add('reveal')
        } else {
          node.classList.remove('reveal')
          this.toggleAttribute('hide', false);
          this.toggleAttribute('selected', false)
        }
        break;
      case 'hide':
        if (this.hasAttribute('hide')) {
          node.classList.add('hide')
        } else {
          node.classList.remove('hide')
        }
      case 'selected':
        if (this.hasAttribute('selected')) {
          node.children[0].classList.add('selected')
        } else {
          node.children[0].classList.remove('selected')
        }
    }
  }
}

customElements.define('node-line', nodeLine)