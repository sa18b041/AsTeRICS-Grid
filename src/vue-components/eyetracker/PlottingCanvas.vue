<template>
  <canvas ref="plot" id="plotting-canvas" width="500" height="500">

<!-- <button v-on:mousemove="coords" class="coords">{{coords.x}}, {{coords.y}}</button> -->

  </canvas>
  

</template>

<script>
export default {
  
  // name: "PlottingCanvas",
  // coords: {
  //   x: 50,
  //   y: 50
  // },
  methods: {
    clear() {
      if (this.$refs.plot) {
        const { width, height } = this.$refs.plot;
        const ctx = this.$refs.plot.getContext("2d");
        ctx.clearRect(0, 0, width, height);
        console.log(this.$refs.plot);
      }
    },
    resize() {
      if (this.$refs.plot && window) {
        this.$refs.plot.width = window.innerWidth; // will be widened to the full screen, no matter how big the screen is 
        this.$refs.plot.height = window.innerHeight; // always the full screen 
      }
    },
  },
  mounted() {
    this.clear();
    this.resize();
  },
  created() {
    if (window) {
      window.addEventListener("resize", this.resize);
    }
  },
  beforeDestroy() {
    if (window) {
      window.removeEventListener("resize", this.resize);
    }
  },
};

</script>

<style scoped>
  #plotting-canvas {
    cursor: crosshair;
    position: fixed;
  }
    
</style>
