//keycode definitions

// define the template of the web component
const template = document.createElement('template')
template.innerHTML = `
  <style>

  @keyframes border-pulse{
    from{
      border:4px solid #50fbf3;
    }
    to{
      border:4px solid #04AFA6;
    }
  }

  .menu-icon__container{
    position:relative;
    width:100%;
    margin-bottom: 1.5em;
  }

  .menu-icon__image{
    display:block;
    width:calc(100% - (2px + 2px));
    
    border-radius: 100%;
    border: 4px solid #E8E8E8;
  }

  .menu-icon__label{

    display:none;
    position:absolute;
    white-space:normal;

    width:100%;
    color:#05DED2;
    font-weight:normal;
    font-size: 1.1em;
    text-align:center;
  }

  /* focused style */
  .menu-icon__container.focused .menu-icon__label{
    display:initial;
  }

  .menu-icon__container.focused .menu-icon__image{

    border: 4px solid #05DED2;
    
    animation-name: border-pulse;
    animation-direction: alternate;
    animation-duration: 0.5s;
    animation-iteration-count: infinite;

  }

  </style>

  <div class="menu-icon__container">
  <img class="menu-icon__image"/>
  <label class="menu-icon__label"> </label>
  </div>
`

export default class MenuIcon extends HTMLElement{
  constructor(){
    super()

    this.addEventListener('focus', this.handleOnFocus.bind(this))
    this.addEventListener('blur', this.handleOnBlur.bind(this))
  }

  render({label, imageSrc}){
    this.setAttribute('aria-label', label);
    this.shadowRoot.querySelector('.menu-icon__label').innerHTML = label;
    this.shadowRoot.querySelector('.menu-icon__image').src = imageSrc;
  }

  connectedCallback(){
    
    let shadowRoot = this.attachShadow({mode:'open'})

    // get the template and clone it
    let instance = template.content.cloneNode(true)

    shadowRoot.appendChild(instance);

    // Extract the attributes from our element
    let label  = this.getAttribute('icon-label');
    let imageSrc = this.getAttribute('icon-image');

    this.render({label, imageSrc})
  }

  handleOnFocus(){
    let menuIconContainer = this.shadowRoot.querySelector('.menu-icon__container');
    menuIconContainer.classList.add("focused")
  }

  handleOnBlur(){
    let menuIconContainer = this.shadowRoot.querySelector('.menu-icon__container');
    menuIconContainer.classList.remove("focused")
  }
}