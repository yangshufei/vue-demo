<template>
  <div class="scroll-container">
    <div class="scroll-bswrapper" ref="bsWrapper">
      <div class="scroll-content">

        <div class="top-tips">
          <div v-html="tipText"></div>
        </div>

        <ul class="scroll-list">
          <li v-for="i of dataList" :key="i" class="scroll-list-item">
            {{ i % 5 === 0 ? 'scroll up 👆🏻' : `I am item ${i} `}}
          </li>
        </ul>

        <div class="pullup-tips">
          <div v-if="!isPullUpLoad" class="before-trigger">
            <span class="pullup-txt">Pull up and load more</span>
          </div>
          <div v-else class="after-trigger">
            <span class="pullup-txt">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import PullDown from '@better-scroll/pull-down'
import Pullup from '@better-scroll/pull-up'
BScroll.use(PullDown)
BScroll.use(Pullup)
function generateData () {
  return 10
}

// pulldownRefresh state
const PHASE = {
  moving: {
    enter: 'enter',
    leave: 'leave'
  },
  fetching: 'fetching',
  succeed: 'succeed'
}
const TIME_BOUNCE = 800

const ARROW_BOTTOM = '<svg width="16" height="16" viewBox="0 0 512 512"><path fill="currentColor" d="M367.997 338.75l-95.998 95.997V17.503h-32v417.242l-95.996-95.995l-22.627 22.627L256 496l134.624-134.623l-22.627-22.627z"></path></svg>'
const ARROW_UP = '<svg width="16" height="16" viewBox="0 0 512 512"><path fill="currentColor" d="M390.624 150.625L256 16L121.376 150.625l22.628 22.627l95.997-95.998v417.982h32V77.257l95.995 95.995l22.628-22.627z"></path></svg>'

export default {
  data () {
    return {
      tipText: '',
      isPullingDown: false,
      dataList: generateData(),
      isPullUpLoad: false,
      data: 30
    }
  },
  mounted () {
    this.initBscroll()
  },
  methods: {
    initBscroll () {
      this.bscroll = new BScroll(this.$refs.bsWrapper, {
        scrollY: true,
        bounceTime: TIME_BOUNCE,
        useTransition: false,
        pullDownRefresh: {
          threshold: 70,
          stop: 56
        },
        pullUpLoad: true
      })

      this.bscroll.on('pullingDown', this.pullingDownHandler)
      this.bscroll.on('scrollEnd', e => {
        console.log('scrollEnd')
      })
      // v2.4.0 supported
      this.bscroll.on('enterThreshold', () => {
        this.setTipText(PHASE.moving.enter)
      })
      this.bscroll.on('leaveThreshold', () => {
        this.setTipText(PHASE.moving.leave)
      })
      this.bscroll.on('pullingUp', this.pullingUpHandler)
    },
    async pullingUpHandler () {
      this.isPullUpLoad = true

      await this.requestData()

      this.bscroll.finishPullUp()
      this.bscroll.refresh()
      this.isPullUpLoad = false
    },
    async requestData () {
      try {
        const newData = await this.ajaxGet(/* url */)
        this.dataList += newData
      } catch (err) {
        // handle err
        console.log(err)
      }
    },
    ajaxGet (/* url */) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(20)
        }, 1000)
      })
    },
    async pullingDownHandler () {
      this.setTipText(PHASE.fetching)
      await this.getData()

      this.setTipText(PHASE.succeed)
      // tell BetterScroll to finish pull down
      this.bscroll.finishPullDown()
      // waiting for BetterScroll's bounceAnimation then refresh size
      setTimeout(() => {
        this.bscroll.refresh()
      }, TIME_BOUNCE + 50)
    },
    async getData () {
      const newData = await this.mockFetchData()
      this.dataList = newData
    },
    mockFetchData () {
      return new Promise(resolve => {
        setTimeout(() => {
          const dataList = generateData()
          resolve(dataList)
        }, 2000)
      })
    },
    setTipText (phase = PHASE.default) {
      const TEXTS_MAP = {
        enter: `${ARROW_BOTTOM} Pull down`,
        leave: `${ARROW_UP} Release`,
        fetching: 'Loading...',
        succeed: 'Refresh succeed'
      }
      this.tipText = TEXTS_MAP[phase]
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-container {
  height: 100%;
  .scroll-bswrapper {
    position:  relative;
    height: calc(100vh - 100px);
    padding:  0 10px;
    border:  1px solid #ccc;
    overflow:  hidden;
    .top-tips {
      position:  absolute;
      width:  100%;
      padding:  20px;
      box-sizing:  border-box;
      transform:  translateY(-100%) translateZ(0);
      text-align:  center;
      color:  #999;
    }
    .pullup-tips {
      padding: 20px;
      text-align: center;
      color: #999;
    }
  }

  .scroll-list {
    padding:  0;
    .scroll-list-item {
      padding:  10px 0;
      list-style:  none;
      border-bottom:  1px solid #ccc;
    }
  }
}

</style>
