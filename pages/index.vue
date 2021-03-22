<template>
<section>
  <div class="controller">
      <div class="view-welcome" 
      v-if="state == ''">
          <div class="icon-box">
            <img src="~/static/favicon.png" alt="">
          </div>
          <h1 class="app-title" 
          v-if="state == ''">
              <span>BandPocket</span>
          </h1>
          <button class="signUp" @click="state = 'signup'">
              <p>
                  <span>新規アカウントを登録</span>
              </p>
          </button>
          <button class="signIn" @click="state = 'signin'">
              <p>
                  <span>既存アカウントでログイン</span>
              </p>
          </button>
          <button class="guestIn" @click="$store.dispatch('auth/signin', {email: guest.email, password: guest.password})">
              <p>
                  <span>ゲストアカウントでお試し</span>
              </p>
          </button>
      </div>
      <div class="view-signup"
      v-if="state == 'signup'">
          <p class="description">
              <span>Name / 氏名</span>
          </p>
          <input type="name" v-model="name" placeholder="John Doe">
          <p class="description">
              <span>Email / メールアドレス</span>
          </p>
          <input type="email" v-model="email" placeholder="sample@drink.jp" autocomplete="email">
          <p class="description">
              <span>Password / パスワード</span>
          </p>
          <input type="password" v-model="password" placeholder="password">
          <button @click="signup">
              <p>
                  <span>アカウントを登録</span>
              </p>
          </button>
          <button class="back" @click="state = ''">
              <p>
                  <span>戻る</span>
              </p>
          </button>
      </div>
      <div class="view-signin"
      v-if="state == 'signin'">
          <p class="description">
              <span>Email / メールアドレス</span>
          </p>
          <input type="email" v-model="email" placeholder="XXX@XXX.jp" autocomplete="email">
          <p class="description">
              <span>Password / パスワード</span>
          </p>
          <input type="password" v-model="password" placeholder="XXXXXXXX">
          <button @click="signin">
              <p>
                  <span>サインイン</span>
              </p>
          </button>
          <button class="back" @click="state = ''">
              <p>
                  <span>戻る</span>
              </p>
          </button>
      </div>
  </div>
</section>
</template>

<script>
export default {
    methods: {
        signin: function(){
            if (!!this.email && !!this.password) {
                this.$store.dispatch('auth/signin', {email: this.email, password: this.password});
            } else {
                alert('メールアドレスとパスワードのどちらかが入力されていません')
            }
        },
        signup: function(){
            if (!!this.email && !!this.password && !!this.name) {
                this.$store.dispatch('auth/signup', {email: this.email, password: this.password, name: this.name});
            } else {
                alert('メールアドレスとパスワードのどちらかが入力されていません')
            }
        },
    },
    data: function(){
        return {
            guest: {
                email: process.env.GUEST_MailAddress,
                password: process.env.GUEST_Password,
            },
            state: '',
            email: '',
            password: '',
            name: '',
        }
    },
    mounted: function(){
        this.$store.dispatch('auth/signOut');
    },
}
</script>

<style lang="scss" scoped>
$theme-color: #060521;
div.controller{
    padding-left: 8px;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    background: $theme-color;
    button{
        margin-bottom: 16px;
        padding: 0;
        border: 0;
        border-radius: 8px;
        width: 100%;
        height: 48px;
        position: relative;
        left: 50%;
        transform: translate(-50%, 0);
        &:active{opacity: 0.4;}
        &:focus{outline: none;}
        background: #fff;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        p{
            line-height: 48px;
            span{
                color: $theme-color;
                font-size: 16px;
                font-weight: 600;
            }
        }
        &.guestIn{
          border: solid 1px #fff;
            background: transparent;
            p{
                span{
                    color: #fff;
                }
            }
        }
    }
    button.back{
        margin-bottom: 8px;
        padding: 0;
        border: solid 1px #fff;
        border-radius: 8px;
        width: 100%;
        position: relative;
        left: 50%;
        transform: translate(-50%, 0);
        &:active{opacity: 0.4;}
        &:focus{outline: none;}
        background: transparent;
        filter: none;
        p{
            text-decoration: underline;
            line-height: 48px;
            span{
                color: #fff;
                font-size: 16px;
                font-weight: 600;
            }
        }
    }
    div.view-welcome{
        width: 320px;
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        div.icon-box{
          width: 240px;
          height: 240px;
          position: relative;
          left: 50%;
          transform: translateX(-50%);
          img{
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
        h1{
            margin-top: 48px;
            margin-bottom: 32px;
            text-align: center;
            filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.2));
            span{
                // color: transparent;
                color: #fff;
                font-size: 32px;
                font-family: 'Comfortaa';
            }
        }
    }
    div.view-signup, div.view-signin{
        width: 320px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        p.description{
            margin-bottom: 4px;
            border-radius: 8px;
            filter: drop-shadow(0 4px 8px rgba(255, 255, 255, 0.4));
            span{
                color: #fff;
                font-size: 16px;
                font-weight: 600;
            }
        }
        input{
            display: block;
            margin-bottom: 16px;
            padding: 16px;
            border: 0;
            border-radius: 8px;
            width: calc(100% - 32px);
            height: 24px;
            background: #fff;
            font-size: 16px;
            font-weight: lighter;
            &:focus{outline: none;}
            &:last-child{
              margin-bottom: 480px;
            }
        }
        button{
          position: relative;
          top: 48px;
        }
    }
}
</style>