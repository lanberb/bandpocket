<template>
    <section class="container">
        <div class="head">
            <p>
                <span>スタジオ一覧</span>
            </p>
        </div>
        <div class="studioList">
            <nuxt-link class="studio-card"
            v-for="(s, index) in studioList"
            :key="s.id"
            :to="{
                name: 'studio-id',
                path: '/studio/:id/',
                params: {
                    id: s.id,
                },
            }">
                <img :src="thumbnailList[index]" alt="studio-img">
                <div class="card-favorite">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#fff" stroke-width="1.6px"/>
                    </svg>
                </div>
                <p class="card-title">
                    <span>{{ s.name }}</span>
                </p>
            </nuxt-link>
        </div>
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
    },
    watch: {
    },
    data: function() {
        return {
            studioList: '',
            thumbnailList: '',
            url: '',
        }
    },
    asyncData: async function() {
        const db = firebase.firestore();
        var list = [];
        var thumbnails = [];
        await db.collection('studio').get().then(function(querySnapshot){
            querySnapshot.forEach((doc) => {
                const studio = doc.data();
                studio.id = doc.id;
                list.push(studio);
            });
        }).catch(console.error);

        const urls = list.map(i => i.thumbnail);
        for (let i = 0; i < list.length; i++) {
            if (!!urls[i]) {
                const url = await firebase.storage().ref().child('studio-thumbnails/' + urls[i]);
                await url.getDownloadURL().then(function(res) {
                    thumbnails.push(res);
                });
            }
            if (!urls[i]) thumbnails.push(null);
        }
        console.log(thumbnails);
        return {
            studioList: list.concat(),
            thumbnailList: thumbnails.concat(),
        }
    },
    mounted: function() {
        if (!(!!firebase.auth().currentUser)) this.$router.push('/');
        console.log(this.url)
    },
}
</script>

<style lang="scss" scoped>
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
div.studioList{
    width: 100%;
    a.studio-card{
        display: block;
        margin-bottom: 24px;
        padding: 16px;
        border-radius: 64px 0 64px 0;
        width: calc(100% - 32px);
        height: calc(240px - 32px);
        overflow: hidden;
        text-decoration: none;
        filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.2));
        img{
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            object-fit: cover;
            z-index: -1;
        }
        div.card-favorite{
            border-left: solid 1px #fff;
            border-bottom: solid 1px #fff;
            border-radius: 0 0 0 32px;
            width: 48px;
            height: 48px;
            position: absolute;
            top: 0;
            left: 100%;
            transform: translateX(calc(-100%));
            svg{
                width: 20px;
                height: 20px;
                object-fit: contain;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                fill: transparent;
            }
        }
        p{
            position: relative;
            top: 100%;
            transform: translateY(-100%);
            span{
                color: #fff;
                font-weight: bold;
            }
        }
    }
}
</style>
