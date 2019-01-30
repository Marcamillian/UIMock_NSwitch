var currentDocument = document.currentScript.ownerDocument;

class MenuIcon extends HTMLElement{
  constructor(){
    super()
  }

  render({label, imageSrc}){
    this.shadowRoot.querySelector('.menu-icon__label').innerHTML = label;
    this.shadowRoot.querySelector('.menu-icon__image').src = imageSrc;
  }

  connectedCallback(){
    
    let shadowRoot = this.attachShadow({mode:'open'})

    // get the template and clone it
    let template = currentDocument.querySelector('#menu-icon-template');
    let instance = template.content.cloneNode(true)

    shadowRoot.appendChild(instance);

    // Extract the attributes from our element
    let label  = this.getAttribute('icon-label');
    let imageSrc = this.getAttribute('icon-image');

    this.render({label, imageSrc})
  }
}

customElements.define('menu-icon', MenuIcon)