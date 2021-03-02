<template>
<div class="drag-table-wrapper">
  <div class="drag-table">
    <el-table
      :data="tableList"
      max-height="600"
      class="table-left"
      :row-class-name="rowClassName"
      ref="tableLeft">
      <el-table-column prop="name" label="姓名" align="center"></el-table-column>
      <el-table-column prop="age" label="年龄" align="center"></el-table-column>
      <el-table-column prop="addr" label="地址" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="58">
        <template slot-scope="scope">
          <el-button type="text" size="mini" v-if="changedList[scope.row.id]" @click.stop="() => revertChange(scope.row, scope.$index)">撤销</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      :data="tableListR"
      max-height="600"
      class="table-right"
      ref="tableRight">
      <el-table-column prop="name" label="姓名" align="center"></el-table-column>
      <el-table-column prop="age" label="年龄" align="center"></el-table-column>
      <el-table-column prop="addr" label="地址" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="58">
      </el-table-column>
    </el-table>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      tableList: [],
      // 冻结的数据，备份用
      tableListFreezen: [],
      tableListR: [],
      // 左侧表格hover行
      hoverIndex: -1,
      dragIndex: -1,
      changedList: {},
      changedIds: [],
      // 点击高亮ID
      selectId: -1,
      // 表格联动
      tableLinkage: true
    }
  },
  methods: {
    // 撤销操作
    revertChange (obj, index) {
      this.tableList.splice(index, 1, JSON.parse(JSON.stringify(this.tableListFreezen[index])))
      this.changedIds.splice(this.changedIds.indexOf(obj.id), 1)
      delete this.changedList[obj.id]
    },
    // 滚动Right表格
    scrollRightTable (obj) {
      if (obj.index > -1) {
        this.$refs.tableRight.bodyWrapper.getElementsByClassName('el-table__row')[obj.index].scrollIntoView()
      } else {
        this.$refs.tableRight.bodyWrapper.scrollTop = obj.top
      }
    },
    // 表格联动
    startTableLinkage () {
      const tableLeft = this.$refs.tableLeft.bodyWrapper
      const tableRight = this.$refs.tableRight.bodyWrapper
      tableLeft.addEventListener('scroll', () => {
        if (this.tableLinkage) {
          const top = Math.round((tableRight.scrollHeight - tableRight.clientHeight) * tableLeft.scrollTop / (tableLeft.scrollHeight - tableLeft.clientHeight))
          this.scrollRightTable({ top })
        }
      })
    },
    getTableList () {
      const tableList = []
      for (let i = 0; i < 100; i++) {
        tableList.push({ name: '小王', age: 18, addr: '北京', id: i + 1 })
      }
      this.tableList = tableList
      this.tableListFreezen = Object.freeze(JSON.parse(JSON.stringify(tableList)))
    },
    getTableListR () {
      const tableList = []
      for (let i = 300; i < 400; i++) {
        tableList.push({ name: '小王', age: 19, addr: '上海', id: i + 1 })
      }
      this.tableListR = tableList
      setTimeout(() => {
        this.$nextTick(this.startSort)
      }, 300)
    },
    // 开始拖动
    startSort () {
      // 右侧拖动表格
      const tableRows = document.querySelector('.drag-table-wrapper .el-table.table-right tbody').getElementsByClassName('el-table__row')
      for (let i = 0; i < tableRows.length; i++) {
        tableRows[i].setAttribute('draggable', 'true')
        tableRows[i].addEventListener('dragstart', (e) => {
          // 记录开始拖动表格
          this.dragIndex = i
        })
      }
      // 左侧目标表格
      const tableRows2 = document.querySelector('.drag-table-wrapper .el-table.table-left tbody').getElementsByClassName('el-table__row')
      for (let i = 0; i < tableRows2.length; i++) {
        tableRows2[i].addEventListener('dragenter', (e) => { this.doNothing(e) }, false)
        tableRows2[i].addEventListener('dragover', (e) => {
          // 记录当前所在行（事件频率较高，避免重复赋值）
          this.hoverIndex !== i && (this.hoverIndex = i)
          this.doNothing(e)
        }, false)
        tableRows2[i].addEventListener('dragleave', (e) => {
          // 移出时重置当前所在行
          this.hoverIndex = -1
          this.doNothing(e)
        }, false)
        // 阻止 Firefox 打开 URL
        // 拖动在此处放置
        tableRows2[i].addEventListener('drop', (e) => {
          // 当 开始拖动行 和 当前所在行 有效时处理数据
          if (this.hoverIndex > -1 && this.dragIndex > -1) {
            this.tableList.splice(this.hoverIndex, 1, Object.assign(this.tableList[this.hoverIndex], this.tableListR[this.dragIndex]))
            this.recordChange(this.tableList[this.hoverIndex])
            // 重置
            this.hoverIndex = -1
            this.dragIndex = -1
          }
          this.doNothing(e)
        }, false)
      }
    },
    // 记录改动
    recordChange (obj) {
      this.changedList[obj.id] = obj
      const index = this.changedIds.indexOf(obj.id)
      index > -1 ? this.changedIds.splice(index, 1, obj.id) : this.changedIds.push(obj.id)
    },
    // 阻止浏览器默认事件
    doNothing (event) {
      event.stopPropagation()
      event.preventDefault()
    },
    // 左侧表格row-class
    rowClassName (val) {
      if (this.hoverIndex === val.rowIndex || this.changedIds.indexOf(val.row.id) > -1) {
        return 'high-light-row blue'
      } else if (this.selectId === val.row.id) {
        return 'high-light-row'
      } else {
        return ''
      }
    }
  },
  mounted () {
    this.startTableLinkage()
    this.getTableList()
    this.getTableListR()
  }
}
</script>

<style lang="scss">
.drag-table-wrapper {
  .drag-table {
    display: flex;
    .el-table {
      flex: auto;
      border: 1px solid #F4F4F4;
    }
    .table-left {
      flex: 1;
    }
    .table-right {
      flex: 1;
    }
  }
}
// 页面通用样式
.el-table__body-wrapper tbody .el-table__row.high-light-row td {
  background: #d6e5fa;
}
.el-table__body-wrapper tbody .el-table__row.high-light-row.blue td {
  background: #c6f2ff;
}
</style>
