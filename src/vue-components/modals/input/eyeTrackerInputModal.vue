<template>
    <div class="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container" @keydown.27="cancel()" @keydown.enter="save()">
                    <a class="inline close-button" href="javascript:void(0);" @click="cancel()"><i class="fas fa-times"/></a>
                    <a class="close-button" href="javascript:;" @click="openHelp()"><i class="fas fa-question-circle"></i></a>
                    <div class="modal-header">
                        <h1 name="header">
                            Choose your Eye tracking mode
                        </h1>
                                 
                        <form action="">

  <input name="eyeTrackingMode" value="WebGazer offline" v-focus type="radio" id="enableEyetracking"  @click="inputConfig.eyetrackingEnabled">
  <label for="webGazer">WebGazer offline Version</label><br>
  <input type="radio" id="gazeCloud" name="eyeTrackingMode" value="Gaze cloudbased">
  <label for="gazeCloud">Gaze Cloud online Version</label><br>
   <label class="inline" for="enableScanning" data-i18n></label> 
  
  <br>  
  <input type="submit" value="Enable Eyetracking // Augensteuerung aktivieren">
</form>
               
                    
 
                    <div class="modal-body" v-if="inputConfig">
                         <div id="app">
    <!-- <GazeCloud @update="onUpdate" />  -->
    
                            <!-- <WebGazer @update="onUpdate" :off="false"/>  -->
                         <!-- <PlottingCanvas />
                            <CalibrationPoints :x="x" :y="y" /> --> 
                            

                            <!-- <CalibrationPoint @click="getID" :id="id" />  -->
                            <!-- List  :listdata="items"--> 
                        </div>
                    </div>
                    </div>

                    <div class="modal-footer">
                        <div class="button-container row">
                            <button @click="cancel()" class="four columns offset-by-four">
                                <i class="fas fa-times"/> <span data-i18n>Cancel // Abbrechen</span>
                            </button>
                            <button @click="save()" class="four columns">
                                <i class="fas fa-check"/> <span>OK</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    //import webgazer from "webgazer";
    import {dataService} from '../../../js/service/data/dataService'
    import {helpService} from "../../../js/service/helpService";
    import {i18nService} from "../../../js/service/i18nService";
    import Accordion from "../../components/accordion.vue"
    import InputEventList from "../../components/inputEventList.vue"
    import TestArea from "./testArea.vue"
    import './../../../css/modal.css';
    import {InputConfig} from "../../../js/model/InputConfig";
    import {Scanner} from "../../../js/input/scanning";
    import {inputEventHandler} from "../../../js/input/inputEventHandler";

    import WebGazer from "../../eyetracker/WebGazer.vue"
     import GazeCloud from "../../components/GazeCloud.vue"
   //  import PlottingCanvas from "../../eyetracker/PlottingCanvas.vue"
    // import CalibrationPoints from "../../eyetracker/CalibrationPoints.vue"

export default {
        // name: 'eyetracker-input-modal',
        props: [],
        components: {WebGazer,  Accordion, InputEventList, TestArea, GazeCloud},
        data: function () {
            return {
                x: 0,
                y: 0,
                inputConfig: null,
                touchScanning: null,
                metadata: null,
                InputConfig: InputConfig,
                error: '',
                errorInputs: [],
                scanner: null,
                testOpen: false,
                selectedTestElement: null
            }
        },
        watch: {
            inputConfig: {
                handler: function(newConfig) {
                    if (this.testOpen) {
                        this.initTest(newConfig);
                    }
                },
                deep: true
            }
        },
        methods: {
            save() {
                if (!this.validateInputs()) {
                return;
                }
                this.metadata.inputConfig = this.inputConfig;
                dataService.saveMetadata(this.metadata).then(() => {
                    this.$emit('close');
                });
            },
            cancel() {
                this.$emit('close');
            },
            openHelp() {
                helpService.openHelp();
            },
            validateInputs() {
                this.errorInputs = [];
                this.error = "";

               // if (this.inputConfig.eyetrackingEnabled) {

                   return true;
              //  }
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
                this.$set(this.inputConfig, 'eyetrackingInputs', JSON.parse(JSON.stringify(InputConfig.DEFAULT_SCAN_INPUTS)));
                this.inputChanged();
            },
            changeTouchScanning() {
                this.inputConfig.mouseclickEnabled = !this.touchScanning;
            },
            initTest() {
                setTimeout(() => {
                    this.stopTest();
                    if (this.inputConfig.scanEnabled) {
                        this.scanner = Scanner.getInstanceFromConfig(this.inputConfig, '.area-element-inner', 'active', 'inactive');
                        this.scanner.setSelectionListener(element => {
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
            }
        },
        mounted () {
            let thiz = this;
            inputEventHandler.pauseAll();
            dataService.getMetadata().then(metadata => {
                thiz.metadata = JSON.parse(JSON.stringify(metadata));
                thiz.inputConfig = JSON.parse(JSON.stringify(metadata.inputConfig));
                thiz.touchScanning = !thiz.inputConfig.mouseclickEnabled;
            });
            helpService.setHelpLocation('04_input_options', '#scanning');
        },
        updated() {
            i18nService.initDomI18n();
        },
        beforeDestroy() {
            helpService.revertToLastLocation();
            this.stopTest();
            inputEventHandler.resumeAll();
        }
    }
</script>

<style scoped>
    .warn {
        margin-top: 2em;
    }

    .slidergroup input {
        width: 50%;
    }
</style>