<template>
  <div class="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div
          class="modal-container"
          @keydown.27="cancel()"
          @keydown.enter="save()"
        >
          <a
            class="inline close-button"
            href="javascript:void(0);"
            @click="cancel()"
            ><i class="fas fa-times"
          /></a>
          <a class="close-button" href="javascript:;" @click="openHelp()"
            ><i class="fas fa-question-circle"></i
          ></a>
           
          <div class="modal-header">
            <h1 name="header" class="modalHeader">Choose your Eye tracking mode</h1>
            
            

            <input
              name="eyeTrackingMode"    
              value="WebGazer"
              v-model="test"
              @click="showSettings()"
              type="radio"
              id="enableEyetracking"
            />
            <label class="RadioSelection" 
              >WebGazer offline Version</label
            ><br />
            

            <input
              
              v-model="test"
              type="radio"
              id="gazeCloud"
              name="eyeTrackingMode"
              value="Gaze cloudbased"
            />
            <label class="RadioSelection" 
              >Gaze Cloud online Version</label
            ><br />
            <label class="inline" for="enableEyetracking" data-i18n></label>
            <label class="inline" for="enableGazeCloud" data-i18n></label>

            <br />
            <!-- <span> status = {{ test }} </span> -->

             
          <div v-if="show" class="row">
            <h1 name="header" class="modalHeader">Select your clicking settings</h1>
            <br>
            <button @click="showPopUp = true" class="buttonPopUp">Enter Intervall(ms)</button><br>
             <label class="three columns" for="intervall">Intervalls(ms)</label>
             <input  min="0" step="500" class="six columns" type="number" placeholder="multiply of 500" v-model="intervall">
              <transition name="fade" appear>
              <div class="modal-overlay-PopUp" v-if="showPopUp" @click="showPopUp = false"></div>
              </transition>
                <transition name="slide" appear>
                  <div class="popUp" v-if="showPopUp">
                    <h1>Heading of the pop Up</h1>
                    <p>text of the description of the settings for the clicking algorithm</p>
                    <button class="buttonPopUp" @click="showPopUp = false">Close</button>
                  </div>
               </transition>        
              <br>                      
            
            <br>        
            <button @click="showPopUp = true" class="buttonPopUp">Enter total counts</button> <br>
            <label class="three columns" for="counterSteps">Total counts</label>
            <input min="0" step="5" placeholder="multiply of 5" class="six columns" type="number" v-model="counterSum">
            <transition name="fade" appear>
              <div class="modal-overlay-PopUp" v-if="showPopUp" @click="showPopUp = false"></div>
            </transition>
            <transition name="slide" appear>
              <div class="popUp" v-if="showPopUp">
                <h1>Total sum of counts to click</h1>
                <p>Here you need to select the number of counts to be on the item that the selected grid item is clicked</p>
                <button class="buttonPopUp" @click="showPopUp = false">Close</button>
                   </div>
               </transition>  <br>
            
            <br>
            <button @click="showPopUp = true" class="buttonPopUp">Enter duration(ms)</button><br>
            <label class="three columns" for="timeDuration">Duration(ms)</label>
            <input min="0" step="500" placeholder="multiply of 500" class="six columns" type="number" v-model="duration">
            <transition name="fade" appear>
              <div class="modal-overlay-PopUp" v-if="showPopUp" @click="showPopUp = false"></div>
            </transition>
            <transition name="slide" appear>
              <div class="popUp" v-if="showPopUp">
                <h1>Duration on the grid element</h1>
                <p>it depends how long the user should be on the grid element before it is finally clicked</p>
                <button class="buttonPopUp" @click="showPopUp = false">Close</button>
                   </div>
               </transition>  
            
            <br><br>
           
            
          </div>
            <!-- <input type="submit" value="Enable Eyetracking // Augensteuerung aktivieren"> -->

            <!-- <PlottingCanvas />
                            <CalibrationPoints :x="x" :y="y" /> -->

            <!-- <CalibrationPoint @click="getID" :id="id" />  -->
            <!-- List  :listdata="items"-->
            <!--</div> -->
          </div>

          <div class="modal-footer">
            <div class="button-container row">
              <button @click="delete1()" class="four columns offset-by-four">
                <i class="fas fa-times" />
                <span data-i18n>Cancel // Abbrechen</span>
              </button>
              <button
                @click="$store.state.activateWebGazer = true"
                class="four columns"
              >
                <i class="fas fa-check" /> <span>OK</span>
              </button>
              <!-- <WebGazer v-if="$store.state.activateWebGazer" @update="onUpdate" :off="false" /> -->
              <!-- <div v-if="webGazerOn==false"><WebGazer @update="onUpdate" :off="false" /></div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import webgazer from "webgazer";
