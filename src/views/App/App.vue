<template>
  <div id="app">
    <!-- <router-link to="face-mask">face-mask</router-link> -->

    <transition name="vue-trans-fade" mode="out-in" type="transition">
      <!-- <keep-alive> -->
      <router-view></router-view>
      <!-- </keep-alive> -->
    </transition>
  </div>
</template>

<style lang="stylus">
#app {
  width: 100%;
  height: 100%;
}
</style>
