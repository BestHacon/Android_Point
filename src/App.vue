<template>
  <div id="app-container">
    <router-view/>

  </div>
</template>

<script setup>
import consoleCapoo from '@/assets/consleCapoo.js'
// 打印控制台标签
console.log('%c %cCode by www.hacon.top',
  'display: inline; padding:20px; background-image: url(' + consoleCapoo + '); background-repeat: no-repeat; background-position: center center;  background-size: 50px;',
  'display: inline-block; border-radius: 17px; margin: 8px; padding: 8px 24px; line-height: 18px; color: #000000; font-size: 12px; font-family: sans-serif; font-weight: 700; background-image: linear-gradient(30deg,  #CFF9FD 0%, #FDF4DA 48%, #FDCCFC 100%);'
)
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app-container{
  height: 100vh;
  width: 100vw;
}

</style>
