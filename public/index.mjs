const splash = document.createElement('splash');
splash.innerHTML = `
  <link rel="stylesheet" type="text/css" media="screen" href="Splash.css" />
  <div id="splash">
    <div id="selection">
      <span>Welcome Adventurer!</span>
      <span>Please Choose an Attribute:</span>
      <div id="attributes">
        <attribute-circle type="Strength"></attribute-circle>
        <attribute-circle type="Intelligence"></attribute-circle>
        <attribute-circle type="Dexterity"></attribute-circle>
      </div>
    </div>
    <div id="attribute-details">
      <span class="circle"></span>
      <div class="details">
        <span>Assocations</span>
      </div>
      <span id="selected-attribute"></span>
    </div>
  </div>
`;

class splashPage extends HTMLElement {
  static get observedAttributes() {
    return ['selection'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(splash.cloneNode(true));

  }

  connectedCallback() {
    document.getElementById('splash-page').appendChild(this.createAttributeScript());
    const collection = document.getElementById('splash-page').shadowRoot.getElementById('attributes').children
    const attributes = [...collection]
    attributes.map((child) => {
      child.addEventListener('click', () => {
        this.handleSelectionChoice(child.getAttribute('type'))
      })
    })
  }

  disconnectedCallback() {
    document.head.appendChild(this.createMainScript());
    document.getElementById('app-container').appendChild(document.createElement('main-page'))
    const collection = document.getElementById('splash-page').shadowRoot.getElementById('attributes').children
    const attributes = [...collection]
    attributes.map((child) => {
      child.removeEventListener('click', () => {
        this.handleSelectionChoice(child.getAttribute('type'))
      })
    })
  }

  attributeChangedCallback(name, oldVal, newVal) {
    const element = this.shadowRoot.getElementById('selected-attribute');
    if (!oldVal) {
      element.parentNode.classList.add('attribute-details-active');
    }
    element.innerHTML = newVal
  }

  createAttributeScript() {
    const attributeScript = document.createElement('script');
    attributeScript.type = 'module';
    attributeScript.src = './Utility/AttributeCircle/AttributeCircle.mjs';
    return attributeScript;
  }

  createMainScript() {
    const mainScript = document.createElement('script');
    mainScript.type = 'module';
    mainScript.src = './Main/Main.mjs';
    return mainScript;
  }

  handleSelectionChoice(type) {
    this.setAttribute('selection', type)
  }
  confirmSelectionChoice(type) {
    // document.getElementById('app-container').removeChild(document.getElementById('splash-page'))
  }
}

customElements.define('splash-page', splashPage);