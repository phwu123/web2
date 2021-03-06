const splashTemplate = `
  <link rel="stylesheet" type="text/css" media="screen" href="Splash.css" />
  <div id="splash">
    <div id="selection">
      <span class="intro">Welcome Adventurer!</span>
      <span class="intro">Please Choose an Attribute:</span>
      <div id="attributes">
        <attribute-circle type="Strength"></attribute-circle>
        <attribute-circle type="Intelligence"></attribute-circle>
        <attribute-circle type="Dexterity"></attribute-circle>
      </div>
    </div>
    <div id="attribute-details">
      <span id="chosen-circle"></span>
      <div class="details">
        <span>Associations</span>
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
    this.innerHTML = splashTemplate;
    this.FADE_DURATION = 1.5 * 1000;
    this.FADE_SPACING = 0.5 * 1000;
    this.startTime = null;
    this.eachFrame = this.eachFrame.bind(this)
    this.handleSelectionChoice = this.handleSelectionChoice.bind(this)
    this.confirmingSelectionChoice = false
  }

  connectedCallback() {
    this.appendChild(this.createAttributeScript())
    this.addEventListeners();
    this.eachFrame()
  }

  disconnectedCallback() {
    this.appendMainPage();
  }

  addEventListeners() {
    const collection = document.getElementById('attributes').children;
    const attributes = [...collection];
    attributes.map((child) => {
      child.toggleAttribute('hover')
      child.addEventListener('click', this.handleSelectionChoice)
    })
    setTimeout(() => {
      const circle = document.getElementById('chosen-circle');
      circle.addEventListener('click', this.confirmSelectionChoice);
    }, 3000);
  }

  removeEventListeners() {
    const collection = document.getElementById('attributes').children;
    const attributes = [...collection];
    attributes.map((child) => {
      child.removeEventListener('click', this.handleSelectionChoice);
    })
    const circle = document.getElementById('chosen-circle');
    circle.removeEventListener('click', this.confirmSelectionChoice);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    const element = document.getElementById('selected-attribute');
    if (!oldVal) {
      element.parentNode.classList.add('attribute-details-active');
      element.parentNode.style.opacity = 1;
    }
    element.innerHTML = newVal;
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

  handleSelectionChoice(e) {
    this.setAttribute('selection', e.target.getAttribute('type'));
  }

  confirmSelectionChoice() {
    if (!this.confirmSelectionChoice) {
      this.confirmSelectionChoice = true
      document.getElementById('selected-attribute').classList.remove('attribute-details-active');
      document.getElementById('splash-page').eachFrame(true);
      setTimeout(() => {
        document.getElementById('splash-page').removeEventListeners();
        document.getElementById('app-container').removeChild(document.getElementById('splash-page'));
      }, 3000);
    }
  }

  appendMainPage() {
    document.head.appendChild(this.createMainScript());
    document.getElementById('app-container').appendChild(document.createElement('main-page'));
    document.getElementById('app-container').firstElementChild.setAttribute('type', this.getAttribute('selection'));
  }

  toggleOpacity(currTime, fadeOut) {
    const first = this.querySelectorAll('.intro')[0];
    const second = this.querySelectorAll('.intro')[1];
    const third = document.getElementById('attributes');
    const fourth = document.getElementById('attribute-details');

    const opFirst = this.clamp(currTime / this.FADE_DURATION);
    const opSecond = this.clamp((currTime - this.FADE_SPACING) / this.FADE_DURATION);
    const opThird = this.clamp((currTime - this.FADE_SPACING * 2) / this.FADE_DURATION);
    const opFourth = this.clamp((currTime - this.FADE_SPACING * 3) / this.FADE_DURATION);
    first.style.opacity = !fadeOut ? opFirst : 1 - opFirst;
    second.style.opacity = !fadeOut ? opSecond : 1 - opSecond;
    third.style.opacity = !fadeOut ? opThird : 1 - opSecond;
    fourth.style.opacity = !fadeOut ? fourth.style.opacity : 1 - opFourth * 2;
  }

  eachFrame(fade) {
    if (!this.startTime) {
      this.startTime = (new Date()).getTime();
      this.toggleOpacity(0, fade);
      window.requestAnimationFrame(() => this.eachFrame(fade))
    } else if (((new Date()).getTime() - this.startTime) < 3000) {
      this.toggleOpacity((new Date()).getTime() - this.startTime, fade)
      window.requestAnimationFrame(() => this.eachFrame(fade));
    } else {
      this.startTime = null;
    }
  }

  clamp(num) {
    return Math.max(0, Math.min(num, 1));
  }
}

customElements.define('splash-page', splashPage);