var currentDocument = document.currentScript.ownerDocument;

const KB_CODES = {
  "VK_ENTER": 13,
  "VK_SPACE": 32,
  "VK_LEFT": 37,
  "VK_UP": 38,
  "VK_RIGHT": 39,
  "VK_DOWN": 40
}

class ListBox extends HTMLElement{
  
  constructor(){
    super()
  }

  slice(nodeList){
    return Array.prototype.slice.call(nodeList)
  }

  connectedCallback(){
    this.setAttribute('tabindex',0);

    this.items = this.slice(this.children);
    this.focusedIdx = 0; // default focused element
    this.focusedItem= this.items[this.focusedIdx] // set ref to focused item

    this.addEventListener('keydown', this.handleKeyDown.bind(this))
    // click event listener?
  }

  handleKeyDown(event){
    // ! TODO - this is not picking up focusedIdx or focusedItem
    
    console.log("focus key press")
    
    switch(event.keyCode){
      case KB_CODES["VK_UP"]:
      case KB_CODES["VK_LEFT"]:
        event.preventDefault();
        if(this.focusedIdx < this.items.length-1){
          this.focusedIdx ++
        }else{
          this.focusedIdx = 0
        }

      break;
      
      case KB_CODES["VK_DOWN"]:
      case KB_CODES["VK_RIGHT"]:
        event.preventDefault();
        if(this.focusedIdx > 0){
          this.focusedIdx --;
        }else{
          this.focusedIdx = this.items.length-1;
        }
      break;
    }

    this.changeFocus(this.focusedIdx)
  }

  changeFocus(idx){
    this.focusedItem.tabIndex = -1; // old item unfocused
    this.focusedItem.removeAttribute('checked'); // remove checked attribute

    // focus on the new element
    this.focusedItem = this.items[idx];
    this.focusedItem.tabIndex = 0;
    this.focusedItem.focus();
    this.focusedItem.setAttribute('checked','checked')
  }

}

customElements.define('list-box', ListBox)