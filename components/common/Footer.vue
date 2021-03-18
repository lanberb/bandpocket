<template>
    <div class="footer">
        <nuxt-link to="/">
            <small>Home</small>
        </nuxt-link>
        <p>
            <small>©︎Nao Sasaki｜Lanberb 2020</small>
        </p>
    </div>
</template>

<style lang="scss">
$font-ja: "Yu Gothic Medium", "游ゴシック Medium", '游ゴシック', "游ゴシック体", 'Yu Gothic', YuGothic, 'メイリオ', 'Meiryo', sans-serif;
*{
  font-family: $font-ja;
}
div.footer{
    padding-bottom: 32px;
    width: 100%;
    z-index: 1;
    font-size: 10px;
    text-align: center;
    a{
        color: #444;
        text-decoration: none;
    }
    p{
        color: #bbb;
    }
}
</style>