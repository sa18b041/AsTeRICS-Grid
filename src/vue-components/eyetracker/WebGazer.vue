<script>
import webgazer from "webgazer";
export default {
  name: "WebGazer",
  render: (h) => h(),
  props: {
    off: {
      type: Boolean,
      default: false,
    },
  },
  data: () => {
    return {
      x: 0,
      y: 0,
    };
  },
  async created() {
    let dataArr = []
    if (window && !this.off) {
      const thiz = this;
      window.applyCalmanFilter = true;
      window.saveDataAccrossSessions = true; // remembers the calibration points for the next session
      webgazer.params.showVideoPreview = true; // set to false than the video will not be opened
      await webgazer
        .setRegression("ridge")
        .setGazeListener(function(data, time) {  // it is an given event - where a callback function is called : here the data will be übergeben - where the user looks x/y values
          if (data) {
            thiz.x = data.x;
            thiz.y = data.y;
             let dataCoord = {
                x: data.x,
                y: data.y
            }
            dataArr.push(dataCoord)
            //console.log('This Array');
           // console.log(dataArr)
            thiz.$emit("update", { x: data.x, y: data.y });  //update event 
          }
        })
        .begin();
      webgazer.showPredictionPoints(true);
    }
    
  },
  beforeDestroy() {
    webgazer.end();
  },
};
</script>

<style lang="stylus" scoped></style>
