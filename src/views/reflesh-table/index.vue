<template>
  <div class="table-test">
    <table-list :headers="headers"
                :list="tableData"
                @cell-click="rowClick"
                @refresh="handleRefresh"
                @oper-click="handleOper"
                @next="handleNext"></table-list>
  </div>
</template>

<script>
import TableList from './table'
export default {
  name: 'reflesh-table',
  components: { TableList },
  data () {
    return {
      headers: [
        { label: '日期', value: 'date', width: 120, sortable: true },
        { label: '航班号', value: 'acrNo', width: 120, sortable: true },
        { label: '飞机号', value: 'fliNo', width: 120, sortable: false },
        { label: '起飞机场', value: 'aptDep', width: 120, sortable: true },
        { label: '着陆机场', value: 'arrDep', width: 120, sortable: true },
        { label: '起飞时刻', value: 'takeOff', width: 120, sortable: false },
        { label: '岗位', value: 'post', width: 120, sortable: false },
        { label: '节油量', value: 'fuelSaving', width: 'auto', sortable: true, slot: true }
      ],
      tableData: [
        { date: '04/06', acrNo: 'RD8818', fliNo: 'B1688', aptDep: 'ZBTJ', arrDep: 'ZHHH', takeOff: '21:12', post: '起飞PF', fuelSaving: '航班待飞' },
        { date: '04/06', acrNo: 'RD8818', fliNo: 'B1688', aptDep: 'ZBTJ', arrDep: 'ZHHH', takeOff: '21:12', post: '起飞PF', fuelSaving: '计算中' },
        { date: '04/06', acrNo: 'RD8818', fliNo: 'B1688', aptDep: 'ZBTJ', arrDep: 'ZHHH', takeOff: '21:12', post: '起飞PF', fuelSaving: 200 },
        { date: '04/06', acrNo: 'RD8818', fliNo: 'B1688', aptDep: 'ZBTJ', arrDep: 'ZHHH', takeOff: '21:12', post: '起飞PF', fuelSaving: 200 },
        { date: '04/06', acrNo: 'RD8818', fliNo: 'B1688', aptDep: 'ZBTJ', arrDep: 'ZHHH', takeOff: '21:12', post: '起飞PF', fuelSaving: 200 },
        { date: '04/06', acrNo: 'RD8818', fliNo: 'B1688', aptDep: 'ZBTJ', arrDep: 'ZHHH', takeOff: '21:12', post: '起飞PF', fuelSaving: 200 },
        { date: '04/06', acrNo: 'RD8818', fliNo: 'B1688', aptDep: 'ZBTJ', arrDep: 'ZHHH', takeOff: '21:12', post: '起飞PF', fuelSaving: 200 },
        { date: '04/06', acrNo: 'RD8818', fliNo: 'B1688', aptDep: 'ZBTJ', arrDep: 'ZHHH', takeOff: '21:12', post: '起飞PF', fuelSaving: 200 },
        { date: '04/06', acrNo: 'RD8818', fliNo: 'B1688', aptDep: 'ZBTJ', arrDep: 'ZHHH', takeOff: '21:12', post: '起飞PF', fuelSaving: 200 },
        { date: '04/06', acrNo: 'RD8818', fliNo: 'B1688', aptDep: 'ZBTJ', arrDep: 'ZHHH', takeOff: '21:12', post: '起飞PF', fuelSaving: 200 },
        { date: '04/06', acrNo: 'RD8818', fliNo: 'B1688', aptDep: 'ZBTJ', arrDep: 'ZHHH', takeOff: '21:12', post: '起飞PF', fuelSaving: 200 },
        { date: '04/06', acrNo: 'RD8818', fliNo: 'B1688', aptDep: 'ZBTJ', arrDep: 'ZHHH', takeOff: '21:12', post: '起飞PF', fuelSaving: 200 },
        { date: '04/06', acrNo: 'RD8818', fliNo: 'B1688', aptDep: 'ZBTJ', arrDep: 'ZHHH', takeOff: '21:12', post: '起飞PF', fuelSaving: 200 },
        { date: '04/06', acrNo: 'RD8818', fliNo: 'B1688', aptDep: 'ZBTJ', arrDep: 'ZHHH', takeOff: '21:12', post: '起飞PF', fuelSaving: 200 },
        { date: '04/06', acrNo: 'RD8818', fliNo: 'B1688', aptDep: 'ZBTJ', arrDep: 'ZHHH', takeOff: '21:12', post: '起飞PF', fuelSaving: 200 },
        { date: '04/06', acrNo: 'RD8818', fliNo: 'B1688', aptDep: 'ZBTJ', arrDep: 'ZHHH', takeOff: '21:12', post: '起飞PF', fuelSaving: 200 },
        { date: '04/06', acrNo: 'RD8818', fliNo: 'B1688', aptDep: 'ZBTJ', arrDep: 'ZHHH', takeOff: '21:12', post: '起飞PF', fuelSaving: 200 },
        { date: '04/06', acrNo: 'RD8818', fliNo: 'B1688', aptDep: 'ZBTJ', arrDep: 'ZHHH', takeOff: '21:12', post: '起飞PF', fuelSaving: 200 },
        { date: '04/06', acrNo: 'RD8818', fliNo: 'B1688', aptDep: 'ZBTJ', arrDep: 'ZHHH', takeOff: '21:12', post: '起飞PF', fuelSaving: 200 },
        { date: '04/06', acrNo: 'RD8818', fliNo: 'B1688', aptDep: 'ZBTJ', arrDep: 'ZHHH', takeOff: '21:12', post: '起飞PF', fuelSaving: 200 }
      ]
    }
  },
  methods: {
    // 刷新
    handleRefresh () {
      this.pageNum = 1
      this.orderBy = ''
      this.getList(true)
    },
    // 翻页
    handleNext () {
      this.pageNum++
      this.getList()
    },
    handleOper (row) {
      console.log(row)
    },
    rowClick (row) {
      // this.$router.push({ name: 'flightDetail' })
    }
  }
}
</script>
