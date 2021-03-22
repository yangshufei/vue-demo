<template>
<div class="map-wrapper" style="height:700px;">
  <map-line
    :fitBounds="false"
    :zoom="2.5"
    :polylines="polylines"
    :center="[31.23224, 80.819739]"
  >
  </map-line>
</div>
</template>

<script>
import mapLine from '@/components/mapLine/index.vue'
import axios from 'axios'

export default {
  name: 'Map',
  components: { mapLine },
  data () {
    return {
      polylines: []
    }
  },
  methods: {
    async getAirlineNetWork () {
      const res = await axios.get('/mapList')
      const polylines = []
      res.data.data.forEach((item, index) => {
        const data = [[item.depN, item.depE < 0 ? Number(item.depE) + 360 : item.depE], [item.arrN, item.arrE < 0 ? Number(item.arrE) + 360 : item.arrE]]
        polylines.push({ name: `line${index}`, data, color: this.colorList[index % 20], hideButton: true, weight: 1 })
      })
      this.polylines = polylines
      console.log(res.data.data, polylines)
    }
  },
  computed: {
    colorList () {
      return [
        '#80FFA5', '#cd0a0a', '#37A2FF', '#FF0087', '#FFBF00',
        '#7579e7', '#fe7171', '#9d65c9', '#ff4b5c', '#ea2c62'
      ]
    }
  },
  created () {
    // this.getAirlineNetWork()
  }
}
</script>
