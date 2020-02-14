<template>
  <svg :fill="color" class="app-loading" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
  <path :fill="color" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
    <animateTransform attributeType="xml"
      attributeName="transform"
      type="rotate"
      from="0 25 25"
      to="360 25 25"
      dur="0.6s"
      repeatCount="indefinite"/>
    </path>
  </svg>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#000'
    }
  }
};
</script>

<style lang="stylus" scoped>
.app-loading {
  // filter: drop-shadow( 0px 0px 4px rgba(0, 0, 0, .8));
  // animation: loading-rotate 2s ease-in-out infinite;
}

// @keyframes loading-rotate {
//   0% {
//     transform: rotate(0deg);
//   }
//   40% {
//     transform: rotate(190deg);
//   }
//   50% {
//     transform: rotate(180deg);
//   }
//   90% {
//     transform: rotate(370deg);
//   }
//   100% {
//     transform: rotate(360deg);
//   }
// }
</style>
