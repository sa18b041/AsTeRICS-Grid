<template>
  <div>
    <a href="/#main" style="position: absolute;top:5px;left:50%;z-index:5;"

      >BACK</a
    >
    <WebGazer @update="onUpdate" :off="false" />
    <PlottingCanvas />
    <CalibrationPoints :x="x" :y="y" />
  </div>
</template>

<script>
import WebGazer from "../eyetracker/WebGazer.vue";
import PlottingCanvas from "../eyetracker/PlottingCanvas.vue";
import CalibrationPoints from "../eyetracker/CalibrationPoints.vue";

export default {
  components: { WebGazer, CalibrationPoints, PlottingCanvas },
  data() {
    return {
      x: 0,
      y: 0,
    };
  },
  methods: {
    onUpdate(coord) {
      this.x = coord.x;
      this.y = coord.y;
    },
    stopCalibration(){
         webgazer.showPredictionPoints(false);
    },
  },
};
</script>
