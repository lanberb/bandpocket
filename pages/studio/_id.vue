<template>
    <section>
        <img :src="thumbnail" alt="studio-img">
        <div class="reserve-paper">
            <p class="studio-name">
                <span>
                    {{ datas.name }}
                </span>
            </p>
            <p class="studio-description" v-if="!!datas.description">
                <span>
                    {{ datas.description }}
                </span>
            </p>
            <hr noshade>
            <div class="date-selector">
                <button class="date-prev" @click="reloadTable(-1, null)"></button>
                <p>
                    <span>{{ userView.date }}</span>
                </p>
                <button class="date-prev" @click="reloadTable(1, null)"></button>
            </div>
            <div class="room-selector">
                <button class="room"
                v-for="r in datas.rooms"
                :key="r.id"
                :class="r == userSelected.room ? 'room-active' : null"
                @click="reloadTable(null, r)">
                    <span>{{ 'ルーム: ' + r }}</span>
                </button>
            </div>
            <div class="usage-viewer">
                <h2>
                    <span>{{ userView.usage }}</span>
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
                <div class="cell">
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
            <p class="description">
                <span>※予約時間は区切らず、連続させてください</span><br>
                <span>※複数の時間の同時予約はできません</span>
            </p>
            <hr noshade>
            <button class="reserve-button" :class="allowBooking ? 'reserve-button-active' : null" @click="makeBooking">
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
        // data への値入力のみの関数
        setDayAndRoom: function(n, room) {
            if (!!room) this.userSelected.room = room;
            if (!!n) this.userSelected.skip += n;
            if (this.userSelected.skip <= 0) this.userSelected.skip = 0;
            if (this.userSelected.skip >= 7) this.userSelected.skip--;
        },
        // 日付&部屋の変更に合わせてtableの中身を変える関数
        reloadTable: function(n, room) {
            // 引数をuserSelectに反映
            this.setDayAndRoom(n, room);

            // ユーザが指定した日時に関する情報を取得
            const dateData = this.getDate();
            this.datas.term = this.datas.list.term[dateData.day];
            // 日付を表すタグを生成 (ex: YYYYMMDD)
            const dateTag = String(dateData.year) + String(dateData.month) + String(dateData.date);
            // タイムテーブル生成
            const timeTable = this.getTimeTable(this.datas.list.term[dateData.day], this.datas.list.open[dateData.day]);

            // デフォルト部屋の予約時間を取得 => timeTableに予約状況を反映
            for (let i = 0; i < this.datas.reserved.length; i++) { 
                // 日付がdateTagと等しくない予約をフィルター
                if (this.datas.reserved[i].date == dateTag && this.datas.reserved[i].room == this.userSelected.room) {
                    // 予約１つの開始時間, 終了時間を単位利用時間を基準に変換
                    const reserveStart = 60 / this.datas.term * this.datas.reserved[i].start;
                    const reserveFinish = 60 / this.datas.term * this.datas.reserved[i].finish;
                    // 予約の開始時間, 終了時間をindexとしてtimeTableに予約済みの設定
                    for (let i = 0; i < reserveFinish - reserveStart; i++) {
                        timeTable[reserveStart + i].reserve = true;
                    }
                }
            }

            // 開店までの要素（空き時間）をtimeTableから削除
            for (let i = 0; i < (60 / this.datas.term * this.datas.list.open[dateData.day]); i++) timeTable.shift();
            // 開店までの要素（空き時間）をtimeTableから削除
            for (let i = 0; i < (60 / this.datas.term * 24 - (60 / this.datas.term * this.datas.list.close[dateData.day])); i++) timeTable.pop();
            
            // 画面上で表示される日時を変更
            this.userView.date = dateData.year + '年' + dateData.month + '月' + dateData.date + '日';

            // 曜日<date>を基に店舗情報を更新
            this.datas.fee = this.datas.list.fee[dateData.day];
            this.datas.open = 60 / this.datas.term * this.datas.list.open[dateData.day];
            this.datas.close = 60 / this.datas.term * this.datas.list.close[dateData.day];
            this.datas.daylist = timeTable.concat();
            // ユーザが画面上で選択した時間帯をリセット
            this.booking.splice(0);
        },
        // ユーザのタッチイベントによってbookingの中身を変える関数
        selected: function(index) {
            if (!this.datas.daylist[index].reserve) { 
                this.datas.daylist[index].selected = !this.datas.daylist[index].selected;
                if (this.datas.daylist[index].selected) {
                    this.booking.push(index);
                }
                if (!this.datas.daylist[index].selected) {
                    this.booking.splice(this.booking.indexOf(index), 1);
                }
                this.booking = Array.from(new Set(this.booking));
                this.booking.sort(function(a, b) {
                    return a - b;
                });
            }
        },
        isIncludeReserved: function() {
            const reserves = this.datas.daylist.map(i => i.reserve);
            for (let i = 0; i < this.booking[0]; i++) reserves.shift();
            for (let i = 0; i < this.datas.daylist.length - this.booking[this.booking.length - 1] - 1; i++) reserves.pop();
            if (reserves.includes(true)) return true;
            return false;
        },
        isIndexContinuously: function() {
            const original = this.booking.concat();
            const copy = this.booking.concat();
            copy.shift();
            copy.push(this.booking[this.booking.length - 1] + 1); 
            for (let i = 0; i < original.length; i++) {
                if (copy[i] - original[i] > 1) return true;
            }
            return false;
        },
        // 何かしらの値をreturnする関数
        getTimeTable: function(term) {
            const timeTable = [];
            for (let i = 0; i < (60 / term * 24); i++) {
                const ob = new Object();
                ob.reserve = false;
                ob.selected = false;
                timeTable.push(ob);
            }
            return timeTable;
        },
        getDate: function() {
            const now = new Date();
            const day = (now.getDay() + this.userSelected.skip) % 7;
            const date = now.getDate() + this.userSelected.skip;
            const month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
            const year = now.getFullYear();
            return { day, date, month, year };
        },
        getFactorial: function(n) {
            if(n <= 1) return 1;
            return n * this.getFactorial(n - 1);
        },
        // 予約確認画面へ進む関数
        makeBooking: function() {
            const open = this.datas.open;
            const term = this.datas.term;
            const booking = this.booking;
            const dateData = this.getDate();
            this.$store.commit('reserve/setReservation', {
                studioId: this.$route.params.id,
                name: this.datas.name,
                fee: this.datas.list.fee[this.getDate().day],
                term: term,
                open: open,
                start: term / 60 * (Number(booking[0]) + Number(open)),
                finish: term / 60 * (Number(booking[booking.length - 1] + 1) + Number(open)),
                date: String(dateData.year) + String(dateData.month) + String(dateData.date),
                room: this.userSelected.room,
            });
        },
    },
    watch: {
        booking: function(value) {
            this.allowBooking = true;
            const open = this.datas.open;
            const term = this.datas.term;
            const hour = (index) => Math.floor((index + open) * term / 60);
            const minuite = (index) => Math.floor(index * term % 60) == 0 ? '00' : Math.floor(index * term % 60);
            if (!!(value[0] + 1) && !(value[1] + 1)) {
                this.userView.usage = hour(value[0]) + ':' + minuite(value[0]) + ' ~ ';
                this.allowBooking = false;
            }
            if (!!(value[value.length - 1] + 1)) {
                this.userView.usage = hour(value[0]) + ':' + minuite(value[0]) + ' ~ ' + hour(value[value.length - 1] + 1) + ':' + minuite(value[value.length - 1] + 1) + '（' + ((this.booking[value.length - 1] - this.booking[0] + 1) * this.datas.term) + '分）';
            }
            if (this.isIncludeReserved() || this.isIndexContinuously()) {
                this.userView.usage = '時間を選び直してください';
                this.allowBooking = false;
            }
            if (value.length == 0) this.allowBooking = false;
            console.log(value)
        },
    },
    data: function() {
        return {
            thumbnail: '',
            allowBooking: false,
            booking: [],
            datas: {
                name: '',
                description: '',
                fee: 0,
                term: 0,
                open: 0,
                close: 0,
                close: '',
                cost: 800,
                list: {
                    fee: '',
                    term: '',
                    open: '',
                    close: '',
                },
                daylist: [],
                reserved: [],
                rooms: [],
            },
            userSelected: {
                skip: 0,
                room: '',
            },
            userView: {
                usage: '利用時間をお選びください',
                date: '',
            },
        }
    },
    mounted: async function() {
        if (!(!!firebase.auth().currentUser)) this.$router.push('/');
        // サムネイルのリンクを取得
        let uri = '';
        await firebase.storage().ref().child('studio-thumbnails/' + this.thumbnail).getDownloadURL().then(function(res) {
            uri = res;
        }).catch(function(error) {
            uri = null;
        });
        await this.reloadTable();
        this.thumbnail = uri;
        this.allowBooking = false;
    },
    asyncData: async function(query) {
        const timeTable = [];
        let openTime = 0;
        let closeTime = 0;
        let feeList = '';
        let termList = '';
        let openTimeList = '';
        let closeTimeList = '';
        let reserveTerm = '';
        const reserved = [];
        let rooms = '';
        let name = '';
        let description = '';
        let thumbnail = '';

        const now = new Date();
        const day = now.getDay();
        const date = now.getDate();
        const month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
        const year = now.getFullYear();
        const dateTag = String(year) + String(month) + String(date);

        // 店舗データを取得, データを元にArray[Object{reserve: Boolean}] 型のタイムテーブルの生成
        await firebase.firestore().collection('studio').doc(query.params.id).get().then(function(shopData) {
            // 単位利用時間, 開店時間, 閉店時間を設定
            reserveTerm = shopData.data().term[day];
            openTime = 60 / shopData.data().term[day] * shopData.data().open[day];
            closeTime = 60 / shopData.data().term[day] * shopData.data().close[day];
            feeList = shopData.data().fee;
            termList = shopData.data().term;
            openTimeList = shopData.data().open;
            closeTimeList = shopData.data().close;
            rooms = shopData.data().rooms;
            name = shopData.data().name;
            description = shopData.data().description;
            thumbnail = shopData.data().thumbnail;

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
                    const reserveStart = 60 / termList[0] * book.start;
                    const reserveFinish = 60 / termList[0] * book.finish;
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
            thumbnail: thumbnail,
            datas: {
                name: name,
                description: description,
                fee: feeList[day],
                term: reserveTerm,
                open: openTime,
                close: closeTime,
                daylist: timeTable.concat(),
                reserved: reserved.concat(),
                list: {
                    fee: feeList,
                    term: termList,
                    open: openTimeList,
                    close: closeTimeList,
                },
                rooms: rooms.concat(),
            },
            userSelected: {
                skip: 0,
                room: rooms[0],
            },
            userView: {
                date: year + '年' + month + '月' + date + '日',
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
    border-radius: 80px 0 0 0;
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
        margin-top: 64px;
        margin-bottom: 16px;
        width: 100%;
        p{
            line-height: calc(32px + 1vw);
            span{
                color: $theme-color;
                font-weight: bold;
                font-size: calc(12px + 1vw);
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
        margin-bottom: 16px;
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
            margin-bottom: 16px;
            text-align: center;
            span{
                color: $theme-color;
            }
        }
    }
    div.table{
        padding-top: 24px;
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
    p.description{
        margin-bottom: 32px;
        line-height: 16px;
        span{
            color: #2a2a2a;
            font-size: 12px;
        }
    }
    div.date-selector-large{
        display: flex;
        justify-content: space-between;
        margin-top: 32px;
        margin-bottom: 32px;
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
