<template>
    <section class="container">
        <div class="head">
            <p>
                <span>予約情報確認</span>
            </p>
        </div>
        <div class="data-viewer">
            <p class="data-section">
                <span>お客様情報</span>
            </p>
            <div class="user-name">
                <p class="label">
                    <span>氏名</span>
                </p>
                <input type="text" v-model="name" placeholder="範馬刃牙">
            </div>
            <div class="email">
                <p class="label">
                    <span>連絡先メールアドレス</span>
                </p>
                <input type="text" v-model="email" placeholder="xxx@bandpocket.jp">
            </div>
            <div class="people">
                <p class="label">
                    <span>利用人数</span>
                </p>
                <input type="number" v-model="number" size="10" placeholder="人数を選択してください">
            </div>
        </div>
        <div class="shop-viewer">
            <p class="data-section">
                <span>お客様情報</span>
            </p>
            <p class="name">
                <span>{{ $store.state.reserve.name }}</span>
            </p>
            <p class="date">
                <span>{{ date }}</span>
            </p>
        </div>
        <div class="fee-viewer">
            <p class="data-section">
                <span>金額</span>
            </p>
            <div class="fee">
                <p>
                    <span>合計金額</span>
                </p>
                <p>
                    <span>¥{{ fee }}</span>
                </p>
            </div>
        </div>
        <button class="reserve-button" :class="!!number ? 'reserve-button-active' : null" @click="$store.dispatch('reserve/booking')">
            <span>予約を確定する</span>
        </button>
        <Footer/>
    </section>
</template>

<script>
import firebase from '~/plugins/firebase.js';
import Footer from '~/components/common/Footer.vue';
export default {
    components: {
        Footer
    },
    methods: {
    getMin: function(time) {
            return Math.floor(time * 60 % 60) == 0 ? '00' : Math.floor(time * 60 % 60);
        },
    },
    mounted: function() {
        const fee = this.$store.state.reserve.fee;
        const start = this.$store.state.reserve.start;
        const finish = this.$store.state.reserve.finish;
        this.date = (
            Math.floor(start) + ':' + this.getMin(start) 
            + '~' + Math.floor(finish) + ':' + this.getMin(finish)
            + ', ' + Math.floor((finish - start) * 60) + '分'
        );
        this.fee = fee * (finish - start);
    },
    data: function() {
        return {
            name: firebase.auth().currentUser.displayName,
            email: firebase.auth().currentUser.email,
            number: 0,
            date: '',
            fee: 0,
        }
    },
}
</script>

<style lang="scss" scoped>
$theme-color: #060521;
div.head{
    width: 100%;
    position: relative;
    margin-bottom: 24px;
    p{
        margin-top: 44px;
        margin-bottom: 48px;
        width: 100%;
        text-align: center;
        span{
            color: $theme-color;
            font-weight: bold;
        }
    }
}
div{
    width: 100%;
    position: relative;
    margin-bottom: 24px;
    p.data-section{
        margin-bottom: 32px;
        padding-left: 32px;
        width: calc(100vw - 32px);
        height: 32px;
        position: relative;
        left: -32px;
        background: #e5e5e5;
        line-height: 32px;
        span{
            color: $theme-color;
            font-weight: bold;
        }
    }
    div.user-name, div.email, div.people{
        width: 100%;
        p{
            margin-bottom: 8px;
            padding-left: 8px;
            position: relative;
            &::before{
                content: '';
                border-radius: 2px;
                width: 4px;
                height: 16px;
                position: absolute;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
                background: $theme-color;
            }
            span{
                color: $theme-color;
                font-weight: bold;
            }
        }
        input{
            display: block;
            margin-bottom: 32px;
            padding-left: 16px;
            border-radius: 4px;
            border: solid 1px #BCBCBC;
            width: calc(100% - 16px);
            height: 48px;
            font-size: 16px;
            &::placeholder{
                color: #BCBCBC;
            }
        }
    }
    p.name{
        span{
            color: $theme-color;
            font-weight: bold;
        }
    }
    p.date{
        margin-bottom: 32px;
        span{
            color: $theme-color;
            font-weight: lighter;
        }
    }
    div.fee{
        display: flex;
        justify-content: space-between;
        p{
            span{
                color: $theme-color;
                font-weight: bold;
            }
        }
    }
    button.reserve-button{
        pointer-events: none;
        margin-top: 32px;
        margin-bottom: 32px;
        border-radius: 16px;
        border: solid 1px $theme-color;
        position: relative;
        width: 100%;
        height: 64px;
        background: $theme-color;
        opacity: 0.4;
        text-align: center;
        line-height: 44px;
        &:focus{outline: none;}
        span{
            color: #fff;
            font-size: 16px;
            font-weight: bold;
        }
        &-active{
            pointer-events: all;
            opacity: 1;
        }
    }
}
</style>
