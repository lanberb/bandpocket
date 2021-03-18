<template>
    <section>
        <img src="~/static/caught-in-joy-ptVBlniJi50-unsplash.jpg" alt="studio-img">
        <div class="reserve-paper">
            <p class="studio-name">
                <span>
                    {{ name }}
                </span>
            </p>
            <p class="studio-description" v-if="!!description">
                <span>
                    {{ description }}
                </span>
            </p>
            <hr noshade>
            <div class="date-selector">
                <button class="date-prev" @click="reloadTable(-1, null)"></button>
                <p>
                    <span>{{ date }}</span>
                </p>
                <button class="date-prev" @click="reloadTable(1, null)"></button>
            </div>
            <div class="room-selector">
                <button class="room"
                v-for="r in datas.rooms"
                :key="r.id"
                :class="r == room ? 'room-active' : null"
                @click="reloadTable(null, r)">
                    <span>{{ 'ルーム: ' + r }}</span>
                </button>
            </div>
            <hr noshade>
            <div class="usage-viewer">
                <p class="section-name"><span>利用時間</span></p>
                <h2>
                    <span>{{ usage }}</span>
                </h2>
            </div>
            <div class="table">
                <div class="cell"
                v-for="(h, index) in datas.daylist"
                :key="h.id" 
                @click="selected(index)">
                    <div class="time">
                        <span>{{ 
                            Math.floor((index + datas.open) * datas.term / 60 ) 
                            + ':' 
                            + (
                                Math.floor(index * datas.term % 60) == 0
                                ? '00'
                                : Math.floor(index * datas.term % 60)
                            )
                        }}</span>
                    </div>
                    <div class="possibility"
                    :class="{
                        'possibility-reserved': h.reserve,
                        'possibility-selected': h.selected,
                    }">
                        <span>{{ 
                            datas.daylist[index].reserve ? '' : '⭕️' 
                        }}</span>
                    </div>
                </div>
                <div class="cell"
                @click="selected(datas.daylist.length)">
                    <div class="time">
                        <span>{{
                            Math.floor(datas.term / 60 * datas.close) 
                            + ':' 
                            + (
                                Math.floor(datas.term * datas.close % 60) == 0 
                                ? '00' 
                                : Math.floor(datas.term * datas.close % 60)
                            )
                        }}</span>
                    </div>
                    <div class="possibility">
                        <span>Close / 閉店</span>
                    </div>
                </div>
            </div>
            <div class="date-selector-large">
                <button class="date-prev" @click="reloadTable(-1, null)">
                    <span>前日</span>
                </button>
                <button class="date-prev" @click="reloadTable(1, null)">
                    <span>次日</span>
                </button>
            </div>
            <hr noshade>
            <button class="reserve-button" @click="makeBooking">
                <span>予約情報を確認する</span>
            </button>
            <Footer/>
        </div>
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
        makeBooking: function() {
            const open = this.datas.open;
            const term = this.datas.term;
            const booking = this.booking;
            const hour = function(index) {
                return Math.floor((index + open)  * term / 60) < 10 ? '0' + Math.floor((index + open)  * term / 60) : Math.floor((index + open)  * term / 60);
            }
            const minuite = function(index) {
                return Math.floor(index * term % 60) == 0 ? '00' : Math.floor(index * term % 60);
            }
            const ob = new Object();
            ob.name = firebase.auth().currentUser.displayName;
            ob.email = firebase.auth().currentUser.email;
            ob.start = String(hour(booking[0])) + String(minuite(booking[0]));
            ob.finish = String(hour(booking[1])) + String(minuite(booking[1]));
            ob.date = this.date;
            ob.room = this.room;
            console.log(ob);
            // あと予約機能つければひとまず終わり！！！！！！！！！！！！！お疲れ！！！！！！！！！！！！！！！！！！！！
            // お前の人生を頑張れるのはお前しかいない！！！！！！！！！！！！！！！頑張れ！！！！！！！！！！！！！！！！！！！！！！！！
            // 歯医者行ったらなんか飯食いに行って学校行ってアプリの自慢するとかいいんじゃね？
        },
        reloadTable: async function(n, room) {
            if (!!room) this.room = room;
            if (!!n) this.day += n;
            if (this.day <= 0) this.day = 0;
            if (this.day >= 7) this.day--;

            const now = new Date();
            const date = (now.getDay() + this.day) % 7;
            const day = now.getDate() + this.day;
            const month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
            const year = now.getFullYear();
            const dateTag = String(year) + String(month) + String(day);
            const timeTable = [];
            const translateTime = function(term, open) {
                const h = 60 / term * Number(open.slice(0, 2));
                const m = Number(open.slice(-2)) / term;
                return h + m;
            };
            this.datas.term = this.datas.list.term[date];
            this.date = year + '年' + month + '月' + day + '日';

            // 単位利用時間を１つの要素として、24時間分のタイムテーブルを生成
            // ex. 単位利用時間が1時間 => タイムテーブル内に24個の要素
            // ex. 単位利用時間が30分 => タイムテーブル内に48個の要素
            for (let i = 0; i < (60 / this.datas.term * 24); i++) {
                const ob = new Object();
                ob.reserve = false;
                ob.selected = false;
                timeTable.push(ob);
            }

            // デフォルト部屋の予約時間を取得 => timeTableに予約状況を反映
            for (let i = 0; i < this.datas.reserved.length; i++) { 
                // 日付がdateTagと等しくない予約をフィルター
                if (this.datas.reserved[i].date == dateTag && this.datas.reserved[i].room == this.room) {
                    // 予約１つの開始時間, 終了時間を単位利用時間を基準に変換
                    const reserveStart = translateTime(this.datas.term, this.datas.reserved[i].start);
                    const reserveFinish = translateTime(this.datas.term, this.datas.reserved[i].finish);
                    // 予約の開始時間, 終了時間をindexとしてtimeTableに予約済みの設定
                    for (let i = 0; i < reserveFinish - reserveStart; i++) {
                        timeTable[reserveStart + i].reserve = true;
                    }
                }
            }

            // 開店までの要素（空き時間）をtimeTableから削除
            for (let i = 0; i < translateTime(this.datas.term, this.datas.list.open[date]); i++) timeTable.shift();
            // 開店までの要素（空き時間）をtimeTableから削除
            for (let i = 0; i < (60 / this.datas.term * 24 - translateTime(this.datas.term, this.datas.list.close[date])); i++) timeTable.pop();

            this.datas.open = translateTime(this.datas.term, this.datas.list.open[date]);
            this.datas.close = translateTime(this.datas.term, this.datas.list.close[date]);
            this.datas.daylist = timeTable.concat();
            this.booking.splice(0);
        },
        selected: function(index) {
            if ((this.booking.length == 0 || this.booking.length == 2) && index == this.datas.daylist.length) {
                for (let i = 0; i < this.booking[1] - this.booking[0]; i++) {
                    this.datas.daylist[this.booking[0] + i].selected = false;
                }
                this.booking.splice(0);
                return true;
            }

            // booking[0], booking[1]に値がある場合
            if (this.booking.length >= 2) {
                for (let i = 0; i < this.booking[1] - this.booking[0]; i++) {
                    this.datas.daylist[this.booking[0] + i].selected = false;
                }
                this.booking.splice(0);
            }

            // booking[0]に開始時間が含まれている場合, booking[1]に終了時間を追加
            if (this.booking.length == 1 && index > this.booking[0]) {
                this.booking.push(index);
                const daylist = this.datas.daylist.concat();
                const list = daylist.splice(this.booking[0], this.booking[1] - this.booking[0]).map(i => i.reserve).includes(true); 
                // 開始から終了までの時間に予約済時間が含まれていた場合
                if (list) {
                    this.usage = '予約済みの時間は予約できません';
                    this.datas.daylist[this.booking[0]].selected = false;
                    this.booking.splice(0);
                }
                // 開始から終了までの全時間が空いている場合
                if (!list) {
                    for (let i = 0; i < this.booking[1] - this.booking[0]; i++) {
                        this.datas.daylist[this.booking[0] + i].selected = true;
                    }
                }
            }

            // booking[0]に値がなく、クリックしたindexの時間が予約済でない場合
            if (this.booking.length == 0 && !this.datas.daylist[index].reserve) {
                this.datas.daylist[index].selected = true;
                this.booking.push(index);
            }
        },
    },
    watch: {
        booking: function(value) {
            const open = this.datas.open;
            const term = this.datas.term;
            const hour = function(index) {
                return Math.floor((index + open) * term / 60);
            }
            const minuite = function(index) {
                return Math.floor(index * term % 60) == 0 ? '00' : Math.floor(index * term % 60);
            }
            if (!(value[0] + 1) && !(value[1] + 1)) {
                this.usage = '再度お選びください';
            }
            if (!!(value[0] + 1) && !(value[1] + 1)) {
                this.usage = hour(value[0]) + ':' + minuite(value[0]) + ' ~ ';
            }
            if (!!(value[1] + 1)) {
                this.usage = hour(value[0]) + ':' + minuite(value[0]) + ' ~ ' + hour(value[1]) + ':' + minuite(value[1]) + '（' + ((this.booking[1] - this.booking[0]) * this.datas.term) + '分）';
            }
        },
    },
    data: function() {
        return {
            booking: [],
            usage: '利用時間をお選びください',
            day: 0,
            date: '',
            room: '',
            name: '',
            description: '',
            datas: {
                open: 0,
                close: 0,
                close: '',
                cost: 800,
                list: {
                    term: '',
                    open: '',
                    close: '',
                },
                daylist: [],
                reserved: [],
                rooms: [],
            },
            reserveList: {
                start: '',
                finish: '',
                time: '',
                date: '',
            },
        }
    },
    asyncData: async function(query) {
        const timeTable = [];
        var openTime = 0;
        var closeTime = 0;
        var termList = '';
        var openTimeList = '';
        var closeTimeList = '';
        var reserveTerm = '';
        const reserved = [];
        let rooms = '';
        let name = '';
        let description = '';

        // 時間を表す文字列からterm基準に変換したindexを出力
        const translateTime = function(term, open) {
            const h = 60 / term * Number(open.slice(0, 2));
            const m = Number(open.slice(-2)) / term;
            return h + m;
        };

        const now = new Date();
        const date = now.getDay();
        const day = now.getDate();
        const month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
        const year = now.getFullYear();
        const dateTag = String(year) + String(month) + String(day);

        // 店舗データを取得, データを元にArray[Object{reserve: Boolean}] 型のタイムテーブルの生成
        await firebase.firestore().collection('studio').doc(query.params.id).get().then(function(shopData) {
            // 単位利用時間, 開店時間, 閉店時間を設定
            reserveTerm = shopData.data().term[date];
            openTime = translateTime(reserveTerm, shopData.data().open[date]);
            closeTime = translateTime(reserveTerm, shopData.data().close[date]);
            termList = shopData.data().term;
            openTimeList = shopData.data().open;
            closeTimeList = shopData.data().close;
            rooms = shopData.data().rooms;
            name = shopData.data().name;
            description = shopData.data().description;

            // 単位利用時間を１つの要素として、24時間分のタイムテーブルを生成
            // ex. 単位利用時間が1時間 => タイムテーブル内に24個の要素
            // ex. 単位利用時間が30分 => タイムテーブル内に48個の要素
            for (let i = 0; i < (60 / reserveTerm * 24); i++) {
                const ob = new Object();
                ob.reserve = false;
                ob.selected = false;
                timeTable.push(ob);
            }
        }).catch(console.error);

        // デフォルト部屋の予約時間を取得 => timeTableに予約状況を反映
        await firebase.firestore().collection('studio').doc(query.params.id).collection('reserveList').get().then(function(querySnapshot) {
            querySnapshot.forEach((doc) => {
                const book = doc.data();
                reserved.push(book);
                // 日付がdateTagと等しくない予約をフィルター
                if (book.date == dateTag && book.room == rooms[0]) {
                    // 予約１つの開始時間, 終了時間を単位利用時間を基準に変換
                    const reserveStart = translateTime(reserveTerm, book.start);
                    const reserveFinish = translateTime(reserveTerm, book.finish);
                    // 予約の開始時間, 終了時間をindexとしてtimeTableに予約済みの設定
                    for (let i = 0; i < reserveFinish - reserveStart; i++) {
                        timeTable[reserveStart + i].reserve = true;
                    }
                }
            });
        }).catch(console.error);

        // 開店までの要素（空き時間）をtimeTableから削除
        for (let i = 0; i < openTime; i++) timeTable.shift();
        // 開店までの要素（空き時間）をtimeTableから削除
        for (let i = 0; i < (60 / reserveTerm * 24 - closeTime); i++) timeTable.pop();
        return {
            name: name,
            room: rooms[0],
            date: year + '年' + month + '月' + day + '日',
            description: description,
            datas: {
                term: reserveTerm,
                open: openTime,
                close: closeTime,
                daylist: timeTable.concat(),
                reserved: reserved.concat(),
                list: {
                    term: termList,
                    open: openTimeList,
                    close: closeTimeList,
                },
                rooms: rooms.concat(),
            },
        }
    }
}
</script>

