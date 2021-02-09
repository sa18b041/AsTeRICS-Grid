<template>
<div>
  <input
    :id="id"
    ref="point"
    type="button"
    class="calibration-point"
    :class="{ hover: hover }"
    :style="{ left, right, top, bottom, width, height, transform, opacity, backgroundColor }"
    @click="onClick($event)" 
  />
  </div>
</template>

<script>
export default {
  name: "CalibrationPoint",
  props: {
    id: {
      type: String,
      required: true,
    },
    calibration: {
      type: Number,
      default: 0,
    },
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      default: 0,
    },
    horizontal: {
      type: Boolean,
      default: false,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    left: {
      type: String,
      default: "unset",
    },
    right: {
      type: String,
      default: "unset",
    },
    top: {
      type: String,
      default: "unset",
    },
    bottom: {
      type: String,
      default: "unset",
    },
    width: {
      type: String,
      default: "150px",
    },
    height: {
      type: String,
      default: "150px",
    },
  },
  data() {
    return {
      count: 0,
      isHorizontalHover: false,
      isVerticalHover: false,
    };
  },
  computed: {
    //moves the middle boxes to left and right
    transform() {
      return `translate(${this.horizontal ? "-50" : "0"}%, ${this.vertical ? "-50" : "0"}%)`;
    },
    //moves to 100% of the color green
    opacity() {
      let result = (this.count / this.max) * 100;
      if (result < 20) result = 20;
      else if (result >= 100) result = 50;
      return `${result}%`;
    },
    backgroundColor() {
      return this.count < this.max ? "red" : "green";
    },
    //Border when clicking the boxes
    hover() {
      return this.isVerticalHover && this.isHorizontalHover;
    },
  },
  watch: {
    x: function(value) {
      if (this.$refs.point) {
        const { left, right } = this.$refs.point.getBoundingClientRect();
        this.isHorizontalHover = value > left && value < right;
      }
      //  console.log('------------------------------')
      //  console.log('X : '+value)
    },
    y: function(value) {
      if (this.$refs.point) {
        const { top, bottom } = this.$refs.point.getBoundingClientRect();
        this.isVerticalHover = value > top && value < bottom;
      }
      // console.log('Y : '+value)
    },
  },
  methods: { 
    onClick(event) { // this returns click pt 1-9 (all boxes)
      this.count += 1;
      this.$emit("click", this.id);
      console.log('##################### '+ this.id)
      console.log('X : '+ event.clientX, 'Y : ' + event.clientY) 
    },
  },
  created() { // the 9 boxes are created on the screen
    this.$emit("create", this.id);
    //console.log('Points '+ this.id)
  },
};
</script>

<style scoped>
input {
  border-radius: 25px;
  opacity: 0.5;
  border-color: black;
  border-style: solid;
  position: fixed;
  cursor: pointer;
  
}
input:hover {
    outline: 1rem solid blue;
  }
</style>
