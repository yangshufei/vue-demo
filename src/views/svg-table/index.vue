<template>
<div class="svg-table">
  <el-button type="primary" @click="canvasHandle">下载</el-button>

  <div class="svg-chart-wrapper" ref="svgChartRef">
    <el-table :data="tableData" stripe>
      <el-table-column  prop="time"  label="日期"  width="100px" align="center" fixed="left"></el-table-column>
      <el-table-column v-for="(item, index) in headList" :key="index" :prop="item.prop" :label="item.label" width="100px" align="center">
        <template slot-scope="{row}">
          <div style="background:#5ADF96;color:black;width:100%;fontSize:14px;">{{row[item.prop]}}</div>
          <div style="background:#eee;color:#bbb;width:100%;">{{row[item.prop]}}</div>
        </template>
      </el-table-column>
    </el-table>
    <svg width="100%" height="100%" id="svg-id" class="svg-icon" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
      <g v-for="(item, index) in tableData" :key="index">
        <defs v-if="item.dPath">
            <marker id="triangle" markerUnits="strokeWidth" markerWidth="5" markerHeight="4" refX="0" refY="2" orient="auto" fill="#11BF92">
                <path d="M 0 0 L 5 2 L 0 4 z" />
            </marker>
        </defs>
        <path :id="'path'+index" v-if="item.dPath" :d="item.dPath" stroke="#11BF92" stroke-width="2" fill="none" style="marker-end: url(#triangle);" />

        <text :id="'text'+index" font-size="14" text-anchor="middle" :rotate="tableData[index+1] && tableData[index+1].isDown ? '180': '0'" fill="red">
          <textPath :xlink:href="'#path'+index" startOffset="50%">转</textPath>
        </text>
      </g>
    </svg>
  </div>
</div>

</template>

<script>
import html2canvas from 'html2canvas'
const map = {
  SS: 200,
  FR: 300,
  F1: 400,
  F2: 500,
  F3: 600,
  F4: 700,
  F5: 800,
  FL: 900,
  FZ: 1000,
  PN: 1100,
  P1: 1200,
  PP: 1300
}
export default {
  data () {
    return {
      tableData: [
        { time: '2019-03-21', SS: '15908/293', prop: 'SS' },
        { time: '2019-03-21', FR: '351/137', prop: 'FR' },
        { time: '2019-03-21', F1: '351/137', prop: 'F1' },
        { time: '2019-03-21', F2: '351/137', prop: 'F2' },
        { time: '2019-03-21', F1: '351/137', prop: 'F1', isDown: true },
        { time: '2019-03-21', F4: '351/137', prop: 'F4' },
        { time: '2019-03-21', FL: '351/137', prop: 'FL' },
        { time: '2019-03-21', FZ: '351/137', prop: 'FZ' },
        { time: '2019-03-21', P1: '351/137', prop: 'P1' },
        { time: '2019-03-21', PP: '351/137', prop: 'PP' }
      ],
      headList: [
        { prop: 'SS', label: 'SS' },
        { prop: 'FR', label: 'FR' },
        { prop: 'F1', label: 'F1' },
        { prop: 'F2', label: 'F2' },
        { prop: 'F3', label: 'F3' },
        { prop: 'F4', label: 'F4' },
        { prop: 'F5', label: 'F5' },
        { prop: 'FL', label: 'FL' },
        { prop: 'FZ', label: 'FZ' },
        { prop: 'PN', label: 'PN' },
        { prop: 'P1', label: 'P1' },
        { prop: 'PP', label: 'PP' }
      ]
    }
  },
  mounted () {
    this.$nextTick(() => {
      var node = document.getElementById('svg-id')
      document.querySelector('.el-table__body-wrapper').appendChild(node)
    })
  },
  created () {
    const rowHeight = 71
    const baseHeight = rowHeight / 2
    const firstHeight = rowHeight - 10

    const tableData = this.tableData
    for (let i = 0; i < tableData.length - 1; i++) {
      const index = map[tableData[i].prop] // 降级的index
      const nextIndex = map[tableData[i + 1].prop] // 下一行的index

      if (tableData[i + 1].isDown) {
        tableData[i].dPath = `M ${index - 100}  ${baseHeight + i * rowHeight} L ${nextIndex - 50}  ${baseHeight + i * rowHeight} L ${nextIndex - 50}  ${firstHeight + i * rowHeight}`
      } else {
        tableData[i].dPath = `M ${index}  ${baseHeight + i * rowHeight} L ${nextIndex - 50}  ${baseHeight + i * rowHeight} L ${nextIndex - 50}  ${firstHeight + i * rowHeight}`
      }
    }
  },
  methods: {
    canvasHandle () {
      html2canvas(this.$refs.svgChartRef,
        {
          useCORS: true,
          backgroundColor: null
        }).then(canvas => {
        var base64Url = canvas.toDataURL('image/jpg')
        // 第一步：将dataUrl转换成Blob
        const blob = this.base64ToBlob(base64Url)
        this.saveFile(blob)
      })
    },
    // base64转换成blob数据
    base64ToBlob (base64Url, type) {
      var arr = base64Url.split(',')
      var mime = arr[0].match(/:(.*?);/)[1] || type
      // 去掉url的头，并转化为byte
      var bytes = window.atob(arr[1])
      // 处理异常,将ascii码小于0的转换为大于0
      var ab = new ArrayBuffer(bytes.length)
      // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
      var ia = new Uint8Array(ab)
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
      }
      return new Blob([ab], {
        type: mime
      })
    },

    // downLoad
    saveFile (blob) {
      const link = document.createElement('a')
      const url = window.URL.createObjectURL(blob)
      link.download = 'svg-table'
      link.href = url
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(url)
      link.remove()
    }

  }
}
</script>

<style lang="scss">
  .svg-chart-wrapper {
    position: relative;
    margin-left: 200px;
    .svg-icon {
      position: absolute;
      top: 0;
      left: 0;
    }
    thead th {
      background: #EBEBEB !important;
    }
  }
</style>