<style lang="scss" scoped>
$theme-color: #060521;
img{
    width: 100vw;
    height: 100vw;
    max-height: 480px;
    position: fixed;
    left: 0;
    object-fit: cover;
}
hr{
    border: solid 1px #E5E5E5;
    position: relative;
}
div.reserve-paper{
    padding-top: 48px;
    padding-left: 32px;
    padding-right: 16px;
    width: calc(100vw - 48px);
    position: absolute;
    top: 280px;
    left: 0px;
    background: #fff;
    filter: drop-shadow(0 -4px 4px rgba(0, 0, 0, 0.2));
    p.studio-name{
        margin-bottom: 16px;
        line-height: 32px;
        span{
            color: #2a2a2a;
            font-size: 24px;
            font-weight: bold;
        }
    }
    p.studio-description{
        margin-bottom: 64px;
        line-height: 20px;
        span{
            color: #2a2a2a;
            font-size: 12px;
            font-weight: lighter;
        }
    }
    div.date-selector{
        display: flex;
        justify-content: space-between;
        margin-top: 32px;
        margin-bottom: 16px;
        width: 100%;
        p{
            line-height: 32px;
            span{
                color: $theme-color;
                font-weight: bold;
            }
        }
        button{
            border-radius: 16px;
            border: solid 1px $theme-color;
            position: relative;
            width: 64px;
            height: 32px;
            background: #fff;
            &:focus{outline: none;}
            &:last-child{
                transform: scale(-1, 1);
            }
            &::before, &::after{
                content: '';
                width: 12px;
                height: 1px;
                position: absolute;
                top: 11px;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                background: $theme-color;
            }
            &::after{
                top: 18.5px;
                transform: translate(-50%, -50%) rotate(45deg);
            }
        }
    }
    div.room-selector{
        white-space: nowrap;
        margin-bottom: 32px;
        width: 100%;
        overflow: scroll;
        &::-webkit-scrollbar{
            display: none;
        }
        button.room{
            display: inline-block;
            margin-right: 8px;
            padding: 16px;
            border: solid 1px $theme-color;
            border-radius: 24px;
            height: 48px;
            background: #fff;
            line-height: 0;
            &:focus{outline: none;}
            &.room-active{
                background: $theme-color;
                span{
                    color: #fff;
                }
            }
            span{
                color: $theme-color;
                font-weight: bold;
            }
        }
    }
    div.usage-viewer{
        margin-top: 32px;
        margin-bottom: 32px;
        p.section-name{
            margin-bottom: 16px;
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
        h2{
            text-align: center;
            span{
                color: $theme-color;
            }
        }
    }
    div.table{
        margin-bottom: 24px;
        border: solid 1px #e5e5e5;
        width: 100%;
        max-height: 420px;
        overflow: scroll;
        div.cell{
            display: flex;
            height: 40px;
            background: #fff;
            &:last-child{
                div.possibility{
                        border-color: #2a2a2a;
                        background: #2a2a2a;
                    span{
                        color: #fff;
                    }
                }
            }
            div{
                justify-content: space-between;
                height: 100%;
                text-align: center;
                &.time{
                    border-right: solid 1px #E5E5E5;
                    width: 120px;
                    line-height: 4px;
                }
                &.possibility{
                    border-top: solid 1px #e5e5e5;
                    width: 100%;
                    line-height: 40px;
                    &-reserved{
                        border-color: #2a2a2a;
                        background: #2a2a2a;
                    }
                    &-selected{
                        border-color: #FF6464;
                        background: #FF6464;
                    }
                }
            }
        }
        span{
            display: block;
            width: 100%;
            text-align: center;
        }
    }
    div.date-selector-large{
        display: flex;
        justify-content: space-between;
        margin-top: 32px;
        margin-bottom: 24px;
        width: 100%;
        p{
            line-height: 32px;
            span{
                color: $theme-color;
                font-weight: bold;
            }
        }
        button{
            border-radius: 24px;
            border: solid 1px $theme-color;
            position: relative;
            width: 156px;
            height: 48px;
            background: #fff;
            text-align: center;
            line-height: 44px;
            span{
                color: $theme-color;
                font-size: 16px;
                font-weight: bold;
            }
            &:focus{outline: none;}
            &::before, &::after{
                content: '';
                width: 12px;
                height: 2px;
                position: absolute;
                top: 18px;
                left: 24px;
                transform: translate(-50%, -50%) rotate(-45deg);
                background: $theme-color;
            }
            &::after{
                top: 26px;
                transform: translate(-50%, -50%) rotate(45deg);
            }
            &:last-child{
                &::before, &::after{
                    content: '';
                    width: 12px;
                    height: 2px;
                    position: absolute;
                    top: 18px;
                    left: 100%;
                    transform: translate(calc(-50% - 24px), -50%) rotate(45deg);
                    background: $theme-color;
                }
                &::after{
                    top: 26px;
                    transform: translate(calc(-50% - 24px), -50%) rotate(-45deg);
                }
            }
        }
    }
    button.reserve-button{
        margin-top: 24px;
        margin-bottom: 24px;
        border-radius: 24px;
        border: solid 1px $theme-color;
        position: relative;
        width: 100%;
        height: 64px;
        background: $theme-color;
        text-align: center;
        line-height: 44px;
        &:focus{outline: none;}
        span{
            color: #fff;
            font-size: 16px;
            font-weight: bold;
        }
    }
}
</style>
