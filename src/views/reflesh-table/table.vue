<template>
  <div class="table-list" ref="dom">
    <div class="table-header">
      <table cellpadding="0" cellspacing="0" border="0">
        <thead>
          <tr>
            <th v-for="(item, index) of cellHeaders" :key="item.value" :style="{ width: item.width }" @click="handleSort(item, index)">
              <div class="cell" :class="item.sort">
                {{ item.label }}
                <span class="caret-wrapper" v-if="item.sortable">
                  <i class="sort-caret ascending"></i>
                  <i class="sort-caret descending"></i>
                </span>
              </div>
            </th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="table-refresh">
      <i :class="refreshLoading ? 'el-icon-loading' : ''">{{ refreshLoading ? '' : '下拉加载' }}</i>
    </div>
    <div class="table-body">
      <table cellpadding="0" cellspacing="0" border="0">
        <tbody>
          <tr v-for="(li, num) of list"
              class="body-item"
              :key="`body${num}`"
              @click="$emit('cell-click', li, num)">
            <td v-for="item of cellHeaders" :key="item.value" :style="{ width: item.width }">
              <span>{{ li[item.value] }}</span>
            </td>
            <td class="tab" @click.stop="$emit('oper-click', li)" :style="{ backgroundColor: oper.backgroundColor }">{{ oper.text }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-next">
      <i class="el-icon-loading"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    headers: {
      type: Array,
      default: function () {
        return []
      }
    },
    list: {
      type: Array,
      default: function () {
        return []
      }
    },
    oper: {
      typr: Object,
      default: function () {
        return {
          backgroundColor: '#3583E6',
          text: '离线缓存'
        }
      }
    }
  },
  data () {
    return {
      layoutWidth: 0,
      tableData: this.list,
      cellHeaders: [],
      refreshLoading: false
    }
  },
  mounted () {
    this.layoutWidth = this.$refs.dom.style.width || this.$refs.dom.clientWidth || this.$refs.dom.offsetWidth || this.$refs.dom.scrollWidth
    let sum = 0
    this.cellHeaders = this.headers.map(item => {
      if (typeof item.width === 'number') {
        sum += item.width
        item.width = item.width + 'px'
      } else if (item.width === 'auto') {
        item.width = this.layoutWidth - sum + 'px'
      }
      return item
    })
  },
  methods: {
    handleSort () {

    }
  }
}
</script>

<style scoped lang="scss">
.table-list {
  width: 100%;
  height: calc(100vh - 100px);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s;
  table {
    overflow: hidden;
    width: 100%;
  }
  .table-header {
    z-index: 9;
    th {
      // background-color: #1A283A;
      border-bottom-color: rgba(255, 255, 255, 0.1);
      font-weight: normal;
      // color: #ffffff;
      text-align: center;
      overflow: hidden;
      user-select: none;
      padding: 5px 0;
      min-width: 0;
      box-sizing: border-box;
      text-overflow: ellipsis;
      vertical-align: middle;
      position: relative;
      font-size: 14px;
      .cell.descending .sort-caret.descending {
        border-top-color: #409EFF!important;
      }
      .cell.ascending .sort-caret.ascending {
        border-bottom-color: #409EFF!important;
      }
      .cell {
        .caret-wrapper {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          height: 34px;
          width: 24px;
          vertical-align: middle;
          cursor: pointer;
          overflow: initial;
          position: relative;
          .sort-caret {
            width: 0;
            height: 0;
            border: solid 5px transparent;
            position: absolute;
            left: 7px;
          }
          .sort-caret.ascending {
            border-bottom-color: #C0C4CC;
            top: 5px;
          }
          .sort-caret.descending {
            border-top-color: #C0C4CC;
            bottom: 7px;
          }
        }
      }
    }
  }

  .table-refresh {
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 44px;
    left: 0;
    width: 100%;
    opacity: 0;
    transition: opacity 0.3s;
    font-size: 12px;
    font-weight: 400;
    font-style: normal;
  }
  .table-next {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s;
    font-size: 12px;
    font-weight: 400;
    font-style: normal;
  }

  .table-body {
    $tableMaxLength: 500;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100% - 44px);
    tbody tr {
      font-size: 14px;
      font-weight: 400;
      position: absolute;
      left: 0;
      transition: left 0.3s;
      td {
        border-bottom: 1px solid #ccc;
        padding: 10px 0;
        box-sizing: border-box;
        position: relative;
        width: 80px;
        text-align: center;
      }
      .tab {
        position: absolute;
        top: 0;
        right: -88px;
        width: 88px;
        height: 100%;
        background-color: #4293b9;
        color: #f0f0f0;
        line-height: 1.5;
      }
    }
    @while($tableMaxLength > 0) {
      tbody tr:nth-child(#{$tableMaxLength}) {
        top: 44px * ($tableMaxLength - 1);
      }
      $tableMaxLength: $tableMaxLength - 1
    }
  }
}
</style>
