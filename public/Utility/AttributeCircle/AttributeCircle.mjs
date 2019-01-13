const attribute = document.createElement('attribute')
attribute.innerHTML = `
  <link rel="stylesheet" type="text/css" media="screen" href="./Utility/AttributeCircle/AttributeCircle.css" />
  <div class="attribute-circle"></div>
`;

class attributeCircle extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'small-circle', 'hover-splash'];
  }
  
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(attribute.cloneNode(true));
  }

  attributeChangedCallback(name, oldVal, newVal) {
    const classList = this.shadowRoot.querySelector('.attribute-circle').classList
    if (this.hasAttribute('hover-splash')) {
      classList.add('hover-splash')
    }
    if (this.hasAttribute('small-circle')) {
      classList.add('small-circle') 
    } else {
      classList.remove('small-circle')
    }
  }
}

customElements.define('attribute-circle', attributeCircle);