<template>
  <div>
    <div
      id="gazeCloudDot"
      :style="style"
      style="
        display: block;
        position: fixed;
        z-index: 99999;
        left: -5px;
        top: -5px;
        background: red;
        border-radius: 100%;
        opacity: 0.7;
        width: 10px;
        height: 10px;"
    ></div>
  </div>
</template>

<script>
export default {
  name: "GazeCloud",
  data() {
    return {
      x: 0,
      y: 0,
    };
  },
  computed: {
    style() {
      return { tranform: "translate3d(" + this.x + "px, " + this.y + "px, 0x" };
    },
  },
  created() {
    if (window.GazeCloudAPI) {
      const thiz = this;
      window.GazeCloudAPI.StartEyeTracking();
      window.GazeCloudAPI.UseClickRecalibration = true;
      window.GazeCloudAPI.OnCalibrationComplete = function() {
        console.log("Calibration complete");
        window.GazeCloudAPI.OnResult = function(GazeData) {
          thiz.updateGazeData(GazeData);
        };
      };
    }
  },
  methods: {
    updateGazeData(GazeData) {
      this.x = GazeData.x;
      this.y = GazeData.y;
    },
  },
};
</script>

<style lang="scss" scoped></style>
