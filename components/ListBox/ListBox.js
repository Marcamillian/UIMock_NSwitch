var currentDocument = document.currentScript.ownerDocument;

const KB_CODES = {
  "VK_ENTER": 13,
  "VK_SPACE": 32,
  "VK_LEFT": 37,
  "VK_UP": 38,
  "VK_RIGHT": 39,
  "VK_DOWN": 40,
  "VK_SHIFT":16,
  "VK_TAB":9,
}

class ListBox extends HTMLElement{
  
  constructor(){
    super()
  }

  slice(nodeList){
    return Array.prototype.slice.call(nodeList)
  }
  

  connectedCallback(){
    let listName = this.getAttribute('list-name') || 'Some list';
    let listOrientation = this.getAttribute('list-orientation') || 'vertical';

    // set attributes on the main container
    this.setAttribute('tabindex',0);
    this.setAttribute("role", "listbox");
    this.setAttribute("aria-label", listName);
    this.setAttribute("aria-orientation", listOrientation)

    // deal with the template
    let shadowRoot = this.attachShadow({mode:'open'});
    let template = currentDocument.querySelector('#list-box-template');
    let instance = template.content.cloneNode(true);

    shadowRoot.appendChild(instance);

    // handle the list of options that we have
    this.items = this.slice(this.children);
    this.items.forEach(item =>{
      item.setAttribute("role","option")
      item.addEventListener("focusout", this.blurItem.bind(item))
      item.style.display = "inline-block";
    })
    
    this.focusedIdx = 0; // default focused element
    this.focusedItem= this.items[this.focusedIdx] // set ref to focused item
    this.scrollOffset = 0;


    this.addEventListener('keydown', this.handleKeyDown.bind(this))
    //this.addEventListener('focus', this.handleOnFocus.bind(this))
    this.addEventListener('mousedown', this.handleClickStart.bind(this))
    this.addEventListener('mouseup', this.handleClickEnd.bind(this))
    this.addEventListener('mousemove', this.handleMouseMove.bind(this))
  }

  handleKeyDown(event){

    switch(event.keyCode){
      /*
      case KB_CODES["VK_TAB"]:
        this.focusOutsideList();
      break;
      */
      case KB_CODES["VK_UP"]:
      case KB_CODES["VK_LEFT"]:
        event.preventDefault();
        if(this.focusedIdx > 0){
          this.focusedIdx --
        }else{
          this.focusedIdx = this.items.length-1
        }
        this.changeFocus(this.focusedIdx)
      break;
      case KB_CODES["VK_DOWN"]:
      case KB_CODES["VK_RIGHT"]:
        event.preventDefault();
        if(this.focusedIdx < this.items.length-1){
          this.focusedIdx ++;
        }else{
          this.focusedIdx = 0;
        }
        this.changeFocus(this.focusedIdx)
      break;
    }

  }

  handleOnFocus(event){
    this.changeFocus(this.focusedIdx)
  }

  handleClickStart(event){
    
    if(event.buttons == 1){
      console.log("Click down")
      event.preventDefault()

      // define some kind of start point 

      //
      

    }
  }

  handleClickEnd(event){
    console.log("Click up")
    if (this.items.includes(event.target)){
      event.preventDefault()

      let clickedItemIndex = this.items.indexOf(event.target);
      this.changeFocus(clickedItemIndex)
    }
  }

  handleMouseMove(event){
    if(event.buttons == 1){
      event.preventDefault()
      
      // scroll some 

      //

    }
  }


  changeFocus(idx){
    this.focusedItem.tabIndex = -1; // old item unfocused
    this.focusedItem.removeAttribute('checked'); // remove checked attribute
    this.focusedItem.removeAttribute('aria-selected');

    // focus on the new element
    this.focusedItem = this.items[idx];
    this.focusedItem.tabIndex = 0;
    this.focusedItem.focus();
    this.focusedItem.setAttribute('checked','checked')
    this.focusedItem.setAttribute('aria-selected', true)
  }

  focusOutsideList(){
    this.focusedItem.tabIndex = -1
  }

  blurItem(){
    this.tabIndex = -1
  }

}

customElements.define('list-box', ListBox)