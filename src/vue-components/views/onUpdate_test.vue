onUpdate(coord)
{
    this.x = coord.x;
    this.y = coord.y;
    const timestamp = Date.now();
    const focusedElement = document.elementFromPoint(this.x, this.y);

    let container = document.getElementById("grid-container");
    let list = container.children[0];
    let lists = list.children;
    let listArray = Array.from(lists);
    let containItems = listArray.filter((e) => e.classList.contains("item"));

    if (focusedElement == null || !containItems.includes(focusedElement)) {
        return;
    }
    if (this.focusedElementPrevious != focusedElement {
         this.focusedElements.forEach((el) => {
             if(timestamp - el.timestamp > 6000){
                el.counter = 0;
                el.ref.classList.remove()
             }else if(timestamp - el.timestamp > 500 && el.counter >= 1){
                 el.counter--;
             }
         });
        /*if (this.focusedElementPrevious !== null && timestamp - this.focusedElementPrevious.timestamp > 6000) {
            this.focusedElementPrevious.counter = 0;
            
            this.focusedElementPrevious = focusedElement;
        } else if (this.focusedElementPrevious !== null && timestamp - this.focusedElementPrevious.timestamp > 500) {
            if (this.focusedElementPrevious.counter >= 1)
                this.focusedElementPrevious.counter--;
        } else {
            focusedElement.timestamp = timestamp;
            focusedElement.counter = 0;
            this.focusedElementPrevious = focusedElement;
             //new
             this.focusedElements.push({
                ref: focusedElement,
                counter: 0,
                timestamp,
            });
        }*/
    } else {
        const elementExists = typeof this.focusedElements.find(({ref}) => ref === focusedElement) !== "undefined";
        if (!elementExists) {
            this.focusedElements.push({
                ref: focusedElement,
                counter: 0,
                timestamp,
            });
        } else {
            const element = this.focusedElements.find(
                ({ref}) => ref === focusedElement
            );
            if (timestamp - element.timestamp > 10) {
                element.timestamp = timestamp;
                element.counter++;
                element.ref.classList.add(`click-duration-${element.counter}`);
                element.ref.focus();
                if (element.counter > 2) {
                    element.ref.click();
                    this.focusedElements.forEach((el) => {
                       // el.counter = 0;
                        el.ref.classList.remove(); //remove the css classlists on the focused elements
                    });
                    this.focusedElements = [];

                }
            }
        }
    }
}
,