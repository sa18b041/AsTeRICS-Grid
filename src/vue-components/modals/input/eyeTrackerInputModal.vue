<template>
    <div class="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container" @keydown.27="cancel()" @keydown.enter="save()">
                    <a class="inline close-button" href="javascript:void(0);" @click="cancel()"><i class="fas fa-times"/></a>
                    <a class="close-button" href="javascript:;" @click="openHelp()"><i class="fas fa-question-circle"></i></a>
                    <div class="modal-header">
                        <h1 name="header" data-i18n="">Mouse/Touch input // Maus-/Toucheingabe</h1>
                    </div>

                    <div class="modal-body" v-if="inputConfig">
                        <div class="row" >
                            <div class="twelve columns">
                                <input v-focus type="checkbox" id="enableClick" v-model="inputConfig.mouseclickEnabled"/>
                                <label class="inline" for="enableClick" data-i18n>Select with mouse click (or tap) // Auswahl mit Mausklick (oder Antippen)</label>
                            </div>
                        </div>
                        <div class="row" >
                            <div class="twelve columns">
                                <input v-focus type="checkbox" id="enableHover" v-model="inputConfig.hoverEnabled"/>
                                <label class="inline" for="enableHover" data-i18n>Enable hovering // Hovering aktivieren</label>
                            </div>
                        </div>
                        <div class="row" v-show="inputConfig.hoverEnabled">
                            <label class="four columns" for="inHoverTime" data-i18n>Hover Time (ms) // Hovering Zeit (ms)</label>
                            <input type="range" id="inHoverTime" v-model.number="inputConfig.hoverTimeoutMs" min="0" max="5000" step="100"/>
                            <input type="number" v-model.number="inputConfig.hoverTimeoutMs" min="0" max="5000" step="100"/>
                        </div>
                        <div class="row" v-show="inputConfig.hoverEnabled">
                            <div class="twelve columns">
                                <input v-focus type="checkbox" id="hoverHideCursor" v-model="inputConfig.hoverHideCursor"/>
                                <label class="inline" for="hoverHideCursor" data-i18n>Hide Cursor // Cursor verstecken</label>
                            </div>
                            <div class="twelve columns">
                                <input type="checkbox" id="chkReadActive" v-model="inputConfig.globalReadActive"/>
                                <label for="chkReadActive" data-i18n>Read out active element // Aktives Element vorlesen</label>
                            </div>
                            <div class="twelve columns">
                                <input type="checkbox" id="chkDisableHoverpane" v-model="inputConfig.hoverDisableHoverpane"/>
                                <label for="chkDisableHoverpane" data-i18n>Disable hover pane // Hover-Fläche deaktivieren</label>
                            </div>
                        </div>
                        <accordion class="row" acc-label="TEST_CONFIGURATION" acc-label-type="h2" acc-background-color="white" @open="testOpen = true; initTest()" @close="testOpen = false; stopTest()">
                            <test-area :selected-element="selectedTestElement"></test-area>
                        </accordion>
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