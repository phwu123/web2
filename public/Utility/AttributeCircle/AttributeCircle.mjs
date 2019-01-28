const attribute = `
  <link rel="stylesheet" type="text/css" media="screen" href="./Utility/AttributeCircle/AttributeCircle.css" />
  <div class="attribute-circle"></div>
`;

class attributeCircle extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'small-circle', 'wheel-circle', 'hover', 'selected', 'hide'];
  }
  
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = attribute
  }

  attributeChangedCallback(name) {
    const classList = this.shadowRoot.querySelector('.attribute-circle').classList

    switch (name) {
      case 'hover':
        classList.add('hover')
        break;
      case 'small-circle':
        if (this.hasAttribute('small-circle')) {
          classList.add('small-circle'); 
        } else {
          classList.remove('small-circle');
        }
        break;
      case 'wheel-circle':
        if (this.hasAttribute('wheel-circle')) {
          classList.add('wheel-circle')
        }
        break;
      case 'selected':
        if (this.hasAttribute('selected')) {
          classList.add('selected');
        } else {
          classList.remove('selected');
        }
        break;
      case 'hide':
        if (this.hasAttribute('hide')) {
          classList.add('hide');
        } else {
          classList.remove('hide');
        }
      default:
        break;
    }
  }
}

customElements.define('attribute-circle', attributeCircle);