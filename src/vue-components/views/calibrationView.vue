<template>
    <div>
    <a href="/#main" style = "position: absolute; z-index: 5; top: 5px; left: 50%;" >BACK</a>
    <WebGazer @update="onUpdate" :off="false"/>
  <PlottingCanvas />
  <CalibrationPoints :x="x" :y="y" />
    
    </div>

</template>

<script>
import WebGazer from "../eyetracker/WebGazer.vue";
import PlottingCanvas from "../eyetracker/PlottingCanvas.vue";
import CalibrationPoints from "../eyetracker/CalibrationPoints.vue";


export default {
  name: "App",
  components: { WebGazer, PlottingCanvas, CalibrationPoints },
  data() {
    return {
      x: 0, //passing data with props - data first included here in the App.vue and then passed via
      y: 0, // data binding in the template above (example Calibration points) with :
      // id: ''
      // gridBoxes: ['first','second','third'], //############ change later 
    };
  },
  methods: {
   
   
    onUpdate(coord) {
      this.x = coord.x;
      this.y = coord.y;
      // console.log("###########################")
      // console.log("X :"+this.x)
      // console.log("Y :"+this.y)
      // console.log("coord X :"+coord.x)
      // console.log("coord Y :"+coord.y)
      // console.log(this.id);
    },
  },
};
    

</script>