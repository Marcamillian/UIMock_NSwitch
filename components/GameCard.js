// using structure from - https://developers.google.com/web/fundamentals/web-components/examples/howto-checkbox 



// keycode definitions

// define the template of the web component
const template = document.createElement('template');
template.innerHTML = `
  <style>
    @keyframes border-pulse{
      from{
        outline:4px solid #50fbf3;
      }
      to{
        outline:4px solid #04AFA6;
      }
    }

    /* unfocused styling */
    .game-card__container{
      position:relative;
      margin-top: 2.3em;
    }
    
    .game-card__name{
      display:none;
      white-space: normal;

      position:absolute;
      width:100%;

      margin:0px;
      top:-1.5em;

      color:#05DED2;
      font-size: 1.3em;
      font-weight:normal;
      text-align:center;
    }
    
    .game-card__image{
      width: calc(100% - 16px);
      margin: 7px;
    }

    /* focus styling */

    .game-card__container.focused .game-card__name{
      display:initial;
    }

    .game-card__container.focused .game-card__image{
      margin: 4px;
      border:3px solid white;
      outline: 4px solid #05DED2;

      animation-name: border-pulse;
      animation-direction:alternate;
      animation-duration: 0.5s;
      animation-iteration-count:infinite;
    }

  </style>


  <div class="game-card__container">
    <h2 class="game-card__name"></h2>
    <img class="game-card__image"/>
  </div>
`;

export default class GameCard extends HTMLElement {
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

    // clone the template into the shadowroot
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
