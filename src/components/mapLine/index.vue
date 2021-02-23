<!--
  leaflet地图组件
  tips:
  1. 需要给组件容器指定大小，地图大小为容器100%
  2. 所有功能必传参数为 {name, data}
  3. 不同功能的name也不要相同，name要符合属性名的规范
  4. 组件内部不对传入的数据修改
  功能：
  1. 画折线：支持自定义颜色，宽度，在折线处绘制点，根据折线绘制动态标记，折线点处hover提示
  2. 画点（绘制圆圈）：支持自定义颜色，大小
  3. 画标记（图片资源）：支持自定义图片，大小
  接口：
-->

<template>
  <div class="leaflet-container">
    <div id="map" />
    <div class="map-title"><span>{{ title }}</span></div>
    <div class="btns">
      <a class="btn" @click.stop="() => map.panTo(center)"><i class="fa fa-map-marker" aria-hidden="true"></i></a>
      <a class="btn" v-if="showDownLoad" @click.stop="() => downHandle()"><i class="fa fa-download" aria-hidden="true"></i></a>
    </div>
    <div class="map-line-buttons">
      <div v-for="item in polylineBtns" :key="item.name" class="map-button" @click="btnClickHandle(item.name)">
        <span class="label">{{ item.label }}</span>
        <el-button size="mini" :style="btnStyleCalc(item.name, item.color)" />
      </div>
      <slot name="buttons" />
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './MovingMarker.js'

