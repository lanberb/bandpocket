<template>
  <div class="menu">
    <input type="checkbox" id="menu-checkbox">
    <label for="menu-checkbox">
      <div class="hamburger">
        <div class="crescenet"></div>
      </div>
    </label>
  </div>
</template>

<style lang="scss" scoped>
$theme-color: #060521;
div.menu{
  position: fixed;
  top: 0;
  input{
    display: none;
    &:checked + label{
      width: 80vw;
      overflow: visible;
      div.hamburger{
        background: $theme-color;
        &::before, &::after{
          top: 31.3px;
          left: 20.2px;
          transform: rotate(45deg);
        }
        &::after{
          transform: rotate(-45deg);
        }
      }
    }
  }
  label{
    transition: 250ms;
    display: block;
    padding-top: 20px;
    border-radius: 0 0 16px 0;
    width: 16px;
    height: calc(100vh - 20px);
    background: $theme-color;
    filter: drop-shadow( 0 4px 4px rgba(0, 0, 0, 0.2));
    // &::before{
    //   content: '';
    //   width: 100vw;
    //   height: 100vh;
    //   position: absolute;
    //   top: 0;
    //   background: tomato;
    //   z-index: -1;
    // }
    div.hamburger{
      transition: 250ms;
      border-radius: 0 16px 16px 0;
      width: 64px;
      height: 64px;
      position: absolute;
      left: 100%;
      transform: translateX(-16px);
      background: $theme-color;
      z-index: 1;
      &::before, &::after{
        content: '';
        transition: 250ms;
        width: 32px;
        height: 2px;
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        z-index: 1;
      }
      &::after{top: 60%;}
    }
  }
}
</style>