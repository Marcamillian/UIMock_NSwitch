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
    
    this.scrollContainer = this.shadowRoot.querySelector('.scroll-container')
    this.focusedIdx = 0; // default focused element
    this.focusedItem= this.items[this.focusedIdx] // set ref to focused item
    this.scrollVars = {
      leftStart:0,
      clientXStart:0
    }


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
      event.preventDefault()

      // define some kind of start point 
      this.scrollVars.leftStart = this.scrollContainer.scrollLeft
      this.scrollVars.clientXStart = event.clientX;
      //
      
    }
  }

  handleClickEnd(event){
    this.scrollAdjust()

    if (this.items.includes(event.target)){
      event.preventDefault()

      // only select if there hasn't been a scroll
      let scrollDistance = this.scrollVars.clientXStart - event.clientX;
      if(Math.abs(scrollDistance) < 20){
        let clickedItemIndex = this.items.indexOf(event.target);
        this.changeFocus(clickedItemIndex)
      }
    }
  }

  handleMouseMove(event){
    
    // if left click pressed
    if(event.buttons == 1){
      event.preventDefault()

      // scroll some 
      let scrollDistance = this.scrollVars.clientXStart - event.clientX;
      let totalScroll = this.scrollVars.leftStart + scrollDistance;
      this.scrollContainer.scrollTo(totalScroll,0);

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

  scrollAdjust(){
    // get scroll position
    let scrollPosition = this.scrollContainer.scrollLeft;
    var itemBoundaries = [0]

    // track a length across the scroll
    this.items.forEach(( item, index )=>{
      // cumulative distance of right edge of the item from container left
      let newBound = (itemBoundaries[index] || 0) + item.clientWidth;
      itemBoundaries.push( newBound )
    })

    for (var i=0; i < itemBoundaries.length; i++){
      let lowerBound = itemBoundaries[i];
      let upperBound = itemBoundaries[i+1];

      if( scrollPosition >= lowerBound && scrollPosition < upperBound ){
        
        if(i == 0){ // in first item
      
          //this.items[0].scrollIntoView()
          this.scrollContainer.scrollTo(0, 0)

        }else if( itemBoundaries[i+1] == undefined){ // last item

          this.scrollContainer.scrollTo(this.scrollContainer.clientWidth, 0)

        }else{ // if in the middle

          let scrollPosition = lowerBound + (upperBound - lowerBound)/2
          this.scrollContainer.scrollTo( scrollPosition , 0  )
        }
        
      }
    }
  }

}

customElements.define('list-box', ListBox)