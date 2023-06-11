<template>
  <!-- <div id="container">

  </div> -->
  <baidu-map
    class="bm-view"
    :zoom="zoom"
    :center="center"
    @ready="handler"
  >
  </baidu-map>
</template>

<script src="https://unpkg.com/vue-baidu-map"></script>
<script>
// var BMapGL=window.BMapGL
// var map = new BMapGL.Map('container')
// console.log(Map)
// var point = new BMapGL.Point(116.404, 39.915)
// map.centerAndZoom(point, 15)
// map.enableScrollWheelZoom(true)
</script>
<script>

export default {
  data(){
    return {
      center :{lng:0,lat:0},
      zoom:0
    }
  },
  methods: {
    handler ({BMap, map}) {
      map.enableScrollWheelZoom(true);
      console.log(BMap, map)
      this.center.lng = 116.404
      this.center.lat = 39.915
      this.zoom = 6
    }
  },
  mounted(){
  }
}
</script>

<style type="text/css">
    .bm-view {
  width: 100%;
  height: 760px;
}
</style>

