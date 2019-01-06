const splash = document.createElement('splash');
splash.innerHTML = `
  <link rel="stylesheet" type="text/css" media="screen" href="Splash.css" />
  <div id="splash">
    <span>Welcome Adventurer!</span>
    <span>Please Choose an Attribute:</span>
    <div id="attributes">
      <attribute-circle type="str"></attribute-circle>
      <attribute-circle type="int"></attribute-circle>
      <attribute-circle type="dex"></attribute-circle>
    </div>
  </div>
`;

class splashPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(splash.cloneNode(true));

    
  }

  connectedCallback() {
    document.getElementById('splash-page').appendChild(this.createAttributeScript());
}

  disconnectedCallback() {
    document.head.appendChild(this.createMainScript());
    document.getElementById('app-container').appendChild(document.createElement('main-page'))
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

}

customElements.define('splash-page', splashPage);