export default {
  name: 'MapLine',
  props: {
    /**
     * 标题
     */
    title: {
      default: '',
      type: String
    },
    /**
     * 初始放大系数
     * tips: line有数据且fitBounds为true时不生效
     */
    zoom: {
      default: 5,
      type: Number
    },
    minZoom: {
      default: 1,
      type: Number
    },
    maxZoom: {
      default: 20,
      type: Number
    },
    /**
     * 地图中心点
     * tips: line有数据且fitBounds为true时不生效
     * type: [number, number]
     */
    center: {
      default: () => [22.629919, 113.819739],
      type: Array
    },
    /**
     * 点数组
     * points包含多组点，每组可以设置点坐标、点图片、大小
     * 颜色、半径 可不设置，使用全局的值
     * type:[{name: String, data: Array, color?: String, radius?: Number}, {}, {}]
     * data:[[<Number> latitude, <Number> longitude],[]]
     */
    points: {
      default: null,
      type: Array
    },
    /**
     * 画点的颜色全局值
     */
    pointColor: {
      default: '#008CFF',
      type: String
    },
    /**
     * 画点的大小全局值
     */
    pointRadius: {
      default: 2,
      type: Number
    },
    /**
     * 点的tooltip常驻
     */
    pointTooltip: {
      type: Boolean,
      default: false
    },
    /**
     * 标记数组
     * points包含多组点，每组可以设置点坐标、点图片、大小
     * 图片、大小 可不设置，使用全局的值
     * type:[{name: String, data: Array, iconUrl?: String, iconSize?: Array}, {}, {}]
     * data:[[<Number> latitude, <Number> longitude, <String> tips?],[]]
     */
    markers: {
      default: null,
      type: Array
    },
    /**
     * 画点的图片资源全局值
     */
    markerIconUrl: {
      default: './img/point_yellow.png',
      type: String
    },
    /**
     * 标记的大小全局值
     */
    markerIconSize: {
      default: () => [18, 18],
      type: Array
    },
    /**
     * 折线数组
     * polylines包含多组折线，每组可以设置点坐标、折线颜色、宽度
     * 折线颜色、宽度、是否画点 可不设置，使用全局的值
     * drawMovingMarker: 是否画线条上的动点，默认不绘制，每条线单独设置
     * movingMarkerSize：每条线单独设置，或者使用默认设置
     * type:[{name: String, label: String, data: Array, color?: String, weight?: Number, drawPoint?: Boolean, drawMovingMarker?: Boolean, movingMarkerSize?: Number, hideButton?: Boolean}, {}, {}]
     * name:本组数据名称，需要符合属性名规范；label：按钮名称
     * data:[[<Number> latitude, <Number> longitude, <String> hoverTip?],[]]
     * hideButton: 不显示该条线的按钮；默认显示
     */
    polylines: {
      default: null,
      type: Array
    },
    /**
     * 折线颜色
     */
    lineColor: {
      default: '#008CFF',
      type: String
    },
    lineWeight: {
      default: 3,
      type: Number
    },
    /**
     * 缩放地图以将连线全部展示
     */
    fitBounds: {
      default: true,
      type: Boolean
    },
    /**
     * 在折线line[]点处画点
     */
    polylinePoint: {
      default: false,
      type: Boolean
    },
    /**
     * 显示缩放按钮
     */
    zoomControl: {
      default: true,
      type: Boolean
    },
    /**
     * 显示leaflet LOGO
     */
    attributionControl: {
      default: false,
      type: Boolean
    },
    /**
     * 可通过鼠标缩放
     */
    scrollWheelZoom: {
      default: false,
      type: Boolean
    },
    /**
     * 显示下载按钮
     */
    showDownLoad: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      map: null,
      // 保存展示的点，线，标记等，以便编辑
      pointsObj: {},
      lineObj: {},
      markerObj: {},
      movingObj: {},

      // 默认值
      movingMarkerSize: 15,
      mapUrl: {
        light: 'https://api.mapbox.com/styles/v1/yangshufei/cklhfc72k0iqg17ln9f0gksbe/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoieWFuZ3NodWZlaSIsImEiOiJja2I3OXlxdXQwMjM1MnRvMWU5cDRtaDY4In0.H3oO7Jwyh4TMIK84IANhMA'
      }
    }
  },
  methods: {
    /**
     * 初始化地图
     */
    initMap () {
      // 必须在mounted中或者之后调用
      var map = L.map('map', {
        scrollWheelZoom: this.scrollWheelZoom,
        center: this.center,
        zoom: this.zoom,
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
        zoomControl: this.zoomControl,
        attributionControl: this.attributionControl
      })
      this.map = map
      L.tileLayer(this.mapUrl.light).addTo(map)
    },
    /**
     * 画线预处理
     * param: 同this.polylines
     */
    lineHandle (polylines) {
      polylines.forEach(item => {
        this.drawLine(item)
      })
    },
    /**
     * 画线
     * param：polylines中的元素对象
     */
    drawLine (line) {
      // 清除之前的同name数据
      this.remove('line', line.name)
      const config = {
        color: line.color || this.lineColor,
        weight: line.weight || this.lineWeight,
        interactive: false
      }
      const polyline = L.polyline(line.data, config).addTo(this.map)
      this.addToData('line', line.name, polyline)
      /**
       * zoom the map to the polyline
       * 缩放地图将连线全部展示
       * 折线较多时不建议
       */
      if (this.fitBounds) {
        this.map.fitBounds(polyline.getBounds())
      }
      if (line.drawMovingMarker) {
        this.movingMarker(line)
      }
      if (line.drawPoint !== undefined ? line.drawPoint : this.polylinePoint) {
        this.drawPoint(line)
      }
    },
    /**
     * 标记预处理
     * param: 同this.markers
     */
    markerHandle (markers) {
      markers.forEach(item => {
        this.drawMarker(item)
      })
    },
    /**
     * 画标记
     * param：markers中的元素对象
     */
    drawMarker (markerObj) {
      var markerToSave = []
      markerObj.data.forEach(item => {
        const pointIconUrl = markerObj.iconUrl || this.markerIconUrl
        const myIcon = L.icon({
          iconUrl: require(pointIconUrl + ''),
          iconSize: markerObj.iconSize || this.markerIconSize
        })
        const marker = L.marker(item, { icon: myIcon }).addTo(this.map)
        if (item[2]) marker.bindTooltip(item[2], { closeButton: false, direction: 'top', permanent: true, className: markerObj.class || 'yellow' }).openTooltip()
        markerToSave.push(marker)
      })
      this.addToData('marker', markerObj.name, markerToSave)
    },
    /**
     * 画点预处理
     * param: 同this.markers
     */
    pointHandle (points) {
      points.forEach(item => {
        this.drawPoint(item)
      })
    },
    /**
     * 画点
     * param：points中的元素对象
     */
    drawPoint (pointObj) {
      var pointToSave = []
      pointObj.data.forEach(item => {
        const pointColor = pointObj.color || this.pointColor
        const pointRadius = pointObj.radius || this.pointRadius
        const point = L.circleMarker(item.slice(0, 2), { color: pointColor, fillColor: pointColor, radius: pointRadius, fillOpacity: 1 }).addTo(this.map)
        pointToSave.push(point)
        if (item[2]) {
          if (this.pointTooltip) {
            point.bindTooltip(item[2], { closeButton: false, direction: 'top', permanent: true, className: 'c' + (pointObj.color || this.pointColor).slice(-6) }).openTooltip()
            // 点击放大显示文字
            point.bindPopup(item[2], { autoClose: true, className: 'popup-color', closeButton: false, offset: [0, -7] })
            // 鼠标移出改点后指定时间关闭popup
            point.addEventListener('popupopen', function () {
              const onLeave = function () {
                point.removeEventListener('mouseout', onLeave)
                setTimeout(() => { point && point.closePopup() }, 500)
              }
              point.addEventListener('mouseout', onLeave)
            })
          } else {
            point.bindTooltip(item[2])
          }
        }
      })
      this.addToData('point', pointObj.name, pointToSave)
    },
    /**
     * 动点
     */
    movingMarker (line) {
      try {
        var moving = L.Marker.movingMarker(line.data, 10000, { loop: true, rotate: true })
        const iconColor = line.color || this.lineColor
        const iconSize = line.movingMarkerSize || this.movingMarkerSize
        const myIcon = L.divIcon({
          html: `<i class="fa fa-plane" aria-hidden="true" style="font-size:${iconSize}px;color:${iconColor};"></i>`,
          iconSize
        })
        moving.setIcon(myIcon)
        moving.addTo(this.map)
        moving.start()
        this.addToData('move', line.name, moving)
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * 移除
     * param
     *  type: String，移除对象类型
     *    'line'：线
     *    'point'：点
     *    'marker': 标记
     *  name: String，名称
     */
    remove (type, name) {
      if (type === 'line') {
        if (this.lineObj[name]) {
          this.lineObj[name].remove()
          this.$set(this.lineObj, name, null)
          this.remove('point', name)
          this.remove('move', name)
        }
      } else if (type === 'point') {
        if (this.pointsObj[name]) {
          this.pointsObj[name].forEach(item => {
            // 清除所有监听
            item.off()
            item.remove()
            item.unbindTooltip()
          })
          this.$set(this.pointsObj, name, null)
        }
      } else if (type === 'marker') {
        if (this.markerObj[name]) {
          this.markerObj[name].forEach(item => item.remove())
          this.$set(this.markerObj, name, null)
        }
      } else if (type === 'move') {
        if (this.movingObj[name]) {
          this.movingObj[name].remove()
          this.$set(this.movingObj, name, null)
        }
      }
    },
    /**
     * 重新显示
     */
    resume (type, name) {
      if (type === 'line') {
        const oldData = this.polylines.find(item => item.name === name)
        if (oldData) {
          this.drawLine(oldData)
        }
      } else if (type === 'point') {
        const oldData = this.points.find(item => item.name === name)
        if (oldData) {
          this.drawPoint(oldData)
        }
      } else if (type === 'marker') {
        const oldData = this.markers.find(item => item.name === name)
        if (oldData) {
          this.drawMarker(oldData)
        }
      }
    },
    /**
     * 将绘制数据添加到data，方便remove操作
     */
    addToData (type, name, obj) {
      if (type === 'line') {
        this.$set(this.lineObj, name, obj)
      } else if (type === 'point') {
        if (this.pointsObj[name]) {
          this.remove(type, name)
        }
        this.$set(this.pointsObj, name, obj)
      } else if (type === 'marker') {
        this.$set(this.markerObj, name, obj)
      } else if (type === 'move') {
        this.$set(this.movingObj, name, obj)
      }
    },
    /**
     * 按钮点击处理
     */
    btnClickHandle (name) {
      if (this.lineObj[name]) {
        this.remove('line', name)
      } else {
        this.resume('line', name)
      }
    },
    /**
     * 按钮样式计算
     */
    btnStyleCalc (name, color) {
      if (this.lineObj[name]) {
        return `background-color:${color};border-color:${color}`
      } else {
        return 'background-color:#fff;border-color:#DCDFE6'
      }
    },
    /**
     * 下载
     */
    downHandle () {
      this.$emit('downLoad')
    },
    /**
     * 重新加载this.ma
     */
    reoad () {
      this.map.remove()
      this.initMap()
      if (this.markers && this.markers.length > 0) {
        this.markerHandle(this.markers)
      }
      if (this.polylines && this.polylines.length > 0) {
        this.lineHandle(this.polylines)
      }
      if (this.points && this.points.length > 0) {
        this.pointHandle(this.points)
      }
    }
  },
  mounted () {
    this.initMap()
    if (this.markers && this.markers.length > 0) {
      this.markerHandle(this.markers)
    }
    if (this.polylines && this.polylines.length > 0) {
      this.lineHandle(this.polylines)
    }
    if (this.points && this.points.length > 0) {
      this.pointHandle(this.points)
    }
  },
  watch: {
    /**
     * 监听数据变化的方式绘制/重绘数据
     */
    markers () {
      Object.keys(this.markerObj).forEach(name => this.remove('marker', name))
      this.markerHandle(this.markers)
    },
    polylines () {
      Object.keys(this.lineObj).forEach(name => this.remove('line', name))
      this.lineHandle(this.polylines)
    },
    points () {
      Object.keys(this.pointsObj).forEach(name => this.remove('point', name))
      this.pointHandle(this.points)
    },
    center () {
      this.map.panTo(this.center)
    }
  },
  computed: {
    // 按钮数据
    polylineBtns () {
      return this.polylines ? this.polylines.filter(item => !item.hideButton) : null
    }
  }
}
</script>

<style lang="scss">
// MapLine
.leaflet-container{
  position: relative;
  width: 100%;
  height: 100%;
  #map{
    width: 100%;
    height: 100%;
  }
  .map-title{
    color: #769FC8;
    font-size: 20px;
    font-weight: bold;
    position: absolute;
    left: 50%;
    top: 10px;
    transform: translateX(-50%);
    z-index: 400;
    background-color: rgba(0,0,0,0);
    user-select: none;
  }
  .btns {
    position: absolute;
    left: 10px;
    top: 66px;
    width: 30px;
    z-index: 400;
    display: flex;
    flex-direction: column;
    .btn {
      box-shadow: 0 1px 5px rgba(0,0,0,0.65);
      background-color: #FFF;
      color: #000;
      width: 26px;
      height: 26px;
      font-size: 18px;
      line-height: 26px;
      text-align: center;
      border-radius: 4px;
      margin-bottom: 3px;
    }
  }
  .map-line-buttons{
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    text-align: right;
    /* 比图层大一点 */
    z-index: 400;
    .map-button {
      cursor: pointer;
    }
    .label {
      position: relative;
      top: 4px;
      color: #fff;
      font-weight: bold;
      user-select: none;
    }
  }
}
</style>
