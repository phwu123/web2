const attribute = document.createElement('attribute')
attribute.innerHTML = `
  <link rel="stylesheet" type="text/css" media="screen" href="./Utility/AttributeCircle/AttributeCircle.css" />
  <div class="attribute-circle"></div>
`;

class attributeCircle extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'active'];
  }
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(attribute.cloneNode(true));
  }

  connectedCallback() {
    this.addEventListener('click', this.handleClickAttribute)
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.handleClickAttribute)
    console.log('bye')
    
  }
  handleClickAttribute() {
    document.getElementById('app-container').removeChild(document.getElementById('splash-page'))
    this.toggleAttribute('active');
  }
}

customElements.define('attribute-circle', attributeCircle);