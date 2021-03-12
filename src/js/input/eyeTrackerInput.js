import {L} from "../util/lquery.js";
import {inputEventHandler} from "./inputEventHandler";
import {InputEventKey} from "../model/InputEventKey";
import {InputConfig} from "../model/InputConfig";
//import WebGazer from "../../vue-components/eyetracker/WebGazer.vue"
import webgazer from "webgazer";

let EyeTracker = {

};
//Aufruf vom Eyetracker - die inputConfig Werte werden übergeben u Position muss richtig sein
EyeTracker.getInstanceFromConfig = function(inputConfig){
    return new EyeTrackerConstructor(inputConfig.eyetrackingClicks, inputConfig.eyetrackingIntervall, inputConfig.eyetrackingDuration);
}
// Übergabe muss nach diesem Schema laufen - zuerst counter, dann intervall, dann duration
function EyeTrackerConstructor(counter,intervall, duration) {
  //var webgazerIstance = webgazer;
   this.x =null;
   this.y =null;
   this.focusedElements = [];
   this.counter = Number(counter);
   this.duration = Number(duration);
   this.intervall = Number(intervall);
   //console.log(this.counter);
   console.log("at the constructor level", this.duration);

    this.getWebGazer= function (){
      return webgazer;
  }

  this.stop = function(){
      webgazer.showPredictionPoints(false);
      webgazer.showVideo(false) ;
      webgazer.params.showVideoPreview = false; // set to false than the video will not be opened
      webgazer.end();
      //location.reload();

  }

  this.onUpdate = function (coord){
        console.log("coming from eyeTrackerInput.js");
       console.log(this.intervall, this.duration, this.clicks); //originally worked!! 
       //console.log(this.counter);
      this.x = coord.x;
      this.y = coord.y;
      const timestamp = Date.now();
      const focusedElement = document.elementFromPoint(this.x, this.y);
      let container = document.getElementById("grid-container");
      let list = container.children[0];
      let lists = list.children;
      let listArray = Array.from(lists);
      let containItems = listArray.filter((e) => e.classList.contains("item"));
      //elements not found or does not contain item within the grid-element
      if (focusedElement == null || !containItems.includes(focusedElement)) {
          return;
      }
      //evaluate the time to reduce or delete counter
      this.focusedElements.forEach((el) => {
          if(timestamp - el.timestamp > this.duration){
              for(let i=1;i<=el.counter;i++){
                  el.ref.classList.remove(`click-duration-`+i)
              }
              el.counter = 0;
          }else if(timestamp - el.timestamp > this.intervall && el.counter >= 1){
              el.ref.classList.remove(`click-duration-${el.counter}`)
              el.counter--;
          }
      });

      // the new element should be evaluated if it is a new focusedElement or already within the array
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
          if (timestamp - element.timestamp > 100) {
              element.timestamp = timestamp;
              element.counter++;
              element.ref.classList.add(`click-duration-${element.counter}`);
              element.ref.focus();
              if (element.counter > this.counter) {
                  element.ref.click();
                  console.log("Clicked", element.ref);
                  this.focusedElements.forEach((el) => {
                      for(let i=1;i<=el.counter;i++){
                          el.ref.classList.remove(`click-duration-`+i)
                      }
                  });
                  this.focusedElements = [];
              }
          }
      }
  };

  this.start = function(){
      webgazer.begin();
  }
}
export {EyeTracker};