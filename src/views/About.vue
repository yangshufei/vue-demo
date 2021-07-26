<template>
  <div id="main" style="height:500px;width:1400px;margin:0 auto;"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  data () {
    return {
      myChart: null,
      count: 1,
      chartData: []
    }
  },
  methods: {
    handleOption (data) {
      console.log(data)
      const option = {
        xAxis: {},
        yAxis: {},
        series: [{
          symbolSize: 20,
          data,
          type: 'scatter'
        }]
      }
      this.setChart(option)
    },
    setChart (option) {
      this.myChart.setOption(option)
    },
    getData () {
      return new Promise((resolve, reject) => {
        const arr = []
        for (let i = 0; i < 5000; i++) {
          arr.push([i, i * this.count])
        }
        setTimeout(() => {
          resolve(arr)
        }, Math.random() * 3000)
      })
    },
    search () {
      this.getData().then((arr) => {
        this.chartData.push(...arr)
        const r = JSON.parse(JSON.stringify(this.chartData))
        this.handleOption(r)
        this.count++
        if (this.count <= 10) {
          this.search()
        }
      })
    }
  },
  mounted () {
    var chartDom = document.getElementById('main')
    this.myChart = echarts.init(chartDom)
    this.search()
  }
}
</script>
