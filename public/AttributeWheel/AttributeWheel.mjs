const wheelTemplate = `
<link rel="stylesheet" type="text/css" media="screen" href="./AttributeWheel/AttributeWheel.css" />
<div class="wheel inner"></div>
<div class="wheel middle"></div>
<div class="wheel outer"></div>
`
class attributeWheel extends HTMLElement {
  static get observedAttributes() {
    return ['selected']
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = wheelTemplate
    this.types = ['Strength', 'Intelligence', 'Dexterity']
  }

  connectedCallback() {
    this.shadowRoot.appendChild(this.createAttributeScript())
    for (let i = 0; i < 3; ++i) {
      const attributeCircle = document.createElement('attribute-circle')
      attributeCircle.toggleAttribute('wheel-circle', true)
      attributeCircle.setAttribute('type', this.types[i])
      attributeCircle.toggleAttribute('hover', true)
      attributeCircle.classList.add(`attribute${i}`)
      this.shadowRoot.children[2].appendChild(attributeCircle)
    }
    this.setUpEventListeners()
  }

  disconnectedCallback() {

  }

  attributeChangedCallback(name, oldVal, newVal) {

  }

  createAttributeScript() {
    const attributeScript = document.createElement('script')
    attributeScript.type = 'module'
    attributeScript.src = './Utility/AttributeCircle/AttributeCircle.mjs'
    return attributeScript
  }
  setUpEventListeners() {
    const nodes = this.shadowRoot.children[2].children
    const circles = [...nodes]
    for (let i = 0; i < circles.length; ++i) {
      circles[i].shadowRoot.children[1].addEventListener('click', this.changeAttribute)
    }
  }

  changeAttribute(e) {
    const changeAttribute = new CustomEvent('changeAttribute', {
      bubbles: true,
      detail: {
        type: e.target.parentNode.host.getAttribute('type')
      }
    })
    document.getElementById('attribute-wheel').dispatchEvent(changeAttribute)
    document.getElementById('attribute-wheel').toggleAttributes(e.target.parentNode.host)
  }

  toggleAttributes(node) {
    const wheel = node.parentNode
    node.toggleAttribute('selected', true)
    for (let i = 0; i < this.types.length; ++i) {
      if (node !== wheel.children[i]) {
        wheel.children[i].toggleAttribute('selected', false)
      }
    }
  }
}

customElements.define('attribute-wheel', attributeWheel)