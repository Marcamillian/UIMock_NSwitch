const currentDocument = document.currentScript.ownerDocument;

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

    console.log("something")

    const shadowRoot = this.attachShadow({mode:'open'})

    // get the template and clone it
    const template = currentDocument.querySelector('#game-card-template');
    const instance = template.content.cloneNode(true);

    shadowRoot.appendChild(instance);

    // Extract the attributes from our element
    const gameName = this.getAttribute('game-name')
    const gameImageSrc = this.getAttribute('game-image')

    this.render({name:gameName, imageSrc:gameImageSrc})
  }


  toggleCard(){
    console.log("Element was clicked!")
  }

}

customElements.define('game-card', GameCard)