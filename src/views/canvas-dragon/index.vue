<template>
<div id="dragon-wrapper">
  <canvas id="canvas" style="position: absolute;top:30px;z-index: 1;filter: blur(5px);"></canvas>
</div>
</template>

<script>
export default {
  data () {
    return {}
  },
  mounted () {
    this.drawDragonImageInCanvas()
  },
  methods: {
    drawDragonImageInCanvas () {
      const canvas = document.getElementById('canvas')
      const ctx = canvas.getContext('2d')

      const image = new Image()
      image.src = require('@/assets/dragon.jpg')
      image.onload = function () {
        canvas.width = image.width
        canvas.height = image.height

        ctx.drawImage(image, 0, 0)

        const imageData = ctx.getImageData(0, 0, image.width, image.height).data
        // console.log(imageData.length, canvas.width, canvas.height)

        ctx.clearRect(0, 0, image.width, image.height)

        const gap = 10

        const dragonContainer = document.getElementById('dragon-wrapper')
        const dragonScale = 2

        for (let h = 0; h < image.height; h += gap) { // imageWidth: 656  imageHeight: 356 imageData.length 934144   934144 / 656 / 356 = 4
          for (let w = 0; w < image.width; w += gap) {
            const position = (image.width * h + w) * 4
            const r = imageData[position]
            const g = imageData[position + 1]
            const b = imageData[position + 2]
            if (r + g + b === 0) {
              const bubble = document.createElement('img')
              bubble.src = require('@/assets/bubble.png')
              bubble.setAttribute('class', 'bubble')

              const bubbleSize = Math.random() * 10 + 20

              bubble.style.left = (w * dragonScale - bubbleSize / 2) + 'px'
              bubble.style.top = (h * dragonScale - bubbleSize / 2) + 'px'

              bubble.style.width = bubble.style.height = bubbleSize + 'px'

              bubble.style.animationDuration = Math.random() * 6 + 4 + 's'

              dragonContainer.appendChild(bubble)
            }
          }
        }
      }
    }
  }
}
</script>
<style lang="scss">
  #dragon-wrapper {
    background: pink;
    width: 100%;
    height: calc(100vh - 100px);
    position: relative;
    .bubble {
      position: absolute;
      animation-timing-function: linear;
      animation-name: floating;
      animation-iteration-count: infinite;
    }

    @keyframes floating {
      0% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-5px);
      }
      100% {
        transform: translateY(0px);
      }
    }
  }
</style>
