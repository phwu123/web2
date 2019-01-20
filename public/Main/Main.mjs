const main = document.createElement('main');
main.innerHTML = `
<link rel="stylesheet" type="text/css" media="screen" href="./Main/Main.css" />
<div id="main-page">

<div id="center" class="container">
  <div id="symbol-large" class="category-box"></div>
  <div id="skill-tree-container" class="category-box">
  </div>
  <div id="node-details" class="category-box"></div>
</div>

</div>
`;

class mainPage extends HTMLElement {
  static get observedAttributes() {
    return ['type'];
  }
  constructor() {
    super();
    this.appendChild(main.cloneNode(true));
    this.eventListeners = [];
    this.skillPoints = {
      strength: [],
      intelligence: [],
      dexterity: []
    }
    this.MAX_SKILL_POINTS = 5;
  }

  connectedCallback() {
    this.appendChild(this.createSkillTreeScript())
    const skillTree = document.createElement('skill-tree')
    document.getElementById('skill-tree-container').appendChild(skillTree)
    document.getElementById('skill-tree-container').addEventListener('click', this.deselectSkillTreeNodes)
  }

  disconnectedCallback() {
    document.getElementById('skill-tree-container').removeEventListener('click', this.deselectSkillTreeNodes)
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