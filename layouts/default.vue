<template>
  <div>
    <Nuxt />
    <Menu/>
  </div>
</template>

<script>
import Menu from '~/components/common/Menu.vue';
export default {
  components: {
    Menu,
  },
}
</script>

<style lang="scss">
$font-ja: "Yu Gothic Medium", "游ゴシック Medium", '游ゴシック', "游ゴシック体", 'Yu Gothic', YuGothic, 'メイリオ', 'Meiryo', sans-serif;
*{
  margin: 0;
  -webkit-font-smoothing: antialiased;
  font-family: $font-ja;
}
html{
  background: #fcfcfc;
}
section{
  padding-left: 32px;
  padding-right: 16px;
}
</style>
