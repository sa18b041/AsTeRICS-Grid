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
            <h1 name="header" class="modalHeader">
              Choose your Eye tracking mode
            </h1>
          </div>
          <div class="modal-body" v-if="inputConfig">
            <div class="row">
              <span data-i18n="">Webgazer aktivate</span>
              <a aria-label="Help" href="javascript:;" @click="openHelp()"
                ><i class="fas blue fa-question-circle"></i
              ></a>
            </div>
            <div class="row">
              <div class="twelve columns">
                <input
                  v-focus
                  type="checkbox"
                  id="enableWebgazer"
                  v-model="inputConfig.eyetrackingEnabled"
                />
                <label class="inline" for="enableWebgazer" data-i18n
                  >Enable Webgazer // Webgazer aktivieren</label
                >
                <button
                  id="calibration_button"
                  class="spaced small"
                  type="submit"
                >
                  Try Live Demo
                </button>

                <button
                  type="button"
                  id="start_calibration"
                  class="btn btn-primary"
                  data-dismiss="modal"
                  @click="restart()"
                >
                  Start Calibration
                </button>
              </div>
            </div>

            <div v-show="inputConfig.eyetrackingEnabled">
              <accordion
                acc-label="Input // Eingabe"
                acc-open="true"
                acc-label-type="h2"
                acc-background-color="white"
                class="row"
              >
                <input-event-list
                  v-model="inputConfig.eyetrackingInputs"
                  :input-labels="[InputConfig.SELECT, InputConfig.NEXT]"
                  :error-inputs="errorInputs"
                  @input="inputChanged"
                ></input-event-list>

                <div class="row">
                  <h1 name="header" class="modalHeader">
                    Select your clicking settings
                  </h1>
                  <br />

                  <button @click="showPopUp1 = true" class="buttonPopUp">
                    Enter Intervall(ms)</button
                  ><br />
                  <label class="three columns" for="intervall"></label>
                  <input
                    min="0"
                    step="500"
                    class="six columns"
                    type="number"
                    placeholder="multiply of 500"
                    v-model="inputConfig.eyetrackingIntervall"
                  />
                  <transition name="fade" appear>
                    <div
                      class="modal-overlay-PopUp"
                      v-if="showPopUp1"
                      @click="showPopUp1 = false"
                    ></div>
                  </transition>
                  <transition name="slide" appear>
                    <div class="popUp" v-if="showPopUp1">
                      <h1>
                        Intervall-time by when the counter will be reduced
                      </h1>
                      <p>
                        Enter a certain period of time (in ms) by when the
                        counter needs to be reduced by 1 step
                      </p>
                      <button class="buttonPopUp" @click="showPopUp1 = false">
                        Close
                      </button>
                    </div>
                  </transition>
                  <br />

                  <br />
                  <button @click="showPopUp2 = true" class="buttonPopUp">
                    Enter total counts
                  </button>
                  <br />
                  <label class="three columns" for="counterSteps"></label>
                  <input
                    min="0"
                    step="5"
                    placeholder="multiply of 5"
                    class="six columns"
                    type="number"
                    v-model="inputConfig.eyetrackingClicks"
                  />
                  <transition name="fade" appear>
                    <div
                      class="modal-overlay-PopUp"
                      v-if="showPopUp2"
                      @click="showPopUp2 = false"
                    ></div>
                  </transition>
                  <transition name="slide" appear>
                    <div class="popUp" v-if="showPopUp2">
                      <h1>Total sum of counts to click</h1>
                      <p>
                        Here you need to select the number of counts to be on
                        the item that the selected grid item is clicked
                      </p>
                      <button class="buttonPopUp" @click="showPopUp2 = false">
                        Close
                      </button>
                    </div>
                  </transition>
                  <br />

                  <br />
                  <button @click="showPopUp3 = true" class="buttonPopUp">
                    Enter duration(ms)</button
                  ><br />
                  <label class="three columns" for="timeDuration"></label>
                  <input
                    min="0"
                    step="500"
                    placeholder="ms as a multiply of 500"
                    class="six columns"
                    type="number"
                    v-model="inputConfig.eyetrackingDuration"
                  />
                  <transition name="fade" appear>
                    <div
                      class="modal-overlay-PopUp"
                      v-if="showPopUp3"
                      @click="showPopUp3 = false"
                    ></div>
                  </transition>
                  <transition name="slide" appear>
                    <div class="popUp" v-if="showPopUp3">
                      <h1>Duration on the grid element</h1>
                      <p>
                        it depends how long the user should be on the grid
                        element before it is finally clicked
                      </p>
                      <button class="buttonPopUp" @click="showPopUp3 = false">
                        Close
                      </button>
                    </div>
                  </transition>
                </div>
              </accordion>

              <div class="warn" v-show="error">
                <i class="fas fa-exclamation-triangle"></i> {{ error }}
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <div class="button-container row">
              <button @click="cancel()" class="four columns offset-by-four">
                <i class="fas fa-times" />
                <span data-i18n>Cancel // Abbrechen</span>
              </button>
              <button @click="save()" class="four columns">
                <i class="fas fa-check" /> <span>OK</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dataService } from "../../../js/service/data/dataService";
