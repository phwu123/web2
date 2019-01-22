const mainTemplate = `
<link rel="stylesheet" type="text/css" media="screen" href="./Main/Main.css" />
<div id="center" class="container">
  <div id="symbol-large" class="category-box"></div>
  <div id="skill-tree-container" class="category-box">
  </div>
  <div id="node-details" class="category-box"></div>
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
    const skillTree = document.createElement('skill-tree')
    document.getElementById('skill-tree-container').appendChild(skillTree)
    document.getElementById('skill-tree-container').addEventListener('click', this.deselectSkillTreeNodes)
    this.addEventListener('updateClasses', this.handleClasses)
  }

  disconnectedCallback() {
    document.getElementById('skill-tree-container').removeEventListener('click', this.deselectSkillTreeNodes)
    this.removeEventListener('updateClasses', this.handleClasses)
  }

  attributeChangedCallback(name, oldVal, newVal) {
    switch (name) {
      case 'type':
        setTimeout(() => {
          document.getElementById('skill-tree-container').children[0].setAttribute('type', newVal)
        }, 0);
        break;
      default:
        break;
    }
  }

  handleClasses(e) {
    this.classPoints[e.detail.type] = e.detail.classes
    this.classPointsRemaining = this.calculateClassPointsRemaining()
    document.getElementById('points-remaining').innerHTML = `Points Remaining: ${this.classPointsRemaining}`
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

  deselectSkillTreeNodes(e) {
    if (e.target.id.length > 1) {
      e.target.children[0].toggleAttribute('reset', true)
    }
  }
}

customElements.define('main-page', mainPage);