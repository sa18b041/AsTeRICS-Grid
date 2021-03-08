methods: {
      onUpdate(coord) {
      this.x = coord.x;
      this.y = coord.y;
      const timestamp = Date.now();
      const focusedElement = document.elementFromPoint(this.x, this.y);
      // var focusedElement = $(document.elementFromPoint(this.x, this.y));
      //  if (focusedElement == null) {
      //     this.focusedElementPrevious  = null;
      //     return;
      // }
      
      // focusedElement = $(focusedElement.parents(".grid-item-content"));
      //   console.log(focusedElement.parentElement.parentElement);

      let container = document.getElementById("grid-container");
      let list = container.children[0];
      let lists = list.children;
     
      // Array.from(lists)
      let listArray = Array.from(lists);
      let containItems = listArray.filter((e) => e.classList.contains("item"));
      //   console.log('item' , containItems[0]);
      //   console.log(containItems); // here all 9 elements are lsited

      // if (containItems[0] === focusedElement.parentElement.parentElement) {
      //     this.dwellingCounter++;
      //     console.log(this.dwellingCounter);

      // }
      //   containItems[0].addEventListener("mousemove", (e) => {
      //       console.log('#')
      //   });

      if (focusedElement == null || !containItems.includes(focusedElement)) {
      //  this.focusedElementPrevious = null;
        return;
       
      }
      

      if (this.focusedElementPrevious != focusedElement)
       {
        console.log("DEBUG", "Focused element not the same", focusedElement, this.focusedElementPrevious, "containItems", containItems);
         this.focusedElementPrevious = focusedElement;
        
        if (this.focusedElementPrevious !== null && timestamp - this.focusedElementPrevious.timestamp > 6000){
          this.focusedElementPrevious.counter = 0;
        }else if (this.focusedElementPrevious !== null && timestamp - this.focusedElementPrevious.timestamp > 500)
        {
          if(this.focusedElementPrevious.counter >= 1 )
          this.focusedElementPrevious.counter--;
        }else
        {
          focusedElement.timestamp = timestamp;
          focusedElement.counter = 0;
          this.focusedElementPrevious = focusedElement;
        }
    }  else  {
        const elementExists = typeof this.focusedElements.find(({ ref }) => ref === focusedElement) !== "undefined";

// if(this.focusedElements.find(({ref}) => ref === focusedElement))
// {
//   elementExists= true;
// }
// else{
//   elementExists = false;
// }

        // if focused element is within the list of focusedElements - than element exists and =true! otherwise the 
        //element is not defined - the focusedElement was not found then the find method returns undefined!
        console.log("DEBUG", "Focused element the same", elementExists, this.focusedElementPrevious, focusedElement, elementExists)

//        if (elementExists === false) {
        if (!elementExists) {
          this.focusedElements.push({
            ref: focusedElement,
            counter: 0,
            timestamp,
          });
        } else {
          const element = this.focusedElements.find(
            ({ ref }) => ref === focusedElement
          );
        // containItems.forEach(liItem => {
        //     // console.log(liItem.getAttribute('data-label'));
        // if (liItem === element.ref) {
        //     this.dwellingCounter++;
        //    }
        // });

          if (timestamp - element.timestamp > 10) {
            element.timestamp = timestamp;
            element.counter++;

            element.ref.classList.add(`click-duration-${element.counter}`);
            element.ref.focus();

            if (element.counter > 2) {
              // Click
             element.ref.click();
            console.log("click")
             
           
              console.log("DEBUG", "Extension: Click");
              this.focusedElements.forEach((el) => {
               el.counter = 0;
                el.ref.classList.remove(); //remove the css classlists on the focused elements
              });

            }
          }
        }
      }
    },
