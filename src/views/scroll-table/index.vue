<template>
<div class="scroll-table">
  <ScrollTable ref="scrollRef" @pullingUp="pullingUp">
    <!-- <ul class="scroll-list">
      <li v-for="i of dataList" :key="i" class="scroll-list-item">
        {{ i % 5 === 0 ? 'scroll up 👆🏻' : `I am item ${i} `}}
      </li>
    </ul> -->
  </ScrollTable>
</div>
</template>

<script>
import ScrollTable from '@/components/scrollTable'

function generateData () {
  return 50
}
export default {
  components: {
    ScrollTable
  },
  data () {
    return {
      dataList: generateData()
    }
  },
  methods: {
    async pullingUp () {
      try {
        const newData = await this.ajaxGet(/* url */)
        this.dataList += newData
        this.$refs.scrollRef.pullingUpEnd()
      } catch (err) {
        // handle err
        console.log(err)
      }
    },
    ajaxGet (/* url */) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(5)
        }, 500)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .scroll-list {
    padding:  0;
    .scroll-list-item {
      padding:  10px 0;
      list-style:  none;
      border-bottom:  1px solid #ccc;
    }
  }
</style>
