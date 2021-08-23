<template>
  <div class="banner" @click="routeToShopping">
    <div class="pic">
      <!-- 第一個轉場動畫 -->
      <div class="wrapper ml-3 mb-2 position-absolute bottom-0">
        <h1 class="bigline">
          當吻不再只是吻
          <div id="text-mask" />
        </h1>
      </div>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 645 445"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <mask id="theMask" maskUnits="userSpaceOnUse">
            <circle cx="15%" cy="30%" r="15%" fill="#fff" id="centerRect" />
          </mask>
        </defs>

        <g id="maskReveal" mask="url(#theMask)" class="w-100 h-100">
          <image
            class="kiss"
            xlink:href="https://i.ibb.co/MkmxG65/the-Lovers.jpg"
          />
        </g>
      </svg>
      <!-- 第一個轉場動畫 END-->
      <!-- 第二個轉場動畫 -->
      <section class="gitch-wrapper w-100 overflow-hidden">
        <h2
          class="position-absolute text-white"
          style="right: 0; left: 0; bottom: 10%; font-size: 64px; z-index: 2"
        >
          這不是雷內・馬格利特
        </h2>
        <div class="position-absolute w-100 h-100 bottom-0">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 645 445"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <clipPath id="myClip">
                <circle cx="50vw" cy="50vh" r="0" class="center-circle" />
              </clipPath>
            </defs>
            <image
              xlink:href="https://i.ibb.co/tPW4dsw/v2-38e09aa22efe339a44019c859f074eb2-r.jpg"
              height="100%"
            />
          </svg>
          <div class="glitch w-100" />
        </div>
      </section>
      <!-- 第二個轉場動畫 END -->
      <!-- 第三個轉場動畫 -->
      <div
        class="position-absolute w-100 overflow-hidden h-100 bottom-0"
        id="third"
        style="background:#f6f7f9;"
      >
        <img
          src="~@imgs/magritte.jpg"
          alt="本周主打"
          id="third-img"
          class="h-100"
        />
        <div class="text position-absolute w-70" style="top:30%;right:0;">
          <section class="animation-3 my-4">
            <div id="upperWrap" class="display-4 w-50 start-0">
              <div id="upper" class="text-uppercase position-absolute  end-0">
                Inside
              </div>
            </div>
            <div id="line" />
            <div id="lowerWrap" class="display-4 w-50 end-0">
              <div id="lower" class="text-uppercase position-absolute">
                Magritte
              </div>
            </div>
          </section>
          <p class="animation-3-text h4 text-center my-3 text-gray-800">
            眼見不一定為實
          </p>
          <span class="animation-3-text text-white h3 p-2 bg-dark-400">2022.5.17~9.18</span>
          <span class="animation-3-text text-white h3 p-2 bg-dark-400">南港展覽館一館</span>
        </div>
      </div>
      <!-- 第三個轉場動畫 END-->
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'

import { useRouter } from 'vue-router'

import { gsap } from 'gsap'

export default {
  name: 'Banner',
  setup () {
    const curAinmation = ref('first')
    onMounted(() => {
      const first = firstAinmation()
      const second = secondAnimation()
      const third = thirdAnimation()
      const animationSum = gsap
        .timeline()
        .add(first)
        .add(second)
        .add(third)
      animationSum.play(0)
    })
    const firstAinmation = () => {
      const animation = gsap
        .timeline({
          repeat: 0,
          yoyo: true,
          defaults: { ease: 'Back.easeInOut', duration: 0.75 }
        })
        .to('#centerRect', { x: 'random(200%, 80%)' })
        .to('.centerRect', { x: 'random(200%, 30%)', y: 'random(180%,30%)' })
        .to('#centerRect', {
          x: 'random(350%, 80%)',
          y: 'random(20%,80%)',
          delay: 0.3
        })
        .to('#text-mask', { xPercent: 100, ease: 'none' }, 'text')
        .to('#centerRect', { r: '100%' })
      return animation
    }
    const secondAnimation = () => {
      const animation = gsap
        .timeline({
          repeat: 0,
          yoyo: true,
          defaults: { ease: 'Back.easeInOut', duration: 1.5 }
        })
        .to('.center-circle', { r: '500%', ease: 'none' })
      return animation
    }
    const thirdAnimation = () => {
      curAinmation.value = 'third'
      const animation = gsap
        .timeline({
          repeat: 0,
          yoyo: true,
          defaults: { ease: 'Power4.easeOut', duration: 1 }
        })
        .from(
          '#third',
          { opacity: 0, transformOrigin: '50% 50%' },
          { opacity: 1 }
        )
        .from('#third-img', { autoAlpha: 0, scale: 3 })
        .from('#line', { scaleY: 0 })
        .from('#upper', { duration: 0.75, x: '110%' }, 'text')
        .from('.animation-3-text', { opacity: 0 }, { opacity: 1 }, '+=1')
        .from('#lower', { duration: 0.75, x: '-110%' }, 'text')
      return animation
    }
    const router = useRouter()
    const routeToShopping = () => {
      router.push({ name: 'Order' })
    }
    return { curAinmation, routeToShopping }
  }
}
</script>

