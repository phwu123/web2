const mainTemplate = `
<link rel="stylesheet" type="text/css" media="screen" href="./Main/Main.css" />
<div id="center">
  <div id="symbol-large" class="category-box"></div>
  <div id="skill-tree-container" class="category-box">
  </div>
  <div id="node-details" class="category-box">
    <span></span>
    <span></span>
    <span></span>
  </div>
  <div id="points-remaining"></div>
</div>
`;

class mainPage extends HTMLElement {
  static get observedAttributes() {
    return ['type'];
  }
  constructor() {
    super();
    this.innerHTML = mainTemplate;
    this.eventListeners = [];
    this.classPoints = {
      Strength: {},
      Intelligence: {},
      Dexterity: {}
    }
    this.MAX_CLASS_POINTS = 5;
    this.classPointsRemaining = null
  }

  connectedCallback() {
    document.getElementById('points-remaining').innerHTML = `Points Remaining: ${this.MAX_CLASS_POINTS}`
    this.appendChild(this.createSkillTreeScript())
    this.createSkillTree()
    document.getElementById('skill-tree-container').addEventListener('click', this.deselectSkillTreeNodes)
    this.appendChild(this.createAttributeWheelScript())
    const attributeWheel = document.createElement('attribute-wheel')
    attributeWheel.id = 'attribute-wheel'
    document.getElementById('center').append(attributeWheel)
    this.addEventListener('updateClasses', this.handleClasses)
    this.addEventListener('changeAttribute', this.changeAttribute)
    this.printAttributes()
  }

  disconnectedCallback() {
    document.getElementById('skill-tree-container').removeEventListener('click', this.deselectSkillTreeNodes)
    this.removeEventListener('updateClasses', this.handleClasses)
  }

  attributeChangedCallback(name, oldVal, newVal) {
    switch (name) {
      case 'type':
        // setTimeout(() => {
        //   document.getElementById('skill-tree-container').children[0].setAttribute('type', newVal)
        // }, 0);
        break;
      default:
        break;
    }
  }

  handleClasses(e) {
    this.classPoints[e.detail.type] = e.detail.classes
    console.log('type ', e.detail.type)
    this.classPointsRemaining = this.calculateClassPointsRemaining()
    document.getElementById('points-remaining').innerHTML = `Points Remaining: ${this.classPointsRemaining}`
    this.printAttributes()
  }

  calculateClassPointsRemaining() {
    let count = 0;
    for (const type in this.classPoints) {
      for (const num in this.classPoints[type]) {
        if (this.classPoints[type][num]) {
          ++count
        }
      }
    }
    return this.MAX_CLASS_POINTS - count
  }

  createSkillTreeScript() {
    const skillTreeScript = document.createElement('script')
    skillTreeScript.type = 'module';
    skillTreeScript.src = './SkillTree/SkillTree.mjs'
    return skillTreeScript
  }

  createSkillTree() {
    const skillTree = document.createElement('skill-tree')
    skillTree.setAttribute('type', this.getAttribute('type'))
    document.getElementById('skill-tree-container').appendChild(skillTree)
  }

  createAttributeWheelScript() {
    const AttributeWheelScript = document.createElement('script')
    AttributeWheelScript.type = 'module'
    AttributeWheelScript.src = './AttributeWheel/AttributeWheel.mjs'
    return AttributeWheelScript
  }

  deselectSkillTreeNodes(e) {
    if (e.target.id.length > 1) {
      e.target.children[0].toggleAttribute('reset', true)
    }
  }

  changeAttribute(e) {
    this.setAttribute('type', e.detail.type)
    document.getElementById('skill-tree-container').children[0].remove()
    this.createSkillTree()
  }

  getAttributes(attribute) {
    let count = 0
    for (let item in this.classPoints[attribute]) {
      if (this.classPoints[attribute][item]) {
        ++count
      }
    }
    return count
  }

  printAttributes() {
    const details = document.getElementById('node-details').children
    details[0].innerHTML = `Strength: ${this.getAttributes('Strength')}`
    details[1].innerHTML = `Intelligence: ${this.getAttributes('Intelligence')}`
    details[2].innerHTML = `Dexterity: ${this.getAttributes('Dexterity')}`
    
  }
}

customElements.define('main-page', mainPage);