import { helpService } from "../../../js/service/helpService";
import { i18nService } from "../../../js/service/i18nService";
import Accordion from "../../components/accordion.vue";
import InputEventList from "../../components/inputEventList.vue";
import TestArea from "./testArea.vue";
import "./../../../css/modal.css";
import { InputConfig } from "../../../js/model/InputConfig";
import { inputEventHandler } from "../../../js/input/inputEventHandler";
import { Hover } from "../../../js/input/hovering";
import { Clicker } from "../../../js/input/clicking";
import { Eyetracker } from "../../../js/input/eyeTrackerInput";
import WebGazer from "../../eyetracker/WebGazer.vue";
import GazeCloud from "../../components/GazeCloud.vue";
//import webgazer from "webgazer";
//import PlottingCanvas from "../../eyetracker/PlottingCanvas.vue";
//import CalibrationPoints from "../../eyetracker/CalibrationPoints.vue";
// import store from "../../../store/store.js";

export default {
  // name: 'eyetracker-input-modal',
  props: [],
  components: { Accordion, InputEventList, TestArea, GazeCloud },
  data: function() {
    return {
      docs: null,
      updateTime: null,
      x: null,
      y: null,
      intervall: null,
      counterSum: null,
      duration: null,
      show: false,
      //inputConfig: true,
      inputConfig: null,
      hover: null,
      clicker: null,
      metadata: null,
      InputConfig: InputConfig,
      error: "",
      errorInputs: [],
      test: "",
      testOpen: false,
      selectedTestElement: null,
      showPopUp3: false,
      showPopUp1: false,
      showPopUp2: false,
    };
  },
  watch: {
    inputConfig: {
      handler: function(newConfig) {
        if (this.testOpen) {
          this.initTest(newConfig);
        }
      },
      deep: true,
    },
  },
  methods: {
    onUpdate(coord) {
      this.x = coord.x;
      this.y = coord.y;
    },
    onUpdate1(coord) {
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
          console.log("click out of Modal");
          doc.click();
        }
      } else {
        this.docs = document.elementFromPoint(this.x, this.y);
        this.updateTime = Date.now(); // gives the time in ms from 1970 ongoing
      }
    },
    beforeDestroy() {
      webgazer.end();
    },
    delete1() {
      webgazer.end();
      webgazer.showPredictionPoints(false);

      this.$emit("close");
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
    cancel() {
      this.$emit("close");
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

      if (this.errorInputs.length > 0) {
        this.error = i18nService.translate(
          "Please specify input modalities // Bitte Eingabemodalitäten definieren"
        );
        return false;
      }
      return true;
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
    changeTouchScanning() {
      this.inputConfig.mouseclickEnabled = !this.touchScanning;
    },

    initTest() {
      setTimeout(() => {
        this.stopTest();
        if (this.inputConfig.eyetrackingEnabled) {
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
    });
    helpService.setHelpLocation("04_input_options", "#eyetracking-input");
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
}
/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
}

.modalHeader {
  color: rgb(255, 168, 127);
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
  background-image: linear-gradient(to right, #2e58cc, #587fff);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  box-shadow: 2px 3px rgba(0, 0, 0, 0.4);
  transition: 0.4s ease-out;
}
.buttonPopUp:hover {
  box-shadow: 6px 6px rgba(0, 0, 0, 0.6);
}

.modal-overlay-PopUp {
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
  z-index: 98;
  width: 100%;
  max-width: 300px;
  background-color: #fff;
  border-radius: 16px;
  padding: 25px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  transition: opacity 0;
}
</style>
