<template>
    <section class="container">
        <div class="head">
            <p>
                <span>予約完了</span>
            </p>
        </div>
        <div class="body">
            <h3>
                <span>ご予約ありがとうございました</span>
            </h3>
            <p>
                <span>左上のメニューから予約情報をご確認いただけます。キャンセルの際はスタジオの管理人にお問い合わせください。</span>
            </p>
            <nuxt-link to="/home">
                <span>ホームへ戻る</span>
            </nuxt-link>
        </div>
        <Footer/>
    </section>
</template>

<style lang="scss">
$theme-color: #060521;
div.head{
    width: 100%;
    position: relative;
    border-bottom: solid 1px #e5e5e5;
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
div.body{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% - 48px);
    text-align: center;
    h3{ 
        margin-bottom: 32px;
        span{
            font-size: 20px;
        }
    }
    p{
        margin-bottom: 32px;
        line-height: 18px;
        span{
            font-size: 12px;
        }
    }
    a{
        display: block;
        margin-top: 32px;
        margin-bottom: 32px;
        border-radius: 16px;
        position: relative;
        width: 100%;
        height: 64px;
        background: $theme-color;
        text-align: center;
        text-decoration: none;
        line-height: 64px;
        span{
            color: #fff;
            font-size: 16px;
            font-weight: bold;
        }
    }
}
</style>