import { dataService } from "../../../js/service/data/dataService";
import { helpService } from "../../../js/service/helpService";
import { i18nService } from "../../../js/service/i18nService";
import Accordion from "../../components/accordion.vue";
import InputEventList from "../../components/inputEventList.vue";
import TestArea from "./testArea.vue";
import "./../../../css/modal.css";
import { InputConfig } from "../../../js/model/InputConfig";
import { Scanner } from "../../../js/input/scanning";
import { inputEventHandler } from "../../../js/input/inputEventHandler";

import WebGazer from "../../eyetracker/WebGazer.vue";
import GazeCloud from "../../components/GazeCloud.vue";
import webgazer from "webgazer";
//import PlottingCanvas from "../../eyetracker/PlottingCanvas.vue"
//import CalibrationPoints from "../../eyetracker/CalibrationPoints.vue"
import store from "../../../store/store.js";

export default {
  // name: 'eyetracker-input-modal',
  props: [],
  components: { WebGazer, Accordion, InputEventList, TestArea, GazeCloud },
  data: function () {
    return {
      docs: null,
      updateTime: null,
      x: null,
      y: null,
      intervall: null,
      counterSum: null,
      duration: null,
      show: false,
      inputConfig: true,
      touchScanning: null,
      metadata: null,
      InputConfig: InputConfig,
      error: "",
      errorInputs: [],
      scanner: null,
      testOpen: false,
      selectedTestElement: null,
      test: "",
      webGazerOn: true,
      showPopUp: false,
    };
  },
  watch: {
    inputConfig: {
      handler: function (newConfig) {
        if (this.testOpen) {
          this.initTest(newConfig);
        }
      },
      deep: true,
    },
  },
  methods: {
    showSettings() {
console.log("test");
this.show = true;
    },
    // async testGazerOn(){
    //  let dataArr = []
    // if (window && this.webGazerOn && this.test == "WebGazer") {
    //   const thiz = this;
    //   window.applyCalmanFilter = true;
    //   window.saveDataAccrossSessions = true; // remembers the calibration points for the next session
    //   webgazer.params.showVideoPreview = true; // set to false than the video will not be opened
    //   await webgazer
    //     .setRegression("ridge")
    //     .setGazeListener(function(data, time) {  // it is an given event - where a callback function is called : here the data will be übergeben - where the user looks x/y values
    //       if (data) {
    //         thiz.x = data.x;
    //         thiz.y = data.y;
    //          let dataCoord = {
    //             x: data.x,
    //             y: data.y
    //         }
    //         dataArr.push(dataCoord)
    //         //console.log('This Array');
    //        // console.log(dataArr)
    //        //thiz.$emit("update", { x: data.x, y: data.y });  //update event

    //       }
    //     })
    //     .begin();
    //   webgazer.showPredictionPoints(true);
    //   this.onUpdate({ x: this.x, y: this.y })
    //   this.webGazerOn = false;
    // } else {
    //     this.webgazer.resume();
    // }
    // },
    onUpdate(coord) {
      this.x = coord.x;
      this.y = coord.y;
      var doc = document.elementFromPoint(this.x, this.y);
      if (doc == null) {
        // if click = null  - no element to click
        this.docs = null;
        return;
      }
      if (doc == !null) {
        var time = Date.now();
        if (time - this.updateTime > 100) {
          console.log("click");
          doc.click();
        }
      } else {
        this.docs = document.elementFromPoint(this.x, this.y);
        this.updateTime = Date.now(); // gives the time in ms from 1970 ongoing
      }
      // console.log("update", coord, this.docs);
    },
     beforeDestroy() {
    webgazer.end();
  },
    delete1() {
      webgazer.end();
      webgazer.showPredictionPoints(false);
      // webgazer.params.showVideoPreview = false;
      this.$emit("close");
    },
    cancel() {
      this.$emit("close");
      
    },
    startCalibration() {
      alert(
        "Please click 10 times on the red button when the camera has started"
      );
    },
    save() {
      if (!this.validateInputs()) {
        return;
      }
      this.metadata.inputConfig = this.inputConfig;
      dataService.saveMetadata(this.metadata).then(() => {
        this.$emit("close");
      });
    },
    openHelp() {
      helpService.openHelp();
    },
    validateInputs() {
      this.errorInputs = [];
      this.error = "";

      if (this.inputConfig.eyetrackingEnabled) {
        return true;
      }
      // if (this.inputConfig.eyetrackingEnabled.filter(input => input.label === InputConfig.SELECT).length === 0) {
      //     this.errorInputs.push(InputConfig.SELECT);
      // }
      // if (this.inputConfig.eyetrackingEnabled.filter(input => input.label === InputConfig.NEXT).length === 0 && !this.inputConfig.scanAuto) {
      //     this.errorInputs.push(InputConfig.NEXT);
      // }

      // if (this.errorInputs.length > 0) {
      //     this.error = i18nService.translate('Please specify input modalities // Bitte Eingabemodalitäten definieren');
      //     return false;
      // }
      // return true;
    },
    inputChanged() {
      if (this.error) {
        this.validateInputs();
      }
    },
    resetInput() {
      this.$set(
        this.inputConfig,
        "eyetrackingInputs",
        JSON.parse(JSON.stringify(InputConfig.DEFAULT_SCAN_INPUTS))
      );
      this.inputChanged();
    },
 
    initTest() {
      setTimeout(() => {
        this.stopTest();
        if (this.inputConfig.scanEnabled) {
          this.scanner = Scanner.getInstanceFromConfig(
            this.inputConfig,
            ".area-element-inner",
            "active",
            "inactive"
          );
          this.scanner.setSelectionListener((element) => {
            this.selectedTestElement = element;
          });
          this.scanner.startScanning();
        }
      }, 100);
    },
    stopTest() {
      if (this.scanner) {
        this.scanner.destroy();
      }
    },
  },
  mounted() {
    let thiz = this;
    inputEventHandler.pauseAll();
    dataService.getMetadata().then((metadata) => {
      thiz.metadata = JSON.parse(JSON.stringify(metadata));
      thiz.inputConfig = JSON.parse(JSON.stringify(metadata.inputConfig));
      thiz.touchScanning = !thiz.inputConfig.mouseclickEnabled;
    });
    helpService.setHelpLocation("04_input_options", "#scanning");
  },
  updated() {
    i18nService.initDomI18n();
  },
  beforeDestroy() {
    helpService.revertToLastLocation();
    this.stopTest();
    inputEventHandler.resumeAll();
  },
};
</script>

<style scoped>
.warn {
  margin-top: 2em;
}

.slidergroup input {
  width: 50%;
}

.radioSelection {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
}

.modalHeader {
  color:rgb(255, 168, 127);
  text-align: center;
}

.buttonPopUp {
  appearance: none;
  border: none;
  outline: none;
  background: none;
  cursor: pointer;
  display: inline-block;
  padding: 15px 25px;
  background-image: linear-gradient(to right, #CC2E5E, #FF5858);
  color: #FFF;
  font-size: 18px;
  font-weight: 700;
  box-shadow: 2px 3px rgba(0, 0, 0, 0.4);
  transition: 0.4s ease-out;
}
  .buttonPopUp:hover{
      box-shadow: 6px 6px rgba(0, 0, 0, 0.6);
  }

.modal-overlay-PopUp{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 98;
  background-color: rgba(0, 0, 0, 0.2);
}

div.popUp {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
  width: 100%;
  max-width: 400px;
  background-color: #FFF;
  border-radius: 16px;
  padding: 25px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  transition: opacity 0; 
}

</style>