<style lang="sass" scoped>
body > div
  position: relative
  width: auto
  height: auto
  font-size: 5vw
  max-width: 90%
  max-height: 100%
.banner
  width: 100vw
  height: calc(100vh - 50px)
  background: #282828
/*--svg設定--*/
.pic
  position: relative
  height: 100%
h1
  font-size: 4em
  clip-path: inset(0 0 0 0)
/*-- first animation *--/
.wrapper
  padding-left: 5px
  position: absolute
  left: 20%
  bottom: 0
  width: 100%
  border-left: 5px solid #faad14
.bigline
  position: relative
  width: auto
  height: auto
  font-size: 5vw
  max-width: 90%
  max-height: 100%
  font-weight: 700
  color: #fff
  text-align: left
  letter-spacing: -5px
  font-weight: 700
#text-mask
  z-index: 2021
  position: absolute
  top: 0
  bottom: 1rem
  right: 0
  width: 200%
  height: 110%
  max-width: none
  background-image: linear-gradient(to right, transparent, #282828 50%, #282828)
/*-- second animation --*/
.gitch-wrapper
  position: absolute
  height: 100%
  top: 0
  clip-path: url(#myClip)
.glitch
  z-index: 0
  position: absolute
  top: 0
  width: 500px
  height: 100%
  background: url('~@imgs/man.png') no-repeat
  background-position: center
  clip-path: url(#myClip)
  background-size: contain
  &:before
    animation: glitch 2s cubic-bezier(.25, .46, .45, .94) both infinite
  &:after
    animation: glitch 2s cubic-bezier(.25, .46, .45, .94) reverse both infinite
.glitch:before,.glitch:after
  content: ''
  display: block
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  opacity: .8
  background-position: center
  background-size: contain
.glitch:before
  background: url('~@imgs/glitch_red.png') no-repeat
  z-index: 1
  opacity: .5
  background-position: center
  background-size: contain
.glitch:after
  background: url('~@imgs/glitch_green.png') no-repeat
  z-index: 2
  opacity: .5
  background-position: center
  background-size: contain
@keyframes glitch
  0%
    -webkit-transform: translate(0)
    transform: translate(0)
  20%
    -webkit-transform: translate(-10px, 5px)
    transform: translate(-10px, 5px)
  40%
    -webkit-transform: translate(-10px, -5px)
    transform: translate(-10px, -5px)
  60%
    -webkit-transform: translate(10px, 5px)
    transform: translate(10px, 5px)
  80%
    -webkit-transform: translate(10px, -5px)
    transform: translate(10px, -5px)
  to
    -webkit-transform: translate(0)
    transform: translate(0)

/*-- third animation *--/
.animation-3
  position: relative
  width: 100%
  top: -28px
  height: 150px
  color: #1f78d2
  #upperWrap, #lowerWrap
    position: absolute
    overflow: hidden
    height: 150px
    font-weight: 700
#upper
  top: 25px
#lower
  bottom: -5px
  left: 5%

#line
  position: absolute
  right: 50%
  width: 3px
  height: 200px
  transform: rotate(45deg)
  background: $danger
</style>
