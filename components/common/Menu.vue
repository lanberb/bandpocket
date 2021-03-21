<template>
  <div class="menu">
    <input type="checkbox" id="menu-checkbox">
    <label for="menu-checkbox" @click="getUserData">
      <div class="body">
        <div class="user">
          <p>
            <span>{{ name }}</span>
          </p>
          <p>
            <span>{{ email }}</span>
          </p>
        </div>
        <div class="links">
          <nuxt-link to="/home">
            <span>Home / ホームへ戻る</span>
          </nuxt-link>
          <nuxt-link to="/">
            <span>SignOut / サインアウト</span>
          </nuxt-link>
        </div>
      </div>
      <div class="hamburger">
        <div class="crescenet"></div>
      </div>
    </label>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase.js';
export default {
  data: function() {
    return {
      name: null,
      email: null,
    }
  },
  methods: {
    getUserData: function() {
      this.name = !!firebase.auth().currentUser ? firebase.auth().currentUser.displayName : null;
      this.email = !!firebase.auth().currentUser ? firebase.auth().currentUser.email : null;
    },
  },
}
</script>

<style lang="scss" scoped>
$theme-color: #060521;
div.menu{
  position: fixed;
  top: 0;
  z-index: 1;
  input{
    display: none;
    &:checked + label{
      width: 80vw;
      overflow: visible;
      div.body{
        opacity: 1;
      }
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
    div.body{
      transition: 250ms;
      padding-left: 24px;
      padding-right: 24px;
      padding-bottom: 32px;
      width: calc(100% - 40px);
      height: 100%;
      position: absolute;
      opacity: 0;
      div{
        margin-top: 16px;
        width: 100%;
        position: relative;
        white-space: nowrap;
        span{
          color: #fff;
        }
      }
      div.user{
        border-bottom: solid 1px #e5e5e5;
        height: 64px;
        p{
          &:first-child{
            span{
              font-weight: bold;
            }
          }
        }
      }
      div.links{
        a{
          display: block;
          height: 80px;
          text-decoration: none;
          line-height: 80px;
          span{
            font-weight: bold;
          }
        }
      }
    }
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