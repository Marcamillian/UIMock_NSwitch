var currentDocument = document.currentScript.ownerDocument;

class GameCard extends HTMLElement {
  constructor(){
    super()

    this.addEventListener('focus', this.handleOnFocus.bind(this))
    this.addEventListener('blur', this.handleOnBlur.bind(this))
  }

  render({name, imageSrc}){
    this.setAttribute('aria-label', name)
    this.shadowRoot.querySelector('.game-card__name').innerHTML = name;
    this.shadowRoot.querySelector('.game-card__image').src = imageSrc;
  }

  connectedCallback(){
    let shadowRoot = this.attachShadow({mode:'open'})

    // get the template and clone it
    let template = currentDocument.querySelector('#game-card-template');
    let instance = template.content.cloneNode(true);

    shadowRoot.appendChild(instance);

    // Extract the attributes from our element
    let gameName = this.getAttribute('game-name')
    let gameImageSrc = this.getAttribute('game-image')

    this.render({name:gameName, imageSrc:gameImageSrc})
  }

  handleOnFocus(){
    let gameCardContainer = this.shadowRoot.querySelector('.game-card__container');
    gameCardContainer.classList.add("focused")

  }
  handleOnBlur(){
    let gameCardContainer = this.shadowRoot.querySelector('.game-card__container');
    gameCardContainer.classList.remove("focused")

  }

}

customElements.define('game-card', GameCard)