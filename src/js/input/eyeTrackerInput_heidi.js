import {L} from "../util/lquery.js";
import {inputEventHandler} from "./inputEventHandler";
import {InputEventKey} from "../model/InputEventKey";
import {InputConfig} from "../model/InputConfig";
//import WebGazer from "../../vue-components/eyetracker/WebGazer.vue"
import webgazer from "webgazer"; 


//Initializing the Eyetracker class
let EyeTracker = {};

//Aufruf vom Eyetracker - die inputConfig Werte werden übergeben u Position muss richtig sein/params
EyeTracker.getInstanceFromConfig = function(inputConfig){
    return new EyeTrackerConstructor(inputConfig.eyetrackingClicks, inputConfig.eyetrackingIntervall, inputConfig.eyetrackingDuration);
}
// Übergabe muss nach diesem Schema laufen - zuerst counter, dann intervall, dann duration
function EyeTrackerConstructor(counter,intervall, duration) {
  //var webgazerInstance = webgazer;
   this.x =null;
   this.y =null;
   this.focusedElements = [];
   this.counter = Number(counter);
   this.intervall = Number(intervall);
   this.duration = Number(duration);
  
   
   
   //console.log(this.counter);
   console.log("at the constructor level", this.duration);

    //set variable to initialize webgazer
    this.getWebGazer= function (){
      return webgazer;
  }

  this.stop = function(){
      this.focusedElements = []; 
      webgazer.showPredictionPoints(false);
      webgazer.showFaceOverlay(false);
      //webgazer.showVideo(false) ;
      webgazer.params.showVideoPreview = false; // set to false than the video will not be opened
      webgazer.end();
      //webgazer.resume(true);
      webgazer.stopVideo(true);
      //videoStream.getTracks()[0].stop();
      //webgazer.setCameraConstraints(false);
        
      location.reload();

  }

  this.onUpdate = function (coord){
      //console.log("coming from eyeTrackerInput.js");
      //console.log(this.intervall, this.duration, this.counter); //originally worked!! 
      //console.log(`${coord.x}-${coord.y}`);
      this.x = coord.x;
      this.y = coord.y;
      const timestamp = Date.now();
      let focusedElement = document.elementFromPoint(this.x, this.y);
      if(focusedElement !== null){
        focusedElement = focusedElement.closest(".item");
        /*if(focusedElement !== null){
            console.log(focusedElement.querySelector('.text-container').innerHTML);
        }*/
      }
      if (focusedElement == null) {
          return;
      }

      //mock selection start------------------------------------
      /*let container = document.getElementById("grid-container");
      let list = container.children[0];
      let lists = list.children;
      let listArray = Array.from(lists);
      focusedElement = listArray[10]*/
      //mock selection end----------------------------------------

      //evaluate the time to reduce or delete counter
      this.focusedElements.forEach((el) => {
          if(timestamp - el.timestamp > this.duration){
              for(let i=1;i<=el.counter;i++){
                  el.ref.classList.remove(`click-duration-`+i)
              }
              el.counter = 0;
          }else if(timestamp - el.timestamp > this.intervall && el.counter >= 1 && focusedElement != el.ref){
              el.ref.classList.remove(`click-duration-${el.counter}`)
              el.counter--;
          }
      });

      // the new element should be evaluated if it is a new focusedElement or already within the array
      //const jj = typeof this.focusedElements.find(({ref}) => ref === focusedElement);
      const elementExists = typeof this.focusedElements.find(({ref}) => ref === focusedElement) !== "undefined";
      if (!elementExists) {
          focusedElement.classList.add(`click-duration-1`);
          this.focusedElements.push({
              ref: focusedElement,
              counter: 1,
              timestamp,
          });
      } else {
          // find if the new element is already within focusedElements
          const element = this.focusedElements.find(
              ({ref}) => ref === focusedElement
          );        
              element.timestamp = timestamp;
              element.counter++;
              //console.log(element.ref.querySelector('.text-container').innerHTML +element.counter);
              element.ref.classList.add(`click-duration-${element.counter}`);
              element.ref.focus();
              if (element.counter > this.counter) {
                  element.ref.firstElementChild.click(); //div has to be clicked
                  console.log("Clicked", element.ref);
                  this.focusedElements.forEach((el) => {
                      for(let i=1;i<=el.counter;i++){
                          el.ref.classList.remove(`click-duration-`+i)
                      }
                      el.counter = 0;
                  });
                  this.focusedElements = [];
              }
      }
  };

  this.start = function(){
      webgazer.begin();
      
  }

}

export {EyeTracker};
