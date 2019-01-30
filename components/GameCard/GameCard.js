var currentDocument = document.currentScript.ownerDocument;

class GameCard extends HTMLElement {
  constructor(){
    super()

    this.addEventListener('click', e =>{
      this.toggleCard()
    })
  }

  render({name, imageSrc}){
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


  toggleCard(){
    console.log("Element was clicked!")
  }

}

customElements.define('game-card', GameCard)